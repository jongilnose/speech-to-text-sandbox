/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    OPENAI_KEY: process.env.NEXT_PUBLIC_OPENAI_KEY
  },
};

module.exports = nextConfig;
