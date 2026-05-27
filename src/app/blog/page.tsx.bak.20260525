import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { getPublishedPosts } from "@/data/blogPosts";
import BlogIndexClient from "./client";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  const pageNum = page ? parseInt(page) : 1;
  const isFirstPage = !page || pageNum === 1;

  return {
    title: isFirstPage ? "ブログ | 山田ツール" : `ブログ (${pageNum}ページ目) | 山田ツール`,
    description: "ビジネス効率化・PDF活用・不動産情報・税金・金融の実践ノウハウを発信。全銀フォーマット、確定申告、不動産情報ライブラリの使い方など。",
    alternates: { canonical: isFirstPage ? "https://yamada-tools.jp/blog" : `https://yamada-tools.jp/blog?page=${pageNum}` },
    robots: isFirstPage ? "index, follow" : "noindex, follow",
    openGraph: {
      title: "ブログ | 山田ツール",
      description: "ビジネス効率化・PDF活用・不動産情報の実践ノウハウを発信。",
      url: isFirstPage ? "https://yamada-tools.jp/blog" : `https://yamada-tools.jp/blog?page=${pageNum}`,
      type: "website",
    },
  };
}

function getDynamicBlogs() {
  try {
    const p = path.join(process.cwd(), "src/data/dynamicBlogs.json");
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {}
  return [];
}

export default function BlogPage() {
  const staticBlogs = getPublishedPosts();
  const dynamicBlogs = getDynamicBlogs();
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const allBlogs = [...dynamicBlogs, ...staticBlogs]
    .filter((b) => new Date(b.publishDate) <= today)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  return <BlogIndexClient blogs={allBlogs} />;
}
