"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

interface AiPost {
  slug: string;
  title: string;
  seoTitle?: string;
  excerpt?: string;
  description?: string;
  seoDescription?: string;
  category: string;
  tags?: string[];
  publishedAt?: string;
  publishDate?: string;
  author?: string;
  toolName?: string;
  toolPrice?: string;
  timeSaved?: string;
  readTime?: string;
  difficulty?: string;
  type?: string;
}

const CAT_LABELS: Record<string, string> = {
  "ai-tools":  "AIツール",
  "excel":     "Excel",
  "writing":   "文章作成",
  "image":     "画像生成",
  "business":  "ビジネス",
  "marketing": "マーケティング",
  "google":    "Google",
};

const CAT_COLORS: Record<string, string> = {
  "ai-tools":  "bg-violet-100 text-violet-700",
  "excel":     "bg-emerald-100 text-emerald-700",
  "writing":   "bg-blue-100 text-blue-700",
  "image":     "bg-pink-100 text-pink-700",
  "business":  "bg-amber-100 text-amber-700",
  "marketing": "bg-cyan-100 text-cyan-700",
  "google":    "bg-red-100 text-red-700",
};

const CAT_ACTIVE: Record<string, string> = {
  "ai-tools":  "bg-violet-600 text-white shadow-md",
  "excel":     "bg-emerald-600 text-white shadow-md",
  "writing":   "bg-blue-600 text-white shadow-md",
  "image":     "bg-pink-600 text-white shadow-md",
  "business":  "bg-amber-500 text-white shadow-md",
  "marketing": "bg-cyan-600 text-white shadow-md",
  "google":    "bg-red-600 text-white shadow-md",
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
  "dall-e": "🎨", "stable": "🎨", "excel": "📊",
  "gmail": "📧", "google": "🔍", "zapier": "⚡",
  "make": "🔗", "n8n": "🔗",
};

function catLabel(cat: string) { return CAT_LABELS[cat] ?? cat; }
function catColor(cat: string) { return CAT_COLORS[cat] ?? "bg-gray-100 text-gray-600"; }
function catActive(cat: string) { return CAT_ACTIVE[cat] ?? "bg-violet-600 text-white shadow-md"; }
function catGrad(cat: string)  { return CAT_GRAD[cat] ?? "from-violet-500 to-purple-600"; }

function toolEmoji(toolName?: string, category?: string) {
  if (!toolName && !category) return "🤖";
  const lc = (toolName ?? category ?? "").toLowerCase();
  for (const [k, v] of Object.entries(TOOL_EMOJI)) {
    if (lc.includes(k)) return v;
  }
  return "🤖";
}

function postDate(post: AiPost) {
  return (post.publishDate ?? post.publishedAt ?? "").slice(0, 10);
}

function estimateReadTime(post: AiPost): string {
  if (post.readTime) return post.readTime;
  return "5分";
}

function isNew(post: AiPost): boolean {
  const d = postDate(post);
  if (!d) return false;
  const diff = (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 14;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}

const PER_PAGE = 12;

export default function AiRecipeClient({ posts }: { posts: AiPost[] }) {
  const [search, setSearch]               = useState("");
  const [activeCategory, setActiveCategory] = useState("すべて");
  const [activeTag, setActiveTag]         = useState("");
  const [sort, setSort]                   = useState<"new"|"old">("new");
  const [page, setPage]                   = useState(1);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => { counts[p.category] = (counts[p.category] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const allTags = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => (p.tags ?? []).forEach((t) => { counts[t] = (counts[t] ?? 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([t]) => t);
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts.filter((p) => {
      const q = search.toLowerCase();
      const title = p.seoTitle ?? p.title;
      const desc  = p.excerpt ?? p.description ?? p.seoDescription ?? "";
      const matchSearch = !q ||
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
        (p.toolName ?? "").toLowerCase().includes(q);
      const matchCat = activeCategory === "すべて" || p.category === activeCategory;
      const matchTag = !activeTag || (p.tags ?? []).includes(activeTag);
      return matchSearch && matchCat && matchTag;
    });
    if (sort === "new") result = [...result].sort((a, b) => postDate(b).localeCompare(postDate(a)));
    else result = [...result].sort((a, b) => postDate(a).localeCompare(postDate(b)));
    return result;
  }, [posts, search, activeCategory, activeTag, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCategory = (cat: string) => { setActiveCategory(cat); setActiveTag(""); setPage(1); };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); };
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => { setSort(e.target.value as "new"|"old"); setPage(1); };
  const resetFilters = () => { setSearch(""); setActiveCategory("すべて"); setActiveTag(""); setSort("new"); setPage(1); };

  const pageNumbers = () => {
    const pages: number[] = [];
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);
    return pages;
  };

  // Featured = newest post
  const featured = useMemo(() => [...posts].sort((a,b) => postDate(b).localeCompare(postDate(a)))[0], [posts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span>🤖</span> AIレシピ集
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
            AIツール実践レシピ
          </h1>
          <p className="text-violet-100 text-base md:text-lg mb-5 max-w-xl mx-auto">
            ChatGPT・Claude・Geminiなど、業務で今すぐ使えるプロンプトと活用術
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full">
              全 {posts.length} レシピ
            </span>
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full">
              コピペOK プロンプト付き
            </span>
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full">
              毎週火曜更新
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Featured post */}
        {featured && activeCategory === "すべて" && !search && !activeTag && page === 1 && (
          <Link href={`/ai-recipe/${featured.slug}`}
            className="group block mb-8 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="md:flex">
              <div className={`md:w-2/5 aspect-video md:aspect-auto bg-gradient-to-br ${catGrad(featured.category)} flex items-center justify-center relative overflow-hidden`}>
                <span className="text-8xl opacity-80 group-hover:scale-110 transition-transform duration-500">
                  {toolEmoji(featured.toolName, featured.category)}
                </span>
                <div className="absolute top-3 left-3 bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow">
                  ⭐ 注目レシピ
                </div>
              </div>
              <div className="md:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catColor(featured.category)}`}>
                      {catLabel(featured.category)}
                    </span>
                    {featured.difficulty && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">{featured.difficulty}</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                    {featured.seoTitle ?? featured.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                    {featured.excerpt ?? featured.description ?? featured.seoDescription ?? ""}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  {featured.timeSaved && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                      ⚡ {featured.timeSaved} に短縮
                    </span>
                  )}
                  <span className="text-sm text-violet-700 dark:text-violet-400 font-semibold group-hover:underline ml-auto">
                    レシピを見る →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Active tag badge */}
        {activeTag && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">タグ絞り込み中:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-700 text-white rounded-full text-sm font-medium">
              #{activeTag}
              <button onClick={() => { setActiveTag(""); setPage(1); }} className="ml-1 hover:opacity-75">×</button>
            </span>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <input type="text" value={search} onChange={handleSearch}
            placeholder="AIツール名・キーワードで検索..."
            className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 dark:text-gray-200 placeholder-gray-400" />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
          <button onClick={() => handleCategory("すべて")}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === "すべて" ? "bg-violet-700 text-white shadow-md" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50"}`}>
            すべて
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === "すべて" ? "bg-white/25 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{posts.length}</span>
          </button>
          {categories.map(([cat, count]) => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? catActive(cat) : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50"}`}>
              {catLabel(cat)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat ? "bg-white/25 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Popular tags */}
        {!activeTag && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {allTags.slice(0, 12).map((tag) => (
              <button key={tag} onClick={() => { setActiveTag(tag); setPage(1); }}
                className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 dark:hover:bg-violet-900/30 dark:hover:text-violet-300 transition-colors cursor-pointer">
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Count + Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="text-gray-900 dark:text-white font-bold text-base">{filtered.length}</span> 件のレシピ
          </p>
          <select value={sort} onChange={handleSort}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer">
            <option value="new">新しい順</option>
            <option value="old">古い順</option>
          </select>
        </div>

        {/* Grid */}
        {paged.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {paged.map((post) => {
                const title = post.seoTitle ?? post.title;
                const desc  = post.excerpt ?? post.description ?? post.seoDescription ?? "";
                const date  = postDate(post);
                const emoji = toolEmoji(post.toolName, post.category);
                const newPost = isNew(post);
                return (
                  <Link key={post.slug} href={`/ai-recipe/${post.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                    <div className={`relative w-full aspect-video bg-gradient-to-br ${catGrad(post.category)} flex items-center justify-center overflow-hidden`}>
                      <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                      {newPost && (
                        <div className="absolute top-2 left-2 bg-violet-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">NEW</div>
                      )}
                      {post.difficulty && (
                        <span className="absolute top-2 right-2 bg-black/30 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">{post.difficulty}</span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${catColor(post.category)}`}>
                          {catLabel(post.category)}
                        </span>
                        {post.toolName && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{post.toolName}</span>
                        )}
                      </div>
                      <h2 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
                        {title}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{desc}</p>
                      {post.timeSaved && (
                        <div className="flex items-center gap-1.5 mb-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          ⚡ {post.timeSaved} に短縮
                        </div>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTag(tag); setPage(1); window.scrollTo(0,0); }}
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full cursor-pointer hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-900/40 dark:hover:text-violet-300 transition-colors">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {estimateReadTime(post)}
                        </span>
                        <span>{formatDate(date)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed transition">← 前へ</button>
                {pageNumbers().map((n) => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${n === page ? "bg-violet-700 text-white shadow-md" : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>{n}</button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed transition">次へ →</button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🤖</span>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">レシピが見つかりませんでした</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">キーワードやカテゴリを変えてみてください</p>
            <button onClick={resetFilters}
              className="px-6 py-2.5 bg-violet-700 text-white rounded-full font-semibold text-sm hover:bg-violet-800 transition">フィルターをリセット</button>
          </div>
        )}
      </div>
    </div>
  );
}
