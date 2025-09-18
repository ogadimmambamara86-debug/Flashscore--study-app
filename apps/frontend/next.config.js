// apps/frontend/next.config.js
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/app/components'),
      '@hooks': path.resolve(__dirname, 'src/app/hooks'),
      '@services': path.resolve(__dirname, 'src/app/services'),
      '@controllers': path.resolve(__dirname, 'src/app/controllers'),
      '@api': path.resolve(__dirname, 'src/app/api'),
      '@styles': path.resolve(__dirname, 'src/app/styles'), // Add this line
    };
    return config;
  },
}

export default nextConfig