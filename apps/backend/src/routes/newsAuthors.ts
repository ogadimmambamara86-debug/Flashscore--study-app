import { FastifyInstance } from 'fastify';
import { NewsAuthorController } from '../controllers/newsAuthorController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function newsAuthorRoutes(fastify: FastifyInstance) {
  // Get all active authors (public)
  fastify.get('/news-authors', NewsAuthorController.getAllAuthors);
  
  // Get author by ID (public for basic info)
  fastify.get('/news-authors/:id', NewsAuthorController.getAuthorById);
  
  // Create or update author (member access required)
  fastify.post('/news-authors', {
    preHandler: authMiddleware.requireMemberAccess
  }, NewsAuthorController.createOrUpdateAuthor);
  
  // Create collaboration news (member access required)
  fastify.post('/news-authors/:id/collaborate', {
    preHandler: authMiddleware.requireMemberAccess
  }, NewsAuthorController.createCollaborationNews);
  
  // Generate automatic news (member access required)
  fastify.post('/news-authors/auto-news', {
    preHandler: authMiddleware.requireMemberAccess
  }, NewsAuthorController.generateAutoNews);
  
  // Initialize default authors (public for setup)
  fastify.post('/news-authors/initialize', NewsAuthorController.initializeDefaultAuthors);
}