import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools, financeTools, careerTools, realestateTools, businessTools, healthTools, educationTools, debtTools, utilityTools, insuranceTools, taxTools, statTools, clinicTools } from "@/config/tools";

const baseUrl = "https://yamada-tools.jp";

// Sitemap IDs: 0 = static pages, 1 = tool pages
export function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }];
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();
  const numId = Number(id);

  if (numId === 0) {
    // Static pages sitemap
    return [
      { url: baseUrl, lastModified: currentDate, changeFrequency: "weekly", priority: 1.0 },
      { url: baseUrl + "/pdf", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
      { url: baseUrl + "/document", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
      { url: baseUrl + "/convert", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
      { url: baseUrl + "/image", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
      { url: baseUrl + "/generator", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
      { url: baseUrl + "/finance", lastModified: currentDate, changeFrequency: "weekly", priority: 0.95 },
      { url: baseUrl + "/blog", lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
      { url: baseUrl + "/ai", lastModified: currentDate, changeFrequency: "weekly", priority: 0.85 },
      ...(() => {
        const aiPostsPath = path.join(process.cwd(), "src/data/aiPosts.json");
        if (!fs.existsSync(aiPostsPath)) return [];
        const aiPosts: any[] = JSON.parse(fs.readFileSync(aiPostsPath, "utf-8"));
        return aiPosts.map(p => ({
          url: baseUrl + "/ai/" + p.slug,
          lastModified: currentDate,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        }));
      })(),
      ...(() => {
        const blogsPath = path.join(process.cwd(), "src/data/dynamicBlogs.json");
        if (!fs.existsSync(blogsPath)) return [];
        const blogs: any[] = JSON.parse(fs.readFileSync(blogsPath, "utf-8"));
        return blogs.map(b => ({
          url: baseUrl + "/blog/" + b.slug,
          lastModified: b.publishDate || currentDate,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }));
      })(),
      { url: baseUrl + "/career", lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
      { url: baseUrl + "/health", lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
      { url: baseUrl + "/insurance", lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
      { url: baseUrl + "/realestate", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
      { url: baseUrl + "/souzoku-touki", lastModified: currentDate, changeFrequency: "monthly", priority: 0.85 },
      { url: baseUrl + "/business", lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
      { url: baseUrl + "/tax", lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
      { url: baseUrl + "/debt", lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
      { url: baseUrl + "/education", lastModified: currentDate, changeFrequency: "monthly", priority: 0.8 },
      { url: baseUrl + "/utility", lastModified: currentDate, changeFrequency: "monthly", priority: 0.75 },
      { url: baseUrl + "/clinic", lastModified: currentDate, changeFrequency: "weekly", priority: 0.85 },
      { url: baseUrl + "/reference", lastModified: currentDate, changeFrequency: "monthly", priority: 0.75 },
      { url: baseUrl + "/about/company", lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
      { url: baseUrl + "/about/story", lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
      { url: baseUrl + "/about/faq", lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
      { url: baseUrl + "/about/business", lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
      { url: baseUrl + "/legal/terms", lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
      { url: baseUrl + "/legal/privacy", lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
      { url: baseUrl + "/legal/tokushoho", lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
      { url: baseUrl + "/search", lastModified: currentDate, changeFrequency: "weekly", priority: 0.7 },
      // ─── English pages with hreflang alternates ─────────────────────
      // Tells Google these are translations of the Japanese pages.
      {
        url: baseUrl + "/en/pdf-text-input",
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            "en-US": baseUrl + "/en/pdf-text-input",
            "ja-JP": baseUrl + "/pdf-text-input",
            "x-default": baseUrl + "/en/pdf-text-input",
          },
        },
      },
      {
        url: baseUrl + "/en/business/company-search",
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.9,
        alternates: {
          languages: {
            "en-US": baseUrl + "/en/business/company-search",
            "ja-JP": baseUrl + "/business/houjin-search",
            "x-default": baseUrl + "/en/business/company-search",
          },
        },
      },
      {
        url: baseUrl + "/en/realestate/property-report",
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.9,
        alternates: {
          languages: {
            "en-US": baseUrl + "/en/realestate/property-report",
            "ja-JP": baseUrl + "/realestate/yoto-chiiki-checker",
            "x-default": baseUrl + "/en/realestate/property-report",
          },
        },
      },
      {
        url: baseUrl + "/en/utility/postal-code-lookup",
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            "en-US": baseUrl + "/en/utility/postal-code-lookup",
            "x-default": baseUrl + "/en/utility/postal-code-lookup",
          },
        },
      },
      {
        url: baseUrl + "/en",
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.85,
        alternates: {
          languages: {
            "en-US": baseUrl + "/en",
            "ja-JP": baseUrl + "/",
            "x-default": baseUrl + "/en",
          },
        },
      },
    ];
  }

  // numId === 1: Tool pages sitemap
  const allTools = [
    ...pdfTools.filter(t => t.available),
    ...documentTools.filter(t => t.available),
    ...convertTools.filter(t => t.available),
    ...imageTools.filter(t => t.available),
    ...generatorTools.filter(t => t.available),
    ...financeTools.filter(t => t.available),
    ...careerTools.filter(t => t.available),
    ...realestateTools.filter(t => t.available),
    ...statTools.filter(t => t.available),
    ...businessTools.filter(t => t.available),
    ...healthTools.filter(t => t.available),
    ...educationTools.filter(t => t.available),
    ...debtTools.filter(t => t.available),
    ...utilityTools.filter(t => t.available),
    ...insuranceTools.filter(t => t.available),
    ...taxTools.filter(t => t.available),
    ...clinicTools.filter(t => t.available),
  ];

  // Map of Japanese tool paths -> English alternate paths.
  // Add new entries here when you build more English versions.
  const englishAlternates: Record<string, string> = {
    "/business/houjin-search": "/en/business/company-search",
    "/pdf-text-input": "/en/pdf-text-input",
    "/realestate/yoto-chiiki-checker": "/en/realestate/property-report",
    "/realestate/hazard-checker": "/en/realestate/property-report",
    "/realestate/land-price": "/en/realestate/property-report",
    "/realestate/transaction-price": "/en/realestate/property-report",
    "/realestate/school-district": "/en/realestate/property-report",
    "/realestate/population": "/en/realestate/property-report",
  };

  return allTools.map(tool => {
    const enPath = englishAlternates[tool.path];
    const entry: any = {
      url: baseUrl + tool.path,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: tool.category === "finance" ? 0.9 :
                ["career", "realestate", "business", "health", "education"].includes(tool.category) ? 0.85 : 0.8,
    };
    if (enPath) {
      entry.alternates = {
        languages: {
          "ja-JP": baseUrl + tool.path,
          "en-US": baseUrl + enPath,
          "x-default": baseUrl + enPath,
        },
      };
    }
    return entry;
  });
}
