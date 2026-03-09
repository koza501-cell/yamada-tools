import { MetadataRoute } from "next";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools } from "@/config/tools";

const baseUrl = "https://yamada-tools.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: currentDate, changeFrequency: "weekly", priority: 1.0 },
    { url: baseUrl + "/pdf", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/document", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/convert", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/image", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/generator", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/blog", lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: baseUrl + "/tools", lastModified: currentDate, changeFrequency: "weekly", priority: 0.9 },
    { url: baseUrl + "/finance", lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: baseUrl + "/reference/bank-codes", lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: baseUrl + "/reference/holidays", lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: baseUrl + "/use-cases/pdf-compress-email", lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: baseUrl + "/use-cases/tax-8-10", lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: baseUrl + "/use-cases/resume-mobile", lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: baseUrl + "/docs/holiday-api", lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: baseUrl + "/about/company", lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
    { url: baseUrl + "/about/story", lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
    { url: baseUrl + "/about/faq", lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
    { url: baseUrl + "/about/business", lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: baseUrl + "/legal/terms", lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
    { url: baseUrl + "/legal/privacy", lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
    { url: baseUrl + "/legal/tokushoho", lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  const allTools = [
    ...pdfTools.filter(t => t.available),
    ...documentTools.filter(t => t.available),
    ...convertTools.filter(t => t.available),
    ...imageTools.filter(t => t.available),
    ...generatorTools.filter(t => t.available),
  ];

  const toolPages: MetadataRoute.Sitemap = allTools.map(tool => ({
    url: baseUrl + tool.path,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...toolPages];
}
