import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
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

    if (!dev) {
      // Production optimizations
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }

    return config;
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

  
};

export default nextConfig;