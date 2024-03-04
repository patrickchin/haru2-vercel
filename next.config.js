// @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: process.env.BLOB_STORE_HOSTNAME || "",
    }],
  }


}
 
module.exports = nextConfig