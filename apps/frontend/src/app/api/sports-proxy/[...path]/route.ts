
import { NextApiRequest, NextApiResponse } from 'next';
import { createSportsAPIService } from '../../../Sports-api';

interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

const sportsAPI = createSportsAPIService();

// Sample match data with predictions (fallback)
const fallbackMatches: Match[] = [
  {
    id: 1,
    home: "Manchester United",
    away: "Liverpool",
    prediction: "Liverpool to win 2-1"
  },
  {
    id: 2,
    home: "Barcelona",
    away: "Real Madrid",
    prediction: "Draw 1-1"
  },
  {
    id: 3,
    home: "Bayern Munich",
    away: "Borussia Dortmund",
    prediction: "Bayern Munich to win 3-0"
  },
  {
    id: 4,
    home: "Arsenal",
    away: "Chelsea",
    prediction: "Arsenal to win 2-0"
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Try to fetch enhanced live matches with FlashScore and StatArea data
      const liveMatches = await sportsAPI.fetchEnhancedLiveMatches();
      
      // Convert live matches to dashboard format with real predictions
      const matches: Match[] = liveMatches.map((match, index) => ({
        id: parseInt(match.id) || index + 1,
        home: match.homeTeam,
        away: match.awayTeam,
        prediction: match.prediction || `Analysis: ${match.homeTeam} vs ${match.awayTeam} - Check recent form and head-to-head records`
      }));

      // If no live matches, use fallback data
      res.status(200).json(matches.length > 0 ? matches : fallbackMatches);
    } catch (error) {
      console.error('Error fetching enhanced live matches:', error);
      // Fallback to regular matches
      try {
        const regularMatches = await sportsAPI.fetchAllLiveMatches();
        const matches: Match[] = regularMatches.map((match, index) => ({
          id: parseInt(match.id) || index + 1,
          home: match.homeTeam,
          away: match.awayTeam,
          prediction: `Prediction for ${match.homeTeam} vs ${match.awayTeam}`
        }));
        res.status(200).json(matches.length > 0 ? matches : fallbackMatches);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        res.status(200).json(fallbackMatches);
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
