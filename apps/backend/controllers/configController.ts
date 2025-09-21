
import { Request, Response } from 'express';

export class ConfigController {
  // Get sanitized config for frontend
  static getConfig = (req: Request, res: Response) => {
    try {
      const config = {
        nodeEnv: process.env.NODE_ENV,
        frontendUrl: process.env.FRONTEND_URL,
        // Don't expose sensitive data like database URLs or API keys
        hasDatabase: !!(process.env.MONGODB_URI || process.env.DATABASE_URL),
        hasAdminCredentials: !!(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
        hasSportsApi: !!process.env.SPORTS_API_KEY,
      };

      res.json({
        success: true,
        config,
        message: "Configuration loaded successfully"
      });
    } catch (error) {
      console.error("❌ Error getting config:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load configuration"
      });
    }
  };

  // Health check with environment status
  static healthCheck = (req: Request, res: Response) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      secrets: {
        database: !!(process.env.MONGODB_URI || process.env.DATABASE_URL),
        admin: !!(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
        sportsApi: !!process.env.SPORTS_API_KEY,
      }
    };

    res.json(health);
  };
}
}
