import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://flashstudy-ri0g.onrender.com/api/:path*',
      },
    ];
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Frontend aliases
      '@components': path.resolve(__dirname, 'src/app/components'),
      '@hooks': path.resolve(__dirname, 'src/app/hooks'),
      '@controllers': path.resolve(__dirname, 'src/app/controllers'),
      '@api': path.resolve(__dirname, 'src/app/api'),
      '@services': path.resolve(__dirname, 'src/app/services'),
      '@style': path.resolve(__dirname, 'src/app/style'),

      // Simplified shared alias
      '@shared': path.resolve(__dirname, '../../packages/shared/src/libs'),
    };
    return config;
  },
};

export default nextConfig;