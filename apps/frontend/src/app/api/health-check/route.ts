import { NextResponse } from 'next/server';

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

async function checkExternalApis(): Promise<boolean> {
  try {
    // Add your external API health checks here
    return true;
  } catch {
    return false;
  }
}

function checkCache(): boolean {
  // Add your cache health check here
  return true;
}

export async function GET() {
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

    return NextResponse.json(status, {
      status: allHealthy ? 200 : someHealthy ? 206 : 503
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: false,
        cache: false,
        externalApis: false
      },
      uptime: Date.now() - startTime,
      version: '1.0.0'
    }, { status: 503 });
  }
}