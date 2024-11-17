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
      { hostname: `haru2.s3.me-central-1.amazonaws.com` },
      { hostname: `haru2-cape.s3.af-south-1.amazonaws.com` },
      { hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com` },
      { hostname: process.env.BLOB_STORE_HOSTNAME || "" },
    ],
  },
};

module.exports = nextConfig;
