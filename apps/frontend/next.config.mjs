import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  
  // Allow origins for Replit environment
  allowedDevOrigins: [
    '*.repl.co',
    '*.replit.dev',
    'localhost',
    '127.0.0.1'
  ],

  images: {
    formats: ["image/webp", "image/avif"],
  },

  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    return [
      {
        source: "/api/backend/:path*",
        destination: isDev 
          ? "http://localhost:8000/api/:path*"
          : "/api/:path*",
      },
    ];
  },

  webpack: (config) => {
    // Chunk optimization
    if (config.optimization?.splitChunks) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            chunks: "all",
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react",
            chunks: "all",
            priority: 20,
          },
        },
      };
    }

    // Aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.resolve(__dirname, "src/app/components"),
      "@hooks": path.resolve(__dirname, "src/app/hooks"),
      "@controllers": path.resolve(__dirname, "src/app/controllers"),
      "@api": path.resolve(__dirname, "src/app/api"),
      "@services": path.resolve(__dirname, "src/app/services"),
      "@styles": path.resolve(__dirname, "src/app/styles"),
      "@config": path.resolve(__dirname, "src/app/config"),
      "@shared/types": path.resolve(
        __dirname,
        "../../packages/shared/src/libs/types"
      ),
      "@shared/utils": path.resolve(
        __dirname,
        "../../packages/shared/src/libs/utils"
      ),
      "@shared/models": path.resolve(
        __dirname,
        "../../packages/shared/src/libs/models"
      ),
    };

    return config;
  },
};

export default nextConfig;