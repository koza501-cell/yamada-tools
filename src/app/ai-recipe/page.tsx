import { Metadata } from "next";
import fs from "fs";
import path from "path";
import AiRecipeClient from "./client";

export const metadata: Metadata = {
  title: "AIレシピ",
  description: "ChatGPT・Claude・NotionAIなど最新AIツールの実践的な使い方レシピを紹介。業務効率化・文章作成・データ分析に今すぐ使えるプロンプトテンプレート付き。",
  alternates: { canonical: "https://yamada-tools.jp/ai-recipe" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "AIレシピ | 山田ツール",
    description: "AIツールの実践レシピ集。コピペOKプロンプト付き。",
    url: "https://yamada-tools.jp/ai-recipe",
    type: "website",
  },
};

function getAiPosts() {
  try {
    const p = path.join(process.cwd(), "src/data/aiPosts.json");
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {}
  return [];
}

export default function AiRecipePage() {
  const posts = getAiPosts();
  return <AiRecipeClient posts={posts} />;
}
