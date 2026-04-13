import { notFound } from 'next/navigation';
import CopyCodeButton from '@/components/CopyCodeButton';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

const NICHE = {
  slug: 'ai',
  name: 'AI活用レシピ',
  emoji: '🤖',
  gradient: 'from-blue-600 to-purple-600',
  dataFile: 'aiPosts.json',
};

function getAllPosts() {
  const postsPath = path.join(process.cwd(), 'src/data/' + NICHE.dataFile);
  const fileContent = fs.readFileSync(postsPath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find((p: any) => p.slug === slug);
  return {
    title: post.title + ' | ' + NICHE.name + '',
    description: post.metaDescription || post.description,
  };
}

export default async function NicheArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find((p: any) => p.slug === slug);

  const htmlContent = String(await marked(post.content));
  const relatedPosts = posts.filter((p: any) => p.slug !== slug).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription || post.description,
    "author": { "@type": "Organization", "name": "Yamada Tools" },
    "publisher": { "@type": "Organization", "name": "Yamada Tools", "url": "https://yamada-tools.jp" },
    "datePublished": post.publishDate || post.publishedAt,
    "dateModified": post.publishDate || post.publishedAt,
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/ai/" + slug }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className={"bg-gradient-to-r " + NICHE.gradient + " text-white py-3"}>
        <div className="max-w-4xl mx-auto px-4">
          <Link href={'/' + NICHE.slug} className="text-white/80 hover:text-white text-sm transition-colors">
            ← {NICHE.emoji} {NICHE.name} に戻る
          </Link>
        </div>
      </div>
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{post.type || 'レシピ'}</span>
            {post.difficulty && (<span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{post.difficulty}</span>)}
            {post.toolName && (<span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{post.toolName}</span>)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{post.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <span>📅 {post.publishDate}</span>
            <span>⏱ {post.readTime || '5分で読める'}</span>
            {post.timeSaved && (<span className="text-green-600 font-medium">💡 時短効果: {post.timeSaved}</span>)}
          </div>
          {post.toolName && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-blue-900 mb-3">📋 このレシピで使うもの</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div><span className="text-gray-500">ツール:</span><span className="ml-2 font-medium">{post.toolName}</span></div>
                <div><span className="text-gray-500">料金:</span><span className="ml-2 font-medium">{post.toolPrice || '無料プランあり'}</span></div>
                <div><span className="text-gray-500">難易度:</span><span className="ml-2 font-medium">{post.difficulty || '初心者OK'}</span></div>
              </div>
              {post.toolUrl && (
                <a href={post.toolUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">
                  {post.toolName}の公式サイトを開く →
                </a>
              )}
            </div>
          )}
        </header>
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 prose-h3:text-xl prose-h3:mt-8 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-amber-50 prose-pre:text-gray-800 prose-pre:rounded-xl prose-pre:border-2 prose-pre:border-amber-200 prose-pre:shadow-sm prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-table:border-collapse prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-td:p-3 prose-td:border prose-td:border-gray-200"
          dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <CopyCodeButton />
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 関連レシピ</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related: any) => (
                <Link key={related.slug} href={'/' + NICHE.slug + '/' + related.slug}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-5 group">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{related.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{related.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mt-12 text-center">
          <Link href={'/' + NICHE.slug}
            className={"inline-flex items-center px-8 py-4 bg-gradient-to-r " + NICHE.gradient + " text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg"}>
            {NICHE.emoji} {NICHE.name}の全レシピを見る
          </Link>
        </div>
      </article>
    </div>
  );
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post: any) => ({ slug: post.slug }));
}
