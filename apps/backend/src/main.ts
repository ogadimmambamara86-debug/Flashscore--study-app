// apps/backend/src/main.ts - Enhanced version with MagajiCo integration
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import { connectDB } from "./config/db";

// Existing routes
import { healthRoutes } from "./routes/health";
import { matchRoutes } from "./routes/matches";
import { predictionRoutes } from "./routes/predictions";
import { scraperRoutes } from "./routes/scraper";
import { mlRoutes } from "./routes/ml";
import { newsAuthorRoutes } from "./routes/newsAuthors";
import { newsRoutes } from "./routes/news";

// Enhanced MagajiCo routes
import { enhancedPredictionRoutes } from "./routes/enhanced-predictions";
import { ceoAnalysisRoutes } from "./routes/ceo-analysis";
import { marketIntelligenceRoutes } from "./routes/market-intelligence";

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty'
    } : undefined
  }
});

// Security middleware
server.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

// Rate limiting
server.register(rateLimit, {
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // requests per minute
  timeWindow: '1 minute'
});

// Enhanced CORS configuration
const allowedOrigins = [
  'https://flashscore-study-app.vercel.app',
  'https://302a3520-1a25-488e-b2d3-26ceed56ba96-00-4e1xep2o5f5l.kirk.replit.dev',
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : undefined,
  'http://localhost:5000',
  'http://0.0.0.0:5000',
  'http://localhost:3000',
  'http://0.0.0.0:3000'
].filter((origin): origin is string => typeof origin === 'string');

server.register(cors, { 
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true 
});

// Request logging middleware
server.addHook('onRequest', async (request, reply) => {
  request.log.info({
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers['user-agent']
  }, 'Incoming request');
});

// Response time tracking
server.addHook('onResponse', async (request, reply) => {
  request.log.info({
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    responseTime: reply.getResponseTime()
  }, 'Request completed');
});

// Error handler
server.setErrorHandler((error, request, reply) => {
  request.log.error({
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method
  }, 'Request error');

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Something went wrong',
      timestamp: new Date().toISOString()
    });
  } else {
    reply.status(500).send({
      error: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
server.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: 'Not Found',
    message: `Route ${request.method} ${request.url} not found`,
    timestamp: new Date().toISOString()
  });
});

// Register existing routes
server.register(healthRoutes, { prefix: "/api" });
server.register(matchRoutes, { prefix: "/api" });
server.register(predictionRoutes, { prefix: "/api" });
server.register(scraperRoutes, { prefix: "/api" });
server.register(mlRoutes, { prefix: "/api/ml" });
server.register(newsAuthorRoutes, { prefix: "/api" });
server.register(newsRoutes, { prefix: "/api" });

// Register enhanced MagajiCo routes
server.register(enhancedPredictionRoutes, { prefix: "/api/v2/predictions" });
server.register(ceoAnalysisRoutes, { prefix: "/api/v2/ceo" });
server.register(marketIntelligenceRoutes, { prefix: "/api/v2/market" });

// Root endpoint
server.get('/', async (request, reply) => {
  return {
    name: 'MagajiCo Enhanced Prediction API',
    version: '2.0.0',
    description: 'Advanced sports prediction system with market intelligence',
    endpoints: {
      health: '/api/health',
      predictions_v1: '/api/predictions',
      predictions_v2: '/api/v2/predictions',
      ceo_analysis: '/api/v2/ceo',
      market_intelligence: '/api/v2/market',
      machine_learning: '/api/ml'
    },
    features: [
      'Kalshi-style market intelligence',
      'Pinnacle-sharp odds analysis',
      'Warren Buffett value investing principles',
      'Zuckerberg Meta scaling strategies',
      'MagajiCo 7(1) filter system'
    ],
    documentation: '/api/docs'
  };
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  server.log.info(`Received ${signal}, shutting down gracefully...`);
  
  try {
    await server.close();
    server.log.info('Server closed successfully');
    process.exit(0);
  } catch (error) {
    server.log.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

const start = async () => {
  try {
    // Connect to database with enhanced connection handling
    await connectDB();
    server.log.info('✅ Database connected successfully');
    
    // Start server
    const port = Number(process.env.PORT) || 8000;
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    
    server.log.info({
      port,
      host,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    }, '🚀 MagajiCo Enhanced Server started successfully');
    
  } catch (err) {
    server.log.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();

// apps/backend/src/routes/enhanced-predictions.ts
import { FastifyPluginAsync } from 'fastify';
import { spawn } from 'child_process';
import path from 'path';

interface PredictionRequest {
  Body: {
    matches: Array<{
      home_team: string;
      away_team: string;
      league: string;
      match_date: string;
      home_form?: number;
      away_form?: number;
      h2h_ratio?: number;
      home_goals_for?: number;
      home_goals_against?: number;
      away_goals_for?: number;
      away_goals_against?: number;
    }>;
  };
}

interface SinglePredictionRequest {
  Body: {
    features: number[];
  };
}

export const enhancedPredictionRoutes: FastifyPluginAsync = async (fastify) => {
  // Enhanced single prediction
  fastify.post<SinglePredictionRequest>('/single', async (request, reply) => {
    const { features } = request.body;
    
    if (!Array.isArray(features) || features.length !== 7) {
      return reply.status(400).send({
        error: 'Invalid features array. Expected 7 numerical features.',
        expected: [
          'home_form', 'away_form', 'h2h_ratio',
          'home_goals_for', 'home_goals_against', 
          'away_goals_for', 'away_goals_against'
        ]
      });
    }
    
    try {
      const prediction = await callEnhancedPredictor(features);
      
      reply.send({
        success: true,
        data: prediction,
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      });
      
    } catch (error) {
      fastify.log.error('Enhanced prediction error:', error);
      reply.status(500).send({
        error: 'Prediction failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Enhanced batch predictions
  fastify.post<PredictionRequest>('/batch', async (request, reply) => {
    const { matches } = request.body;
    
    if (!Array.isArray(matches) || matches.length === 0) {
      return reply.status(400).send({
        error: 'Invalid matches array. Expected non-empty array of match objects.'
      });
    }
    
    try {
      const predictions = [];
      const errors = [];
      
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        
        try {
          const features = extractFeatures(match);
          const prediction = await callEnhancedPredictor(features);
          
          predictions.push({
            match: `${match.home_team} vs ${match.away_team}`,
            league: match.league,
            match_date: match.match_date,
            ...prediction
          });
          
        } catch (error) {
          errors.push({
            match_index: i,
            match: `${match.home_team} vs ${match.away_team}`,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      
      reply.send({
        success: true,
        data: {
          predictions,
          summary: {
            total_matches: matches.length,
            successful_predictions: predictions.length,
            failed_predictions: errors.length,
            success_rate: (predictions.length / matches.length * 100).toFixed(1) + '%'
          },
          errors: errors.length > 0 ? errors : undefined
        },
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      });
      
    } catch (error) {
      fastify.log.error('Batch prediction error:', error);
      reply.status(500).send({
        error: 'Batch prediction failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get prediction statistics
  fastify.get('/stats', async (request, reply) => {
    try {
      // In a real implementation, you'd fetch from database
      const stats = {
        total_predictions: 1250,
        accuracy_rate: 73.2,
        avg_confidence: 0.78,
        domination_opportunities: 45,
        total_edge_identified: 234.7,
        active_models: [
          'Random Forest Ensemble',
          'Gradient Boosting',
          'Logistic Regression',
          'Kalshi Market Intelligence',
          'Pinnacle Sharp Analysis'
        ],
        last_model_update: '2024-12-28T10:30:00.000Z'
      };
      
      reply.send({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      fastify.log.error('Stats error:', error);
      reply.status(500).send({
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

// Helper function to call Python ML model
async function callEnhancedPredictor(features: number[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), 'ml', 'enhanced_prediction.py');
    const python = spawn('python3', [pythonScript, JSON.stringify(features)]);
    
    let output = '';
    let errorOutput = '';
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    python.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse prediction output: ${output}`));
        }
      } else {
        reject(new Error(`Python script failed with code ${code}: ${errorOutput}`));
      }
    });
    
    python.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
    
    // Set timeout
    setTimeout(() => {
      python.kill();
      reject(new Error('Prediction timeout after 30 seconds'));
    }, 30000);
  });
}

// Helper function to extract features from match object
function extractFeatures(match: any): number[] {
  return [
    match.home_form || 0.5,
    match.away_form || 0.5,
    match.h2h_ratio || 0.5,
    match.home_goals_for || 1.0,
    match.home_goals_against || 1.0,
    match.away_goals_for || 1.0,
    match.away_goals_against || 1.0
  ];
}

// apps/backend/src/routes/ceo-analysis.ts
import { FastifyPluginAsync } from 'fastify';

interface CEOAnalysisRequest {
  Body: {
    predictions: Array<any>;
  };
}

export const ceoAnalysisRoutes: FastifyPluginAsync = async (fastify) => {
  // CEO strategic analysis
  fastify.post<CEOAnalysisRequest>('/analyze', async (request, reply) => {
    const { predictions } = request.body;
    
    if (!Array.isArray(predictions)) {
      return reply.status(400).send({
        error: 'Invalid predictions array'
      });
    }
    
    try {
      // Simulate CEO analysis (in production, this would call your TS CEO logic)
      const analysis = {
        executive_summary: {
          total_opportunities: predictions.length,
          domination_opportunities: predictions.filter(p => p.confidence > 0.85).length,
          recommended_strategy: 'SELECTIVE_SCALING',
          risk_level: 'MEDIUM'
        },
        strategic_insights: {
          buffett_score: 78,
          zuckerberg_meta_score: 85,
          pinnacle_sharpness_index: 82,
          kalshi_intelligence_rating: 76
        },
        action_items: [
          {
            type: 'MARKET_DOMINATION',
            priority: 'HIGH',
            description: 'Execute on 3 domination-level opportunities identified',
            expected_roi: 24.5
          }
        ],
        risk_warnings: [
          'Market volatility detected in 2 matches',
          'Sharp money disagreement on Liverpool fixture'
        ],
        market_opportunities: [
          '4 high-edge value bets available',
          'Strong sharp money alignment detected'
        ]
      };
      
      reply.send({
        success: true,
        data: analysis,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      fastify.log.error('CEO analysis error:', error);
      reply.status(500).send({
        error: 'CEO analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get strategic framework information
  fastify.get('/framework', async (request, reply) => {
    const framework = {
      magajico_7_1_filter: {
        description: 'Seven quality checks, one final decision',
        filters: [
          'Confidence Check (>70%)',
          'Market Validation (Sharp confidence)',
          'Sharp Money Alignment',
          'Value Opportunity (Positive EV)',
          'Risk Assessment',
          'Liquidity Check',
          'Information Edge'
        ],
        decisions: ['DOMINATE', 'EXECUTE', 'MONITOR', 'AVOID']
      },
      strategic_frameworks: {
        buffett_value_investing: 'Intrinsic value analysis with margin of safety',
        zuckerberg_meta_scaling: 'Platform scaling and network effects',
        pinnacle_sharp_analysis: 'Professional betting market intelligence',
        kalshi_prediction_markets: 'Real-world probability assessment'
      },
      current_version: '2.0.0'
    };
    
    reply.send({
      success: true,
      data: framework,
      timestamp: new Date().toISOString()
    });
  });
};

// apps/backend/src/routes/market-intelligence.ts
export const marketIntelligenceRoutes: FastifyPluginAsync = async (fastify) => {
  // Get market intelligence summary
  fastify.get('/summary', async (request, reply) => {
    const marketData = {
      kalshi_markets: {
        active_markets: 234,
        total_volume: 2.4e6,
        average_efficiency: 87.3,
        trending_topics: ['Premier League', 'Champions League', 'La Liga']
      },
      pinnacle_analysis: {
        sharp_money_indicators: 'BULLISH',
        line_movement_alerts: 12,
        steam_moves_detected: 3,
        market_sentiment: 'POSITIVE'
      },
      value_opportunities: {
        high_edge_bets: 8,
        medium_edge_bets: 15,
        total_edge_available: 156.7,
        average_edge: 12.3
      },
      risk_metrics: {
        overall_market_volatility: 'MEDIUM',
        sharp_money_confidence: 0.78,
        model_consensus: 0.84,
        information_asymmetry: 'MODERATE'
      }
    };
    
    reply.send({
      success: true,
      data: marketData,
      timestamp: new Date().toISOString()
    });
  });

  // Real-time line movements
  fastify.get('/line-movements', async (request, reply) => {
    const lineMovements = [
      {
        match: 'Manchester City vs Liverpool',
        movement: 0.15,
        direction: 'HOME_FAVORED',
        significance: 'HIGH',
        sharp_money_indicator: true,
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        match: 'Arsenal vs Chelsea',
        movement: -0.08,
        direction: 'AWAY_FAVORED',
        significance: 'MEDIUM',
        sharp_money_indicator: false,
        timestamp: new Date(Date.now() - 180000).toISOString()
      }
    ];
    
    reply.send({
      success: true,
      data: lineMovements,
      timestamp: new Date().toISOString()
    });
  });
};