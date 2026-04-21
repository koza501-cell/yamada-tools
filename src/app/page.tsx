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
import NewsletterSignup from "@/components/common/NewsletterSignup";
import StickyTabBar from "@/components/common/StickyTabBar";
import TabbedToolsSection from "@/components/common/TabbedToolsSection";
import AdSlot from "@/components/AdSlot";
import StatsCounter from "@/components/common/StatsCounter";
import FooterCta from "@/components/common/FooterCta";
import { ScrollRevealGrid } from "@/components/common/ScrollRevealGrid";
import UseCaseCards from "@/components/common/UseCaseCards";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools, financeTools, careerTools, taxTools, realestateTools, businessTools, getToolCount, allTools } from "@/config/tools";

// High-traffic tool paths that get 🔥 badge
const HOT_PATHS = new Set(['/generator/envelope-print', '/convert/bank-format', '/pdf/compress']);

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

  // Featured tools
  const featuredTools = allTools.filter(t => t.isFeatured && t.available);

  return (
    <div>
      <StickyTabBar />
      {/* Hero Section - REDESIGNED */}
      <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Main Headline - H1 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-kon">
            日本のビジネスに特化した無料オンラインツール｜インボイス・全銀・電子印鑑など{availableTools.length}種
          </h1>

          <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            日本国内サーバーで安全に処理。登録不要・完全無料。
          </p>

          {/* Trust Badges - above fold */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            <span className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100 dark:border-gray-600">
              🇯🇵 日本国内サーバー
            </span>
            <span className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100 dark:border-gray-600">
              🔒 SSL暗号化
            </span>
            <span className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100 dark:border-gray-600">
              🗑️ 60分で自動削除
            </span>
            <span className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100 dark:border-gray-600">
              ✨ 登録不要・完全無料
            </span>
          </div>

          {/* Hero Animation */}
          <HeroAnimation />

          {/* Search Bar */}
          <div className="mb-3 flex justify-center">
            <SearchBar />
          </div>
          {/* Feature H: Search suggestion chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {SEARCH_CHIPS.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="rounded-full px-3 py-1 text-sm bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600 dark:hover:border-blue-400 min-h-[44px] flex items-center"
              >
                {chip.label}
              </Link>
            ))}
          </div>
          <TypingText />

          {/* Primary CTA Button */}
          <Link
            href="#popular-tools"
            className="inline-block bg-kon text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-ai transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            人気ツールを見る →
          </Link>
        </div>
      </section>
      {/* Recently Used Tools - Priority for returning users */}
      <RecentTools />

      {/* Role-Based Quick Access */}
      <RoleQuickAccess />

      {/* 🇯🇵 Japan-Exclusive Identity Section */}
      <section className="py-10 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-kon dark:text-blue-400 mb-2">🇯🇵 日本専用ツール</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">日本の法律・制度・書式に完全対応。海外ツールでは解決できない日本独自の課題に。</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { href: "/convert/bank-format", icon: "🏦", label: "全銀フォーマット", desc: "日本の銀行振込専用" },
              { href: "/generator/hanko", icon: "🔴", label: "電子印鑑", desc: "日本式ハンコをPDFに" },
              { href: "/document/invoice", icon: "📋", label: "請求書作成", desc: "インボイス対応・無料" },
              { href: "/generator/t-number", icon: "🔢", label: "インボイス番号検証", desc: "Tナンバーを即チェック" },
              { href: "/convert/wareki-seireki", icon: "📅", label: "和暦変換", desc: "元号↔西暦を即変換" },
              { href: "/convert/furigana", icon: "あ", label: "ふりがな変換", desc: "漢字→ひらがな・カタカナ" },
              { href: "/generator/envelope-print", icon: "✉️", label: "封筒印刷", desc: "宛名印刷・縦書き対応" },
              { href: "/document/vertical-text", icon: "縦", label: "縦書きテキスト", desc: "日本式縦書きPDF作成" },
              { href: "/pdf/combini-print", icon: "🏪", label: "コンビニ印刷", desc: "端切れなし余白追加" },
              { href: "/generator/nenmatsu-calc", icon: "📝", label: "年末調整計算", desc: "扶養控除・保険料控除" },
              { href: "/tax/furusato-nozei-calculator", icon: "🎁", label: "ふるさと納税", desc: "控除上限額を即計算" },
              { href: "/convert/tsubo-converter", icon: "🏠", label: "坪変換", desc: "坪↔平米・畳を一括変換" },
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

      {/* Feature J: Stats Counter */}
      <StatsCounter />

      {/* Trust Badges */}
      <section className="py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 flex flex-wrap justify-around gap-4">
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🏢</span>
              <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">法人利用実績</span>
              <span className="text-kon dark:text-blue-400 font-bold">500社以上</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🔒</span>
              <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">SSL暗号化通信</span>
              <span className="text-kon dark:text-blue-400 font-bold">常時HTTPS</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🇯🇵</span>
              <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">国内サーバー</span>
              <span className="text-kon dark:text-blue-400 font-bold">100%</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-2xl mb-1">⏱</span>
              <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">自動削除</span>
              <span className="text-kon dark:text-blue-400 font-bold">60分以内</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature I: Use Case Cards */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-kon dark:text-blue-400 text-center mb-8">🎯 用途から探す</h2>
          <UseCaseCards />
        </div>
      </section>


      {/* 担当業務から探す */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">担当業務から探す</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "経理・財務", icon: "🏦", href: "/tools?role=accounting" },
              { label: "人事・給与", icon: "👥", href: "/tools?role=hr" },
              { label: "総務・庶務", icon: "🏢", href: "/tools?role=general" },
              { label: "PDF処理",   icon: "📄", href: "/tools?role=pdf" },
              { label: "マーケ・営業", icon: "📊", href: "/tools?role=marketing" },
            ].map(({ label, icon, href }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-kon hover:text-kon dark:hover:text-blue-400 transition-colors min-h-[44px]">
                <span>{icon}</span>{label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 Popular Tools Section - Below Fold */}
      <section id="popular-tools" className="py-16 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-gray-800 dark:to-gray-900" style={{scrollMarginTop: "120px"}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔥 人気ツール - 今すぐ使う</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">先月100万件以上の処理実績 · 法人500社以上が利用</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {[
              { href: '/pdf/compress', label: '📄 PDF圧縮' },
              { href: '/pdf/merge', label: '📑 PDF結合' },
              { href: '/image/compress', label: '🖼️ 画像圧縮' },
              { href: '/convert/furigana', label: 'あ ふりがな' },
              { href: '/document/invoice', label: '📋 請求書作成' },
              { href: '/generator/envelope-print', label: '✉️ 封筒印刷' },
              { href: '/convert/bank-format', label: '🏦 全銀変換' },
              { href: '/generator/hanko', label: '🔴 電子印鑑' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative bg-white shadow-md hover:shadow-lg text-kon px-3 py-3 rounded-xl font-medium transition-all hover:-translate-y-0.5 text-center text-sm min-h-[44px] flex items-center justify-center"
              >
                {HOT_PATHS.has(href) && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs bg-red-500 text-white px-1 py-0.5 rounded-full leading-none font-bold">🔥</span>
                )}
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* 🆕 新ツール ＋ 💰 金融・資産運用ツール — MERGED SECTION */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          {/* NEW tools sub-section */}
          {featuredTools.filter(t => t.category !== "finance").length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">🆕 新ツール</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">新しいツールが登場！</h2>
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
                      <span className="text-orange-400 group-hover:translate-x-1 transition-transform text-lg flex-shrink-0">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Finance tools sub-section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-block px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full">💰 金融</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">金融・資産運用ツール</h2>
              </div>
              <Link href="/finance" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">すべて見る →</Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">NISA・住宅ローン・老後資金まで、無料で高精度シミュレーション。登録不要。</p>
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

      <TabbedToolsSection pdfTools={availablePdfTools} documentTools={availableDocTools} convertTools={availableConvertTools} imageTools={availableImageTools} generatorTools={availableGenTools} financeTools={availableFinanceTools} careerTools={careerTools.filter(t => t.available)} taxTools={taxTools.filter(t => t.available)} realestateTools={realestateTools.filter(t => t.available)} businessTools={businessTools.filter(t => t.available)} />

      {/* Features Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-kon text-center mb-10">
            選ばれる理由
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🇯🇵</div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">日本国内サーバー</h3>
              <p className="text-gray-600 text-sm">
                大切なファイルは海外に送りたくない。
                当サービスは日本国内のサーバーで運用しています。
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">高速処理</h3>
              <p className="text-gray-600 text-sm">
                最新のサーバー環境で、大容量ファイルも素早く処理。
                お待たせしません。
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">プライバシー重視</h3>
              <p className="text-gray-600 text-sm">
                SSL暗号化通信、処理後は自動削除。
                あなたのファイルを安全に守ります。
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Blog Section */}
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
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                      {post.featuredImage && (
                        <Image src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" width={400} height={192} />
                      )}
                      {isNewBlog(post.publishDate) && (
                        <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.publishDate}</span>
                        <span className="text-blue-600 group-hover:translate-x-2 transition-transform">
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
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  すべてのブログを見る
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </section>
        );
      })()}



      {/* Media Coverage Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            📰 メディア掲載実績
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            日本最大級のソフトウェアレビューサイト「窓の杜」に掲載されました
          </p>
          <a href="https://forest.watch.impress.co.jp/docs/digest/2077518.html" target="_blank" rel="noopener noreferrer" className="inline-block">
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
              <span className="font-bold text-kon dark:text-blue-400">🏢 法人利用実績</span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">500社以上</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl px-6 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="font-bold text-kon dark:text-blue-400">📅 窓の杜掲載</span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">2026年1月13日</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-2xl mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>

      {/* Corporate CTA Section - NEW */}
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

      {/* Feature L: Footer CTA for free users */}
      <FooterCta />

      {/* CTA Section */}
      <section className="py-20 bg-sakura/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-kon mb-4">
            今すぐ無料で使ってみる
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            会員登録不要。すべてのツールが無料でご利用いただけます。
          </p>
          <Link
            href="/pdf"
            className="inline-block bg-kon text-white px-8 py-4 rounded-xl font-bold hover:bg-ai transition-colors"
          >
            PDFツールを使う →
          </Link>
        </div>
      </section>
    </div>
  );
}
