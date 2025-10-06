import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { modelManager } from "./models/modelLoader";
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

// Drug database interface
interface DrugRecord {
  drug_name?: string;
  indication?: string;
  side_effects?: string;
  dosage?: string;
  route?: string;
  rx_otc?: string;
  pregnancy_category?: string;
  csa?: string;
  alcohol?: string;
  drug_class?: string;
  [key: string]: any;
}

// Cache for drug database
let drugDatabase: DrugRecord[] = [];
let isDatabaseLoaded = false;

// Load drug database
async function loadDrugDatabase() {
  if (isDatabaseLoaded) return;
  
  try {
    const csvPath = path.join(process.cwd(), 'drugs_side_effects.csv');
    const results: DrugRecord[] = [];
    
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data: any) => {
          // Convert the parsed CSV row to DrugRecord
          const record: DrugRecord = {
            drug_name: data.drug_name || data['Drug Name'] || '',
            indication: data.indication || data['Indication'] || '',
            side_effects: data.side_effects || data['Side Effects'] || '',
            dosage: data.dosage || data['Dosage'] || '',
            route: data.route || data['Route'] || '',
            rx_otc: data.rx_otc || data['RX/OTC'] || '',
            pregnancy_category: data.pregnancy_category || data['Pregnancy Category'] || '',
            csa: data.csa || data['CSA'] || '',
            alcohol: data.alcohol || data['Alcohol'] || '',
            drug_class: data.drug_class || data['Drug Class'] || '',
            ...data // Include any additional fields
          };
          results.push(record);
        })
        .on('end', () => {
          drugDatabase = results;
          isDatabaseLoaded = true;
          console.log(`📊 Loaded ${drugDatabase.length} drug records`);
          resolve();
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error loading drug database:', error);
    drugDatabase = [];
  }
}

// Search drugs function
function searchDrugs(query: {
  q?: string;
  rxOtc?: string;
  pregnancyCategory?: string;
  csa?: string;
  alcohol?: string;
  drugClass?: string;
}): DrugRecord[] {
  if (!isDatabaseLoaded || drugDatabase.length === 0) {
    return [];
  }
  
  let results = drugDatabase;
  
  // Text search in drug name and indication
  if (query.q) {
    const searchTerm = query.q.toLowerCase();
    results = results.filter(drug => {
      const drugName = (drug.drug_name || '').toLowerCase();
      const indication = (drug.indication || '').toLowerCase();
      const sideEffects = (drug.side_effects || '').toLowerCase();
      
      return drugName.includes(searchTerm) || 
             indication.includes(searchTerm) ||
             sideEffects.includes(searchTerm);
    });
  }
  
  // Filter by rx_otc
  if (query.rxOtc) {
    const rxOtcFilter = query.rxOtc.toLowerCase();
    results = results.filter(drug => 
      (drug.rx_otc || '').toLowerCase() === rxOtcFilter
    );
  }
  
  // Filter by pregnancy category
  if (query.pregnancyCategory) {
    const pregnancyCategoryFilter = query.pregnancyCategory.toLowerCase();
    results = results.filter(drug => 
      (drug.pregnancy_category || '').toLowerCase() === pregnancyCategoryFilter
    );
  }
  
  // Filter by CSA schedule
  if (query.csa) {
    const csaFilter = query.csa.toLowerCase();
    results = results.filter(drug => 
      (drug.csa || '').toLowerCase() === csaFilter
    );
  }
  
  // Filter by alcohol interaction
  if (query.alcohol) {
    const alcoholFilter = query.alcohol.toLowerCase();
    results = results.filter(drug => 
      (drug.alcohol || '').toLowerCase() === alcoholFilter
    );
  }
  
  // Filter by drug class
  if (query.drugClass) {
    const drugClassFilter = query.drugClass.toLowerCase();
    results = results.filter(drug => 
      (drug.drug_class || '').toLowerCase().includes(drugClassFilter)
    );
  }
  
  // Limit results to prevent overwhelming response
  return results.slice(0, 50);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Load drug database on startup
  await loadDrugDatabase();
  
  // Medical Q&A endpoint - uses RAG model
  app.post("/api/medical-qa", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question is required' });
      }

      console.log(`Processing Q&A request: ${question.substring(0, 100)}...`);
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

      console.log(`Processing recommendation request for symptoms: ${symptoms.join(', ')}`);
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
        drugClass,
        limit = '20'
      } = req.query;

      if (!isDatabaseLoaded) {
        return res.status(503).json({
          error: 'Drug database is not loaded yet',
          results: [],
          message: 'Please try again in a few moments'
        });
      }

      const searchParams = {
        q: query as string,
        rxOtc: rxOtc as string,
        pregnancyCategory: pregnancyCategory as string,
        csa: csa as string,
        alcohol: alcohol as string,
        drugClass: drugClass as string
      };

      const results = searchDrugs(searchParams);
      const limitNum = parseInt(limit as string, 10) || 20;
      const limitedResults = results.slice(0, limitNum);

      res.json({
        results: limitedResults,
        total: results.length,
        showing: limitedResults.length,
        query: searchParams,
        database_status: 'loaded',
        total_drugs: drugDatabase.length
      });
    } catch (error) {
      console.error('Drug search error:', error);
      res.status(500).json({ 
        error: 'Failed to search drugs',
        results: [],
        message: 'An error occurred while searching the drug database'
      });
    }
  });

  // Get drug database statistics
  app.get("/api/drugs/stats", async (req, res) => {
    try {
      if (!isDatabaseLoaded) {
        return res.json({
          status: 'loading',
          message: 'Database is still loading'
        });
      }

      // Calculate statistics
      const stats: any = {
        total_drugs: drugDatabase.length,
        rx_otc_distribution: {},
        pregnancy_categories: {},
        drug_classes: {},
        status: 'loaded'
      };

      // Calculate distributions (sample up to 1000 records for performance)
      const sampleSize = Math.min(1000, drugDatabase.length);
      const sample = drugDatabase.slice(0, sampleSize);

      sample.forEach(drug => {
        // RX/OTC distribution
        const rxOtc = drug.rx_otc || 'unknown';
        stats.rx_otc_distribution[rxOtc] = (stats.rx_otc_distribution[rxOtc] || 0) + 1;

        // Pregnancy categories
        const pregnancyCat = drug.pregnancy_category || 'unknown';
        stats.pregnancy_categories[pregnancyCat] = (stats.pregnancy_categories[pregnancyCat] || 0) + 1;

        // Drug classes
        const drugClass = drug.drug_class || 'unknown';
        stats.drug_classes[drugClass] = (stats.drug_classes[drugClass] || 0) + 1;
      });

      res.json(stats);
    } catch (error) {
      console.error('Drug stats error:', error);
      res.status(500).json({ 
        error: 'Failed to get drug statistics',
        status: 'error'
      });
    }
  });

  // Health check endpoint to verify models are loaded
  app.get("/api/health", async (req, res) => {
    const modelStatus = modelManager.getModelStatus();
    
    res.json({
      status: 'ok',
      models: modelStatus,
      database: {
        drugs_loaded: isDatabaseLoaded,
        drug_count: drugDatabase.length
      },
      timestamp: new Date().toISOString()
    });
  });

  // Reload models endpoint (for development)
  app.post("/api/admin/reload-models", async (req, res) => {
    try {
      console.log('Reloading models...');
      await modelManager.loadModels();
      
      res.json({
        success: true,
        message: 'Models reloaded successfully',
        models: modelManager.getModelStatus()
      });
    } catch (error) {
      console.error('Model reload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reload models',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
