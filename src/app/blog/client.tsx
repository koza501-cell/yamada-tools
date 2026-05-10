"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Blog {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  featuredImage?: string;
  publishDate: string;
  readTime?: string;
  excerpt?: string;
  featured?: boolean;
}

const CAT_BADGE: Record<string, string> = {
  "ビジネス": "bg-gray-50 text-kon",
  "PDF":      "bg-gray-50 text-danger",
  "不動産":   "bg-green-100 text-green-700",
  "税金":     "bg-gray-50 text-kon",
  "金融":     "bg-emerald-100 text-emerald-700",
  "SEO":      "bg-gray-50 text-kon",
  "効率化":   "bg-cyan-100 text-cyan-700",
};
const CAT_ACTIVE: Record<string, string> = {
  "ビジネス": "bg-kon text-white shadow-md",
  "PDF":      "bg-danger text-white shadow-md",
  "不動産":   "bg-green-500 text-white shadow-md",
  "税金":     "bg-kon text-white shadow-md",
  "金融":     "bg-emerald-500 text-white shadow-md",
  "SEO":      "bg-kon text-white shadow-md",
  "効率化":   "bg-cyan-500 text-white shadow-md",
};
const CAT_GRAD: Record<string, string> = {
  "ビジネス": "from-slate-900 to-indigo-500",
  "PDF":      "from-red-400 to-rose-500",
  "不動産":   "from-green-400 to-emerald-500",
  "税金":     "from-slate-900 to-yellow-500",
  "金融":     "from-emerald-400 to-teal-500",
  "SEO":      "from-slate-900 to-violet-500",
  "効率化":   "from-cyan-400 to-sky-500",
};

function badgeClass(cat: string) { return CAT_BADGE[cat] ?? "bg-gray-100 text-gray-600"; }
function activeClass(cat: string) { return CAT_ACTIVE[cat] ?? "bg-kon text-white shadow-md"; }
function gradClass(cat: string) { return CAT_GRAD[cat] ?? "from-slate-900 to-indigo-500"; }

const PER_PAGE = 12;

export default function BlogIndexClient({ blogs }: { blogs: Blog[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("すべて");
  const [sort, setSort] = useState<"new" | "old" | "read">("new");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    blogs.forEach((b) => { counts[b.category] = (counts[b.category] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  }, [blogs]);

  const filtered = useMemo(() => {
    let result = blogs.filter((b) => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.title.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || (b.tags ?? []).some((t) => t.toLowerCase().includes(q));
      const matchCategory = activeCategory === "すべて" || b.category === activeCategory;
      return matchSearch && matchCategory;
    });
    if (sort === "new") result = [...result].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
    else if (sort === "old") result = [...result].sort((a, b) => a.publishDate.localeCompare(b.publishDate));
    else result = [...result].sort((a, b) => parseInt(b.readTime ?? "0") - parseInt(a.readTime ?? "0"));
    return result;
  }, [blogs, search, activeCategory, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCategory = (cat: string) => { setActiveCategory(cat); setPage(1); };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1); };
  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => { setSort(e.target.value as "new" | "old" | "read"); setPage(1); };
  const resetFilters = () => { setSearch(""); setActiveCategory("すべて"); setSort("new"); setPage(1); };
  const pageNumbers = () => {
    const pages: number[] = [];
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-kon to-ai text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">📝 山田ツール ブログ</h1>
          <p className="text-gin text-base md:text-lg mb-5 max-w-xl mx-auto">
            ビジネス効率化・PDF活用・不動産情報・税金・金融の実践ノウハウを発信
          </p>
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full">
            全 {blogs.length} 記事
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
          </div>
          <input type="text" value={search} onChange={handleSearch} placeholder="記事を検索..."
            className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-kon text-gray-700 dark:text-gray-200 placeholder-gray-400" />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
          <button onClick={() => handleCategory("すべて")}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === "すべて" ? "bg-kon text-white shadow-md" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50"}`}>
            すべて
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === "すべて" ? "bg-white/25 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{blogs.length}</span>
          </button>
          {categories.map(({ name, count }) => (
            <button key={name} onClick={() => handleCategory(name)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === name ? activeClass(name) : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50"}`}>
              {name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === name ? "bg-white/25 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{count}</span>
            </button>
          ))}
        </div>

        {/* Count + Sort */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="text-gray-900 dark:text-white font-bold text-base">{filtered.length}</span> 件の記事
          </p>
          <select value={sort} onChange={handleSort}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-kon cursor-pointer">
            <option value="new">新しい順</option>
            <option value="old">古い順</option>
            <option value="read">よく読まれる順（読了時間）</option>
          </select>
        </div>

        {/* Grid */}
        {paged.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {paged.map((blog) => (
                <Link key={blog.slug} href={`/blog/${blog.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                  <div className="relative w-full aspect-video overflow-hidden">
                    {blog.featuredImage ? (
                      <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradClass(blog.category)} flex items-center justify-center`}>
                        <span className="text-4xl opacity-70">📝</span>
                      </div>
                    )}
                    {blog.featured && (
                      <div className="absolute top-2 left-2 bg-kon text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">⭐ 注目</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className={`inline-block self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${badgeClass(blog.category)}`}>{blog.category}</span>
                    <h2 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-ai dark:group-hover:text-ai transition-colors">{blog.title}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{blog.description}</p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {blog.readTime ?? "5分"}
                      </span>
                      <span>{blog.publishDate}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed transition">← 前へ</button>
                {pageNumbers().map((n) => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${n === page ? "bg-kon text-white shadow-md" : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>{n}</button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed transition">次へ →</button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">📝</span>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">記事が見つかりませんでした</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">検索条件を変えるか、カテゴリをリセットしてみてください</p>
            <button onClick={resetFilters} className="px-6 py-2.5 bg-kon text-white rounded-full font-semibold text-sm hover:bg-ai transition">フィルターをリセット</button>
          </div>
        )}
      </div>
    </div>
  );
}
