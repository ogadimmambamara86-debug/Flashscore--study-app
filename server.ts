import express from 'express';
import { createSportsAPIService } from './Sports-api';

const app = express();
const port = 5000;

app.use(express.json());

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

app.listen(port, '0.0.0.0', () => {
  console.log(`Sports API running on http://0.0.0.0:${port}`);
});