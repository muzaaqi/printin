import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'imgur.com'
      }
    ]
  },
};

export default nextConfig;
