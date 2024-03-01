// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: process.env.VERCEL_BLOB_STORE_HOSTNAME || "",
    }],
  }


}
 
module.exports = nextConfig