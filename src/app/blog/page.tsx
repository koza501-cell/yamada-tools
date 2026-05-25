import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";
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

const PER_PAGE = 12;

// FIX 3: server-side validation of ?page= param — redirect before render
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; sort?: string; tag?: string }>;
}) {
  const params = await searchParams;

  if (params.page !== undefined) {
    const p = parseInt(params.page);
    if (isNaN(p) || p < 1) {
      redirect("/blog");
    }
  }

  const staticBlogs = getPublishedPosts();
  const dynamicBlogs = getDynamicBlogs();
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const allBlogs = [...dynamicBlogs, ...staticBlogs]
    .filter((b) => new Date(b.publishDate) <= today)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  // Redirect if page exceeds total pages (based on all blogs, unfiltered)
  if (params.page !== undefined) {
    const p = parseInt(params.page);
    const maxPage = Math.ceil(allBlogs.length / PER_PAGE);
    if (p > maxPage) {
      redirect("/blog");
    }
  }

  return <BlogIndexClient blogs={allBlogs} />;
}
