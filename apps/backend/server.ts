// Load environment variables FIRST
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Now import other modules
const express = require('express');
const cors = require('cors');
const { createSportsAPIService } = require('./Sports-api');
const { connectDatabase } = require('./config/database');
const { NewsController } = require('./controllers/newsController');

const app = express();
const PORT = process.env.PORT || 8000;

// Rest of your server code...