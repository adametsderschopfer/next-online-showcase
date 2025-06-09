import type {NextConfig} from "next";
import withPayload from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    reactCompiler: false,
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
