const apiUrl = isProduction
      ? `${process.env.VERCEL_URL || "http://0.0.0.0:3000"}/api/sports-proxy`
      : "http://0.0.0.0:5000";

async rewrites() {
    return [
      {
        source: '/api/sports-proxy/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://api.the-odds-api.com/:path*'
          : 'http://0.0.0.0:5000/api/sports-proxy/:path*'
      },
      {
        source: '/api/backend/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? '/api/backend/:path*'
          : 'http://0.0.0.0:5000/:path*'
      }
    ];
  }