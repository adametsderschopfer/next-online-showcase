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
  async rewrites() {
    return [
      {
        source: '/thumbnails/:path*',
        destination: '/api/image/gifts/:path*',
      },
    ];
  },
};

export default withPayload(nextConfig);
