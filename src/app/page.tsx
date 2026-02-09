import fs from 'fs';
import path from 'path';
import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";
import RecentTools from "@/components/common/RecentTools";
import NewsletterSignup from "@/components/common/NewsletterSignup";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools, getToolCount, allTools } from "@/config/tools";
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


// Homepage structured data
const homepageSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "山田ツール - 無料オンラインツール一覧",
  description: "日本国内サーバーで安全に使える70種類の無料オンラインツール",
  numberOfItems: 5,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "PDFツール",
      description: "PDF結合、圧縮、分割、変換など20種類のPDFツール",
      url: "https://yamada-tools.jp/pdf"
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "書類作成",
      description: "請求書、見積書、履歴書など10種類の書類作成ツール",
      url: "https://yamada-tools.jp/document"
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "変換ツール",
      description: "全角半角変換、和暦西暦変換など9種類の変換ツール",
      url: "https://yamada-tools.jp/convert"
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "画像ツール",
      description: "画像圧縮、リサイズ、形式変換など6種類の画像ツール",
      url: "https://yamada-tools.jp/image"
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "計算・生成ツール",
      description: "パスワード生成、消費税計算など20種類の計算・生成ツール",
      url: "https://yamada-tools.jp/generator"
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
    <div>
      {/* Hero Section - UPDATED */}
      <section className="bg-gradient-to-br from-kon to-ai text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Main Headline - Emphasizes Domestic Server */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            無料オンラインツール{toolCount.total}個<br />
            <span className="text-sakura">日本国内サーバー</span>で安全処理
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            大切なファイルは日本国内サーバーで安全に処理。<br className="hidden md:block" />
            登録不要・完全無料の{toolCount.total}のオンラインツール
          </p>

          {/* Search Bar - NEW */}
          <div className="mb-8 flex justify-center">
            <SearchBar />
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
              🏢 2024年設立
            </span>
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
              🇯🇵 日本国内サーバー
            </span>
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
              🔒 SSL暗号化
            </span>
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
              🗑️ 60分で自動削除
            </span>
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
              ✨ 登録不要・完全無料
            </span>
          </div>

          {/* 5 Category Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/pdf"
              className="bg-white text-kon px-6 py-3 rounded-xl font-bold hover:bg-sakura hover:text-white transition-colors"
            >
              📄 PDFツール ({availablePdfTools.length})
            </Link>
            <Link
              href="/document"
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors"
            >
              📝 書類作成 ({availableDocTools.length})
            </Link>
            <Link
              href="/convert"
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors"
            >
              🔄 変換ツール ({availableConvertTools.length})
            </Link>
            <Link
              href="/image"
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors"
            >
              🖼️ 画像ツール ({availableImageTools.length})
            </Link>
            <Link
              href="/generator"
              className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors"
            >
              ⚡ 計算・生成 ({availableGenTools.length})
            </Link>
          </div>

          {/* 🔥 Popular Tools - Quick Actions */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-sm text-gray-300 mb-4">🔥 人気ツール - 今すぐ使う</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/pdf/compress" className="bg-sakura/90 hover:bg-sakura text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                📄 PDF圧縮
              </Link>
              <Link href="/pdf/merge" className="bg-sakura/90 hover:bg-sakura text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                📑 PDF結合
              </Link>
              <Link href="/image/compress" className="bg-sakura/90 hover:bg-sakura text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                🖼️ 画像圧縮
              </Link>
              <Link href="/convert/furigana" className="bg-sakura/90 hover:bg-sakura text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                あ ふりがな
              </Link>
              <Link href="/document/invoice" className="bg-sakura/90 hover:bg-sakura text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                📋 請求書作成
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ NEW: Featured Tools Section */}
      {featuredTools.length > 0 && (
        <section className="py-10 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-full mb-3">🆕 NEW</span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">新しいツールが登場！</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">仕事がもっと楽になる、便利な新機能を追加しました</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400"
                >
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
                          <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">🔒 ブラウザ処理</span>
                        </div>
                      </div>
                      <span className="text-orange-400 group-hover:translate-x-1 transition-transform text-xl flex-shrink-0">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Used Tools */}
      <RecentTools />

      {/* Media Feature Banner */}
      <section className="py-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <a href="https://forest.watch.impress.co.jp/docs/digest/2077518.html" target="_blank" rel="noopener noreferrer" className="block">
            <img
              src="https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/mado-no-mori-banner.webp"
              alt="窓の杜にて紹介されました - 2026年1月13日掲載"
              className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            />
          </a>
        </div>
      </section>

      {/* Section 1: PDF Tools */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-kon dark:text-blue-400">📄 PDFツール</h2>
            <Link href="/pdf" className="text-kon hover:underline text-sm">
              すべて見る →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {availablePdfTools.slice(0, 10).map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                {tool.isNew && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                )}
                <div className="text-2xl mb-2">{tool.icon}</div>
                <h3 className="font-bold text-sm text-kon dark:text-blue-400">{tool.nameJa}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Document Creation - ONLY AVAILABLE */}
      {availableDocTools.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-kon dark:text-blue-400">📝 書類作成</h2>
              <Link href="/document" className="text-kon hover:underline text-sm">
                すべて見る →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {availableDocTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  {tool.isNew && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                  )}
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-sm text-kon dark:text-blue-400">{tool.nameJa}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Converters - ONLY AVAILABLE */}
      {availableConvertTools.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-kon dark:text-blue-400">🔄 変換ツール</h2>
              <Link href="/convert" className="text-kon hover:underline text-sm">
                すべて見る →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {availableConvertTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  {tool.isNew && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                  )}
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-sm text-kon dark:text-blue-400">{tool.nameJa}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Image Tools - ONLY AVAILABLE */}
      {availableImageTools.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-kon dark:text-blue-400">🖼️ 画像ツール</h2>
              <Link href="/image" className="text-kon hover:underline text-sm">
                すべて見る →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {availableImageTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  {tool.isNew && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                  )}
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-sm text-kon dark:text-blue-400">{tool.nameJa}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Generators - ONLY AVAILABLE */}
      {availableGenTools.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-kon dark:text-blue-400">⚡ 計算・生成ツール</h2>
              <Link href="/generator" className="text-kon hover:underline text-sm">
                すべて見る →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {availableGenTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  {tool.isNew && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">NEW</span>
                  )}
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-sm text-kon dark:text-blue-400">{tool.nameJa}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-kon text-center mb-10">
            選ばれる理由
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🇯🇵</div>
              <h3 className="font-bold text-lg mb-2">日本国内サーバー</h3>
              <p className="text-gray-600 text-sm">
                大切なファイルは海外に送りたくない。
                当サービスは日本国内のサーバーで運用しています。
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-lg mb-2">高速処理</h3>
              <p className="text-gray-600 text-sm">
                最新のサーバー環境で、大容量ファイルも素早く処理。
                お待たせしません。
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-bold text-lg mb-2">プライバシー重視</h3>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
                        <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />
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
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-2xl mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
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
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                「経理担当として毎月大量の請求書を作成しています。以前は別のソフトを使っていましたが、山田ツールは登録不要で、すぐに使えるのが嬉しい。国内サーバーという安心感も決め手でした。」
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
      <section className="py-12 bg-gradient-to-r from-slate-800 to-slate-900">
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

      {/* CTA Section */}
      <section className="py-12 bg-sakura/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-kon mb-4">
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
