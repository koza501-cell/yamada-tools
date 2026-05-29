import { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Marked } from "marked";
import BlogContent from "@/components/BlogContent";
import BlogAdUnit from "@/components/common/BlogAdUnit";
import StaticAdSlot from "@/components/common/StaticAdSlot";
import ReadingProgress from "@/components/blog/ReadingProgress";
import ShareButtons from "@/components/blog/ShareButtons";
import TableOfContents from "@/components/blog/TableOfContents";
import ToolFeedbackWidget from "@/components/feedback/ToolFeedbackWidget";
import "@/app/blog.css";

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
  "google":    "Google",
};

const CAT_GRAD: Record<string, string> = {
  "ai-tools":  "from-violet-500 to-purple-600",
  "excel":     "from-emerald-500 to-teal-600",
  "writing":   "from-blue-500 to-indigo-600",
  "image":     "from-pink-500 to-rose-600",
  "business":  "from-amber-400 to-orange-500",
  "marketing": "from-cyan-500 to-blue-600",
  "google":    "from-red-500 to-orange-600",
};

const TOOL_EMOJI: Record<string, string> = {
  "chatgpt": "🤖", "claude": "🧠", "gemini": "✨",
  "notion": "📝", "copilot": "💡", "midjourney": "🎨",
  "dall-e": "🎨", "excel": "📊", "gmail": "📧",
  "google": "🔍", "zapier": "⚡", "make": "🔗",
};

function toolEmoji(toolName?: string, category?: string) {
  const lc = (toolName ?? category ?? "").toLowerCase();
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

function getRelatedPosts(current: any, all: any[], max = 3): any[] {
  const currentTags = current.tags ?? [];
  const others = all.filter((p) => p.slug !== current.slug);
  const scored = others.map((p) => {
    let score = 0;
    if (p.category === current.category) score += 10;
    score += (p.tags ?? []).filter((t: string) => currentTags.includes(t)).length * 2;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, max).map((s) => s.p);
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = iso.slice(0, 10);
  const [y, m, day] = d.split("-");
  return `${y}年${parseInt(m)}月${parseInt(day)}日`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = getPosts();
  const post = posts.find((p: any) => p.slug === slug);
  if (!post) return { title: "レシピが見つかりません" };
  const title = post.seoTitle ?? post.title;
  const desc  = post.seoDescription ?? post.metaDescription ?? post.excerpt ?? post.description ?? title;
  const siteUrl = "https://yamada-tools.jp";
  return {
    title,
    description: desc,
    ...(post.noindex ? { robots: "noindex" } : {}),
    alternates: { canonical: `${siteUrl}/ai-recipe/${slug}` },
    openGraph: {
      title, description: desc,
      url: `${siteUrl}/ai-recipe/${slug}`,
      type: "article",
      publishedTime: post.publishedAt ?? post.publishDate,
      modifiedTime: post.lastUpdated ?? post.publishedAt ?? post.publishDate,
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

  const allPosts = posts;
  const title    = post.seoTitle ?? post.title;
  const desc     = post.excerpt ?? post.description ?? "";
  const date     = (post.publishDate ?? post.publishedAt ?? "").slice(0, 10);
  const catLabel = CAT_LABELS[post.category] ?? post.category;
  const catGrad  = CAT_GRAD[post.category] ?? "from-violet-500 to-purple-600";
  const emoji    = toolEmoji(post.toolName, post.category);
  const siteUrl  = "https://yamada-tools.jp";
  const related  = getRelatedPosts(post, allPosts);

  // Parse markdown — demote h1→h2
  let htmlContent = post.content
    ? (aiMarked.parse(post.content) as string)
    : "<p>コンテンツ準備中です。</p>";

  // Inject TOC ids
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

  // FAQ schema — handle both object and array formats
  let faqItems: { question: string; answer: string }[] = [];
  if (post.faq) {
    if (Array.isArray(post.faq)) {
      faqItems = post.faq;
    } else if (post.faq.mainEntity) {
      faqItems = post.faq.mainEntity.map((e: any) => ({
        question: e.name,
        answer: e.acceptedAnswer?.text ?? "",
      }));
    }
  }

  // JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description: post.seoDescription ?? post.excerpt ?? title,
    datePublished: post.publishedAt ?? post.publishDate,
    dateModified: post.lastUpdated ?? post.publishedAt ?? post.publishDate,
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

  const faqSchema = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <article className="blog-article max-w-[1200px] mx-auto px-4 py-12">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

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
              <span className="bg-black/40 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full">{post.toolName}</span>
            </div>
          )}
          {post.difficulty && (
            <div className="absolute top-4 right-4">
              <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">{post.difficulty}</span>
            </div>
          )}
        </div>
      </div>

      <StaticAdSlot className="mb-8" />

      {/* Header */}
      <header className="blog-header mb-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="inline-block bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full">{catLabel}</span>
          {post.type && <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-full">{post.type}</span>}
          {post.timeSaved && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              ⚡ {post.timeSaved} に短縮
            </span>
          )}
        </div>

        <h1 className="blog-title text-3xl md:text-4xl font-bold mb-5 leading-tight">{title}</h1>

        <div className="blog-meta flex flex-wrap items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-4 text-sm">
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
                公開日: {formatDate(date)}
              </span>
            </>
          )}
          {post.lastUpdated && post.lastUpdated > date && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                更新日: {formatDate(post.lastUpdated)}
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

        {/* Tool info card */}
        {(post.toolName || post.toolPrice || post.toolUrl) && (
          <div className="inline-flex flex-wrap items-center gap-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-3 mb-4 text-sm">
            {post.toolName && <span className="font-semibold text-gray-900 dark:text-white">🛠 {post.toolName}</span>}
            {post.toolPrice && <span className="text-gray-500 dark:text-gray-400">💰 {post.toolPrice}</span>}
            {post.toolUrl && (
              <a href={post.toolUrl} target="_blank" rel="noopener noreferrer"
                className="text-violet-700 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1">
                公式サイト
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        )}

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

        <div className="hidden lg:block">
          <ShareButtons title={title} url={`${siteUrl}/ai-recipe/${slug}`} layout="desktop" />
        </div>

        <div className="min-w-0">
          <div className="lg:hidden mb-4">
            <ShareButtons title={title} url={`${siteUrl}/ai-recipe/${slug}`} layout="mobile" />
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
                  <li key={item.id} className={item.depth === 3 ? "ml-4" : ""}>
                    <a href={`#${item.id}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-violet-700 transition-colors">{item.text}</a>
                  </li>
                ))}
              </ol>
            </details>
          )}

          {(() => {
            const parts = htmlContent.split(/(?<=<\/p>)/);
            if (parts.length <= 4) return (
              <>
                <div className="blog-content prose prose-lg max-w-[680px] mx-auto"><BlogContent content={htmlContent} /></div>
                <BlogAdUnit />
              </>
            );
            const mid = Math.floor(parts.length * 0.55);
            return (
              <>
                <div className="blog-content prose prose-lg max-w-[680px] mx-auto"><BlogContent content={parts.slice(0, 2).join("")} /></div>
                <BlogAdUnit />
                <div className="blog-content prose prose-lg max-w-[680px] mx-auto"><BlogContent content={parts.slice(2, mid).join("")} /></div>
                <BlogAdUnit />
                <div className="blog-content prose prose-lg max-w-[680px] mx-auto"><BlogContent content={parts.slice(mid).join("")} /></div>
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

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section className="mt-10 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>❓</span> よくある質問
          </h2>
          <div className="space-y-3">
            {faqItems.map((f, i) => (
              <details key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 group">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">{f.question}</summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related recipes */}
      {related.length > 0 && (
        <section className="mt-12 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <span>🤖</span> 関連レシピ
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((r: any) => {
              const rGrad = CAT_GRAD[r.category] ?? "from-violet-500 to-purple-600";
              const rEmoji = toolEmoji(r.toolName, r.category);
              const rTitle = r.seoTitle ?? r.title;
              return (
                <Link key={r.slug} href={`/ai-recipe/${r.slug}`}
                  className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all">
                  <div className={`aspect-video bg-gradient-to-br ${rGrad} flex items-center justify-center`}>
                    <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">{rEmoji}</span>
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <span className="text-xs font-medium text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded-full w-fit">
                      {CAT_LABELS[r.category] ?? r.category}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">{rTitle}</h3>
                    {r.timeSaved && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">⚡ {r.timeSaved} に短縮</p>}
                    <p className="mt-auto text-xs text-gray-400 pt-1">{(r.publishDate ?? r.publishedAt ?? "").slice(0, 10)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">他のAIレシピも見る</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-5">ChatGPT・Claude・Geminiなど最新AIの実践レシピ集。毎週火曜更新。</p>
          <Link href="/ai-recipe"
            className="inline-flex items-center px-6 py-3 bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition-colors font-medium shadow-lg">
            AIレシピ一覧を見る
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </footer>

      <ToolFeedbackWidget toolSlug={`ai-recipe/${slug}`} visible={true} />
    </article>
  );
}
