
import { NextApiRequest, NextApiResponse } from 'next';
import { createSportsAPIService } from '../../../../Sports-api';

const sportsAPI = createSportsAPIService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const route = Array.isArray(path) ? path.join('/') : path;

  try {
    switch (route) {
      case 'live-matches':
        const matches = await sportsAPI.fetchAllLiveMatches();
        res.json(matches);
        break;
      
      case 'health':
        const health = await sportsAPI.checkAPIHealth();
        res.json(health);
        break;
      
      default:
        if (route?.startsWith('odds/')) {
          const sport = route.split('/')[1]?.toUpperCase();
          const odds = await sportsAPI.fetchOddsData(sport);
          res.json(odds);
        } else {
          res.status(404).json({ error: 'Endpoint not found' });
        }
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
