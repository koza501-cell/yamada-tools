import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  poweredByHeader: false,
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "yamada-tools.jp" },
      { protocol: "https", hostname: "pub-a1dbb3c658b341fabe5015e209050298.r2.dev" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Fix 404: Deleted blog post - redirect to image tools
      {
        source: "/blog/image-resize-sns-perfect-size",
        destination: "/image/resize",
        permanent: true,
      },
      // Fix 404: Garbage URLs from JS bug
      {
        source: "/&",
        destination: "/",
        permanent: true,
      },
      {
        source: "/%24", // URL encoded $
        destination: "/",
        permanent: true,
      },
      // Fix potential em-dash blog URL issue
      {
        source: "/blog/pdf—:slug*",
        destination: "/blog",
        permanent: true,
      },
      // Common typos and variations
      {
        source: "/pdf/combine",
        destination: "/pdf/merge",
        permanent: true,
      },
      {
        source: "/image/compression",
        destination: "/image/compress",
        permanent: true,
      },
      {
        source: "/tools/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
