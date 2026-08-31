import { notFound } from 'next/navigation';
import CopyCodeButton from '@/components/CopyCodeButton';
import BlogAdUnit from '@/components/common/BlogAdUnit';
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
  gradient: 'from-slate-900 to-kon',
  gradientDark: 'dark:from-slate-900 dark:to-kon',
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
  const siteUrl = 'https://yamada-tools.jp';
  const _d = post.metaDescription || post.seoDescription || post.description || post.excerpt || '';
  const description = _d.length > 150 ? _d.slice(0, 150) + '…' : _d;
  const keywords = post.keywords || (Array.isArray(post.tags) ? post.tags.join(',') : '');
  return {
    title: post.title + ' | ' + NICHE.name,
    description,
    keywords,
    robots: post.noindex ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: `${siteUrl}/ai/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `${siteUrl}/ai/${slug}`,
      type: 'article',
      publishedTime: post.publishDate || post.publishedAt,
      images: [{
        url: post.featuredImage || `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&type=ai-recipe&category=${encodeURIComponent(post.category || '')}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.featuredImage || `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&type=ai-recipe&category=${encodeURIComponent(post.category || '')}`],
    },
  };
}

export default async function NicheArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find((p: any) => p.slug === slug);

  const htmlContent = String(await marked(post.content));
  const relatedPosts = posts.filter((p: any) => p.slug !== slug).slice(0, 3);
  function normalizeDate(d: string | undefined): string {
    if (!d) return new Date().toISOString();
    if (d.includes('T')) return d;
    return d + 'T09:00:00+09:00';
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription || post.seoDescription || post.description || post.excerpt || '',
    "image": {
      "@type": "ImageObject",
      "url": post.thumbnail || post.ogImage || "https://yamada-tools.jp/og-default.png",
      "width": 1200,
      "height": 630
    },
    "author": { "@type": "Organization", "name": "Yamada Tools", "url": "https://yamada-tools.jp" },
    "publisher": { "@type": "Organization", "name": "Yamada Tools", "url": "https://yamada-tools.jp" },
    "datePublished": normalizeDate(post.publishDate || post.publishedAt),
    "dateModified": normalizeDate(post.lastUpdated || post.publishDate || post.publishedAt),
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://yamada-tools.jp/ai/" + slug }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {post.faq && <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faq) }} />}
      <div className={"bg-gradient-to-r " + NICHE.gradient + " " + NICHE.gradientDark + " text-white py-3"}>
        <div className="max-w-4xl mx-auto px-4">
          <Link href={'/' + NICHE.slug} className="text-white/80 hover:text-white text-sm transition-colors">
            ← {NICHE.emoji} {NICHE.name} に戻る
          </Link>
        </div>
      </div>
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-gray-50 dark:bg-kon/40 text-kon dark:text-gray-300 rounded-full text-sm font-medium">{post.type || 'レシピ'}</span>
            {post.difficulty && (<span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">{post.difficulty}</span>)}
            {post.toolName && (<span className="px-3 py-1 bg-gray-50 dark:bg-kon/40 text-kon dark:text-gray-300 rounded-full text-sm">{post.toolName}</span>)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">{post.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{post.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>📅 {post.publishDate}</span>
            <span>⏱ {post.readTime || '5分で読める'}</span>
            {post.timeSaved && (<span className="text-green-600 dark:text-green-400 font-medium">💡 時短効果: {post.timeSaved}</span>)}
          </div>
          {post.toolName && (
            <div className="bg-gray-50 dark:bg-kon/30 border border-gray-200 dark:border-kon rounded-xl p-6 mb-8">
              <h2 className="font-bold text-kon dark:text-gray-300 mb-3">📋 このレシピで使うもの</h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div><span className="text-gray-500 dark:text-gray-400">ツール:</span><span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{post.toolName}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">料金:</span><span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{post.toolPrice || '無料プランあり'}</span></div>
                <div><span className="text-gray-500 dark:text-gray-400">難易度:</span><span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{post.difficulty || '初心者OK'}</span></div>
              </div>
              {post.toolUrl && (
                <a href={post.toolUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-kon dark:text-gray-300 hover:text-ai dark:hover:text-ai font-medium text-sm">
                  {post.toolName}の公式サイトを開く →
                </a>
              )}
            </div>
          )}
          <BlogAdUnit />
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h3:text-xl prose-h3:mt-8 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-kon dark:prose-a:text-kon prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-50 dark:prose-pre:bg-gray-800 prose-pre:text-gray-800 dark:prose-pre:text-gray-200 prose-pre:rounded-xl prose-pre:border-2 prose-pre:border-gray-200 dark:prose-pre:border-gray-600 prose-pre:shadow-sm prose-blockquote:border-l-blue-500 dark:prose-blockquote:border-l-blue-400 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-kon/30 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-200 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-table:border-collapse prose-th:bg-gray-100 dark:prose-th:bg-gray-700 prose-th:text-gray-900 dark:prose-th:text-gray-100 prose-th:p-3 prose-th:text-left prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:text-gray-700 dark:prose-td:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <CopyCodeButton />
        <BlogAdUnit />
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">📚 関連レシピ</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related: any) => (
                <Link key={related.slug} href={'/' + NICHE.slug + '/' + related.slug}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-5 group">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-ai dark:group-hover:text-ai transition-colors line-clamp-2 mb-2">{related.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{related.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mt-12 text-center">
          <Link href={'/' + NICHE.slug}
            className={"inline-flex items-center px-8 py-4 bg-gradient-to-r " + NICHE.gradient + " " + NICHE.gradientDark + " text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg"}>
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
