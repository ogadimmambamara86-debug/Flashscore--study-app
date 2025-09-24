import { Pool, Client } from 'pg';
import dotenv from "dotenv";
import path from "path";

let pool: Pool | null = null;

// Environment variables are already loaded in server.ts - no need to reload here
console.log(`🛠 Using environment variables from server.ts`);
console.log(`🛠 DATABASE_URL: ${process.env.DATABASE_URL ? 'Found' : 'Not found'}`);

export const connectDatabase = async (): Promise<void> => {
  console.log("🔄 Initializing database connection...");
  
  // Try MongoDB first (from Replit secrets), then fallback to PostgreSQL
  let mongoUri = process.env.MONGODB_URI;
  let databaseUrl = process.env.DATABASE_URL;

  // Database continuity check
  if (!mongoUri && !databaseUrl) {
    console.log("⚠️ No database configuration found. Using in-memory fallback.");
    return;
  }

  // Prefer MongoDB if available and valid
  if (mongoUri && !mongoUri.includes('localhost') && mongoUri.startsWith('mongodb')) {
    console.log("🔄 Using MongoDB from Replit secrets");
    try {
      const mongoose = await import('mongoose');
      
      if (mongoose.default.connection.readyState === 1) {
        console.log("⚡ Using existing MongoDB connection");
        return;
      }

      await mongoose.default.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        retryReads: true
      });

      console.log(`✅ MongoDB Connected successfully - Database continuity established`);
      return;
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      console.log("🔄 Falling back to PostgreSQL...");
    }
  } else if (mongoUri) {
    console.log("⚠️ MongoDB URI appears to be localhost/invalid, skipping to PostgreSQL");
  }

  // Fallback to PostgreSQL
  if (!databaseUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Database connection string is required in production");
    } else {
      console.log("⚠️ No DATABASE_URL found. Please set up database in Replit secrets.");
      return;
    }
  }

  if (pool) {
    console.log("⚡ Using existing PostgreSQL connection pool");
    return;
  }

  try {
    // Use connection pooling for better performance
    const poolUrl = databaseUrl.replace('.us-east-2', '-pooler.us-east-2');
    
    pool = new Pool({
      connectionString: poolUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Test the connection with retry
    let retries = 3;
    while (retries > 0) {
      try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        console.log(`🔄 Retrying database connection... (${3 - retries}/3)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`✅ PostgreSQL Connected successfully - Database continuity established`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    pool = null;
    throw error;
  }
};

export const getPool = (): Pool | null => {
  return pool;
};

export const disconnectDatabase = async (): Promise<void> => {
  if (pool) {
    try {
      await pool.end();
      console.log("🔄 Database disconnected successfully");
      pool = null;
    } catch (error) {
      console.error("❌ Error disconnecting from database:", error);
    }
  }
};

// Graceful shutdown
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    console.log(`🛑 Received ${signal}, closing DB connection...`);
    await disconnectDatabase();
    process.exit(0);
  });
});