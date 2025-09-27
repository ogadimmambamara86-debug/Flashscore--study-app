import { FastifyInstance } from 'fastify';
import { NewsAuthorController } from '../controllers/newsAuthorController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function newsAuthorRoutes(fastify: FastifyInstance) {
  // Get all active authors (public)
  fastify.get('/news-authors', NewsAuthorController.getAllAuthors);
  
  // Get author by ID with member access check
  fastify.get('/news-authors/:id', {
    preHandler: authMiddleware.requireMemberAccess
  }, NewsAuthorController.getAuthorById);
  
  // Create or update author (admin only)
  fastify.post('/news-authors', {
    preHandler: authMiddleware.requireMemberAccess
  }, NewsAuthorController.createOrUpdateAuthor);
  
  // Create collaboration news (member only)
  fastify.post('/news-authors/:id/collaborate', {
    preHandler: authMiddleware.requireMemberAccess
  }, NewsAuthorController.createCollaborationNews);
  
  // Generate automatic news (member only)
  fastify.post('/news-authors/auto-news', {
    preHandler: authMiddleware.requireMemberAccess
  }, NewsAuthorController.generateAutoNews);
  
  // Initialize default authors (admin only)
  fastify.post('/news-authors/initialize', {
    preHandler: authMiddleware.requireMemberAccess
  }, NewsAuthorController.initializeDefaultAuthors);
}