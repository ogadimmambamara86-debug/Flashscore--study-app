// Load environment variables first
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on environment
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.join(__dirname, envFile) });

// Now import other modules
const express = require('express');
const cors = require('cors');
const { createSportsAPIService } = require('./Sports-api');
const { connectDatabase } = require('./config/database');
const { NewsController } = require('./controllers/newsController');

// Import production config if in production
let corsConfig = {};
if (process.env.NODE_ENV === 'production') {
  const { productionConfig } = require('./config/production');
  corsConfig = productionConfig.cors;
} else {
  corsConfig = {
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true
  };
}

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration
app.use(cors(corsConfig));

// Rest of your server code...