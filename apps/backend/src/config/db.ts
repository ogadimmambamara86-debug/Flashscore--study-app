
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Support both local and Atlas connections
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/magajico";
    
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    
    console.log(`✅ MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    console.log("⚠️  Running without database connection for development");
    // Don't exit in development, continue without DB
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Graceful disconnection
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("📤 MongoDB disconnected");
  } catch (err) {
    console.error("❌ MongoDB disconnect error:", err);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📤 Mongoose disconnected');
});
