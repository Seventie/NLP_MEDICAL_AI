import express from 'express';
import { createServer } from 'http';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Basic API endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    models: {
      'medical-qa-rag': 'available',
      'medicine-recommendation': 'available'
    },
    database: {
      drugs_loaded: true,
      drug_count: 0
    },
    timestamp: new Date().toISOString()
  });
});

// Medical Q&A endpoint
app.post('/api/medical-qa', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Placeholder response for now
    const response = {
      answer: `Thank you for your question: "${question}". This is a placeholder response while the AI models are being loaded. Please ensure your Python environment is set up correctly.`,
      sources: [],
      confidence: 0.5,
      timestamp: new Date().toISOString(),
      disclaimer: '⚠️ This is for educational purposes only. Always consult with qualified healthcare professionals.'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Medical Q&A error:', error);
    res.status(500).json({
      error: 'Failed to process question',
      answer: 'An error occurred while processing your question. Please try again.',
      sources: []
    });
  }
});

// Medicine recommendation endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    const { symptoms, additionalInfo } = req.body;
    
    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    // Placeholder response
    const response = {
      medications: [
        {
          drug_name: 'Placeholder Medication',
          indication: 'For demonstration purposes',
          confidence: 'Low',
          warnings: [
            '⚠️ This is a placeholder response',
            '🩺 Always consult a healthcare professional',
            '📋 Do not self-medicate'
          ]
        }
      ],
      total_found: 1,
      disclaimer: '🏥 Always consult with qualified healthcare professionals before taking any medication.',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      medications: []
    });
  }
});

// Drug search endpoint
app.get('/api/drugs/search', async (req, res) => {
  try {
    const query = req.query.q as string || '';
    
    // Placeholder response
    const response = {
      results: [
        {
          drug_name: 'Sample Drug',
          indication: 'Sample indication',
          side_effects: 'Sample side effects',
          warning: 'This is placeholder data'
        }
      ],
      total: 1,
      showing: 1,
      query: { q: query },
      database_status: 'placeholder',
      message: 'Drug database will be loaded when CSV file is properly configured'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Drug search error:', error);
    res.status(500).json({
      error: 'Failed to search drugs',
      results: []
    });
  }
});

// Drug stats endpoint
app.get('/api/drugs/stats', (req, res) => {
  res.json({
    total_drugs: 0,
    status: 'placeholder',
    message: 'Database statistics will be available when CSV is loaded'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client');
  if (fs.existsSync(clientPath)) {
    app.use(express.static(clientPath));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientPath, 'index.html'));
    });
  }
}

// Start server
const server = createServer(app);

server.listen(PORT, () => {
  console.log('🚀 Medical AI Server Started!');
  console.log(`🏥 Server running at: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log('✅ Server is ready to accept connections!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;
