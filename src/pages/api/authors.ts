
import { NextApiRequest, NextApiResponse } from 'next';

// Import the controller (will be converted to TypeScript later)
const AuthorController = require('../../controllers/authorController');

const authorController = new AuthorController();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { expertise, search } = req.query;
      
      let authors;
      
      if (expertise) {
        authors = authorController.getAuthorsByExpertise(expertise as string);
      } else if (search) {
        authors = authorController.searchAuthors(search as string);
      } else {
        authors = authorController.getAllAuthors();
      }
      
      res.status(200).json(authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const newAuthor = authorController.createAuthor(req.body);
      res.status(201).json(newAuthor);
    } catch (error) {
      console.error('Error creating author:', error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
