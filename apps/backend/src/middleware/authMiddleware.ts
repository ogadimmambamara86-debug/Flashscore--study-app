import { FastifyRequest, FastifyReply } from 'fastify';

// Simple auth middleware for permission checking
export const authMiddleware = {
  // Check if user has permission to read full content
  requireMemberAccess: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // In a real application, you would check JWT tokens, session cookies, etc.
      // For now, we'll check for a simple auth header or query parameter
      const authHeader = request.headers.authorization;
      const authQuery = (request.query as any)?.auth;
      
      if (!authHeader && !authQuery) {
        return reply.code(401).send({
          success: false,
          message: 'Member access required. Please log in to view full content.',
          guestAccess: true
        });
      }
      
      // Simple validation - in production, verify JWT tokens properly
      const isValidAuth = authHeader?.includes('Bearer member') || authQuery === 'member';
      
      if (!isValidAuth) {
        return reply.code(403).send({
          success: false,
          message: 'Invalid credentials. Member access required.',
          guestAccess: true
        });
      }
      
      // User is authenticated, continue to route handler
    } catch (error) {
      return reply.code(500).send({
        success: false,
        message: 'Authentication error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Check if user is guest (for limited access)
  isGuest: (request: FastifyRequest): boolean => {
    const authHeader = request.headers.authorization;
    const authQuery = (request.query as any)?.auth;
    
    return !authHeader && !authQuery;
  },

  // Get user type for response filtering
  getUserType: (request: FastifyRequest): 'guest' | 'member' => {
    const authHeader = request.headers.authorization;
    const authQuery = (request.query as any)?.auth;
    
    const isValidAuth = authHeader?.includes('Bearer member') || authQuery === 'member';
    
    return isValidAuth ? 'member' : 'guest';
  }
};