import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yamada-tools.jp",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Redirects for SEO (trailing slashes)
  async redirects() {
    return [
      {
        source: "/pdf/:path*",
        has: [{ type: "query", key: "ref" }],
        destination: "/pdf/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
