import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { modelManager } from "./models/modelLoader";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Medical Q&A endpoint - uses RAG model
  app.post("/api/medical-qa", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question is required' });
      }

      const result = await modelManager.queryRAGModel(question);
      
      res.json(result);
    } catch (error) {
      console.error('Medical Q&A error:', error);
      res.status(500).json({ 
        error: 'Failed to process question',
        answer: 'An error occurred while processing your question. Please try again.',
        sources: []
      });
    }
  });

  // Medicine Recommendation endpoint - uses recommendation model
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { symptoms, additionalInfo } = req.body;
      
      if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({ error: 'Symptoms array is required' });
      }

      const result = await modelManager.queryRecommendationModel(symptoms, additionalInfo);
      
      res.json(result);
    } catch (error) {
      console.error('Recommendation error:', error);
      res.status(500).json({ 
        error: 'Failed to generate recommendations',
        medications: []
      });
    }
  });

  // Drug search endpoint - connects to your local drug database
  app.get("/api/drugs/search", async (req, res) => {
    try {
      const { 
        q: query, 
        rxOtc, 
        pregnancyCategory, 
        csa, 
        alcohol,
        drugClass 
      } = req.query;

      // TODO: Connect to your local drug dataset
      // Example: Query CSV file, SQLite database, or JSON file
      // const results = await storage.searchDrugs({
      //   query,
      //   filters: { rxOtc, pregnancyCategory, csa, alcohol, drugClass }
      // });

      // Placeholder response
      res.json({
        results: [],
        message: 'Connect your local drug dataset here',
        query: { query, rxOtc, pregnancyCategory, csa, alcohol, drugClass }
      });
    } catch (error) {
      console.error('Drug search error:', error);
      res.status(500).json({ error: 'Failed to search drugs' });
    }
  });

  // Health check endpoint to verify models are loaded
  app.get("/api/health", async (req, res) => {
    res.json({
      status: 'ok',
      models: {
        rag: modelManager.getModel('medical-qa-rag') ? 'loaded' : 'not loaded',
        recommendation: modelManager.getModel('medicine-recommendation') ? 'loaded' : 'not loaded'
      },
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
