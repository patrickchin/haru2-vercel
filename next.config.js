// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/github/:path*",
        destination:
          "https://github.com/patrickchin/haru2-data/raw/main/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: process.env.BLOB_STORE_HOSTNAME || "",
      },
      {
        protocol: "https",
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
        port: "",
        pathname: "**",
      },
    ],
    // deprecated, but I'm missing something from remotePatterns ...
    // so it doesn't work in dev
    domains: [
      `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
    ],
  },
};

module.exports = nextConfig;
