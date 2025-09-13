
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchPredictions } from '../../services/predictionsService';

// Import the controller (will be converted to TypeScript later)
const PredictionController = require('../../controllers/predictionController');

const predictionController = new PredictionController();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get external predictions from scraping
      const externalPredictions = await fetchPredictions();
      
      // Get internal predictions from controller
      const internalPredictions = predictionController.getAllPredictions();
      
      // Combine both sources
      const allPredictions = [
        ...internalPredictions.map(p => ({ 
          id: p.id,
          title: p.title, 
          content: p.content,
          source: 'internal',
          sport: p.sport,
          confidence: `${p.confidence}%`,
          status: p.status,
          match: p.matchDetails ? `${p.matchDetails.home} vs ${p.matchDetails.away}` : 'TBD'
        })),
        ...externalPredictions.map((p, index) => ({ 
          id: `ext_${index}`,
          title: p.title, 
          content: p.content || 'External prediction analysis',
          source: 'external',
          sport: p.sport || 'Football',
          confidence: p.confidence || '70%',
          status: 'active',
          match: 'External Match'
        }))
      ];
      
      res.status(200).json(allPredictions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      res.status(500).json({ error: 'Failed to fetch predictions' });
    }
  } else if (req.method === 'POST') {
    try {
      const newPrediction = predictionController.createPrediction(req.body);
      res.status(201).json(newPrediction);
    } catch (error) {
      console.error('Error creating prediction:', error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
