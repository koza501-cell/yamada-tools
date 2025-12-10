import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '会社概要 | 山田ツール',
  description: '山田ツールを運営する合同会社山田トレードについて。日本国内に完結した安全なオンラインツールを提供します。',
};

export default function AboutCompanyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-kon to-kon/90 text-white rounded-2xl p-10 mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">🏢 会社概要</h1>
          <p className="text-xl text-gray-200">山田ツールについて</p>
        </div>

        {/* Mission */}
        <section className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-kon mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>私たちのミッション</span>
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            山田ツールは、<strong className="text-kon">日本のビジネスパーソン、フリーランサー、学生の皆様</strong>が
            日々直面する小さな課題を解決するため、71種類以上の無料オンラインツールを提供しています。
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            「ちょっとしたツールが必要な時、すぐに、無料で、安全に使える」<br />
            そんな当たり前を実現することが、私たちの使命です。
          </p>
        </section>

        {/* Company Info */}
        <section className="bg-white rounded-xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-kon mb-6 flex items-center gap-2">
            <span>📋</span>
            <span>会社情報</span>
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
              <div className="font-medium text-gray-600">会社名</div>
              <div className="md:col-span-2 text-gray-800">
                合同会社山田トレード<br />
                <span className="text-sm text-gray-500">Yamada Trade LLC</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
              <div className="font-medium text-gray-600">所在地</div>
              <div className="md:col-span-2 text-gray-800">
                〒283-0811<br />千葉県東金市台方937番地13
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
              <div className="font-medium text-gray-600">設立</div>
              <div className="md:col-span-2 text-gray-800">2025年</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
              <div className="font-medium text-gray-600">事業内容</div>
              <div className="md:col-span-2 text-gray-800">
                オンラインツールサービスの開発・運営<br />
                ウェブアプリケーションの企画・開発
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="font-medium text-gray-600">お問い合わせ</div>
              <div className="md:col-span-2 text-gray-800">
                <a href="mailto:support@yamada-tools.jp" className="text-sakura hover:underline">
                  support@yamada-tools.jp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-kon to-kon/90 text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">今すぐ無料で使ってみよう</h3>
          <p className="text-gray-200 mb-6">登録不要・完全無料</p>
          <Link
            href="/"
            className="inline-block bg-sakura text-white px-8 py-3 rounded-full font-medium hover:bg-sakura/90 transition-colors"
          >
            ツール一覧を見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
