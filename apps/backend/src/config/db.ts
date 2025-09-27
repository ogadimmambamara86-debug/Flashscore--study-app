// backend/config/database.js - Hybrid approach supporting both X.509 and standard auth

import mongoose from "mongoose";
import fs from "fs";
import path from "path";

class MagajicoDatabase {
  constructor() {
    this.isConnected = false;
    this.connectionType = null;
    this.setupEventHandlers();
  }

  async connectDB() {
    try {
      console.log('🔄 Initializing MagajiCo database connection...');
      
      // Try X.509 certificate connection first (production)
      if (await this.tryX509Connection()) {
        this.connectionType = 'X.509 Certificate';
        console.log(`✅ Connected via X.509 Certificate: ${mongoose.connection.name}`);
        return;
      }
      
      // Fallback to standard connection (development/alternative)
      if (await this.tryStandardConnection()) {
        this.connectionType = 'Standard Authentication';
        console.log(`✅ Connected via Standard Auth: ${mongoose.connection.name}`);
        return;
      }
      
      // Fallback to local development
      if (await this.tryLocalConnection()) {
        this.connectionType = 'Local Development';
        console.log(`✅ Connected to Local MongoDB: ${mongoose.connection.name}`);
        return;
      }
      
      throw new Error('All connection methods failed');
      
    } catch (err) {
      console.error("❌ All MongoDB connection attempts failed:", err.message);
      
      if (process.env.NODE_ENV === 'production') {
        console.error("🚨 Production environment requires database connection!");
        process.exit(1);
      } else {
        console.log("⚠️  Development mode: Running without database connection");
        console.log("📝 To connect, set MONGODB_URI in your .env file");
      }
    }
  }

  async tryX509Connection() {
    try {
      // Check if X.509 configuration exists
      const certPath = process.env.MONGODB_CERT_PATH || "./certs/mongodb-cert.pem";
      const atlasUri = process.env.MONGODB_X509_URI || 
        "mongodb+srv://clustermagaji.deweqyx.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=ClusterMagaji";
      
      // Verify certificate file exists
      if (!fs.existsSync(certPath)) {
        console.log('📄 X.509 certificate not found, skipping X.509 connection');
        return false;
      }
      
      console.log('🔐 Attempting X.509 certificate connection...');
      
      const clientOptions = {
        tlsCertificateKeyFile: certPath,
        serverApi: { version: '1', strict: true, deprecationErrors: true },
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false,
      };
      
      await mongoose.connect(atlasUri, clientOptions);
      
      // Test the connection
      await mongoose.connection.db.admin().command({ ping: 1 });
      
      this.isConnected = true;
      return true;
      
    } catch (error) {
      console.log('❌ X.509 connection failed:', error.message);
      await this.safeDisconnect();
      return false;
    }
  }

  async tryStandardConnection() {
    try {
      const standardUri = process.env.MONGODB_URI;
      
      if (!standardUri) {
        console.log('🔑 Standard MongoDB URI not found in environment variables');
        return false;
      }
      
      console.log('🔗 Attempting standard MongoDB connection...');
      
      const options = {
        autoIndex: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false,
      };
      
      await mongoose.connect(standardUri, options);
      
      // Test the connection
      await mongoose.connection.db.admin().command({ ping: 1 });
      
      this.isConnected = true;
      return true;
      
    } catch (error) {
      console.log('❌ Standard connection failed:', error.message);
      await this.safeDisconnect();
      return false;
    }
  }

  async tryLocalConnection() {
    try {
      console.log('🏠 Attempting local MongoDB connection...');
      
      const localUri = "mongodb://127.0.0.1:27017/magajico";
      
      const options = {
        autoIndex: true,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 3000,
        socketTimeoutMS: 30000,
      };
      
      await mongoose.connect(localUri, options);
      
      this.isConnected = true;
      return true;
      
    } catch (error) {
      console.log('❌ Local connection failed:', error.message);
      await this.safeDisconnect();
      return false;
    }
  }

  async safeDisconnect() {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch (error) {
      // Ignore disconnect errors during fallback attempts
    }
  }

  async disconnectDB() {
    try {
      if (this.isConnected) {
        await mongoose.disconnect();
        this.isConnected = false;
        console.log("📤 MagajiCo database disconnected");
      }
    } catch (err) {
      console.error("❌ Database disconnect error:", err);
    }
  }

  setupEventHandlers() {
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      console.log(`🔗 MagajiCo connected to MongoDB via ${this.connectionType}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MagajiCo database error:', err);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      console.log('📤 MagajiCo database disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      this.isConnected = true;
      console.log('🔄 MagajiCo database reconnected');
    });

    // Graceful shutdown handlers
    process.on('SIGINT', async () => {
      console.log('🔄 SIGINT received, closing MagajiCo database connection...');
      await this.disconnectDB();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('🔄 SIGTERM received, closing MagajiCo database connection...');
      await this.disconnectDB();
      process.exit(0);
    });
  }

  getConnectionInfo() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return {
      isConnected: this.isConnected,
      connectionType: this.connectionType,
      status: states[mongoose.connection.readyState] || 'unknown',
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      database: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    };
  }

  // Health check method for API endpoints
  async healthCheck() {
    try {
      if (!this.isConnected) {
        return {
          status: 'disconnected',
          healthy: false,
          message: 'Database not connected'
        };
      }

      // Ping the database
      await mongoose.connection.db.admin().command({ ping: 1 });
      
      return {
        status: 'connected',
        healthy: true,
        connectionType: this.connectionType,
        database: mongoose.connection.name,
        message: 'Database connection healthy'
      };
      
    } catch (error) {
      return {
        status: 'error',
        healthy: false,
        error: error.message,
        message: 'Database health check failed'
      };
    }
  }
}

// Create singleton instance
const magajicoDb = new MagajicoDatabase();

// Export the instance and methods
export const connectDB = () => magajicoDb.connectDB();
export const disconnectDB = () => magajicoDb.disconnectDB();
export const getConnectionInfo = () => magajicoDb.getConnectionInfo();
export const healthCheck = () => magajicoDb.healthCheck();

export default magajicoDb;

// .env.example - Environment variables template
/*
# Production X.509 Certificate Configuration
MONGODB_X509_URI=mongodb+srv://clustermagaji.deweqyx.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=ClusterMagaji
MONGODB_CERT_PATH=./certs/mongodb-cert.pem

# Standard MongoDB Atlas Configuration (alternative)
MONGODB_URI=mongodb+srv://username:password@clustermagaji.deweqyx.mongodb.net/magajico?retryWrites=true&w=majority

# Development Configuration
NODE_ENV=development

# Other configurations
JWT_SECRET=your_jwt_secret_here
PORT=3001
*/

// Usage in your main server file (server.js or app.js):
/*
import { connectDB, getConnectionInfo, healthCheck } from './config/database.js';

// Connect to database on startup
await connectDB();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbHealth = await healthCheck();
  const connectionInfo = getConnectionInfo();
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: {
      ...dbHealth,
      ...connectionInfo
    },
    version: '2.0.0'
  });
});
*/