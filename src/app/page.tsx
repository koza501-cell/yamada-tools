import fs from 'fs';
import path from 'path';
import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools, getToolCount } from "@/config/tools";

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
  
  // Filter only available tools
  const availablePdfTools = pdfTools.filter(t => t.available);
  const availableDocTools = documentTools.filter(t => t.available);
  const availableConvertTools = convertTools.filter(t => t.available);
  const availableImageTools = imageTools.filter(t => t.available);
  const availableGenTools = generatorTools.filter(t => t.available);
  
  return (
    <div>
      {/* Hero Section - UPDATED */}
      <section className="bg-gradient-to-br from-kon to-ai text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Main Headline - Emphasizes Domestic Server */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            海外サーバーを使わない<br />
            <span className="text-sakura">日本国内完結</span>のツール
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
              🇯🇵 日本国内サーバー
            </span>
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
              🔒 SSL暗号化
            </span>
            <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
              🗑️ 自動削除
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
        </div>
      </section>

      {/* Section 1: PDF Tools */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-kon">📄 PDFツール</h2>
            <Link href="/pdf" className="text-kon hover:underline text-sm">
              すべて見る →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {availablePdfTools.slice(0, 10).map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-2xl mb-2">{tool.icon}</div>
                <h3 className="font-bold text-sm text-kon">{tool.nameJa}</h3>
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
              <h2 className="text-xl font-bold text-kon">📝 書類作成</h2>
              <Link href="/document" className="text-kon hover:underline text-sm">
                すべて見る →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {availableDocTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-sm text-kon">{tool.nameJa}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Converters - ONLY AVAILABLE */}
      {availableConvertTools.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-kon">🔄 変換ツール</h2>
              <Link href="/convert" className="text-kon hover:underline text-sm">
                すべて見る →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {availableConvertTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-sm text-kon">{tool.nameJa}</h3>
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
              <h2 className="text-xl font-bold text-kon">🖼️ 画像ツール</h2>
              <Link href="/image" className="text-kon hover:underline text-sm">
                すべて見る →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {availableImageTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-sm text-kon">{tool.nameJa}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Generators - ONLY AVAILABLE */}
      {availableGenTools.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-kon">⚡ 計算・生成ツール</h2>
              <Link href="/generator" className="text-kon hover:underline text-sm">
                すべて見る →
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {availableGenTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-sm text-kon">{tool.nameJa}</h3>
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
        const recentBlogs = dynamicBlogs.slice(0, 3);
        
        if (recentBlogs.length === 0) return null;
        
        return (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  📝 最新ブログ
                </h2>
                <p className="text-gray-600">
                  PDFツールの活用方法やビジネス効率化のヒントをお届けします
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {recentBlogs.map((post: any) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
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
                        <span className="text-sm text-gray-500">{post.readTime}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{post.publishDate}</span>
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
  );
}
