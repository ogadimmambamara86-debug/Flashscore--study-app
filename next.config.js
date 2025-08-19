
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const apiUrl = isProduction 
      ? `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/sports-proxy`
      : 'http://localhost:5000';
    
    return [
      {
        source: '/api/sports/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
