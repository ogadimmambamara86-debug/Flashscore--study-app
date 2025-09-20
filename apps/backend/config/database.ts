import { Pool, Client } from 'pg';
import dotenv from "dotenv";
import path from "path";

let pool: Pool | null = null;

// Load environment variables from the correct path
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });
console.log(`🛠 Loading environment from .env`);
console.log(`🛠 Environment file path: ${envPath}`);
console.log(`🛠 DATABASE_URL: ${process.env.DATABASE_URL ? 'Found' : 'Not found'}`);

export const connectDatabase = async (): Promise<void> => {
  let databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("PostgreSQL connection string is required in production");
    } else {
      console.log("⚠️ No DATABASE_URL found. Please set up PostgreSQL database in Replit.");
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
      max: 10,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Test the connection
    const client = await pool.connect();
    client.release();
    
    console.log(`✅ PostgreSQL Connected successfully`);
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