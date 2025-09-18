
import { NextApiRequest, NextApiResponse } from 'next';

// Import the controller (will be converted to TypeScript later)
const AuthorController = require('@controllers/authorController');

const authorController = new AuthorController();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const author = authorController.getAuthorById(id);
      res.status(200).json(author);
    } catch (error) {
      console.error('Error fetching author:', error);
      res.status(404).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedAuthor = authorController.updateAuthor(id, req.body);
      res.status(200).json(updatedAuthor);
    } catch (error) {
      console.error('Error updating author:', error);
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = authorController.deleteAuthor(id);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error deleting author:', error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
