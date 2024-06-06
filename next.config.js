// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/github/:path*",
        destination: "https://github.com/patrickchin/haru2-data/raw/main/:path*",
      }
    ]},
  images: {
    remotePatterns: [
      {
        hostname: process.env.BLOB_STORE_HOSTNAME || "",
      },
    ],
  },
};

module.exports = nextConfig;
