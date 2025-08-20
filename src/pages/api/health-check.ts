
import { NextApiRequest, NextApiResponse } from 'next';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: boolean;
    cache: boolean;
    externalApis: boolean;
  };
  uptime: number;
  version: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<HealthStatus>) {
  const startTime = Date.now();
  
  try {
    // Check external APIs
    const externalApiHealth = await checkExternalApis();
    
    // Check cache
    const cacheHealth = checkCache();
    
    // Check database (mock check since we're using in-memory)
    const databaseHealth = true;
    
    const allHealthy = externalApiHealth && cacheHealth && databaseHealth;
    const someHealthy = externalApiHealth || cacheHealth || databaseHealth;
    
    const status: HealthStatus = {
      status: allHealthy ? 'healthy' : someHealthy ? 'degraded' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: databaseHealth,
        cache: cacheHealth,
        externalApis: externalApiHealth
      },
      uptime: Date.now() - startTime,
      version: '1.0.0'
    };
    
    res.status(allHealthy ? 200 : someHealthy ? 206 : 503).json(status);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: false,
        cache: false,
        externalApis: false
      },
      uptime: Date.now() - startTime,
      version: '1.0.0'
    });
  }
}

async function checkExternalApis(): Promise<boolean> {
  try {
    const response = await fetch('https://www.mybets.today', {
      method: 'HEAD',
      timeout: 5000
    });
    return response.ok;
  } catch {
    return false;
  }
}

function checkCache(): boolean {
  try {
    // Test cache functionality
    const testKey = 'health_check_test';
    const testValue = 'test';
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return retrieved === testValue;
    }
    return true; // Assume healthy if localStorage not available
  } catch {
    return false;
  }
}
