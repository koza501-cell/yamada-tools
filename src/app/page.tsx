import fs from 'fs';
import type { Metadata } from 'next';
import path from 'path';
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";
import TypingText from "@/components/common/TypingText";
import RoleQuickAccess from "@/components/common/RoleQuickAccess";
import NewsletterSignup from "@/components/common/NewsletterSignup";
import StickyTabBar from "@/components/common/StickyTabBar";
import TabbedToolsSection from "@/components/common/TabbedToolsSection";
import StatsCounter from "@/components/common/StatsCounter";
import FooterCta from "@/components/common/FooterCta";
import UseCaseCards from "@/components/common/UseCaseCards";
import {
  pdfTools, documentTools, convertTools, imageTools,
  generatorTools, financeTools, careerTools, taxTools,
  realestateTools, businessTools, allTools,
} from "@/config/tools";
import HomepageAboveFold from "@/components/home/HomepageAboveFold";
import { CategoryChips, CategoryRail } from "@/components/home/CategoryNav";

// High-traffic tool paths that get the hot badge
const HOT_PATHS = new Set(['/generator/envelope-print', '/convert/bank-format', '/pdf/compress']);

// Phase 3.2: 8 popular tools rendered above the SearchBar
const POPULAR_GRID = [
  { href: "/pdf/compress",             icon: "\ud83d\udcc4", label: "PDF\u5727\u7e2e",    desc: "\u753b\u8cea\u3092\u4fdd\u3061\u306a\u304c\u3089\u8efd\u91cf\u5316" },
  { href: "/document/invoice",         icon: "\ud83d\udccb", label: "\u8acb\u6c42\u66f8\u4f5c\u6210", desc: "\u30a4\u30f3\u30dc\u30a4\u30b9\u5bfe\u5fdc\u30fb\u7121\u6599" },
  { href: "/image/format-convert",     icon: "\ud83d\uddbc\ufe0f", label: "\u753b\u50cf\u5909\u63db",  desc: "JPG/PNG/WebP\u4e00\u62ec\u5909\u63db" },
  { href: "/generator/envelope-print", icon: "\u2709\ufe0f", label: "\u5c01\u7b52\u5370\u5237",    desc: "\u5b9b\u540d\u5370\u5237\u30fb\u7e26\u66f8\u304d\u5bfe\u5fdc" },
  { href: "/convert/bank-format",      icon: "\ud83c\udfe6", label: "\u5168\u9280\u5909\u63db",    desc: "\u65e5\u672c\u306e\u9280\u884c\u632f\u8fbc\u5c02\u7528" },
  { href: "/document/vertical-text",   icon: "\u7e26",        label: "\u7e26\u66f8\u304d",          desc: "\u65e5\u672c\u5f0f\u7e26\u66f8\u304dPDF\u4f5c\u6210" },
  { href: "/generator/hanko",          icon: "\ud83d\udd34", label: "\u96fb\u5b50\u5370\u9451",    desc: "\u65e5\u672c\u5f0f\u30cf\u30f3\u30b3\u3092PDF\u306b" },
  { href: "/convert/furigana",         icon: "\u3042",        label: "\u3075\u308a\u304c\u306a",    desc: "\u6f22\u5b57\u2192\u3072\u3089\u304c\u306a\u30fb\u30ab\u30bf\u30ab\u30ca" },
];

export const metadata: Metadata = {
  title: '\u5c71\u7530\u30c4\u30fc\u30eb | \u65e5\u672c\u56fd\u5185\u30b5\u30fc\u30d0\u30fc\u306e\u7121\u6599\u30aa\u30f3\u30e9\u30a4\u30f3\u30c4\u30fc\u30eb',
  alternates: {
    canonical: 'https://yamada-tools.jp/',
  },
};

export const revalidate = 3600;

function getDynamicBlogs() {
  try {
    const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');
    if (fs.existsSync(blogsPath)) {
      return JSON.parse(fs.readFileSync(blogsPath, 'utf-8'));
    }
  } catch (error) {
    console.error('Error loading dynamic blogs:', error);
  }
  return [];
}

function isNewBlog(publishDate: string): boolean {
  const diffInDays = (Date.now() - new Date(publishDate).getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 7;
}

export default function Home() {
  const _seenPaths = new Set<string>();
  const _seenNames = new Set<string>();
  const availableTools = allTools.filter(t => t.available).filter(tool => {
    if (_seenPaths.has(tool.path) || _seenNames.has(tool.nameJa)) return false;
    _seenPaths.add(tool.path);
    _seenNames.add(tool.nameJa);
    return true;
  });

  const availablePdfTools      = pdfTools.filter(t => t.available);
  const availableDocTools      = documentTools.filter(t => t.available);
  const availableConvertTools  = convertTools.filter(t => t.available);
  const availableImageTools    = imageTools.filter(t => t.available);
  const availableGenTools      = generatorTools.filter(t => t.available);
  const availableFinanceTools  = financeTools.filter(t => t.available);
  const featuredTools          = allTools.filter(t => t.isFeatured && t.available);

  // -------------------------------------------------------
  // Phase 3.1: Compressed hero
  //   - text-jp-h1 (clamp 1.75rem..2.5rem) + line-clamp-2
  //   - HeroAnimation removed (redundant with TrustBar Phase 2D)
  //   - Trust badge row removed (redundant with TrustBar Phase 2D)
  // Phase 3.2: Popular tools grid above SearchBar; SEARCH_CHIPS removed
  // -------------------------------------------------------
  const heroSection = (
    <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8 md:py-10 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-jp-h1 font-bold mb-4 text-kon line-clamp-2">
          {"\u65e5\u672c\u306e\u30d3\u30b8\u30cd\u30b9\u306b\u7279\u5316\u3057\u305f\u7121\u6599\u30aa\u30f3\u30e9\u30a4\u30f3\u30c4\u30fc\u30eb\uff5c\u30a4\u30f3\u30dc\u30a4\u30b9\u30fb\u5168\u9280\u30fb\u96fb\u5b50\u5370\u9451\u306a\u3069"}{availableTools.length}{"\u79cd"}
        </h1>

        <p className="text-base md:text-lg mb-5 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {"\u65e5\u672c\u56fd\u5185\u30b5\u30fc\u30d0\u30fc\u3067\u5b89\u5168\u306b\u51e6\u7406\u3002\u767b\u9332\u4e0d\u8981\u30fb\u5b8c\u5168\u7121\u6599\u3002"}
        </p>

        {/* Phase 3.2: Popular tools above SearchBar */}
        {/* Mobile (<sm): horizontal snap carousel */}
        <div className="sm:hidden flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-4 px-4 mb-5">
          {POPULAR_GRID.map(({ href, icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="snap-start flex-shrink-0 w-[140px] group bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all border border-gray-100 dark:border-gray-700 hover:border-blue-300"
            >
              <div className="text-2xl mb-1">{icon}</div>
              <p className="font-bold text-gray-800 dark:text-gray-100 text-xs leading-tight group-hover:text-blue-600">{label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{desc}</p>
            </Link>
          ))}
        </div>
        {/* sm+: 2 cols; lg+: 4 cols */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {POPULAR_GRID.map(({ href, icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div className="text-2xl mb-1.5">{icon}</div>
              <p className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">{label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>

        <div className="mb-3 flex justify-center">
          <SearchBar />
        </div>
        <TypingText />

        <Link
          href="#cat-pdf"
          className="inline-block bg-kon text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-ai transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 mt-2"
        >
          {"\u4eba\u6c17\u30c4\u30fc\u30eb\u3092\u898b\u308b"} &rarr;
        </Link>
      </div>
    </section>
  );

  return (
    <div>
      <StickyTabBar />

      {/* Phase 3.3: returning-user reorder */}
      <HomepageAboveFold hero={heroSection} />

      {/* Phase 3.4: mobile category chips, just below above-fold (not sticky per spec) */}
      <CategoryChips />

      {/* Page body: sticky category sidebar at lg+ */}
      <div className="lg:flex lg:items-start">
        <CategoryRail />

        <div className="flex-1 min-w-0">
          <RoleQuickAccess />

          {/* Japan-exclusive tools */}
          <section id="cat-document" className="py-10 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-kon dark:text-blue-400 mb-2">{"\ud83c\uddef\ud83c\uddf5 \u65e5\u672c\u5c02\u7528\u30c4\u30fc\u30eb"}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{"\u65e5\u672c\u306e\u6cd5\u5f8b\u30fb\u5236\u5ea6\u30fb\u66f8\u5f0f\u306b\u5b8c\u5168\u5bfe\u5fdc\u3002\u6d77\u5916\u30c4\u30fc\u30eb\u3067\u306f\u89e3\u6c7a\u3067\u304d\u306a\u3044\u65e5\u672c\u72ec\u81ea\u306e\u8ab2\u984c\u306b\u3002"}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { href: "/convert/bank-format",          icon: "\ud83c\udfe6", label: "\u5168\u9280\u30d5\u30a9\u30fc\u30de\u30c3\u30c8",   desc: "\u65e5\u672c\u306e\u9280\u884c\u632f\u8fbc\u5c02\u7528" },
                  { href: "/generator/hanko",              icon: "\ud83d\udd34", label: "\u96fb\u5b50\u5370\u9451",           desc: "\u65e5\u672c\u5f0f\u30cf\u30f3\u30b3\u3092PDF\u306b" },
                  { href: "/document/invoice",             icon: "\ud83d\udccb", label: "\u8acb\u6c42\u66f8\u4f5c\u6210",         desc: "\u30a4\u30f3\u30dc\u30a4\u30b9\u5bfe\u5fdc\u30fb\u7121\u6599" },
                  { href: "/generator/t-number",           icon: "\ud83d\udd22", label: "\u30a4\u30f3\u30dc\u30a4\u30b9\u756a\u53f7\u691c\u8a3c", desc: "T\u30ca\u30f3\u30d0\u30fc\u3092\u5373\u30c1\u30a7\u30c3\u30af" },
                  { href: "/convert/wareki-seireki",       icon: "\ud83d\udcc5", label: "\u548c\u66a6\u5909\u63db",           desc: "\u5143\u53f7\u2194\u897f\u66a6\u3092\u5373\u5909\u63db" },
                  { href: "/convert/furigana",             icon: "\u3042",        label: "\u3075\u308a\u304c\u306a\u5909\u63db",       desc: "\u6f22\u5b57\u2192\u3072\u3089\u304c\u306a\u30fb\u30ab\u30bf\u30ab\u30ca" },
                  { href: "/generator/envelope-print",     icon: "\u2709\ufe0f", label: "\u5c01\u7b52\u5370\u5237",           desc: "\u5b9b\u540d\u5370\u5237\u30fb\u7e26\u66f8\u304d\u5bfe\u5fdc" },
                  { href: "/document/vertical-text",       icon: "\u7e26",        label: "\u7e26\u66f8\u304d\u30c6\u30ad\u30b9\u30c8",     desc: "\u65e5\u672c\u5f0f\u7e26\u66f8\u304dPDF\u4f5c\u6210" },
                  { href: "/pdf/combini-print",            icon: "\ud83c\udfea", label: "\u30b3\u30f3\u30d3\u30cb\u5370\u5237",       desc: "\u7aef\u5207\u308c\u306a\u3057\u4f59\u767d\u8ffd\u52a0" },
                  { href: "/generator/nenmatsu-calc",      icon: "\ud83d\udcdd", label: "\u5e74\u672b\u8abf\u6574\u8a08\u7b97",       desc: "\u6276\u990a\u63a7\u9664\u30fb\u4fdd\u967a\u6599\u63a7\u9664" },
                  { href: "/tax/furusato-nozei-calculator",icon: "\ud83c\udf81", label: "\u3075\u308b\u3055\u3068\u7d0d\u7a0e",   desc: "\u63a7\u9664\u4e0a\u9650\u984d\u3092\u5373\u8a08\u7b97" },
                  { href: "/convert/tsubo-converter",      icon: "\ud83c\udfe0", label: "\u5d6a\u5909\u63db",             desc: "\u5d6a\u2194\u5e73\u7c73\u30fb\u7573\u3092\u4e00\u62ec\u5909\u63db" },
                ].map(({ href, icon, label, desc }) => (
                  <Link key={href} href={href} className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                    <div className="text-2xl mb-1.5">{icon}</div>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <StatsCounter />

          {/* Trust badges — section id used as IntersectionObserver target for 計算 category */}
          <section id="cat-calculator" className="py-6">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 flex flex-wrap justify-around gap-4">
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl mb-1">{"\ud83c\udfe2"}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">{"\u6cd5\u4eba\u5229\u7528\u5b9f\u7e3e"}</span>
                  <span className="text-kon dark:text-blue-400 font-bold">500{"\u793e\u4ee5\u4e0a"}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl mb-1">{"\ud83d\udd12"}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">SSL{"\u6697\u53f7\u5316\u901a\u4fe1"}</span>
                  <span className="text-kon dark:text-blue-400 font-bold">{"\u5e38\u6642HTTPS"}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl mb-1">{"\ud83c\uddef\ud83c\uddf5"}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">{"\u56fd\u5185\u30b5\u30fc\u30d0\u30fc"}</span>
                  <span className="text-kon dark:text-blue-400 font-bold">100%</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-2xl mb-1">{"\u23f1"}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">{"\u81ea\u52d5\u524a\u9664"}</span>
                  <span className="text-kon dark:text-blue-400 font-bold">60{"\u5206\u4ee5\u5185"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Use case cards */}
          <section id="cat-image" className="py-10 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-kon dark:text-blue-400 text-center mb-8">{"\ud83c\udfaf \u7528\u9014\u304b\u3089\u63a2\u3059"}</h2>
              <UseCaseCards />
            </div>
          </section>

          {/* Role-based access */}
          <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{"\u62c5\u5f53\u696d\u52d9\u304b\u3089\u63a2\u3059"}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: "\u7d4c\u7406\u30fb\u8ca1\u52d9", icon: "\ud83c\udfe6", href: "/tools?role=accounting" },
                  { label: "\u4eba\u4e8b\u30fb\u7d66\u4e0e", icon: "\ud83d\udc65", href: "/tools?role=hr" },
                  { label: "\u7dcf\u52d9\u30fb\u5e36\u52d9", icon: "\ud83c\udfe2", href: "/tools?role=general" },
                  { label: "PDF\u51e6\u7406",                  icon: "\ud83d\udcc4", href: "/tools?role=pdf" },
                  { label: "\u30de\u30fc\u30b1\u30fb\u55b6\u696d", icon: "\ud83d\udcca", href: "/tools?role=marketing" },
                ].map(({ label, icon, href }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-kon hover:text-kon dark:hover:text-blue-400 transition-colors min-h-[44px]">
                    <span>{icon}</span>{label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Popular tools */}
          <section id="cat-pdf" className="py-16 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-gray-800 dark:to-gray-900" style={{ scrollMarginTop: "120px" }}>
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{"\ud83d\udd25 \u4eba\u6c17\u30c4\u30fc\u30eb - \u4eca\u3059\u3050\u4f7f\u3046"}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{"\u5148\u6708100\u4e07\u4ef6\u4ee5\u4e0a\u306e\u51e6\u7406\u5b9f\u7e3e \u00b7 \u6cd5\u4eba500\u793e\u4ee5\u4e0a\u304c\u5229\u7528"}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {[
                  { href: '/pdf/compress',             label: "\ud83d\udcc4 PDF\u5727\u7e2e" },
                  { href: '/pdf/merge',                label: "\ud83d\udcd1 PDF\u7d50\u5408" },
                  { href: '/image/compress',           label: "\ud83d\uddbc\ufe0f \u753b\u50cf\u5727\u7e2e" },
                  { href: '/convert/furigana',         label: "\u3042 \u3075\u308a\u304c\u306a" },
                  { href: '/document/invoice',         label: "\ud83d\udccb \u8acb\u6c42\u66f8\u4f5c\u6210" },
                  { href: '/generator/envelope-print', label: "\u2709\ufe0f \u5c01\u7b52\u5370\u5237" },
                  { href: '/convert/bank-format',      label: "\ud83c\udfe6 \u5168\u9280\u5909\u63db" },
                  { href: '/generator/hanko',          label: "\ud83d\udd34 \u96fb\u5b50\u5370\u9451" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="relative bg-white shadow-md hover:shadow-lg text-kon px-3 py-3 rounded-xl font-medium transition-all hover:-translate-y-0.5 text-center text-sm min-h-[44px] flex items-center justify-center"
                  >
                    {HOT_PATHS.has(href) && (
                      <span className="absolute -top-1.5 -right-1.5 text-xs bg-red-500 text-white px-1 py-0.5 rounded-full leading-none font-bold">{"\ud83d\udd25"}</span>
                    )}
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* New tools + Finance tools */}
          <section id="cat-finance" className="py-16 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              {featuredTools.filter(t => t.category !== "finance").length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">{"\ud83c\udd95 \u65b0\u30c4\u30fc\u30eb"}</span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{"\u65b0\u3057\u3044\u30c4\u30fc\u30eb\u304c\u767b\u5834\uff01"}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
                    {featuredTools.filter(t => t.category !== "finance").map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.path}
                        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-orange-200 dark:border-orange-800 hover:border-orange-400 p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl flex-shrink-0">{tool.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">{tool.nameJa}</h3>
                              {tool.isNew && <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">NEW</span>}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                          </div>
                          <span className="text-orange-400 group-hover:translate-x-1 transition-transform text-lg flex-shrink-0">&rarr;</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-block px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full">{"\ud83d\udcb0 \u91d1\u878d"}</span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{"\u91d1\u878d\u30fb\u8cc7\u7523\u904b\u7528\u30c4\u30fc\u30eb"}</h2>
                  </div>
                  <Link href="/finance" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{"\u3059\u3079\u3066\u898b\u308b"} &rarr;</Link>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{"\u30cb\u30b5\u30fb\u4f4f\u5b85\u30ed\u30fc\u30f3\u30fb\u8001\u5f8c\u8cc7\u91d1\u307e\u3067\u3001\u7121\u6599\u3067\u9ad8\u7cbe\u5ea6\u30b7\u30df\u30e5\u30ec\u30fc\u30b7\u30e7\u30f3\u3002\u767b\u9332\u4e0d\u8981\u3002"}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableFinanceTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden border border-amber-100 dark:border-gray-700 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl flex-shrink-0">{tool.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-kon dark:text-white leading-tight">{tool.nameJa}</h3>
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs font-bold rounded">Pro</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Tabbed tools -- cat-image marker at top so rail highlights Image when scrolled here */}
          <div id="cat-image">
            <TabbedToolsSection
              pdfTools={availablePdfTools}
              documentTools={availableDocTools}
              convertTools={availableConvertTools}
              imageTools={availableImageTools}
              generatorTools={availableGenTools}
              financeTools={availableFinanceTools}
              careerTools={careerTools.filter(t => t.available)}
              taxTools={taxTools.filter(t => t.available)}
              realestateTools={realestateTools.filter(t => t.available)}
              businessTools={businessTools.filter(t => t.available)}
            />
          </div>

          {/* Why us */}
          <section className="py-10">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-kon text-center mb-10">{"\u9078\u3070\u308c\u308b\u7406\u7531"}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">{"\ud83c\uddef\ud83c\uddf5"}</div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{"\u65e5\u672c\u56fd\u5185\u30b5\u30fc\u30d0\u30fc"}</h3>
                  <p className="text-gray-600 text-sm">{"\u5927\u5207\u306a\u30d5\u30a1\u30a4\u30eb\u306f\u6d77\u5916\u306b\u9001\u308a\u305f\u304f\u306a\u3044\u3002\u5f53\u30b5\u30fc\u30d3\u30b9\u306f\u65e5\u672c\u56fd\u5185\u306e\u30b5\u30fc\u30d0\u30fc\u3067\u904b\u7528\u3057\u3066\u3044\u307e\u3059\u3002"}</p>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">{"\u26a1"}</div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{"\u9ad8\u901f\u51e6\u7406"}</h3>
                  <p className="text-gray-600 text-sm">{"\u6700\u65b0\u306e\u30b5\u30fc\u30d0\u30fc\u74b0\u5883\u3067\u3001\u5927\u5bb9\u91cf\u30d5\u30a1\u30a4\u30eb\u3082\u7d20\u65e9\u304f\u51e6\u7406\u3002\u304a\u5f85\u305f\u305b\u3057\u307e\u305b\u3093\u3002"}</p>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">{"\ud83d\udd12"}</div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">{"\u30d7\u30e9\u30a4\u30d0\u30b7\u30fc\u91cd\u8996"}</h3>
                  <p className="text-gray-600 text-sm">{"SSL\u6697\u53f7\u5316\u901a\u4fe1\u3001\u51e6\u7406\u5f8c\u306f\u81ea\u52d5\u524a\u9664\u3002\u3042\u306a\u305f\u306e\u30d5\u30a1\u30a4\u30eb\u3092\u5b89\u5168\u306b\u5b88\u308a\u307e\u3059\u3002"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Blog */}
          {(() => {
            const dynamicBlogs = getDynamicBlogs();
            const recentBlogs = [...dynamicBlogs]
              .sort((a: { publishDate: string }, b: { publishDate: string }) =>
                new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
              )
              .slice(0, 3);
            if (recentBlogs.length === 0) return null;
            return (
              <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{"\ud83d\udcdd \u6700\u65b0\u30d6\u30ed\u30b0"}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{"PDF\u30c4\u30fc\u30eb\u306e\u6d3b\u7528\u65b9\u6cd5\u3084\u30d3\u30b8\u30cd\u30b9\u52b9\u7387\u5316\u306e\u30d2\u30f3\u30c8\u3092\u304a\u5c4a\u3051\u3057\u307e\u3059"}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {recentBlogs.map((post: { slug: string; featuredImage?: string; title: string; publishDate: string; category: string; readTime: string; description: string }) => (
                      <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                          {post.featuredImage && (
                            <Image src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" width={400} height={192} />
                          )}
                          {isNewBlog(post.publishDate) && (
                            <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">NEW</span>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">{post.category}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{post.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{post.publishDate}</span>
                            <span className="text-blue-600 group-hover:translate-x-2 transition-transform">&rarr;</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="text-center">
                    <Link href="/blog" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {"\u3059\u3079\u3066\u306e\u30d6\u30ed\u30b0\u3092\u898b\u308b"}<span className="ml-2">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* Media coverage */}
          <section className="py-12 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{"\ud83d\udcf0 \u30e1\u30c7\u30a3\u30a2\u6383\u8f09\u5b9f\u7e3e"}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">{"\u65e5\u672c\u6700\u5927\u7d1a\u306e\u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u30ec\u30d3\u30e5\u30fc\u30b5\u30a4\u30c8\u300c\u7a93\u306e\u675c\u300d\u306b\u6383\u8f09\u3055\u308c\u307e\u3057\u305f"}</p>
              <a href="https://forest.watch.impress.co.jp/docs/digest/2077518.html" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Image
                  src="https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/mado-no-mori-banner.webp"
                  alt="\u7a93\u306e\u675c\u306b\u3066\u7d39\u4ecb\u3055\u308c\u307e\u3057\u305f - 2026\u5e741\u670813\u65e5\u6383\u8f09"
                  className="rounded-xl shadow-lg hover:shadow-xl transition-shadow max-w-2xl w-full"
                  width={672}
                  height={150}
                />
              </a>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                  <span className="font-bold text-kon dark:text-blue-400">{"\ud83c\udfe2 \u6cd5\u4eba\u5229\u7528\u5b9f\u7e3e"}</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">500{"\u793e\u4ee5\u4e0a"}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                  <span className="font-bold text-kon dark:text-blue-400">{"\ud83d\udcc5 \u7a93\u306e\u675c\u6383\u8f09"}</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-2">2026{"\u5e741\u670813\u65e5"}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white dark:bg-gray-800">
            <div className="max-w-2xl mx-auto px-4">
              <NewsletterSignup />
            </div>
          </section>

          <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="text-2xl">{"\ud83c\udfe2"}</span>
                    <span className="text-white font-bold text-lg">{"\u6cd5\u4eba\u30fb\u4f01\u696d\u69d8\u5411\u3051"}</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {"\u60c5\u5831\u30b7\u30b9\u30c6\u30e0\u90e8\u9580\u3082\u5b89\u5fc3\u306e\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u57fa\u6e96\u3002"}<br className="hidden md:block" />
                    {"\u65e5\u672c\u56fd\u5185\u30b5\u30fc\u30d0\u30fc\u5b8c\u7d50\u30fb60\u5206\u81ea\u52d5\u524a\u9664\u30fbSSL\u6697\u53f7\u5316"}
                  </p>
                </div>
                <Link
                  href="/about/business"
                  className="inline-flex items-center gap-2 bg-white text-slate-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  {"\u8a73\u3057\u304f\u898b\u308b"}<span>&rarr;</span>
                </Link>
              </div>
            </div>
          </section>

          <FooterCta />

          <section className="py-20 bg-sakura/20">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold text-kon mb-4">{"\u4eca\u3059\u3050\u7121\u6599\u3067\u4f7f\u3063\u3066\u307f\u308b"}</h2>
              <p className="text-gray-600 mb-6 text-sm">{"\u4f1a\u54e1\u767b\u9332\u4e0d\u8981\u3002\u3059\u3079\u3066\u306e\u30c4\u30fc\u30eb\u304c\u7121\u6599\u3067\u3054\u5229\u7528\u3044\u305f\u3060\u3051\u307e\u3059\u3002"}</p>
              <Link href="/pdf" className="inline-block bg-kon text-white px-8 py-4 rounded-xl font-bold hover:bg-ai transition-colors">
                {"PDF\u30c4\u30fc\u30eb\u3092\u4f7f\u3046"} &rarr;
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
