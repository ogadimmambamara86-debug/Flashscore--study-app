
import { NextApiRequest, NextApiResponse } from 'next';

interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

// Sample match data with predictions
const matches: Match[] = [
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(matches);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
