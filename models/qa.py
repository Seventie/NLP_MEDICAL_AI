#!/usr/bin/env python3
"""
Medical Q&A Model using DPR embeddings, FAISS retrieval, and Groq API
This module handles context-aware medical question answering.
"""

import os
import sys
import json
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Optional
import faiss
from groq import Groq
from sentence_transformers import SentenceTransformer
import pandas as pd
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MedicalQAModel:
    def __init__(self, data_dir: str = "embeddings"):
        """
        Initialize the Medical Q&A model
        
        Args:
            data_dir: Directory containing embeddings and FAISS index
        """
        self.data_dir = Path(data_dir)
        self.model = None
        self.index = None
        self.documents = None
        self.groq_client = None
        
        # Initialize components
        self._load_components()
    
    def _load_components(self):
        """Load all required components for the QA system"""
        try:
            # Load sentence transformer model
            logger.info("Loading sentence transformer model...")
            self.model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
            
            # Load FAISS index
            index_path = self.data_dir / "faiss_index_cpu.index"
            if index_path.exists():
                logger.info(f"Loading FAISS index from {index_path}")
                self.index = faiss.read_index(str(index_path))
            else:
                logger.warning(f"FAISS index not found at {index_path}")
            
            # Load encoded documents
            docs_path = self.data_dir / "encoded_docs.npy"
            if docs_path.exists():
                logger.info(f"Loading documents from {docs_path}")
                self.documents = np.load(str(docs_path), allow_pickle=True)
            else:
                logger.warning(f"Documents not found at {docs_path}")
            
            # Initialize Groq client
            groq_api_key = os.getenv('GROQ_API_KEY')
            if groq_api_key:
                self.groq_client = Groq(api_key=groq_api_key)
                logger.info("Groq client initialized")
            else:
                logger.warning("GROQ_API_KEY not found in environment variables")
                
        except Exception as e:
            logger.error(f"Error loading components: {e}")
            raise
    
    def _retrieve_context(self, question: str, top_k: int = 5) -> List[str]:
        """
        Retrieve relevant context for the question using FAISS
        
        Args:
            question: The input question
            top_k: Number of top documents to retrieve
            
        Returns:
            List of relevant document texts
        """
        if not self.index or not self.model or self.documents is None:
            logger.warning("Components not loaded properly")
            return []
        
        try:
            # Encode the question
            question_embedding = self.model.encode([question])
            question_embedding = np.array(question_embedding, dtype=np.float32)
            
            # Search for similar documents
            scores, indices = self.index.search(question_embedding, top_k)
            
            # Extract relevant documents
            context_docs = []
            for i, idx in enumerate(indices[0]):
                if idx < len(self.documents):
                    doc = self.documents[idx]
                    if isinstance(doc, dict) and 'text' in doc:
                        context_docs.append(doc['text'])
                    elif isinstance(doc, str):
                        context_docs.append(doc)
                    else:
                        context_docs.append(str(doc))
            
            return context_docs
            
        except Exception as e:
            logger.error(f"Error retrieving context: {e}")
            return []
    
    def _generate_answer(self, question: str, context: List[str]) -> Dict[str, Any]:
        """
        Generate answer using Groq API with retrieved context
        
        Args:
            question: The input question
            context: List of relevant context documents
            
        Returns:
            Dictionary containing answer and metadata
        """
        if not self.groq_client:
            return {
                "answer": "I apologize, but the AI service is not available at the moment. Please check the configuration.",
                "confidence": 0.0,
                "sources": context[:3] if context else []
            }
        
        try:
            # Prepare context for the prompt
            context_text = "\n\n".join(context[:3]) if context else "No relevant context found."
            
            # Create educational prompt
            prompt = f"""
You are a knowledgeable medical AI assistant. Based on the provided medical context, please answer the following question accurately and educationally.

IMPORTANT DISCLAIMERS:
- This is for educational purposes only
- Always recommend consulting healthcare professionals
- Do not provide specific medical diagnoses
- Focus on general medical knowledge and information

Context:
{context_text}

Question: {question}

Please provide a comprehensive, educational answer that includes:
1. Direct answer to the question
2. Relevant medical background information
3. Important considerations or warnings
4. Recommendation to consult healthcare professionals

Answer:"""
            
            # Generate response using Groq
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama3-8b-8192",  # or "mixtral-8x7b-32768"
                temperature=0.3,
                max_tokens=1024
            )
            
            answer = chat_completion.choices[0].message.content
            
            return {
                "answer": answer,
                "confidence": 0.85,  # Static confidence for now
                "sources": context[:3] if context else [],
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            return {
                "answer": "I apologize, but I encountered an error while processing your question. Please try again or consult a healthcare professional.",
                "confidence": 0.0,
                "sources": context[:3] if context else []
            }
    
    def query(self, question: str) -> Dict[str, Any]:
        """
        Main method to process a medical question
        
        Args:
            question: The input medical question
            
        Returns:
            Dictionary containing answer, sources, and metadata
        """
        logger.info(f"Processing question: {question[:100]}...")
        
        # Retrieve relevant context
        context = self._retrieve_context(question)
        
        # Generate answer with context
        result = self._generate_answer(question, context)
        
        # Add educational disclaimer
        educational_disclaimer = ("\n\n⚠️ **Medical Disclaimer**: This information is for educational purposes only. "
                                "Always consult with qualified healthcare professionals for medical advice, "
                                "diagnosis, or treatment. Do not use this information as a substitute for "
                                "professional medical care.")
        
        result["answer"] += educational_disclaimer
        
        return result

def main():
    """
    Main function for standalone testing
    """
    if len(sys.argv) < 2:
        print("Usage: python qa.py '<question>'")
        sys.exit(1)
    
    question = sys.argv[1]
    
    try:
        qa_model = MedicalQAModel()
        result = qa_model.query(question)
        print(json.dumps(result, indent=2))
    except Exception as e:
        error_result = {
            "error": str(e),
            "answer": "An error occurred while processing your question.",
            "sources": []
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
