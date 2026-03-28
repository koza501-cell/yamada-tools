import fs from 'fs';
import path from 'path';
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";
import HeroAnimation from "@/components/common/HeroAnimation";
import TypingText from "@/components/common/TypingText";
import RecentTools from "@/components/common/RecentTools";
import NewsletterSignup from "@/components/common/NewsletterSignup";
import AdSlot from "@/components/AdSlot";
import StatsCounter from "@/components/common/StatsCounter";
import FooterCta from "@/components/common/FooterCta";
import { ScrollRevealGrid } from "@/components/common/ScrollRevealGrid";
import FinanceSection from "@/components/FinanceSection";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools, getToolCount, allTools } from "@/config/tools";

// High-traffic tool paths that get 🔥 badge
const HOT_PATHS = new Set(['/generator/envelope-print', '/convert/bank-format', '/pdf/compress']);

// Feature H: Search suggestion chips
const SEARCH_CHIPS = [
  { label: 'PDF圧縮', href: '/pdf/compress' },
  { label: '請求書作成', href: '/document/invoice' },
  { label: '画像変換', href: '/image/convert' },
  { label: '封筒印刷', href: '/generator/envelope-print' },
  { label: '全銀変換', href: '/convert/bank-format' },
  { label: '縦書き', href: '/document/vertical-text' },
];

// Feature I: Use case cards
const USE_CASES = [
  {
    icon: '📄', title: '書類を作りたい',
    desc: '請求書・見積書・納品書をPDFで作成',
    links: [{ label: '請求書', href: '/document/invoice' }, { label: '見積書', href: '/document/estimate' }, { label: '送付状', href: '/document/cover-letter' }],
  },
  {
    icon: '✉️', title: '郵便物を送りたい',
    desc: '封筒の宛名印刷・名刺・はがき',
    links: [{ label: '封筒印刷', href: '/generator/envelope-print' }, { label: '名刺作成', href: '/generator/business-card' }, { label: '縦書き', href: '/document/vertical-text' }],
  },
  {
    icon: '📊', title: 'PDFを編集',
    desc: '圧縮・結合・分割・回転',
    links: [{ label: 'PDF圧縮', href: '/pdf/compress' }, { label: 'PDF結合', href: '/pdf/merge' }, { label: 'PDF分割', href: '/pdf/split' }],
  },
  {
    icon: '🏦', title: '経理・振込',
    desc: '全銀フォーマット・請求書・領収書',
    links: [{ label: '全銀変換', href: '/convert/bank-format' }, { label: '請求書', href: '/document/invoice' }, { label: '領収書', href: '/document/receipt' }],
  },
  {
    icon: '🖼️', title: '画像加工',
    desc: '圧縮・変換・リサイズ',
    links: [{ label: '画像圧縮', href: '/image/compress' }, { label: '画像変換', href: '/image/convert' }, { label: 'リサイズ', href: '/image/resize' }],
  },
  {
    icon: '✍️', title: '文書作成',
    desc: '縦書き・ビジネスメール',
    links: [{ label: '縦書き', href: '/document/vertical-text' }, { label: 'ビジネスメール', href: '/document/business-email' }],
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

          {/* Trust Badges - Reduced to 3 */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium">
              🇯🇵 日本国内サーバー
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium">
              🔒 安全なSSL暗号化
            </span>
            <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium">
              ✨ 登録不要・完全無料
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-kon dark:text-blue-400 mb-8">✨ 3ステップで簡単</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
            <div className="flex flex-col items-center text-center w-44">
              <div className="text-4xl mb-2">🔍</div>
              <p className="font-bold text-gray-800 dark:text-gray-100">ツールを選ぶ</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">89種類から目的に合ったツールを選択</p>
            </div>
            <div className="hidden md:block w-16 border-t-2 border-dashed border-gray-300 dark:border-gray-600 mb-6" />
            <div className="flex flex-col items-center text-center w-44">
              <div className="text-4xl mb-2">⚡</div>
              <p className="font-bold text-gray-800 dark:text-gray-100">データを入力</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ファイルをアップロードまたは直接入力</p>
            </div>
            <div className="hidden md:block w-16 border-t-2 border-dashed border-gray-300 dark:border-gray-600 mb-6" />
            <div className="flex flex-col items-center text-center w-44">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-bold text-gray-800 dark:text-gray-100">完成・ダウンロード</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">処理完了後すぐにダウンロード可能</p>
            </div>
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

      {/* Testimonials */}
      <section className="py-10 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-kon dark:text-blue-400 text-center mb-8">💬 ユーザーの声</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <p className="text-gray-700 dark:text-gray-200 mb-4">"毎月の給与振込データ作成が10分で終わるようになりました。"</p>
              <div className="text-yellow-400 text-sm mb-1">⭐⭐⭐⭐⭐</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">経理担当 A.S.さん</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <p className="text-gray-700 dark:text-gray-200 mb-4">"封筒の宛名印刷がブラウザだけでできて助かります。"</p>
              <div className="text-yellow-400 text-sm mb-1">⭐⭐⭐⭐⭐</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">総務部 M.T.さん</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <p className="text-gray-700 dark:text-gray-200 mb-4">"式辞の縦書き変換がPDF出力できるのが便利です。"</p>
              <div className="text-yellow-400 text-sm mb-1">⭐⭐⭐⭐⭐</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">教職員 K.N.さん</p>
            </div>
          </div>
        </div>
      </section>

{/* Ad Slot - Desktop Only */}      <div className="hidden md:block">        <AdSlot format="leaderboard" className="my-8" />      </div>
      {/* 🔥 Popular Tools Section - Below Fold */}
      <section id="popular-tools" className="py-16 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
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
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">NEW</span>
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

      {/* Recently Used Tools */}
      <RecentTools />

      {/* Media Feature Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <a href="https://forest.watch.impress.co.jp/docs/digest/2077518.html" target="_blank" rel="noopener noreferrer" className="block">
            <img
              src="https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/mado-no-mori-banner.webp"
              alt="窓の杜にて紹介されました - 2026年1月13日掲載"
              className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              width={896}
              height={200}
            />
          </a>
        </div>
      </section>

      {/* Section 1: PDF Tools */}
      <section className="py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-kon dark:text-blue-400">📄 PDFツール</h2>
            <Link href="/pdf" className="text-kon hover:text-ai transition-colors duration-200 text-sm">
              すべて見る →
            </Link>
          </div>

          <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
            {availablePdfTools.slice(0, 8).map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center"
              >
                {tool.isNew && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                )}
                <div className="text-2xl mb-2">{tool.icon}</div>
                <h3 className="font-bold text-base text-kon dark:text-blue-400 leading-tight">{tool.nameJa}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-normal">{tool.description}</p>
              </Link>
            ))}
          </ScrollRevealGrid>
        </div>
      </section>

      {/* Section 2: Document Creation - ONLY AVAILABLE */}
      {availableDocTools.length > 0 && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-kon dark:text-blue-400">📝 書類作成</h2>
              <Link href="/document" className="text-kon hover:text-ai transition-colors duration-200 text-sm">
                すべて見る →
              </Link>
            </div>

            <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
              {availableDocTools.slice(0, 8).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center"
                >
                  {tool.isNew && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                  )}
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-base text-kon dark:text-blue-400 leading-tight">{tool.nameJa}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-normal">{tool.description}</p>
                </Link>
              ))}
            </ScrollRevealGrid>
          </div>
        </section>
      )}

      {/* Section 3: Converters - ONLY AVAILABLE */}
      {availableConvertTools.length > 0 && (
        <section className="py-10 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-kon dark:text-blue-400">🔄 変換ツール</h2>
              <Link href="/convert" className="text-kon hover:text-ai transition-colors duration-200 text-sm">
                すべて見る →
              </Link>
            </div>

            <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
              {availableConvertTools.slice(0, 8).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center"
                >
                  {tool.isNew && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                  )}
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-base text-kon dark:text-blue-400 leading-tight">{tool.nameJa}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-normal">{tool.description}</p>
                </Link>
              ))}
            </ScrollRevealGrid>
          </div>
        </section>
      )}

      {/* Section 4: Image Tools - ONLY AVAILABLE */}
      {availableImageTools.length > 0 && (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-kon dark:text-blue-400">🖼️ 画像ツール</h2>
              <Link href="/image" className="text-kon hover:text-ai transition-colors duration-200 text-sm">
                すべて見る →
              </Link>
            </div>

            <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
              {availableImageTools.slice(0, 8).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center"
                >
                  {tool.isNew && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                  )}
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-base text-kon dark:text-blue-400">{tool.nameJa}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
                </Link>
              ))}
            </ScrollRevealGrid>
          </div>
        </section>
      )}

      {/* Section 5: Generators - ONLY AVAILABLE */}
      {availableGenTools.length > 0 && (
        <section className="py-10 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-kon dark:text-blue-400">⚡ 計算・生成ツール</h2>
              <Link href="/generator" className="text-kon hover:text-ai transition-colors duration-200 text-sm">
                すべて見る →
              </Link>
            </div>

            <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
              {availableGenTools.slice(0, 8).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center"
                >
                  {tool.isNew && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                  )}
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-base text-kon dark:text-blue-400 leading-tight">{tool.nameJa}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-normal">{tool.description}</p>
                </Link>
              ))}
            </ScrollRevealGrid>
          </div>
        </section>
      )}

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
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
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
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{post.readTime}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-3 mb-4">
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



      {/* Newsletter Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-2xl mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              💬 ユーザーの声
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              実際にご利用いただいているお客様からの声をご紹介します
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-1 mb-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                「取引先への見積書が25MBもあって、メールで送れず困っていました。山田ツールで圧縮したら3MBに！しかも画質は全く落ちていない。本当に助かりました。」
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl">👨‍💼</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">田中 健太</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">営業部 / 製造業</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-1 mb-4">
                <span className="text-yellow-400">★★★★</span><span className="text-gray-300">★</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                「経理担当として毎月大量の請求書を作成しています。山田ツールは登録不要で、すぐに使えるのが嬉しい。国内サーバーという安心感も決め手でした。欲を言えばダークモードがあると夜の作業が楽になるかも。」
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center text-xl">👩‍💻</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">佐藤 美咲</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">経理担当 / IT企業</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-1 mb-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                「フリーランスで仕事をしていますが、クライアントごとに契約書のPDFを結合する作業が多くて。山田ツールはドラッグ&ドロップだけで完了するので、作業時間が半分以下になりました。」
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xl">👨‍🎨</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">山本 大輝</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">フリーランス / デザイナー</p>
                </div>
              </div>
            </div>
          </div>
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
