/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    esmExternals: true,
  },
  async rewrites() {
    const isProduction = process.env.NODE_ENV === "production";
    const apiUrl = isProduction
      ? `${process.env.VERCEL_URL || "http://0.0.0.0:3000"}/api/sports-proxy`
      : "http://0.0.0.0:5000";

    return [
      // Example rewrite (customize/remove as needed)
      { source: '/old-route', destination: '/new-route' },
      // Your API proxy rewrite
      {
        source: "/api/sports/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.the-odds-api.com https://rapidapi.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/predictions",
        destination: "/",
        permanent: true,
      },
      {
        source: "/sports",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;