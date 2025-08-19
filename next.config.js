
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/sports/:path*',
        destination: 'http://localhost:5000/sports/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
