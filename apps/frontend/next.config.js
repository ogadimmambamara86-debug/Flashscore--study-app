
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
    // Handle path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': new URL('./src/app/components', import.meta.url).pathname,
      '@hooks': new URL('./src/app/hooks', import.meta.url).pathname,
      '@controllers': new URL('./src/app/controllers', import.meta.url).pathname,
      '@api': new URL('./src/app/api', import.meta.url).pathname,
      '@services': new URL('./src/app/services', import.meta.url).pathname,
      '@styles': new URL('./src/app/styles', import.meta.url).pathname,
      '@config': new URL('./src/app/config', import.meta.url).pathname,
      '@shared': new URL('../../packages/shared/src/libs', import.meta.url).pathname,
    };

    return config;
  },
};

export default nextConfig;
