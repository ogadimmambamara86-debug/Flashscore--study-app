const express = require('express');
const cors = require('cors');
const { createSportsAPIService } = require('./Sports-api');
const { connectDatabase } = require('./config/database');
const { NewsController } = require('./controllers/newsController');

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || '*'
    : ['http://localhost:5000', 'http://localhost:3000', 'http://0.0.0.0:5000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
connectDatabase();

// Initialize sports API service
const sportsAPI = createSportsAPIService();

// Sample sports data
const sports = [
 { id: 1, name: 'Football', players: 11, category: 'Team Sport' },
 { id: 2, name: 'Basketball', players: 5, category: 'Team Sport' },
 { id: 3, name: 'Tennis', players: 1, category: 'Individual Sport' },
 { id: 4, name: 'Swimming', players: 1, category: 'Individual Sport' }
];

// Routes
app.get('/', (req, res) => {
 res.json({ message: 'Welcome to Sports API' });
});

app.get('/sports', (req, res) => {
 res.json(sports);
});

app.get('/sports/:id', (req, res) => {
 const sport = sports.find(s => s.id === parseInt(req.params.id));
 if (!sport) {
   return res.status(404).json({ error: 'Sport not found' });
 }
 res.json(sport);
});

// Live matches endpoint
app.get('/live-matches', async (req, res) => {
 try {
   const matches = await sportsAPI.fetchAllLiveMatches();
   res.json(matches);
 } catch (error) {
   console.error('Error fetching live matches:', error);
   res.status(500).json({ error: 'Failed to fetch live matches' });
 }
});

// Odds endpoint
app.get('/odds/:sport', async (req, res) => {
 try {
   const sport = req.params.sport.toUpperCase();
   const odds = await sportsAPI.fetchOddsData(sport);
   res.json(odds);
 } catch (error) {
   console.error('Error fetching odds:', error);
   res.status(500).json({ error: 'Failed to fetch odds data' });
 }
});

// Health check endpoint
app.get('/health', async (req, res) => {
 try {
   const health = await sportsAPI.checkAPIHealth();
   res.json(health);
 } catch (error) {
   console.error('Error checking API health:', error);
   res.status(500).json({ error: 'Failed to check API health' });
 }
});

// News API Routes
app.get('/api/news', NewsController.getAllNews);
app.get('/api/news/:id', NewsController.getNewsById);
app.post('/api/news', NewsController.createNews);
app.put('/api/news/:id', NewsController.updateNews);
app.delete('/api/news/:id', NewsController.deleteNews);

// Start server
app.listen(PORT, '0.0.0.0', () => {
 console.log(`Sports API server running on port ${PORT}`);
});