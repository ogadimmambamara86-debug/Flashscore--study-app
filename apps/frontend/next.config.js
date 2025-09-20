
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://flashstudy-ri0g.onrender.com/api/:path*',
      },
    ];
  },

  webpack: (config, { isServer }) => {
    const path = require('path');
    
    // Handle path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/app/components'),
      '@hooks': path.resolve(__dirname, 'src/app/hooks'),
      '@controllers': path.resolve(__dirname, 'src/app/controllers'),
      '@api': path.resolve(__dirname, 'src/app/api'),
      '@services': path.resolve(__dirname, 'src/app/services'),
      '@styles': path.resolve(__dirname, 'src/app/styles'),
      '@config': path.resolve(__dirname, 'src/app/config'),
      '@shared': path.resolve(__dirname, '../../packages/shared/src/libs'),
    };

    return config;
  },
};

export default nextConfig;
