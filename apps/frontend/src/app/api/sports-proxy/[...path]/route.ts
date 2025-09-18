import { NextApiRequest, NextApiResponse } from 'next';
import { createSportsAPIService } from '@api/route';

interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

const sportsAPI = createSportsAPIService();

// Sample fallback match data
const fallbackMatches: Match[] = [
  { id: 1, home: "Manchester United", away: "Liverpool", prediction: "Liverpool to win 2-1" },
  { id: 2, home: "Barcelona", away: "Real Madrid", prediction: "Draw 1-1" },
  { id: 3, home: "Bayern Munich", away: "Borussia Dortmund", prediction: "Bayern Munich to win 3-0" },
  { id: 4, home: "Arsenal", away: "Chelsea", prediction: "Arsenal to win 2-0" },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse<Match[] | { message: string }>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Try fetching enhanced live matches
    const liveMatches = await sportsAPI.fetchEnhancedLiveMatches();

    const matches: Match[] = liveMatches.map((match, index) => ({
      id: Number(match.id) || index + 1,
      home: match.homeTeam || 'Unknown',
      away: match.awayTeam || 'Unknown',
      prediction: match.prediction || `Analysis: ${match.homeTeam} vs ${match.awayTeam} - check form & stats`,
    }));

    return res.status(200).json(matches.length ? matches : fallbackMatches);

  } catch (error) {
    console.error('Error fetching enhanced live matches:', error);

    try {
      // Fallback: regular live matches
      const regularMatches = await sportsAPI.fetchAllLiveMatches();
      const matches: Match[] = regularMatches.map((match, index) => ({
        id: Number(match.id) || index + 1,
        home: match.homeTeam || 'Unknown',
        away: match.awayTeam || 'Unknown',
        prediction: `Prediction for ${match.homeTeam} vs ${match.awayTeam}`,
      }));

      return res.status(200).json(matches.length ? matches : fallbackMatches);

    } catch (fallbackError) {
      console.error('Fallback fetch failed:', fallbackError);
      return res.status(200).json(fallbackMatches);
    }
  }
}