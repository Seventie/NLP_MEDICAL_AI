// Model Loader for Local AI Models
// This module handles loading and managing multiple local AI models
// Integrated with Python-based AI models

import { spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

export interface ModelConfig {
  name: string;
  path: string;
  type: 'rag' | 'recommendation';
  pythonScript: string;
  status: 'loading' | 'loaded' | 'failed' | 'not_loaded';
}

export interface ModelResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class ModelManager {
  private models: Map<string, ModelConfig> = new Map();
  private pythonProcesses: Map<string, ChildProcess> = new Map();
  private modelConfigs: ModelConfig[] = [
    {
      name: 'medical-qa-rag',
      path: './models',
      type: 'rag',
      pythonScript: 'qa.py',
      status: 'not_loaded'
    },
    {
      name: 'medicine-recommendation',
      path: './models',
      type: 'recommendation', 
      pythonScript: 'medical_v3.py',
      status: 'not_loaded'
    }
  ];

  constructor() {
    // Initialize models map
    this.modelConfigs.forEach(config => {
      this.models.set(config.name, { ...config });
    });
  }

  async loadModels() {
    console.log('🚀 Starting to load AI models...');
    
    for (const config of this.modelConfigs) {
      try {
        console.log(`📦 Loading ${config.name} model...`);
        config.status = 'loading';
        this.models.set(config.name, config);
        
        const isAvailable = await this.checkModelAvailability(config);
        
        if (isAvailable) {
          config.status = 'loaded';
          console.log(`✅ Successfully loaded ${config.name}`);
        } else {
          config.status = 'failed';
          console.log(`❌ Failed to load ${config.name}: Model files not found`);
        }
        
        this.models.set(config.name, config);
        
      } catch (error) {
        console.error(`❌ Failed to load ${config.name}:`, error);
        config.status = 'failed';
        this.models.set(config.name, config);
      }
    }
    
    console.log(`🎉 Model loading complete. ${this.models.size} models processed.`);
  }

  private async checkModelAvailability(config: ModelConfig): Promise<boolean> {
    try {
      // Check if Python script exists
      const scriptPath = path.join(config.path, config.pythonScript);
      await fs.access(scriptPath);
      
      // Check if required data directories exist
      if (config.type === 'rag') {
        await fs.access('./embeddings');
        await fs.access('./embeddings/faiss_index_cpu.index');
        await fs.access('./embeddings/encoded_docs.npy');
      } else if (config.type === 'recommendation') {
        await fs.access('./kg_rag_artifacts');
        await fs.access('./drugs_side_effects.csv');
      }
      
      return true;
    } catch (error) {
      console.warn(`Model availability check failed for ${config.name}:`, error);
      return false;
    }
  }

  private async executeModelScript(config: ModelConfig, command: string, args: string[]): Promise<ModelResponse> {
    return new Promise((resolve) => {
      const scriptPath = path.join(config.path, config.pythonScript);
      const pythonArgs = [scriptPath, command, ...args];
      
      console.log(`Executing: python ${pythonArgs.join(' ')}`);
      
      const pythonProcess = spawn('python', pythonArgs, {
        cwd: process.cwd(),
        env: { ...process.env }
      });
      
      let stdout = '';
      let stderr = '';
      
      pythonProcess.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      
      pythonProcess.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
      
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdout.trim());
            resolve({
              success: true,
              data: result
            });
          } catch (parseError) {
            resolve({
              success: false,
              error: `Failed to parse model output: ${parseError}`
            });
          }
        } else {
          resolve({
            success: false,
            error: `Model execution failed with code ${code}: ${stderr}`
          });
        }
      });
      
      pythonProcess.on('error', (error) => {
        resolve({
          success: false,
          error: `Failed to start Python process: ${error.message}`
        });
      });
      
      // Set timeout for model execution
      setTimeout(() => {
        pythonProcess.kill();
        resolve({
          success: false,
          error: 'Model execution timeout'
        });
      }, 30000); // 30 second timeout
    });
  }

  getModel(name: string): ModelConfig | undefined {
    return this.models.get(name);
  }

  async queryRAGModel(question: string): Promise<any> {
    const model = this.models.get('medical-qa-rag');
    
    if (!model || model.status !== 'loaded') {
      return {
        answer: 'Medical Q&A model is not available. Please check the model configuration and ensure all required files are present.',
        sources: [],
        error: true,
        status: model?.status || 'not_found'
      };
    }

    try {
      console.log(`Querying RAG model with question: ${question.substring(0, 100)}...`);
      
      const result = await this.executeModelScript(model, 'qa', [question]);
      
      if (result.success && result.data) {
        return {
          answer: result.data.answer || 'No answer generated',
          sources: result.data.sources || [],
          confidence: result.data.confidence || 0.5,
          timestamp: result.data.timestamp || new Date().toISOString(),
          error: false
        };
      } else {
        return {
          answer: 'Failed to generate answer. Please try again or consult a healthcare professional.',
          sources: [],
          error: true,
          errorMessage: result.error
        };
      }
    } catch (error) {
      console.error('RAG model error:', error);
      return {
        answer: 'An unexpected error occurred while processing your question.',
        sources: [],
        error: true,
        errorMessage: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async queryRecommendationModel(symptoms: string[], additionalInfo?: string): Promise<any> {
    const model = this.models.get('medicine-recommendation');
    
    if (!model || model.status !== 'loaded') {
      return {
        medications: [],
        error: true,
        message: 'Medicine recommendation model is not available. Please check the model configuration.',
        status: model?.status || 'not_found'
      };
    }

    try {
      console.log(`Querying recommendation model with symptoms: ${symptoms.join(', ')}`);
      
      const args = [symptoms.join(',')];
      if (additionalInfo) {
        args.push(additionalInfo);
      }
      
      const result = await this.executeModelScript(model, 'recommend', args);
      
      if (result.success && result.data) {
        return {
          medications: result.data.medications || [],
          total_found: result.data.total_found || 0,
          extracted_entities: result.data.extracted_entities || [],
          related_concepts: result.data.related_concepts || [],
          disclaimer: result.data.disclaimer || 'Please consult a healthcare professional.',
          timestamp: result.data.timestamp || new Date().toISOString(),
          error: false
        };
      } else {
        return {
          medications: [],
          error: true,
          message: 'Failed to generate recommendations.',
          errorMessage: result.error
        };
      }
    } catch (error) {
      console.error('Recommendation model error:', error);
      return {
        medications: [],
        error: true,
        message: 'An unexpected error occurred while processing your request.',
        errorMessage: error instanceof Error ? error.message : String(error)
      };
    }
  }

  getModelStatus(): Record<string, string> {
    const status: Record<string, string> = {};
    
    this.models.forEach((config, name) => {
      status[name] = config.status;
    });
    
    return status;
  }

  async shutdown() {
    console.log('🛑 Shutting down models...');
    
    // Kill any running Python processes
    this.pythonProcesses.forEach((process, name) => {
      try {
        console.log(`Shutting down ${name} process...`);
        process.kill();
      } catch (error) {
        console.error(`Error shutting down ${name}:`, error);
      }
    });
    
    this.pythonProcesses.clear();
    
    // Update model statuses
    this.models.forEach((config) => {
      config.status = 'not_loaded';
    });
    
    console.log('✅ All models shut down');
  }
}

// Singleton instance
export const modelManager = new ModelManager();
