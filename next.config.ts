import type {NextConfig} from "next";
import withPayload from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.gifts.ru',
        pathname: '/reviewer/webp/**',
      },
      {
        protocol: 'https',
        hostname: 's.a-5.ru',
        pathname: '/p/**',
      },
      {
        protocol: 'https',
        hostname: 'happygifts.ru',
        pathname: '/catalog-images/**',
      },
    ],
    formats: ['image/webp'],
  },
};

export default withPayload(nextConfig);
