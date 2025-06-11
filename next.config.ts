import type {NextConfig} from "next";
import withPayload from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
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
