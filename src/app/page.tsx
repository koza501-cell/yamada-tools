import fs from 'fs';
import type { Metadata } from 'next';
import path from 'path';
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";
import HeroAnimation from "@/components/common/HeroAnimation";
import TypingText from "@/components/common/TypingText";
import RecentTools from "@/components/common/RecentTools";
import RoleQuickAccess from "@/components/common/RoleQuickAccess";
import StickyTabBar from "@/components/common/StickyTabBar";
import TabbedToolsSection from "@/components/common/TabbedToolsSection";
import StatsCounter from "@/components/common/StatsCounter";
import FooterCta from "@/components/common/FooterCta";
import NicheBentoSection from "@/components/home/NicheBentoSection";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools, financeTools, careerTools, taxTools, realestateTools, businessTools, healthTools, foodTools, lifeTools, clinicTools, getToolCount, allTools, getNewTools} from "@/config/tools";
const popularTools = allTools.filter(t => t.isPopular && t.available);


// Feature H: Search suggestion chips
const SEARCH_CHIPS = [
  { label: '📄 PDF圧縮', href: '/pdf/compress' },
  { label: '📋 請求書作成', href: '/document/invoice' },
  { label: '🖼️ 画像変換', href: '/image/format-convert' },
  { label: '✉️ 封筒印刷', href: '/generator/envelope-print' },
  { label: '🏦 全銀変換', href: '/convert/bank-format' },
  { label: '📝 縦書き', href: '/document/vertical-text' },
  { label: '🔴 電子印鑑', href: '/generator/hanko' },
];


export const metadata: Metadata = {
  title: '山田ツール | 日本国内サーバーの無料オンラインツール',
  alternates: {
    canonical: 'https://yamada-tools.jp/',
  },
};

export const revalidate = 3600; // Revalidate every hour

function getDynamicBlogs() {
  try {
    const blogsPath = path.join(process.cwd(), 'src/data/dynamicBlogs.json');
    if (fs.existsSync(blogsPath)) {
      const fileContent = fs.readFileSync(blogsPath, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error loading dynamic blogs:', error);
  }
  return [];
}

function isNewBlog(publishDate: string): boolean {
  const postDate = new Date(publishDate);
  const now = new Date();
  const diffInDays = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 7;
}
export default function Home() {
  const toolCount = getToolCount();

  // Deduplicated available tools (for hero count)
  const _seenPaths = new Set<string>();
  const _seenNames = new Set<string>();
  const availableTools = allTools.filter(t => t.available).filter(tool => {
    if (_seenPaths.has(tool.path) || _seenNames.has(tool.nameJa)) return false;
    _seenPaths.add(tool.path);
    _seenNames.add(tool.nameJa);
    return true;
  });

  // Filter only available tools
  const availablePdfTools = pdfTools.filter(t => t.available);
  const availableDocTools = documentTools.filter(t => t.available);
  const availableConvertTools = convertTools.filter(t => t.available);
  const availableImageTools = imageTools.filter(t => t.available);
  const availableGenTools = generatorTools.filter(t => t.available);
  const availableFinanceTools = financeTools.filter(t => t.available);
  const availableHealthTools = healthTools.filter(t => t.available);
  const availableFoodTools = foodTools.filter(t => t.available);
  const availableLifeTools = lifeTools.filter(t => t.available);

  // Featured tools
  const featuredTools = allTools.filter(t => t.isFeatured && t.available);

  return (
    <div>
      <StickyTabBar />

      {/* ============================================================ */}
      {/* SECTION 1: Hero                                              */}
      {/* ============================================================ */}
      <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-kon dark:text-white" style={{ wordBreak: 'keep-all', lineBreak: 'strict', overflowWrap: 'break-word' }}>
            ビジネス・税金・金融・暮らしまで。日本人のための無料ツール{availableTools.length}種
          </h1>

          <p className="text-lg md:text-xl mb-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            日本国内サーバーで安全に処理。登録不要・完全無料。
          </p>

          <div className="flex justify-center mb-6">
            <a
              href="#tools"
              className="inline-flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200 text-lg w-full sm:w-auto justify-center"
            >
              無料でツールを使う
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Trust Badges - above fold */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            <span className="bg-gray-50 dark:bg-gray-700 text-kon dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">
              🇯🇵 日本国内サーバー
            </span>
            <span className="bg-gray-50 dark:bg-gray-700 text-kon dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">
              🔒 SSL暗号化
            </span>
            <span className="bg-gray-50 dark:bg-gray-700 text-kon dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">
              🗑️ 60分で自動削除
            </span>
            <span className="bg-gray-50 dark:bg-gray-700 text-kon dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">
              登録不要・完全無料
            </span>
            <span className="bg-gray-50 dark:bg-gray-700 text-kon dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">
              📱 スマホ対応
            </span>
          </div>

          <div className="mb-3 text-center">
            <Link href="/about/numbers" className="text-xs text-kon dark:text-blue-300 hover:text-ai underline underline-offset-2">
              数字で見るyamada-tools.jp →
            </Link>
          </div>

          <HeroAnimation />

          <div className="mb-3 flex justify-center">
            <SearchBar />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {SEARCH_CHIPS.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="rounded-full px-3 py-1 text-sm bg-white border border-gray-200 hover:border-ai hover:bg-gray-50 transition-colors cursor-pointer dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600 dark:hover:border-ai min-h-[44px] flex items-center"
              >
                {chip.label}
              </Link>
            ))}
          </div>
          <TypingText />

          <Link
            href="#popular-tools"
            className="inline-block bg-kon text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-ai transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            人気ツールを見る →
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* IDENTITY TIER: 役割別ナビゲーション                          */}
      {/* ============================================================ */}
      <section id="tools" className="py-12 bg-white dark:bg-gray-900" style={{scrollMarginTop: "80px"}}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-kon dark:text-white mb-2">役割別に探す</h2>
            <p className="text-sm text-sumi dark:text-gray-400">お仕事や立場に合わせて、必要なツールをまとめています。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { slug: 'keieisha', name: '中小企業の経営者', desc: '法人検索・補助金・給与・請求書', href: '/business' },
              { slug: 'freelance', name: '個人事業主・フリーランス', desc: '確定申告・インボイス・節税', href: '/tax/income-tax-calculator' },
              { slug: 'clinic', name: 'クリニック・士業', desc: '開業・経営・労務・医療報酬', href: '/clinic' },
              { slug: 'fudousan', name: '不動産・建設関係者', desc: '物件調査・経審・収益計算', href: '/realestate/yoto-chiiki-checker' },
              { slug: 'inshoku', name: '飲食店経営者', desc: '原価率・栄養・補助金', href: '/business/hojokin-active' },
              { slug: 'kazoku', name: '家族の生活・将来設計', desc: '家計・住宅・教育・相続', href: '/realestate/rent-vs-buy' },
            ].map(r => (
              <Link key={r.slug} href={r.href}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-ai dark:hover:border-ai rounded-xl p-5 transition-colors group">
                <div className="font-semibold text-kon dark:text-white group-hover:text-ai text-lg mb-1">{r.name}向け</div>
                <div className="text-sm text-sumi dark:text-gray-400">{r.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: Niche Bento Grid                                  */}
      {/* ============================================================ */}
      <NicheBentoSection />

      {/* ============================================================ */}
      {/* SECTION 3: Recently Used Tools                               */}
      {/* ============================================================ */}
      <RecentTools />

      {/* ============================================================ */}

      {/* ============================================================ */}
      {/* SECTION 5: Popular Tools                                     */}
      {/* ============================================================ */}
      <section id="popular-tools" className="py-16 bg-gray-50 dark:bg-gray-900" style={{scrollMarginTop: "120px"}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">人気ツール - 今すぐ使う</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">多くの方にご利用いただいています</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {popularTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="relative bg-white dark:bg-gray-800 shadow-md hover:shadow-lg text-kon dark:text-gray-200 px-3 py-3 rounded-xl font-medium transition-all hover:-translate-y-0.5 text-center text-sm min-h-[44px] flex items-center justify-center"
              >
                
                <span>{tool.icon} {tool.nameJa}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: New Tools + Finance Tools (merged)                */}
      {/* ============================================================ */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          {getNewTools().filter(t => t.category !== "finance").slice(0, 8).length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block px-3 py-1 bg-kon text-white text-sm font-bold rounded-full">新ツール</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">新しいツールが登場！</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
                {getNewTools().filter(t => t.category !== "finance").slice(0, 8).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-200 hover:border-ai p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-ai transition-colors">{tool.nameJa}</h3>
                          {tool.isNew && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">NEW</span>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                      </div>
                      <span className="text-ai group-hover:translate-x-1 transition-transform text-lg flex-shrink-0">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-block px-3 py-1 bg-kon text-white text-sm font-bold rounded-full">金融</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">金融・資産運用ツール</h2>
              </div>
              <Link href="/finance" className="text-sm text-kon dark:text-gray-300 hover:underline">すべて見る →</Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">NISA・住宅ローン・老後資金まで、無料で高精度シミュレーション。登録不要。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFinanceTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-kon dark:text-white leading-tight mb-1">{tool.nameJa}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                    </div>
                    <span className="text-kon dark:text-gray-300 group-hover:translate-x-1 transition-transform text-lg flex-shrink-0">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 7: Tabbed Tools Section (category browse)            */}
      {/* ============================================================ */}
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
        healthTools={availableHealthTools}
        foodTools={availableFoodTools}
        lifeTools={availableLifeTools}
        clinicTools={clinicTools.filter(t => t.available)}
      />

      {/* ============================================================ */}
      {/* SECTION 8: Blog (3 latest)                                   */}
      {/* ============================================================ */}
      {(() => {
        const dynamicBlogs = getDynamicBlogs();
        const recentBlogs = [...dynamicBlogs].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 3);

        if (recentBlogs.length === 0) return null;

        return (
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  📝 最新ブログ
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  PDFツールの活用方法やビジネス効率化のヒントをお届けします
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {recentBlogs.map((post: any) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative h-48 bg-gradient-to-br from-slate-900 to-kon">
                      {post.featuredImage && (
                        <Image src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" width={400} height={192} />
                      )}
                      {isNewBlog(post.publishDate) && (
                        <span className="absolute top-4 right-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-kon dark:text-gray-200 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-ai transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.publishDate}</span>
                        <span className="text-kon dark:text-gray-300 group-hover:translate-x-2 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-kon text-white rounded-lg hover:bg-kon transition-colors"
                >
                  すべてのブログを見る
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ============================================================ */}
      {/* SECTION 9: Trust + Media Coverage (Stats merged in)          */}
      {/* ============================================================ */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            📰 メディア掲載実績・信頼の数字
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            日本最大級のソフトウェアレビューサイト「窓の杜」に掲載されました
          </p>

          {/* Stats Counter merged in */}
          <StatsCounter />

          <a href="https://forest.watch.impress.co.jp/docs/digest/2077518.html" target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
            <Image
              src="https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/mado-no-mori-banner.webp"
              alt="窓の杜にて紹介されました - 2026年1月13日掲載"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow max-w-2xl w-full"
              width={672}
              height={150}
            />
          </a>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="font-bold text-kon dark:text-gray-300">🏢 法人利用実績</span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">500社以上</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="font-bold text-kon dark:text-gray-300">📅 窓の杜掲載</span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">2026年1月13日</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 10: Corporate B2B CTA                                */}
      {/* ============================================================ */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-2xl">🏢</span>
                <span className="text-white font-bold text-lg">法人・企業様向け</span>
              </div>
              <p className="text-gray-300 text-sm">
                情報システム部門も安心のセキュリティ基準。<br className="hidden md:block" />
                日本国内サーバー完結・60分自動削除・SSL暗号化
              </p>
            </div>
            <Link
              href="/about/business"
              className="inline-flex items-center gap-2 bg-white text-slate-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              詳しく見る
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 11: FooterCta (existing component for free users)    */}
      {/* ============================================================ */}
      <FooterCta />

      {/* Newsletter signup is now in Footer.tsx — no longer here */}
    </div>
  );
}
