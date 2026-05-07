import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zvovuemzonhqqemeywoo.supabase.co', 
      },
    ],
  },
};

export default nextConfig;
