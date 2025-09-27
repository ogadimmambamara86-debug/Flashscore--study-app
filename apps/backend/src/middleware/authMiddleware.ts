import { FastifyRequest, FastifyReply } from 'fastify';

// Simple auth middleware for permission checking
export const authMiddleware = {
  // Check if user has permission to read full content
  requireMemberAccess: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;

      // For development, allow requests with Bearer token or skip auth
      if (process.env.NODE_ENV === 'development') {
        return; // Skip auth in development
      }

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({
          success: false,
          message: 'Member access required'
        });
      }

      // In production, implement proper token validation here
      const token = authHeader.substring(7);
      if (token === 'member' || token === 'admin') {
        return; // Valid token
      }

      return reply.code(401).send({
        success: false,
        message: 'Invalid access token'
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        message: 'Authentication error'
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