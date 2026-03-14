import { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

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
  title: NICHE.name + ' | yamada-tools.jp',
  description: NICHE.description,
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
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm">🔍 価格確認済</span>
            <span className="px-4 py-2 bg-white/20 rounded-full text-sm">💬 正直レビュー</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">記事を準備中です...もうすぐ公開します！</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                最新レシピ <span className="text-gray-400 text-lg font-normal">({posts.length}件)</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Link key={post.slug} href={'/' + NICHE.slug + '/' + post.slug}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className={"h-3 bg-gradient-to-r " + NICHE.gradient} />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {post.type || 'レシピ'}
                      </span>
                      {post.difficulty && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{post.difficulty}</span>
                      )}
                      <span className="text-xs text-gray-400">{post.readTime || '5分'}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.description}</p>
                    {post.timeSaved && (
                      <div className="bg-green-50 rounded-lg p-3 mb-4">
                        <span className="text-green-700 text-sm font-medium">⏱ 時短効果: {post.timeSaved}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{post.publishDate}</span>
                      <span className="text-blue-600 group-hover:translate-x-2 transition-transform font-medium">レシピを見る →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
