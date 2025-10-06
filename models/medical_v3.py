#!/usr/bin/env python3
"""
Medicine Recommendation Model v3
This module provides drug recommendations based on input symptoms and conditions.
Uses knowledge graph RAG artifacts for enhanced recommendations.
"""

import os
import sys
import json
import numpy as np
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import faiss
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
from datetime import datetime
import logging
import pickle
from scipy import sparse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MedicalRecommendationModel:
    def __init__(self, data_dir: str = "kg_rag_artifacts"):
        """
        Initialize the Medical Recommendation Model
        
        Args:
            data_dir: Directory containing knowledge graph RAG artifacts
        """
        self.data_dir = Path(data_dir)
        self.model = None
        self.index = None
        self.corpus_embeddings = None
        self.tfidf_vectorizer = None
        self.tfidf_matrix = None
        self.medical_kg = None
        self.ner_entities = None
        self.kmeans_labels = None
        
        # Load drug side effects data
        self.drugs_data = self._load_drugs_data()
        
        # Initialize components
        self._load_components()
    
    def _load_drugs_data(self) -> Optional[pd.DataFrame]:
        """Load the drugs side effects CSV data"""
        try:
            drugs_path = Path("drugs_side_effects.csv")
            if drugs_path.exists():
                logger.info(f"Loading drugs data from {drugs_path}")
                df = pd.read_csv(drugs_path)
                # Clean and prepare the data
                if 'drug_name' in df.columns:
                    df['drug_name'] = df['drug_name'].str.strip().str.lower()
                if 'indication' in df.columns:
                    df['indication'] = df['indication'].fillna('').str.lower()
                if 'side_effects' in df.columns:
                    df['side_effects'] = df['side_effects'].fillna('')
                return df
            else:
                logger.warning(f"Drugs data not found at {drugs_path}")
                return None
        except Exception as e:
            logger.error(f"Error loading drugs data: {e}")
            return None
    
    def _load_components(self):
        """Load all required components for the recommendation system"""
        try:
            # Load sentence transformer model
            logger.info("Loading sentence transformer model...")
            self.model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
            
            # Load FAISS index
            index_path = self.data_dir / "faiss.index"
            if index_path.exists():
                logger.info(f"Loading FAISS index from {index_path}")
                self.index = faiss.read_index(str(index_path))
            
            # Load corpus embeddings
            embeddings_path = self.data_dir / "corpus_embeddings.npy"
            if embeddings_path.exists():
                logger.info(f"Loading corpus embeddings from {embeddings_path}")
                self.corpus_embeddings = np.load(str(embeddings_path))
            
            # Load TF-IDF components
            tfidf_vec_path = self.data_dir / "tfidf_vectorizer.npz"
            tfidf_matrix_path = self.data_dir / "tfidf_matrix.npz"
            
            if tfidf_vec_path.exists():
                logger.info(f"Loading TF-IDF vectorizer from {tfidf_vec_path}")
                # Load TF-IDF vectorizer (this is a placeholder - you may need to save/load differently)
                pass
            
            if tfidf_matrix_path.exists():
                logger.info(f"Loading TF-IDF matrix from {tfidf_matrix_path}")
                self.tfidf_matrix = sparse.load_npz(str(tfidf_matrix_path))
            
            # Load medical knowledge graph
            kg_path = self.data_dir / "medical_kg.graphml"
            if kg_path.exists():
                logger.info(f"Loading medical knowledge graph from {kg_path}")
                self.medical_kg = nx.read_graphml(str(kg_path))
            
            # Load NER entities
            ner_path = self.data_dir / "ner_entities.csv"
            if ner_path.exists():
                logger.info(f"Loading NER entities from {ner_path}")
                self.ner_entities = pd.read_csv(ner_path)
            
            # Load K-means labels
            kmeans_path = self.data_dir / "kmeans_labels.npy"
            if kmeans_path.exists():
                logger.info(f"Loading K-means labels from {kmeans_path}")
                self.kmeans_labels = np.load(str(kmeans_path))
                
        except Exception as e:
            logger.error(f"Error loading components: {e}")
            # Continue with partial loading
    
    def _extract_medical_entities(self, symptoms: List[str]) -> List[str]:
        """
        Extract medical entities from symptoms using NER data
        
        Args:
            symptoms: List of symptom strings
            
        Returns:
            List of recognized medical entities
        """
        entities = []
        if self.ner_entities is not None:
            symptoms_text = ' '.join(symptoms).lower()
            
            # Look for entities in the NER data
            for _, row in self.ner_entities.iterrows():
                if 'entity' in row and 'label' in row:
                    entity = str(row['entity']).lower()
                    if entity in symptoms_text:
                        entities.append(entity)
        
        return list(set(entities))  # Remove duplicates
    
    def _search_knowledge_graph(self, entities: List[str]) -> List[str]:
        """
        Search the knowledge graph for related medical concepts
        
        Args:
            entities: List of medical entities
            
        Returns:
            List of related medical concepts
        """
        related_concepts = []
        
        if self.medical_kg is not None:
            try:
                for entity in entities:
                    # Find nodes that match the entity
                    for node in self.medical_kg.nodes():
                        node_data = self.medical_kg.nodes[node]
                        if entity.lower() in str(node).lower() or \
                           (isinstance(node_data, dict) and 
                            any(entity.lower() in str(v).lower() for v in node_data.values())):
                            
                            # Get neighbors of this node
                            neighbors = list(self.medical_kg.neighbors(node))
                            related_concepts.extend([str(n) for n in neighbors[:5]])  # Limit to 5
            except Exception as e:
                logger.warning(f"Error searching knowledge graph: {e}")
        
        return list(set(related_concepts))[:10]  # Return top 10 unique concepts
    
    def _semantic_search_drugs(self, symptoms: List[str], top_k: int = 10) -> List[Dict[str, Any]]:
        """
        Search for drugs using semantic similarity
        
        Args:
            symptoms: List of symptoms
            top_k: Number of top results to return
            
        Returns:
            List of drug recommendations with scores
        """
        recommendations = []
        
        if self.drugs_data is None:
            return recommendations
        
        try:
            # Combine symptoms into query text
            query_text = ' '.join(symptoms).lower()
            
            # Search in drug indications
            if 'indication' in self.drugs_data.columns:
                # Simple text matching for now (can be enhanced with embeddings)
                matches = []
                for idx, row in self.drugs_data.iterrows():
                    indication = str(row.get('indication', '')).lower()
                    drug_name = str(row.get('drug_name', '')).lower()
                    
                    # Calculate simple text similarity
                    similarity = 0
                    for symptom in symptoms:
                        symptom = symptom.lower().strip()
                        if symptom in indication or symptom in drug_name:
                            similarity += 1
                    
                    if similarity > 0:
                        matches.append({
                            'drug_name': row.get('drug_name', 'Unknown'),
                            'indication': row.get('indication', 'N/A'),
                            'side_effects': row.get('side_effects', 'N/A'),
                            'score': similarity / len(symptoms),
                            'dosage': row.get('dosage', 'Consult physician'),
                            'route': row.get('route', 'As prescribed')
                        })
                
                # Sort by similarity score
                matches.sort(key=lambda x: x['score'], reverse=True)
                recommendations = matches[:top_k]
        
        except Exception as e:
            logger.error(f"Error in semantic search: {e}")
        
        return recommendations
    
    def _add_safety_warnings(self, recommendations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Add safety warnings and disclaimers to recommendations
        
        Args:
            recommendations: List of drug recommendations
            
        Returns:
            Enhanced recommendations with safety information
        """
        for rec in recommendations:
            # Add safety warnings
            rec['warnings'] = [
                "⚠️ This is for educational purposes only",
                "👨‍⚕️ Always consult a healthcare professional before taking any medication",
                "📋 Verify dosage and interactions with your doctor",
                "🚫 Do not self-medicate based on these recommendations"
            ]
            
            # Add confidence level
            if rec.get('score', 0) >= 0.8:
                rec['confidence'] = 'High'
            elif rec.get('score', 0) >= 0.5:
                rec['confidence'] = 'Medium'
            else:
                rec['confidence'] = 'Low'
        
        return recommendations
    
    def recommend(self, symptoms: List[str], additional_info: Optional[str] = None) -> Dict[str, Any]:
        """
        Main method to generate medicine recommendations
        
        Args:
            symptoms: List of symptoms
            additional_info: Additional medical information
            
        Returns:
            Dictionary containing recommendations and metadata
        """
        logger.info(f"Processing symptoms: {symptoms}")
        
        try:
            # Extract medical entities
            entities = self._extract_medical_entities(symptoms)
            
            # Search knowledge graph for related concepts
            related_concepts = self._search_knowledge_graph(entities)
            
            # Perform semantic search for drug recommendations
            recommendations = self._semantic_search_drugs(symptoms)
            
            # Add safety warnings
            recommendations = self._add_safety_warnings(recommendations)
            
            # Prepare result
            result = {
                "medications": recommendations,
                "extracted_entities": entities,
                "related_concepts": related_concepts,
                "total_found": len(recommendations),
                "disclaimer": (
                    "🏥 MEDICAL DISCLAIMER: These recommendations are for educational purposes only. "
                    "Always consult with qualified healthcare professionals before taking any medication. "
                    "Self-medication can be dangerous and may lead to adverse effects."
                ),
                "timestamp": datetime.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            return {
                "medications": [],
                "error": str(e),
                "disclaimer": "An error occurred while processing your request. Please consult a healthcare professional.",
                "timestamp": datetime.now().isoformat()
            }

def main():
    """
    Main function for standalone testing
    """
    if len(sys.argv) < 2:
        print("Usage: python medical_v3.py '<symptoms>' [additional_info]")
        print("Example: python medical_v3.py 'fever,headache,nausea' 'Patient has history of hypertension'")
        sys.exit(1)
    
    symptoms_str = sys.argv[1]
    additional_info = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Parse symptoms
    symptoms = [s.strip() for s in symptoms_str.split(',') if s.strip()]
    
    try:
        model = MedicalRecommendationModel()
        result = model.recommend(symptoms, additional_info)
        print(json.dumps(result, indent=2))
    except Exception as e:
        error_result = {
            "error": str(e),
            "medications": [],
            "disclaimer": "An error occurred while processing your request."
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
