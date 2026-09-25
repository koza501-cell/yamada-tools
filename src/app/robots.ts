import { MetadataRoute } from "next";
import { headers } from "next/headers";

// Host-aware robots.txt.
// Production (yamada-tools.jp) keeps the existing permissive rules (with an
// explicit /api/ disallow) plus the AI-crawler allowlist and sitemap refs.
// Any non-production host (staging.yamada-tools.jp, localhost, previews)
// gets a hard Disallow: / so it never gets indexed.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const isNonProdHost =
    host === "staging.yamada-tools.jp" ||
    host.includes("localhost") ||
    host.includes("127.0.0.1");

  if (isNonProdHost) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/auth/",
          "/admin/",
          "/*?q=*",
          "/*?search=*",
        ],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
    ],
    sitemap: [
      "https://yamada-tools.jp/sitemap.xml",
      "https://yamada-tools.jp/sitemap-tools.xml",
    ],
  };
}
