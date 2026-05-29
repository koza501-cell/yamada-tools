import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Marked } from "marked";
import BlogContent from "@/components/BlogContent";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ShareButtons from "@/components/blog/ShareButtons";
import TableOfContents from "@/components/blog/TableOfContents";
import "@/app/blog.css";

// Demote h1 → h2 to prevent duplicate h1
const aiMarked = new Marked({ gfm: true });
aiMarked.use({
  walkTokens(token: any) {
    if (token.type === "heading" && token.depth === 1) token.depth = 2;
  },
});

const CAT_LABELS: Record<string, string> = {
  "ai-tools":  "AIツール",
  "excel":     "Excel",
  "writing":   "文章作成",
  "image":     "画像生成",
  "business":  "ビジネス",
  "marketing": "マーケティング",
};

const CAT_GRAD: Record<string, string> = {
  "ai-tools":  "from-violet-500 to-purple-600",
  "excel":     "from-emerald-500 to-teal-600",
  "writing":   "from-blue-500 to-indigo-600",
  "image":     "from-pink-500 to-rose-600",
  "business":  "from-amber-400 to-orange-500",
  "marketing": "from-cyan-500 to-blue-600",
};

const TOOL_EMOJI: Record<string, string> = {
  "chatgpt": "🤖", "claude": "🧠", "gemini": "✨",
  "notion": "📝", "copilot": "💡", "midjourney": "🎨",
};

function toolEmoji(toolName?: string) {
  if (!toolName) return "🤖";
  const lc = toolName.toLowerCase();
  for (const [k, v] of Object.entries(TOOL_EMOJI)) {
    if (lc.includes(k)) return v;
  }
  return "🤖";
}

function getPosts() {
  try {
    const p = path.join(process.cwd(), "src/data/aiPosts.json");
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {}
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = getPosts();
  const post = posts.find((p: any) => p.slug === slug);
  if (!post) return { title: "レシピが見つかりません" };
  const title = post.seoTitle ?? post.title;
  const desc  = post.seoDescription ?? post.excerpt ?? title;
  const siteUrl = "https://yamada-tools.jp";
  return {
    title,
    description: desc,
    alternates: { canonical: `${siteUrl}/ai-recipe/${slug}` },
    openGraph: {
      title, description: desc,
      url: `${siteUrl}/ai-recipe/${slug}`,
      type: "article",
      publishedTime: post.publishedAt ?? post.publishDate,
    },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export async function generateStaticParams() {
  return getPosts().map((p: any) => ({ slug: p.slug }));
}

export const dynamicParams = true;

export default async function AiRecipePost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getPosts();
  const post  = posts.find((p: any) => p.slug === slug);
  if (!post) notFound();

  const title    = post.seoTitle ?? post.title;
  const date     = (post.publishedAt ?? post.publishDate ?? "").slice(0, 10);
  const catLabel = CAT_LABELS[post.category] ?? post.category;
  const catGrad  = CAT_GRAD[post.category] ?? "from-violet-500 to-purple-600";
  const emoji    = toolEmoji(post.toolName);
  const siteUrl  = "https://yamada-tools.jp";

  // Parse markdown
  let htmlContent = post.content
    ? (aiMarked.parse(post.content) as string)
    : "<p>コンテンツ準備中です。</p>";

  // Inject TOC IDs
  const tocItems: { depth: number; text: string; id: string }[] = [];
  let hIdx = 0;
  htmlContent = htmlContent.replace(
    /<h([23])[^>]*>([\s\S]*?)<\/h[23]>/g,
    (_: string, depth: string, inner: string) => {
      hIdx++;
      const id = `section-${hIdx}`;
      tocItems.push({ depth: Number(depth), text: inner.replace(/<[^>]*>/g, "").trim(), id });
      return `<h${depth} id="${id}">${inner}</h${depth}>`;
    }
  );

  // JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description: post.seoDescription ?? post.excerpt ?? title,
    datePublished: post.publishedAt ?? post.publishDate,
    author: { "@type": "Organization", name: "合同会社山田トレード", url: siteUrl },
    publisher: { "@type": "Organization", name: "合同会社山田トレード", url: siteUrl },
    inLanguage: "ja",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "AIレシピ", item: `${siteUrl}/ai-recipe` },
      { "@type": "ListItem", position: 3, name: title, item: `${siteUrl}/ai-recipe/${slug}` },
    ],
  };

  return (
    <article className="blog-article max-w-[1200px] mx-auto px-4 py-12">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-700 transition-colors">ホーム</Link>
        <span>›</span>
        <Link href="/ai-recipe" className="hover:text-violet-700 transition-colors">AIレシピ</Link>
        <span>›</span>
        <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{title}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8 -mx-4 md:mx-0">
        <div className={`relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br ${catGrad} flex items-center justify-center`}>
          <span className="text-8xl md:text-[120px] select-none opacity-90">{emoji}</span>
          <div className="absolute inset-0 bg-black/10" />
          {post.toolName && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-black/40 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                {post.toolName}
              </span>
            </div>
          )}
          {post.difficulty && (
            <div className="absolute top-4 right-4">
              <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {post.difficulty}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="blog-header mb-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="inline-block bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full">
            {catLabel}
          </span>
          {post.timeSaved && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              ⚡ {post.timeSaved} に短縮
            </span>
          )}
        </div>

        <h1 className="blog-title text-3xl md:text-4xl font-bold mb-5 leading-tight">{title}</h1>

        <div className="blog-meta flex flex-wrap items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {post.author ?? "山田ツール編集部"}
          </span>
          {date && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {date}
              </span>
            </>
          )}
          {post.readTime && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime}
              </span>
            </>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {post.tags.map((tag: string, i: number) => (
              <Link key={i} href={`/ai-recipe?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-900/40 dark:hover:text-violet-300 transition-colors">
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 2-col layout */}
      <div className={tocItems.length >= 3
        ? "lg:grid lg:grid-cols-[60px_1fr_240px] lg:gap-4 lg:items-start"
        : "lg:grid lg:grid-cols-[60px_1fr] lg:gap-4 lg:items-start"}>

        {/* Desktop share rail */}
        <div className="hidden lg:block">
          <ShareButtons title={title} url={`${siteUrl}/ai-recipe/${slug}`} layout="desktop" />
        </div>

        <div className="min-w-0">
          {/* Mobile share row */}
          <div className="lg:hidden mb-4">
            <ShareButtons title={title} url={`${siteUrl}/ai-recipe/${slug}`} layout="mobile" />
          </div>

          {/* Mobile TOC */}
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
                  <li key={item.id} className={item.depth === 3 ? "ml-4" : ""}>
                    <a href={`#${item.id}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-700 transition-colors">{item.text}</a>
                  </li>
                ))}
              </ol>
            </details>
          )}

          {/* Content with mid-ad injection */}
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
            const midPoint = Math.floor(parts.length * 0.55);
            return (
              <>
                <div className="blog-content prose prose-lg max-w-[680px] mx-auto">
                  <BlogContent content={parts.slice(0, 2).join("")} />
                </div>
                <BlogAdUnit />
                <div className="blog-content prose prose-lg max-w-[680px] mx-auto">
                  <BlogContent content={parts.slice(2, midPoint).join("")} />
                </div>
                <BlogAdUnit />
                <div className="blog-content prose prose-lg max-w-[680px] mx-auto">
                  <BlogContent content={parts.slice(midPoint).join("")} />
                </div>
                <BlogAdUnit />
              </>
            );
          })()}
        </div>

        {/* Desktop TOC */}
        {tocItems.length >= 3 && (
          <aside className="hidden lg:block">
            <TableOfContents items={tocItems} />
          </aside>
        )}
      </div>

      {/* Footer CTA */}
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            他のAIレシピも見る
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-5">
            ChatGPT・Claude・Geminiなど最新AIの実践レシピ集
          </p>
          <Link href="/ai-recipe"
            className="inline-flex items-center px-6 py-3 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors font-medium shadow-lg hover:shadow-xl">
            AIレシピ一覧を見る
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </footer>
    </article>
  );
}
