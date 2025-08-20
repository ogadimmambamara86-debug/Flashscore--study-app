
import { NextApiRequest, NextApiResponse } from 'next';

// Import the controller (will be converted to TypeScript later)
const PredictionController = require('../../../controllers/predictionController');

const predictionController = new PredictionController();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const prediction = predictionController.getPredictionById(id);
      res.status(200).json(prediction);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      res.status(404).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedPrediction = predictionController.updatePrediction(id, req.body);
      res.status(200).json(updatedPrediction);
    } catch (error) {
      console.error('Error updating prediction:', error);
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = predictionController.deletePrediction(id);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error deleting prediction:', error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
