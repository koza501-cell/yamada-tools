import Image from 'next/image';
import Link from 'next/link';
import { getCategoryStyle } from '@/lib/categoryStyles';

interface RelatedPost {
  slug: string;
  title: string;
  category?: string;
  publishDate?: string;
  featuredImage?: string;
  eyecatch?: { src: string; alt: string };
  [key: string]: unknown;
}

export default function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
  if (!posts.length) return null;

  return (
    <section className="mt-12 mb-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-kon flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h6" />
        </svg>
        関連記事
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map(post => {
          const catStyle = getCategoryStyle(post.category ?? '');
          const heroSrc = (post.eyecatch as any)?.src || post.featuredImage || '';
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <div className="relative aspect-[16/9] flex-shrink-0 overflow-hidden">
                {heroSrc ? (
                  <Image
                    src={heroSrc}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${catStyle.gradient} flex items-center justify-center`}>
                    <span className="text-3xl select-none" role="img" aria-label={post.category}>
                      {catStyle.emoji}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                {post.category && (
                  <span className="text-xs font-medium text-kon dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full w-fit">
                    {post.category}
                  </span>
                )}
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-kon dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
                <p className="mt-auto text-xs text-gray-400 dark:text-gray-500 pt-1">
                  {post.publishDate}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
