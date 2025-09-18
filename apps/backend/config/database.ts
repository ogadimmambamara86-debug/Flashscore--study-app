import mongoose from "mongoose";

// Get MongoDB URI based on environment
const MONGODB_URI = process.env.NODE_ENV === 'production' 
  ? process.env.MONGODB_URI 
  : process.env.MONGODB_URI || 'mongodb://localhost:27017/sports-central';

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (!MONGODB_URI) {
    console.error("❌ MongoDB connection string is not defined");
    if (process.env.NODE_ENV === 'production') {
      throw new Error("MongoDB connection string is required in production");
    }
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
    if (process.env.NODE_ENV === 'production') {
      throw error; // Fail hard in production
    }
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