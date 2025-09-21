import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'react-particles'],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
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
    // Handle path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      // Frontend aliases
      "@components": path.resolve(__dirname, "src/app/components"),
      "@hooks": path.resolve(__dirname, "src/app/hooks"),
      "@controllers": path.resolve(__dirname, "src/app/controllers"),
      "@api": path.resolve(__dirname, "src/app/api"),
      "@services": path.resolve(__dirname, "src/app/services"),
      "@styles": path.resolve(__dirname, "src/app/styles"),
      "@config": path.resolve(__dirname, "src/app/config"),
      "@shared": path.resolve(__dirname, "../../packages/shared/src/libs"),
    };

    return config;
  },
};

export default nextConfig;