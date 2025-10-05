# Medical AI Platform - Model Integration Guide

## Overview

Your medical AI platform is configured to run **2 local AI models simultaneously**:

1. **RAG-based Medical Q&A Model** - Answers medical questions using retrieval-augmented generation
2. **Medicine Recommendation Model** - Recommends medications based on symptoms

## How It Works

### Startup Process

When you run `npm run dev`, the server:

1. ✅ **Loads both AI models** using `server/models/modelLoader.ts`
2. ✅ **Starts the Express server** on port 5000
3. ✅ **Serves the React frontend** with Vite
4. ✅ **Exposes API endpoints** for model inference

The models are loaded **before** the server starts accepting requests, ensuring they're ready immediately.

### Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (Port 5000)       │
│  - Medical Q&A Interface                 │
│  - Medicine Recommendations              │
│  - Drug Search                           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Express API Server (Port 5000)      │
│  - /api/medical-qa                       │
│  - /api/recommendations                  │
│  - /api/drugs/search                     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Model Manager (Singleton)        │
│  ┌─────────────────────────────────┐    │
│  │  RAG Q&A Model                  │    │
│  │  - Loads on startup             │    │
│  │  - Handles medical questions    │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  Recommendation Model           │    │
│  │  - Loads on startup             │    │
│  │  - Processes symptoms           │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Setting Up Your Models

### Step 1: Choose Your Model Type

The platform supports multiple model frameworks. Choose based on your models:

#### Option A: Python-based Models (PyTorch, TensorFlow)

1. Create Python inference scripts:

```python
# models/rag_server.py
from flask import Flask, request, jsonify
import torch
# Your model loading code

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    question = data['question']
    # Run inference
    answer = your_model.predict(question)
    return jsonify({'answer': answer, 'sources': []})

if __name__ == '__main__':
    app.run(port=8001)
```

2. Update `server/models/modelLoader.ts`:

```typescript
private async loadModel(config: ModelConfig): Promise<any> {
  const { spawn } = require('child_process');
  
  const pythonProcess = spawn('python', [
    `models/${config.type}_server.py`,
    config.path
  ]);
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return {
    config,
    status: 'loaded',
    predict: async (input: any) => {
      const response = await fetch(`${config.endpoint}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      return response.json();
    }
  };
}
```

#### Option B: Ollama Models (Local LLMs)

1. Install Ollama: https://ollama.ai
2. Pull your medical model: `ollama pull medllama2`
3. Update modelLoader.ts:

```typescript
private async loadModel(config: ModelConfig): Promise<any> {
  // Ollama runs on http://localhost:11434 by default
  const ollamaEndpoint = 'http://localhost:11434';
  
  return {
    config,
    status: 'loaded',
    predict: async (input: any) => {
      const response = await fetch(`${ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'medllama2',
          prompt: input.question || JSON.stringify(input)
        })
      });
      return response.json();
    }
  };
}
```

#### Option C: ONNX Models (Node.js Native)

1. Install ONNX Runtime: `npm install onnxruntime-node`
2. Update modelLoader.ts:

```typescript
import * as ort from 'onnxruntime-node';

private async loadModel(config: ModelConfig): Promise<any> {
  const session = await ort.InferenceSession.create(config.path);
  
  return {
    config,
    status: 'loaded',
    session,
    predict: async (input: any) => {
      // Prepare input tensor
      const feeds = { input: new ort.Tensor('float32', input, [1, inputSize]) };
      const results = await session.run(feeds);
      return { prediction: results.output.data };
    }
  };
}
```

### Step 2: Configure Model Paths

Edit `.env` file:

```bash
RAG_MODEL_PATH=/path/to/your/rag-model
RECOMMENDATION_MODEL_PATH=/path/to/your/recommendation-model
```

### Step 3: Implement Model-Specific Logic

#### For RAG Q&A Model:

Update `queryRAGModel` in `server/models/modelLoader.ts`:

```typescript
async queryRAGModel(question: string): Promise<any> {
  const model = this.models.get('medical-qa-rag');
  
  // 1. Embed the question
  const embedding = await embedQuestion(question);
  
  // 2. Query vector database for context
  const context = await vectorDB.search(embedding, topK=5);
  
  // 3. Generate answer with context
  const prompt = `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`;
  const response = await model.predict({ prompt });
  
  return {
    answer: response.text,
    sources: context.map(c => c.source),
    confidence: response.confidence
  };
}
```

#### For Recommendation Model:

Update `queryRecommendationModel`:

```typescript
async queryRecommendationModel(symptoms: string[], additionalInfo?: string): Promise<any> {
  const model = this.models.get('medicine-recommendation');
  
  // Preprocess symptoms
  const processed = preprocessSymptoms(symptoms);
  
  // Run inference
  const predictions = await model.predict({
    symptoms: processed,
    context: additionalInfo
  });
  
  // Format as medications
  return {
    medications: predictions.top_k.map(p => ({
      name: p.medication,
      dosage: p.dosage,
      precautions: p.warnings,
      confidence: p.score
    }))
  };
}
```

### Step 4: Connect Drug Database

For the drug search feature, connect your local dataset:

```typescript
// In server/routes.ts
app.get("/api/drugs/search", async (req, res) => {
  const { q, rxOtc, pregnancyCategory, csa, alcohol, drugClass } = req.query;
  
  // Option 1: CSV/JSON file
  const drugs = await loadDrugsFromFile('./data/drugs.csv');
  const filtered = drugs.filter(drug => {
    if (q && !drug.genericName.toLowerCase().includes(q.toLowerCase())) return false;
    if (rxOtc && rxOtc !== 'all' && drug.rxOtc !== rxOtc) return false;
    // ... more filters
    return true;
  });
  
  // Option 2: Database query
  // const results = await db.query(`
  //   SELECT * FROM drugs 
  //   WHERE generic_name ILIKE $1 
  //   AND rx_otc = $2
  // `, [`%${q}%`, rxOtc]);
  
  res.json({ results: filtered });
});
```

## Running the Application

### Development Mode

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your model paths

# Start the app (loads models + starts server)
npm run dev
```

### Production Mode

```bash
# Build the frontend
npm run build

# Start production server
NODE_ENV=production npm start
```

## API Endpoints

### Medical Q&A
```bash
POST /api/medical-qa
Content-Type: application/json

{
  "question": "What are the symptoms of diabetes?"
}

Response:
{
  "answer": "Common symptoms include...",
  "sources": ["MedQuAD-NIH", "MedQuAD-CDC"],
  "confidence": 0.92
}
```

### Medicine Recommendations
```bash
POST /api/recommendations
Content-Type: application/json

{
  "symptoms": ["Headache", "Fever", "Fatigue"],
  "additionalInfo": "Patient has history of..."
}

Response:
{
  "medications": [
    {
      "name": "Acetaminophen",
      "dosage": "500mg every 6 hours",
      "precautions": "Do not exceed 4000mg/day"
    }
  ]
}
```

### Drug Search
```bash
GET /api/drugs/search?q=aspirin&rxOtc=OTC&pregnancyCategory=C

Response:
{
  "results": [
    {
      "id": "1",
      "genericName": "Aspirin",
      "brandNames": "Bayer, Bufferin",
      "rxOtc": "OTC",
      ...
    }
  ]
}
```

### Health Check
```bash
GET /api/health

Response:
{
  "status": "ok",
  "models": {
    "rag": "loaded",
    "recommendation": "loaded"
  }
}
```

## Troubleshooting

### Models Not Loading

Check console output for error messages:
- ✅ `🚀 Starting to load AI models...`
- ✅ `📦 Loading medical-qa-rag model...`
- ✅ `✅ Successfully loaded medical-qa-rag`

If you see errors:
1. Verify model paths in `.env`
2. Check model file permissions
3. Ensure required dependencies are installed

### Memory Issues

If models are too large:
1. Use quantized versions
2. Load models on-demand instead of at startup
3. Use model serving services (TorchServe, TensorFlow Serving)

### Performance Optimization

- Use GPU acceleration if available
- Implement request batching
- Add response caching
- Use model quantization

## Next Steps

1. ✅ Replace placeholders in `modelLoader.ts` with your actual model code
2. ✅ Test each endpoint with your models
3. ✅ Connect your drug database
4. ✅ Deploy to production

Your infrastructure is ready - just plug in your trained models!
