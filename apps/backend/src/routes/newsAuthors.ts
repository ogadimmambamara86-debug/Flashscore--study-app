import { FastifyInstance } from 'fastify';
import { NewsAuthorController } from '../controllers/newsAuthorController';

export async function newsAuthorRoutes(fastify: FastifyInstance) {
  // Get all active authors
  fastify.get('/news-authors', NewsAuthorController.getAllAuthors);
  
  // Get author by ID
  fastify.get('/news-authors/:id', NewsAuthorController.getAuthorById);
  
  // Create or update author
  fastify.post('/news-authors', NewsAuthorController.createOrUpdateAuthor);
  
  // Create collaboration news
  fastify.post('/news-authors/:id/collaborate', NewsAuthorController.createCollaborationNews);
  
  // Generate automatic news
  fastify.post('/news-authors/auto-news', NewsAuthorController.generateAutoNews);
  
  // Initialize default authors
  fastify.post('/news-authors/initialize', NewsAuthorController.initializeDefaultAuthors);
}