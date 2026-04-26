import type { NextConfig } from "next";

const backendApiUrl = process.env.BACKEND_API_URL ?? "http://api:5000/api";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
