/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: "http://127.0.0.1:8001/api",
    NEXT_PUBLIC_BACKEND_URL: "http://localhost:8001",
  },
  // placeholder images placehold.co
  images: {
    domains: ["127.0.0.1", "placehold.co"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
