import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "imgur.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "dnwzgwqdjfouylioejpn.supabase.co",
      },
      {
        hostname: "storage.muzaaqi.my.id",
      },
    ],
  },
};

export default nextConfig;
