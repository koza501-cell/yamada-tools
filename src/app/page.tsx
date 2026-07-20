import fs from 'fs';
import type { Metadata } from 'next';
import path from 'path';
import Image from "next/image";
import Link from "next/link";
import HeroAnimation from "@/components/common/HeroAnimation";
import RecentTools from "@/components/common/RecentTools";
import RoleQuickAccess from "@/components/common/RoleQuickAccess";
import StickyTabBar from "@/components/common/StickyTabBar";
import TabbedToolsSection from "@/components/common/TabbedToolsSection";
import StatsCounter from "@/components/common/StatsCounter";
import FooterCta from "@/components/common/FooterCta";
import NicheBentoSection from "@/components/home/NicheBentoSection";
import { buttonCls } from "@/components/ui/Button";
import Card, { cardCls } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Emoji from "@/components/ui/Emoji";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools, financeTools, careerTools, taxTools, realestateTools, businessTools, healthTools, foodTools, lifeTools, clinicTools, getToolCount, allTools, getNewTools} from "@/config/tools";

const popularTools = allTools.filter(t => t.isPopular && t.available);

export const metadata: Metadata = {
  title: '山田ツール | 日本国内サーバーの無料オンラインツール',
  alternates: {
    canonical: 'https://yamada-tools.jp/',
  },
};

export const revalidate = 3600;

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

  const _seenPaths = new Set<string>();
  const _seenNames = new Set<string>();
  const availableTools = allTools.filter(t => t.available).filter(tool => {
    if (_seenPaths.has(tool.path) || _seenNames.has(tool.nameJa)) return false;
    _seenPaths.add(tool.path);
    _seenNames.add(tool.nameJa);
    return true;
  });

  const availablePdfTools = pdfTools.filter(t => t.available);
  const availableDocTools = documentTools.filter(t => t.available);
  const availableConvertTools = convertTools.filter(t => t.available);
  const availableImageTools = imageTools.filter(t => t.available);
  const availableGenTools = generatorTools.filter(t => t.available);
  const availableFinanceTools = financeTools.filter(t => t.available);
  const availableHealthTools = healthTools.filter(t => t.available);
  const availableFoodTools = foodTools.filter(t => t.available);
  const availableLifeTools = lifeTools.filter(t => t.available);

  const featuredTools = allTools.filter(t => t.isFeatured && t.available);
  const topToolPath = popularTools[0]?.path ?? "/pdf/compress";

  return (
    <div>
      <StickyTabBar />

      {/* ============================================================ */}
      {/* SECTION 1: Hero                                              */}
      {/* ============================================================ */}
      <section className="bg-white dark:bg-gray-900 py-sectionLg">
        <div className="max-w-4xl mx-auto px-4 text-center">

          {/* Media row — grayscale press badge */}
          <div className="flex justify-center mb-8">
            <a
              href="https://forest.watch.impress.co.jp/docs/digest/2077518.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600 transition-colors grayscale hover:grayscale-0"
            >
              <span className="font-semibold">窓の杜</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span>掲載 2026.01.13</span>
            </a>
          </div>

          {/* H1 — 2 lines, no emoji */}
          <h1 className="text-3xl sm:text-4xl md:text-display font-extrabold tracking-tight text-gray-900 dark:text-white text-center mb-4">
            面倒な事務作業、ここで片づく。<br />
            国内サーバーの無料ツール{availableTools.length}種
          </h1>

          {/* Subheadline */}
          <p className="text-lead text-neutral-600 dark:text-gray-400 max-w-[640px] mx-auto mb-8">
            登録は不要。国内サーバーで安全に処理するので、そのまま安心してお使いいただけます。
          </p>

          {/* 2 CTAs */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <Link href={topToolPath} className={buttonCls('primary', 'lg')}>
              人気ツールを試す →
            </Link>
            <Link href="#tools-tabs" className={buttonCls('secondary', 'lg')}>
              すべてのツールを見る
            </Link>
          </div>

          {/* Trust strip — inline, no pill backgrounds */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-12">
            <span className="flex items-center gap-1.5">
              <Emoji symbol="🇯🇵" size="sm" label="日本国内" />
              日本国内サーバー
            </span>
            <span className="text-gray-300 dark:text-gray-600 hidden sm:inline" aria-hidden="true">|</span>
            <span className="flex items-center gap-1.5">
              <Emoji symbol="🔒" size="sm" label="SSL暗号化" />
              SSL暗号化
            </span>
            <span className="text-gray-300 dark:text-gray-600 hidden sm:inline" aria-hidden="true">|</span>
            <span className="flex items-center gap-1.5">
              <Emoji symbol="🗑️" size="sm" label="自動削除" />
              60分で自動削除
            </span>
            <span className="text-gray-300 dark:text-gray-600 hidden sm:inline" aria-hidden="true">|</span>
            <span>登録不要・完全無料</span>
          </div>

          {/* 6-tile popular tools grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {popularTools.slice(0, 6).map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className={`${cardCls('default')} p-5 text-center hover:border-sakura dark:hover:border-sakura`}
              >
                <div className="mb-3">
                  <Emoji symbol={tool.icon} size="lg" label={tool.nameJa} />
                </div>
                <h3 className="font-bold text-base text-kon dark:text-gray-200 mb-1">{tool.nameJa}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{tool.description}</p>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* ご利用の流れ (3-step diagram, below fold)                    */}
      {/* ============================================================ */}
      <section className="py-section bg-gray-50 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-h2 font-bold text-gray-900 dark:text-white mb-8">ご利用の流れ</h2>
          <HeroAnimation />
        </div>
      </section>

      {/* ============================================================ */}
      {/* IDENTITY TIER: 役割別ナビゲーション                          */}
      {/* ============================================================ */}
      <section id="tools" className="py-section bg-white dark:bg-gray-900" style={{scrollMarginTop: "80px"}}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-kon dark:text-white mb-2">お仕事別に探す</h2>
            <p className="text-sm text-sumi dark:text-gray-400">お仕事や立場ごとに、よく使うツールをまとめました。ここから探せます。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { slug: 'keieisha', name: '中小企業の経営者', desc: '法人検索・補助金・給与・請求書', href: '/business' },
              { slug: 'freelance', name: '個人事業主・フリーランス', desc: '確定申告・インボイス・節税', href: '/tax/income-tax-calculator' },
              { slug: 'clinic', name: 'クリニック・士業', desc: '開業・経営・労務・医療報酬', href: '/clinic' },
              { slug: 'fudousan', name: '不動産・建設関係者', desc: '物件調査・経審・収益計算', href: '/realestate/yoto-chiiki-checker' },
              { slug: 'inshoku', name: '飲食店経営者', desc: '原価率・栄養・補助金', href: '/business/hojokin-active' },
              { slug: 'kazoku', name: '家族の生活・将来設計', desc: '家計・住宅・教育・相続', href: '/realestate/rent-vs-buy' },
            ].map(r => (
              <Link key={r.slug} href={r.href}
                className={`${cardCls('default')} p-5 group hover:border-ai dark:hover:border-ai`}>
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
      {/* SECTION 5: Popular Tools                                     */}
      {/* ============================================================ */}
      <section id="popular-tools" className="py-section bg-gray-50 dark:bg-gray-900" style={{scrollMarginTop: "120px"}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">人気ツール - 今すぐ使う</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">たくさんの方に使われている定番ツールです</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {popularTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className={`${cardCls('default')} text-kon dark:text-gray-200 px-3 py-3 font-medium text-sm min-h-[44px] flex items-center justify-center gap-1`}
              >
                <Emoji symbol={tool.icon} size="sm" label={tool.nameJa} />
                <span>{tool.nameJa}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6: New Tools + Finance Tools (merged)                */}
      {/* ============================================================ */}
      <section className="py-section bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          {getNewTools().filter(t => t.category !== "finance").slice(0, 8).length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-block px-3 py-1 bg-kon text-white text-sm font-bold rounded-full">新ツール</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">新しいツールが仲間入り</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                {getNewTools().filter(t => t.category !== "finance").slice(0, 8).map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className={`${cardCls('default')} group overflow-hidden hover:border-ai p-5`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Emoji symbol={tool.icon} size="xl" label={tool.nameJa} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-ai transition-colors">{tool.nameJa}</h3>
                          {tool.isNew && <Badge variant="new">NEW</Badge>}
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="inline-block px-3 py-1 bg-kon text-white text-sm font-bold rounded-full">金融</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">金融・資産運用ツール</h2>
              </div>
              <Link href="/finance" className="text-sm text-kon dark:text-gray-300 hover:underline">すべて見る →</Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">NISAから住宅ローン、老後資金まで。登録なしで、無料で精度の高いシミュレーションができます。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableFinanceTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className={`${cardCls('default')} group overflow-hidden p-5`}
                >
                  <div className="flex items-start gap-4">
                    <Emoji symbol={tool.icon} size="xl" className="flex-shrink-0" label={tool.nameJa} />
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
          <section className="py-section bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span><Emoji symbol="📝" size="lg" label="ブログ" /></span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">最新ブログ</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  PDF活用術から業務効率化のコツまで、実務で役立つ話をお届けします
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {recentBlogs.map((post: any) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className={`${cardCls('default')} overflow-hidden group`}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-slate-900 to-kon">
                      {post.featuredImage && (
                        <Image src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" width={400} height={192} />
                      )}
                      {isNewBlog(post.publishDate) && (
                        <Badge variant="new" className="absolute top-4 right-4">NEW</Badge>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="neutral">{post.category}</Badge>
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
                <Link href="/blog" className={buttonCls('primary', 'md')}>
                  すべてのブログを見る
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ============================================================ */}
      {/* SECTION 9: Trust + Media Coverage                            */}
      {/* ============================================================ */}
      <section className="py-section bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span><Emoji symbol="📰" size="lg" label="メディア" /></span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">メディア掲載実績・信頼の数字</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            日本最大級のソフトウェアレビューサイト「窓の杜」に掲載されました
          </p>

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
            <Card noHover className="px-6 py-3">
              <span className="font-bold text-kon dark:text-gray-300">
                <Emoji symbol="🏢" size="sm" label="法人" /> 法人利用実績
              </span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">500社以上</span>
            </Card>
            <Card noHover className="px-6 py-3">
              <span className="font-bold text-kon dark:text-gray-300">
                <Emoji symbol="📅" size="sm" label="窓の杜" /> 窓の杜掲載
              </span>
              <span className="text-gray-600 dark:text-gray-300 ml-2">2026年1月13日</span>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 10: Corporate B2B CTA                                */}
      {/* ============================================================ */}
      <section className="py-section bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Emoji symbol="🏢" size="xl" label="法人" />
                <span className="text-white font-bold text-lg">法人・企業様向け</span>
              </div>
              <p className="text-gray-300 text-sm">
                情報システム部門も安心してご利用いただけます。<br className="hidden md:block" />
                日本国内サーバー完結・60分自動削除・SSL暗号化
              </p>
            </div>
            <Link
              href="/about/business"
              className="inline-flex items-center gap-2 bg-white text-slate-800 px-6 py-3 rounded-btn font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              詳しく見る
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 11: FAQ                                              */}
      {/* ============================================================ */}
      <section className="py-section bg-white dark:bg-gray-900" id="faq">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span><Emoji symbol="❓" size="lg" label="よくある質問" /></span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">よくある質問</h2>
          </div>
          <div className="space-y-3">
            {([
              {
                q: "山田ツールは本当に無料ですか？",
                a: "はい、基本機能はすべて無料で、会員登録もいりません。より高度な機能だけPROプランでご用意していますが、ふだんの作業は無料のままで十分お使いいただけます。",
              },
              {
                q: "何種類のツールが使えますか？",
                a: `現在${toolCount}種類の無料ツールがあります。PDF・書類・画像・税務・金融など、日本のビジネス向けカテゴリを揃えています。`,
              },
              {
                q: "アップロードしたファイルの安全性は？",
                a: "ファイルは日本国内のサーバーでのみ処理され、SSL暗号化通信で保護されています。多くのツールはブラウザ内で処理されるためサーバーにファイルが送信されません。サーバー処理が必要なツールでも、処理完了後60分以内に自動削除されます。",
              },
              {
                q: "スマホからも使えますか？",
                a: "はい、iPhone・Androidどちらでも動きます。レスポンシブデザインでスマホに最適化されており、アプリのインストールも不要です。",
              },
              {
                q: "会員登録は必要ですか？",
                a: "いいえ、会員登録なしですべてのツールを使えます。メールアドレスの入力も不要で、アクセスしてすぐに始められます。",
              },
              {
                q: "どのブラウザで使えますか？",
                a: "Chrome・Firefox・Safari・Edgeなどのモダンブラウザに対応しています。Internet Explorer は非対応です。最新バージョンのブラウザでご利用いただくことを推奨します。",
              },
              {
                q: "法人・企業でも利用できますか？",
                a: "はい、法人でも個人事業主でも使えます。請求書作成・全銀フォーマット変換・給与明細作成など、業務で役立つツールを多数揃えています。セキュリティ基準についてはお問い合わせページをご覧ください。",
              },
            ] as { q: string; a: string }[]).map(({ q, a }, i) => (
              <Card key={i} noHover className="overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none gap-4">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{q}</span>
                    <span className="flex-shrink-0 text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform duration-200" aria-hidden="true">▾</span>
                  </summary>
                  <div className="px-5 pb-5 pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700">
                    {a}
                  </div>
                </details>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 12: FooterCta                                        */}
      {/* ============================================================ */}
      <FooterCta />
    </div>
  );
}
