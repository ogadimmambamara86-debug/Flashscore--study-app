import mongoose from "mongoose";

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 
                    process.env.MONGODB_URL || 
                    process.env.DATABASE_URL;

let isConnected = false; // track connection

export const connectDatabase = async (): Promise<void> => {
  // Check if MongoDB URI is available
  if (!MONGODB_URI) {
    console.error("❌ MongoDB connection string is not defined");
    console.log("⚠️ Please set MONGODB_URI, MONGODB_URL, or DATABASE_URL environment variable");
    console.log("⚠️ Continuing without database connection - some features may be limited");
    return;
  }

  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
      isConnected = false;
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔄 MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.log("⚠️ Continuing without database - some features may be limited");
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("🔄 Database disconnected successfully");
    isConnected = false;
  } catch (error) {
    console.error("❌ Error disconnecting from database:", error);
  }
};