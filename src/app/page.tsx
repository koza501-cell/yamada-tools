import fs from 'fs';
import path from 'path';
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";
import HeroAnimation from "@/components/common/HeroAnimation";
import TypingText from "@/components/common/TypingText";
import RecentTools from "@/components/common/RecentTools";
import NewsletterSignup from "@/components/common/NewsletterSignup";
import StickyTabBar from "@/components/common/StickyTabBar";
import TabbedToolsSection from "@/components/common/TabbedToolsSection";
import AdSlot from "@/components/AdSlot";
import StatsCounter from "@/components/common/StatsCounter";
import FooterCta from "@/components/common/FooterCta";
import { ScrollRevealGrid } from "@/components/common/ScrollRevealGrid";
import FinanceSection from "@/components/FinanceSection";
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

// Feature I: Use case cards
const USE_CASES = [
  {
    icon: '📄', title: '書類を作りたい',
    desc: '請求書・見積書・納品書をPDFで作成',
    links: [{ label: '見積書', href: '/document/quotation' }, { label: '納品書', href: '/document/delivery-slip' }, { label: '送付状', href: '/document/cover-letter' }],
  },
  {
    icon: '✉️', title: '郵便物を送りたい',
    desc: '封筒の宛名印刷・名刺・はがき',
    links: [{ label: '名刺作成', href: '/document/business-card' }, { label: 'QRコード', href: '/image/qr-code' }, { label: '電子印鑑', href: '/generator/hanko' }],
  },
  {
    icon: '📊', title: 'PDFを編集',
    desc: '圧縮・結合・分割・回転',
    links: [{ label: 'PDF結合', href: '/pdf/merge' }, { label: 'PDF分割', href: '/pdf/split' }, { label: 'PDF回転', href: '/pdf/rotate' }],
  },
  {
    icon: '🏦', title: '経理・振込',
    desc: '全銀フォーマット・請求書・領収書',
    links: [{ label: '領収書', href: '/document/receipt' }, { label: '給与明細', href: '/generator/salary-calc' }, { label: '全銀変換', href: '/convert/bank-format' }],
  },
  {
    icon: '🖼️', title: '画像加工',
    desc: '圧縮・変換・リサイズ',
    links: [{ label: '画像圧縮', href: '/image/compress' }, { label: 'リサイズ', href: '/image/resize' }, { label: 'モザイク', href: '/image/mosaic' }],
  },
  {
    icon: '🔢', title: '計算・シミュレーション',
    desc: '税金・ローン・年金計算',
    links: [{ label: '住宅ローン', href: '/finance/jutaku-loan' }, { label: 'NISA計算', href: '/finance/nisa-simulator' }, { label: '消費税', href: '/generator/tax-calculator' }],
  },
];
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
// Homepage structured data - Dynamic list of all tools
const availableTools = allTools.filter(t => t.available);
const homepageSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "山田ツール - 無料オンラインツール一覧",
  description: `日本国内サーバーで安全に使える${availableTools.length}種類の無料オンラインツール`,
  numberOfItems: availableTools.length,
  itemListElement: availableTools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tool.nameJa,
    description: tool.description,
    url: `https://yamada-tools.jp${tool.path}`
  }))
};




// Homepage SearchAction schema
const homepageSearchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "山田ツール - 無料オンラインツール",
  url: "https://yamada-tools.jp",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://yamada-tools.jp/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Homepage FAQ schema
const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "山田ツールは本当に無料ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、すべてのツールを完全無料でご利用いただけます。会員登録も不要です。一部の高度な機能はPROプランで提供していますが、基本機能はすべて無料です。"
      }
    },
    {
      "@type": "Question",
      name: "アップロードしたファイルの安全性は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ファイルは日本国内のサーバーでのみ処理され、SSL暗号化通信で保護されています。多くのツールはブラウザ内で処理されるためサーバーにファイルが送信されません。サーバー処理が必要なツールでも、処理完了後60分以内に自動削除されます。"
      }
    },
    {
      "@type": "Question",
      name: "スマホからも使えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、iPhone・Androidどちらからもすべてのツールをご利用いただけます。レスポンシブデザインでスマホに最適化されており、アプリのインストールも不要です。"
      }
    },
    {
      "@type": "Question",
      name: "会員登録は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "いいえ、会員登録なしですべてのツールをご利用いただけます。メールアドレスの入力も不要です。アクセスしてすぐにお使いいただけます。"
      }
    }
  ]
};

export default function Home() {
  const toolCount = getToolCount();

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSearchActionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }}
      />

    <div>
      <StickyTabBar />
      {/* Hero Section - REDESIGNED */}
      <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Main Headline - H1 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-kon">
            無料オンラインツール{toolCount.total}個｜PDF編集・画像変換・文書作成
          </h1>

          <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            日本国内サーバーで安全に処理。登録不要・完全無料。
          </p>

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
                className="rounded-full px-3 py-1 text-sm bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer dark:bg-slate-700 dark:text-gray-200 dark:border-slate-600 dark:hover:border-blue-400"
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

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium">
              🇯🇵 日本国内サーバー
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium">
              🔒 安全なSSL暗号化
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium">
              🗑️ 処理後自動削除
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium">
              ✨ 登録不要・完全無料
            </span>
          </div>
        </div>
      </section>
      {/* Recently Used Tools - Priority for returning users */}
      <RecentTools />

      {/* 🇯🇵 Japan-Exclusive Identity Section */}
      <section className="py-10 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-kon dark:text-blue-400 mb-2">🇯🇵 日本専用ツール</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">日本の法律・制度・書式に完全対応。海外ツールでは解決できない日本独自の課題に。</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/convert/bank-format" className="group bg-blue-50 dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-3xl mb-2">🏦</div>
              <p className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-blue-600">全銀フォーマット</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">日本の銀行振込専用</p>
            </Link>
            <Link href="/tax/furusato-nozei-calculator" className="group bg-green-50 dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-3xl mb-2">🎁</div>
              <p className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-green-600">ふるさと納税</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">控除上限額を即計算</p>
            </Link>
            <Link href="/career/income-wall-checker" className="group bg-amber-50 dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-3xl mb-2">🧱</div>
              <p className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-amber-600">年収の壁チェック</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">103万・130万の壁</p>
            </Link>
            <Link href="/generator/hanko" className="group bg-red-50 dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-3xl mb-2">🔴</div>
              <p className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-red-600">電子印鑑</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">日本式ハンコをPDFに</p>
            </Link>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {USE_CASES.map((uc) => (
              <div
                key={uc.title}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5"
              >
                <div className="text-3xl mb-2">{uc.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{uc.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{uc.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {uc.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 Popular Tools Section - Below Fold */}
      <section id="popular-tools" className="py-16 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-gray-800 dark:to-gray-900" style={{scrollMarginTop: "80px"}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔥 人気ツール - 今すぐ使う</h2>
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
                className="relative bg-white shadow-md hover:shadow-lg text-kon px-3 py-3 rounded-xl font-medium transition-all hover:-translate-y-0.5 text-center text-sm"
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
      {/* ⭐ NEW: Featured Tools Section */}
      {featuredTools.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-full mb-3">🆕 NEW</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">新しいツールが登場！</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">仕事がもっと楽になる、便利な新機能を追加しました</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {featuredTools.map((tool) => {
                const isExternal = tool.path.startsWith("http");
                const cardInner = (
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">{tool.nameJa}</h3>
                          {tool.isNew && <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">NEW</span>}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">✓ 無料</span>
                          {isExternal
                            ? <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full">🔍 SEOツール</span>
                            : <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">🔒 ブラウザ処理</span>
                          }
                        </div>
                      </div>
                      <span className="text-orange-400 group-hover:translate-x-1 transition-transform text-xl flex-shrink-0">→</span>
                    </div>
                  </div>
                );
                const cardClass = "group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400";
                return isExternal ? (
                  <a key={tool.id} href={tool.path} target="_blank" rel="noopener noreferrer" className={cardClass}>
                    {cardInner}
                  </a>
                ) : (
                  <Link key={tool.id} href={tool.path} className={cardClass}>
                    {cardInner}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 💰 Finance Tools Section */}
      <FinanceSection />

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
            <img
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
    </>
  );
}
