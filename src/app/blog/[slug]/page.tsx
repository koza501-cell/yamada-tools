import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import BlogContent from '@/components/BlogContent';
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import { Marked } from 'marked';
import '@/app/blog.css';
import RelatedTools from '@/components/common/RelatedTools';
import { getRelatedPosts } from '@/lib/relatedPosts';
import RelatedPosts from '@/components/blog/RelatedPosts';
import ReadingProgress from '@/components/blog/ReadingProgress';
import { getCategoryStyle } from '@/lib/categoryStyles';
import BlogHero from '@/components/blog/BlogHero';
import TableOfContents from '@/components/blog/TableOfContents';
import ShareButtons from '@/components/blog/ShareButtons';

// FIX 1+2: Custom marked instance — demotes h1→h2 in content (prevents duplicate h1)
// and preserves bold/italic via gfm. walkTokens runs before rendering.
const blogMarked = new Marked({ gfm: true });
blogMarked.use({
  walkTokens(token: any) {
    if (token.type === 'heading' && token.depth === 1) {
      token.depth = 2;
    }
  },
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');

  if (!fs.existsSync(blogsPath)) {
    return { title: 'ブログ記事が見つかりません' };
  }

  const fileContent = fs.readFileSync(blogsPath, 'utf-8');
  const blogs = JSON.parse(fileContent);
  const blog = blogs.find((b: any) => b.slug === slug);

  if (!blog) {
    return { title: 'ブログ記事が見つかりません' };
  }

  const siteUrl = 'https://yamada-tools.jp';

  return {
    title: blog.title,
    description: blog.excerpt || blog.title,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: blog.publishDate,
      modifiedTime: blog.updatedAt || blog.publishDate,
      authors: [blog.author || '合同会社山田トレード'],
      images: [{ url: (blog.eyecatch as any)?.src || blog.featuredImage || 'https://yamada-tools.jp/og-image.png', width: 1200, height: 630, alt: blog.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || blog.title,
      images: [(blog.eyecatch as any)?.src || blog.featuredImage || 'https://yamada-tools.jp/og-image.png'],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');

  if (!fs.existsSync(blogsPath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(blogsPath, 'utf-8');
  const blogs = JSON.parse(fileContent);
  const blog = blogs.find((b: any) => b.slug === slug);

  if (!blog) {
    notFound();
  }
  const relatedPosts = getRelatedPosts(blog, blogs);

  // FIX 1+2: blogMarked demotes h1→h2 and correctly renders **bold** / *italic*
  // TASK 0: Pre-process markdown to fix CJK-adjacent bold (CommonMark flanking rule workaround)
  const CJK_PUNCT = /[「」『』（）【】〈〉《》〔〕、。・]/;
  const rawContent = blog.content ?? "";
  const processedContent = rawContent
    .replace(/\*\*(?=\S)/g, (m: string, offset: number, str: string) => {
      const next = str[offset + 2];
      return next && CJK_PUNCT.test(next) ? "**​" : m;
    })
    .replace(/(?<=\S)\*\*/g, (m: string, offset: number, str: string) => {
      const prev = str[offset - 1];
      return prev && CJK_PUNCT.test(prev) ? "​**" : m;
    });
  let htmlContent = processedContent
    ? (blogMarked.parse(processedContent) as string)
    : "<p>この記事のコンテンツは準備中です。</p>";

  // TASK 4: inject section-N IDs into h2/h3 for smooth-scroll TOC
  const tocItems: { depth: number; text: string; id: string }[] = [];
  let _hIdx = 0;
  htmlContent = htmlContent.replace(
    /<h([23])[^>]*>([\s\S]*?)<\/h[23]>/g,
    (_: string, depth: string, inner: string) => {
      _hIdx++;
      const id = `section-${_hIdx}`;
      tocItems.push({ depth: Number(depth), text: inner.replace(/<[^>]*>/g, '').trim(), id });
      return `<h${depth} id="${id}">${inner}</h${depth}>`;
    }
  );

  // TASK 10: inject inline CTAs after 3rd and 6th h2
  const _ctaMap: { test: RegExp; emoji: string; title: string; desc: string; href: string; btn: string }[] = [
    { test: /nisa|ideco|投資|積立/i,        emoji: '📈', title: 'NISAシミュレーター',        desc: '積立額・運用期間で将来資産を無料計算',         href: '/nisa-simulator',       btn: 'シミュレーターを使う' },
    { test: /税金|確定申告|インボイス|節税/i, emoji: '🧾', title: '税務・申告ツール',          desc: 'インボイス・確定申告を無料でサポート',         href: '/tax',                  btn: 'ツールを見る' },
    { test: /保険/i,                         emoji: '🛡️', title: '保険計算ツール',            desc: '保険料・給付金を即シミュレーション',           href: '/insurance',            btn: 'ツールを使う' },
    { test: /不動産|住宅|ローン/i,           emoji: '🏠', title: '不動産ツール',              desc: '住宅ローン・査定を無料計算',                  href: '/realestate',           btn: 'ツールを使う' },
    { test: /ビジネス|法人|会社|起業|開業/i, emoji: '🏢', title: '法人向けビジネスツール',    desc: '起業・会社運営に役立つ無料ツール集',           href: '/business',             btn: 'ツールを見る' },
    { test: /介護|福祉|ケア/i,               emoji: '🤝', title: '介護計算ツール',            desc: '介護費用・サービス単価を無料計算',             href: '/care',                 btn: 'ツールを使う' },
    { test: /キャリア|転職|副業|年収/i,      emoji: '💼', title: 'キャリアツール',            desc: '年収・スキルを無料でチェック',                href: '/career',               btn: 'ツールを使う' },
    { test: /健康|医療|ダイエット/i,         emoji: '❤️', title: '健康計算ツール',            desc: 'BMI・カロリーを無料チェック',                 href: '/health',               btn: 'ツールを使う' },
    { test: /財務|会計|簿記|経理/i,          emoji: '📊', title: '財務計算ツール',            desc: '損益・キャッシュフローを無料計算',             href: '/finance',              btn: 'ツールを使う' },
  ];
  const _ctaHaystack = [blog.category ?? '', ...(blog.tags ?? [])].join(' ');
  const _ctaMatch = _ctaMap.find(c => c.test.test(_ctaHaystack))
    ?? { emoji: '🛠️', title: '山田ツール — 無料業務ツール200種', desc: 'インボイス・PDF・画像変換など登録不要で即使える', href: '/tools', btn: 'ツール一覧を見る' };
  const _ctaHtml = `<div style="margin:2rem 0;padding:1.25rem 1.5rem;background:linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 100%);border:1px solid #C7D2FE;border-radius:1rem;display:flex;align-items:center;gap:1rem;justify-content:space-between;flex-wrap:wrap;not-prose:true">` +
    `<div style="display:flex;align-items:center;gap:0.75rem;min-width:0">` +
    `<span style="font-size:2rem;line-height:1;flex-shrink:0">${_ctaMatch.emoji}</span>` +
    `<div><p style="font-weight:700;color:#1e3a6e;margin:0;font-size:0.95rem">${_ctaMatch.title}</p>` +
    `<p style="color:#4B5563;margin:0.25rem 0 0;font-size:0.8rem">${_ctaMatch.desc}</p></div></div>` +
    `<a href="${_ctaMatch.href}" style="display:inline-block;background:#223A70;color:#fff;font-weight:600;font-size:0.85rem;padding:0.6rem 1.25rem;border-radius:0.75rem;text-decoration:none;white-space:nowrap;flex-shrink:0">${_ctaMatch.btn} →</a></div>`;
  let _h2Ctr = 0;
  htmlContent = htmlContent.replace(/<\/h2>/g, (m: string) => {
    _h2Ctr++;
    return (_h2Ctr === 3 || _h2Ctr === 6) ? m + _ctaHtml : m;
  });


  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || blog.description || blog.title,
    datePublished: blog.publishDate,
    dateModified: blog.updatedAt || blog.modifiedDate || blog.publishDate,
    author: blog.supervisor ? {
      "@type": "Person",
      name: (blog.supervisor as any).name,
      hasCredential: (blog.supervisor as any).credential,
    } : {
      "@type": "Organization",
      name: typeof blog.author === "string" ? blog.author : "合同会社山田トレード",
      url: "https://yamada-tools.jp",
    },
    ...(blog.supervisor ? { reviewedBy: {
      "@type": "Person",
      name: (blog.supervisor as any).name,
      hasCredential: (blog.supervisor as any).credential,
    } } : {}),
    publisher: {
      "@type": "Organization",
      "@id": "https://yamada-tools.jp/#organization",
      name: "合同会社山田トレード",
      logo: {
        "@type": "ImageObject",
        url: "https://yamada-tools.jp/logo-icon.webp",
        width: 512,
        height: 512,
      },
    },
    image: (blog.eyecatch as any)?.src || blog.featuredImage || "https://yamada-tools.jp/og-image.png",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://yamada-tools.jp/blog/${slug}`,
    },
    inLanguage: "ja",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
      { "@type": "ListItem", position: 2, name: "ブログ", item: "https://yamada-tools.jp/blog" },
      { "@type": "ListItem", position: 3, name: blog.title, item: `https://yamada-tools.jp/blog/${slug}` },
    ],
  };

  const faqSchema = blog.faq && Array.isArray(blog.faq) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (blog.faq as Array<{ question: string; answer: string }>).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  } : null;


  // TASK 2: Japanese date formatter YYYY年M月D日
  const formatJaDate = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return `${y}年${parseInt(m)}月${parseInt(d)}日`;
  };

  // TASK 1: inline card renderer for supervisor/author credential block
  const renderCredCard = (label: string, person: any) => (
    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3 text-left">
      {person.avatar ? (
        <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-kon text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {person.name.charAt(0)}
        </div>
      )}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        {person.url ? (
          <Link href={person.url} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-kon transition-colors">{person.name}</Link>
        ) : (
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{person.name}</p>
        )}
        {(person.credential || person.role) && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{person.credential || person.role}</p>
        )}
      </div>
    </div>
  );

  const heroSrc = (blog.eyecatch as any)?.src || blog.featuredImage || '';
  const heroAlt = (blog.eyecatch as any)?.alt || blog.title;
  const catStyle = getCategoryStyle(blog.category || '');

  return (
    <article className="blog-article max-w-[1200px] mx-auto px-4 py-12">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* TASK 3: hero — BlogHero handles image + onError gradient fallback */}
      <BlogHero
        heroSrc={heroSrc}
        heroAlt={heroAlt}
        gradient={catStyle.gradient}
        emoji={catStyle.emoji}
        category={blog.category || ''}
      />

      <StaticAdSlot className="mb-8" />
      <header className="blog-header mb-12 text-center">
        {/* FIX 2: single <h1> per page — markdown h1s are demoted to h2 by blogMarked */}
        <h1 className="blog-title text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {blog.title}
        </h1>

        <div className="blog-meta flex flex-wrap items-center justify-center gap-4 text-gray-600 mb-6">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {blog.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            公開日: {formatJaDate(blog.publishDate)}
          </span>
          {blog.updatedAt && blog.updatedAt > blog.publishDate && (
            <>
              <span>•</span>
              <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                更新日: {formatJaDate(blog.updatedAt)}
              </span>
            </>
          )}
          <span>•</span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {blog.readTime}
          </span>
        </div>


        {/* TASK 1: 監修者/執筆者 credential block */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4 mb-2">
          {blog.supervisor
            ? renderCredCard("監修", blog.supervisor)
            : blog.authorInfo
            ? renderCredCard("執筆", blog.authorInfo)
            : (
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-bold flex-shrink-0">山</div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">編集</p>
                  <Link href="/about" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-kon transition-colors">山田ツール編集部</Link>
                </div>
              </div>
            )}
          {blog.supervisor && blog.authorInfo && renderCredCard("執筆", blog.authorInfo)}
        </div>

        {/* FIX 4: tags are now proper <Link> elements linking to /blog?tag=X */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {blog.tags.map((tag: string, i: number) => (
              <Link
                key={i}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-4 py-2 bg-gray-50 text-kon rounded-full text-sm font-medium hover:bg-ai hover:text-white transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* TASK 4: 2-col layout — left: prose, right: sticky TOC */}
      <div className={tocItems.length >= 3
        ? "lg:grid lg:grid-cols-[60px_1fr_240px] lg:gap-4 lg:items-start"
        : "lg:grid lg:grid-cols-[60px_1fr] lg:gap-4 lg:items-start"}>
        {/* TASK 5: desktop share rail */}
        <div className="hidden lg:block">
          <ShareButtons
            title={blog.title}
            url={`https://yamada-tools.jp/blog/${slug}`}
            layout="desktop"
          />
        </div>
        <div className="min-w-0">
          {/* TASK 5: mobile share row */}
          <div className="lg:hidden mb-4">
            <ShareButtons
              title={blog.title}
              url={`https://yamada-tools.jp/blog/${slug}`}
              layout="mobile"
            />
          </div>
          {tocItems.length >= 3 && (
            <details className="lg:hidden mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <summary className="px-4 py-3 font-semibold text-sm text-gray-900 dark:text-white cursor-pointer flex items-center gap-2 select-none">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
                目次
              </summary>
              <ol className="px-4 pb-4 pt-1 space-y-1.5 list-none">
                {tocItems.map(item => (
                  <li key={item.id} className={item.depth === 3 ? 'ml-4' : ''}>
                    <a href={`#${item.id}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-kon transition-colors">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}
      {(() => {
        const parts = htmlContent.split(/(?<=<\/p>)/);
        if (parts.length <= 4) {
          return (
            <>
              <div className="blog-content prose prose-lg max-w-[680px] mx-auto">
                <BlogContent content={htmlContent} />
              </div>
              <BlogAdUnit />
            </>
          );
        }
        const intro = parts.slice(0, 2).join('');
        const midPoint = Math.floor(parts.length * 0.55);
        const middle = parts.slice(2, midPoint).join('');
        const rest = parts.slice(midPoint).join('');
        return (
          <>
            <div className="blog-content prose prose-lg max-w-[680px] mx-auto">
              <BlogContent content={intro} />
            </div>
            <BlogAdUnit />
            <div className="blog-content prose prose-lg max-w-[680px] mx-auto">
              <BlogContent content={middle} />
            </div>
            <BlogAdUnit />
            <div className="blog-content prose prose-lg max-w-[680px] mx-auto">
              <BlogContent content={rest} />
            </div>
            <BlogAdUnit />
          </>
        );
      })()}
        </div>
        {tocItems.length >= 3 && (
          <aside className="hidden lg:block">
            <TableOfContents items={tocItems} />
          </aside>
        )}
      </div>

      {/* TASK 6: related articles */}
      <RelatedPosts posts={relatedPosts} />

      <footer className="blog-footer mt-16 pt-8 border-t border-gray-200">
        {/* FIX 5: dark mode variants for CTA card gradient and heading */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            関連ツールを試してみませんか？
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            この記事で紹介した機能を、無料でお試しいただけます
          </p>
          <a
            href={blog.toolLink || '/pdf'}
            className="inline-flex items-center px-8 py-4 bg-kon text-white rounded-lg hover:bg-ai transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            ツールを使ってみる
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </footer>
      {blog.faq?.length > 0 && (
        <section className="mt-10 mb-8">
          <h2 className="text-2xl font-bold text-kon mb-6">よくあるご質問</h2>
          <div className="space-y-3">
            {blog.faq.map((f: any, i: number) => (
              <details key={i} className="bg-white border border-gray-200 rounded-lg p-4 group">
                <summary className="font-semibold text-kon cursor-pointer">{f.question}</summary>
                <p className="mt-3 text-sm text-sumi leading-relaxed whitespace-pre-line">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
      {blog.relatedTools?.length > 0 && (
        <RelatedTools tools={blog.relatedTools} />
      )}
    </article>
  );
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');

  if (!fs.existsSync(blogsPath)) {
    return [];
  }

  const fileContent = fs.readFileSync(blogsPath, 'utf-8');
  const blogs = JSON.parse(fileContent);

  return blogs.map((blog: any) => ({
    slug: blog.slug,
  }));
}
