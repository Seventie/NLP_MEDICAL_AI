import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";
import { modelManager } from "./models/modelLoader";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(`Error ${status}: ${message}`);
  console.error(err.stack);
  
  res.status(status).json({ 
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// CORS middleware for development
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

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

async function initializeServer() {
  const server = createServer(app);
  
  try {
    console.log('🚀 Starting Medical AI Server...');
    
    // Initialize AI models
    console.log('🧠 Loading AI models...');
    await modelManager.loadModels();
    
    // Register API routes
    console.log('🔌 Setting up routes...');
    await registerRoutes(app);
    
    // Setup Vite in development or serve static files in production
    if (app.get("env") === "development") {
      console.log('⚙️ Setting up Vite development server...');
      await setupVite(app, server);
    } else {
      console.log('📎 Serving static files...');
      serveStatic(app);
    }
    
    // Health check endpoint at root for monitoring
    app.get('/health', (req, res) => {
      const modelStatus = modelManager.getModelStatus();
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        models: modelStatus,
        version: process.env.npm_package_version || '1.0.0'
      });
    });
    
    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🚨 Received ${signal}. Starting graceful shutdown...`);
      
      try {
        // Close HTTP server
        await new Promise<void>((resolve) => {
          server.close(() => {
            console.log('🚫 HTTP server closed');
            resolve();
          });
        });
        
        // Shutdown AI models
        console.log('🧠 Shutting down AI models...');
        await modelManager.shutdown();
        
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };
    
    // Register shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });
    
    return server;
    
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT || 5000;
  
  initializeServer().then((server) => {
    server.listen(port, () => {
      console.log(`\n🎉 Medical AI Server is running!`);
      console.log(`🏥 Local:   http://localhost:${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📋 Logs: Server requests and AI model operations`);
      console.log(`\n🚑 Ready to serve medical AI queries!\n`);
    });
  }).catch((error) => {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  });
}

export { app, initializeServer };
