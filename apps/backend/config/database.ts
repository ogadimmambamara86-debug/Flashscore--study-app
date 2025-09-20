import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

let isConnected = false;

// Load environment variables from the correct path
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });
console.log(`🛠 Loading environment from .env`);
console.log(`🛠 Environment file path: ${envPath}`);
console.log(`🛠 MONGODB_URI: ${process.env.MONGODB_URI ? 'Found' : 'Not found'}`);

export const connectDatabase = async (): Promise<void> => {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MongoDB connection string is required in production");
    } else {
      mongoUri = "mongodb://localhost:27017/sports_central";
      console.log(`🔄 Using default MongoDB URI: ${mongoUri}`);
    }
  }

  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  const connect = async () => {
    try {
      const conn = await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      isConnected = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      console.log("⏳ Retrying in 5s...");
      setTimeout(connect, 5000);
    }
  };

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
    isConnected = false;
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
    isConnected = false;
    connect(); // try to reconnect
  });

  await connect();
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close();
      console.log("🔄 Database disconnected successfully");
      isConnected = false;
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