/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // env: {
  //   API_URL: process.env.API_URL || "http://127.0.0.1:8000/api",
  //   NEXT_PUBLIC_BACKEND_URL:
  //     process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  //   SOCKET_URL: process.env.SOCKET_URL || "ws://127.0.0.1:8000",
  // },
  // placeholder images placehold.co
  images: {
    domains: ["127.0.0.1", "placehold.co"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
