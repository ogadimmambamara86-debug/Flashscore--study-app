
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { NewsController } from '../controllers/newsController';

export async function newsRoutes(fastify: FastifyInstance) {
  // Get all news (public with member preview restrictions)
  fastify.get('/news', async (request: FastifyRequest, reply: FastifyReply) => {
    await NewsController.getAllNews(request as any, reply as any);
  });
  
  // Get single news item (public with member preview restrictions)
  fastify.get('/news/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    await NewsController.getNewsById(request as any, reply as any);
  });
  
  // Create news (admin only)
  fastify.post('/news', async (request: FastifyRequest, reply: FastifyReply) => {
    await NewsController.createNews(request as any, reply as any);
  });
  
  // Update news (admin only)
  fastify.put('/news/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    await NewsController.updateNews(request as any, reply as any);
  });
  
  // Delete news (admin only)
  fastify.delete('/news/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    await NewsController.deleteNews(request as any, reply as any);
  });
}
