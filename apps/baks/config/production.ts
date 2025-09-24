// apps/backend/config/production.ts
export const productionConfig = {
  cors: {
    origin: process.env.FRONTEND_URL || 'https://flashscore-study-app.vercel.app',
    credentials: true
  },
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }
  }
};