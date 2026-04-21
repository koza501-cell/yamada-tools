import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import RecipeGrid from './RecipeGrid';

const NICHE = {
  slug: 'ai',
  name: 'AI活用レシピ',
  tagline: 'コピペで使える！AIツールの実践レシピ集',
  description: 'ChatGPT、Claude、Geminiなど、AIツールの具体的な活用法をレシピ形式でお届け。コピペできるプロンプト付きで、今すぐ使えます。',
  emoji: '🤖',
  gradient: 'from-blue-600 to-purple-600',
  dataFile: 'aiPosts.json',
};

export const metadata: Metadata = {
  title: NICHE.name,
  description: NICHE.description,
  alternates: {
    canonical: 'https://yamada-tools.jp/ai',
  },
};

function getNichePosts() {
  try {
    const postsPath = path.join(process.cwd(), 'src/data/' + NICHE.dataFile);
    if (fs.existsSync(postsPath)) {
      const fileContent = fs.readFileSync(postsPath, 'utf-8');
      const posts = JSON.parse(fileContent);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return posts
        .filter((p: any) => new Date(p.publishDate || p.publishedAt) <= today)
        .sort((a: any, b: any) => new Date(b.publishDate || b.publishedAt).getTime() - new Date(a.publishDate || a.publishedAt).getTime());
    }
  } catch (error) {
    console.error('Error loading niche posts:', error);
  }
  return [];
}

export default function NicheListPage() {
  const posts = getNichePosts();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={"bg-gradient-to-r " + NICHE.gradient + " text-white py-16"}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-5xl mb-4 block">{NICHE.emoji}</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{NICHE.name}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">{NICHE.tagline}</p>
          <p className="text-white/70 mt-4 max-w-3xl mx-auto">{NICHE.description}</p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm">📋 コピペOK</span>
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm">⏱ 時短効果あり</span>
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm">🎯 実践済みプロンプト</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">記事を準備中です...もうすぐ公開します！</p>
          </div>
        ) : (
          <RecipeGrid posts={posts} />
        )}
      </div>
    </div>
  );
}
