#!/usr/bin/env python3
"""
Model Service for Medical AI Integration
This service provides a unified interface for both QA and Recommendation models
and can be called from the TypeScript backend.
"""

import os
import sys
import json
import asyncio
from pathlib import Path
from typing import Dict, Any, List, Optional
import logging
from concurrent.futures import ThreadPoolExecutor

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

try:
    from qa import MedicalQAModel
    from medical_v3 import MedicalRecommendationModel
except ImportError as e:
    logging.error(f"Failed to import models: {e}")
    MedicalQAModel = None
    MedicalRecommendationModel = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelService:
    def __init__(self):
        """Initialize the model service with both QA and Recommendation models"""
        self.qa_model = None
        self.recommendation_model = None
        self.executor = ThreadPoolExecutor(max_workers=2)
        
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize both models with error handling"""
        try:
            if MedicalQAModel:
                logger.info("Initializing QA model...")
                self.qa_model = MedicalQAModel(data_dir="embeddings")
                logger.info("QA model initialized successfully")
            else:
                logger.error("QA model class not available")
        except Exception as e:
            logger.error(f"Failed to initialize QA model: {e}")
        
        try:
            if MedicalRecommendationModel:
                logger.info("Initializing Recommendation model...")
                self.recommendation_model = MedicalRecommendationModel(data_dir="kg_rag_artifacts")
                logger.info("Recommendation model initialized successfully")
            else:
                logger.error("Recommendation model class not available")
        except Exception as e:
            logger.error(f"Failed to initialize Recommendation model: {e}")
    
    async def query_qa_model(self, question: str) -> Dict[str, Any]:
        """Query the Medical Q&A model asynchronously"""
        if not self.qa_model:
            return {
                "error": "QA model not available",
                "answer": "The Medical Q&A service is currently unavailable. Please try again later.",
                "sources": []
            }
        
        try:
            # Run the synchronous model query in a thread pool
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor, 
                self.qa_model.query, 
                question
            )
            return result
        except Exception as e:
            logger.error(f"Error querying QA model: {e}")
            return {
                "error": str(e),
                "answer": "An error occurred while processing your question. Please try again.",
                "sources": []
            }
    
    async def query_recommendation_model(self, symptoms: List[str], additional_info: Optional[str] = None) -> Dict[str, Any]:
        """Query the Medical Recommendation model asynchronously"""
        if not self.recommendation_model:
            return {
                "error": "Recommendation model not available",
                "medications": [],
                "disclaimer": "The Medicine Recommendation service is currently unavailable. Please consult a healthcare professional."
            }
        
        try:
            # Run the synchronous model query in a thread pool
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor,
                self.recommendation_model.recommend,
                symptoms,
                additional_info
            )
            return result
        except Exception as e:
            logger.error(f"Error querying Recommendation model: {e}")
            return {
                "error": str(e),
                "medications": [],
                "disclaimer": "An error occurred while processing your request. Please consult a healthcare professional."
            }
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get the health status of both models"""
        return {
            "qa_model": "loaded" if self.qa_model else "not loaded",
            "recommendation_model": "loaded" if self.recommendation_model else "not loaded",
            "service_status": "healthy" if (self.qa_model and self.recommendation_model) else "partial"
        }
    
    def shutdown(self):
        """Shutdown the service and clean up resources"""
        logger.info("Shutting down model service...")
        self.executor.shutdown(wait=True)
        logger.info("Model service shutdown complete")

# Global service instance
model_service = ModelService()

async def handle_qa_request(data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle Q&A requests"""
    question = data.get('question', '')
    if not question:
        return {
            "error": "Question is required",
            "answer": "Please provide a question.",
            "sources": []
        }
    
    return await model_service.query_qa_model(question)

async def handle_recommendation_request(data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle recommendation requests"""
    symptoms = data.get('symptoms', [])
    additional_info = data.get('additional_info')
    
    if not symptoms or not isinstance(symptoms, list) or len(symptoms) == 0:
        return {
            "error": "Symptoms are required",
            "medications": [],
            "disclaimer": "Please provide a list of symptoms."
        }
    
    return await model_service.query_recommendation_model(symptoms, additional_info)

def handle_health_check() -> Dict[str, Any]:
    """Handle health check requests"""
    return model_service.get_health_status()

async def main():
    """Main function for testing the service"""
    if len(sys.argv) < 2:
        print("Usage: python model_service.py <command> [args...]")
        print("Commands:")
        print("  qa '<question>'")
        print("  recommend '<symptom1,symptom2,...>' [additional_info]")
        print("  health")
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    try:
        if command == "qa":
            if len(sys.argv) < 3:
                print("Please provide a question")
                sys.exit(1)
            
            question = sys.argv[2]
            result = await handle_qa_request({"question": question})
            print(json.dumps(result, indent=2))
        
        elif command == "recommend":
            if len(sys.argv) < 3:
                print("Please provide symptoms")
                sys.exit(1)
            
            symptoms_str = sys.argv[2]
            additional_info = sys.argv[3] if len(sys.argv) > 3 else None
            
            symptoms = [s.strip() for s in symptoms_str.split(',') if s.strip()]
            result = await handle_recommendation_request({
                "symptoms": symptoms,
                "additional_info": additional_info
            })
            print(json.dumps(result, indent=2))
        
        elif command == "health":
            result = handle_health_check()
            print(json.dumps(result, indent=2))
        
        else:
            print(f"Unknown command: {command}")
            sys.exit(1)
    
    except Exception as e:
        error_result = {
            "error": str(e),
            "message": "An error occurred while processing the request"
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)
    finally:
        model_service.shutdown()

if __name__ == "__main__":
    asyncio.run(main())
