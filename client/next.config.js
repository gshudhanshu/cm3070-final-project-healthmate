/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: "http://localhost:8000/api",
  },
  // placeholder images placehold.co
  images: { domains: ["placehold.co"] },
};

module.exports = nextConfig;
