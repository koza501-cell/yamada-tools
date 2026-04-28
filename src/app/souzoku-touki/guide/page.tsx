import { Metadata } from "next";
import Link from "next/link";
import { GUIDE_ARTICLES } from "../data";

export const metadata: Metadata = {
  title: "相続登記ガイド記事【無料】基礎から申請手順まで",
  description: "相続登記の基礎知識・義務化・必要書類・申請の流れ・よくある失敗など6テーマのガイド記事を無料提供。初心者でもわかりやすく解説。",
  keywords: ["相続登記 手続き 流れ", "相続登記 必要書類", "相続登記 義務化"],
  alternates: { canonical: "https://yamada-tools.jp/souzoku-touki/guide" },
  openGraph: {
    title: "相続登記ガイド記事【無料】",
    description: "相続登記の基礎から申請手順まで6テーマのガイド記事を無料提供。",
    url: "https://yamada-tools.jp/souzoku-touki/guide",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-br from-kon to-ai text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-white/70 mb-2">
            <Link href="/souzoku-touki" className="hover:text-white">相続登記DIYガイド</Link> &rsaquo; ガイド記事
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">📖 相続登記ガイド</h1>
          <p className="text-gray-200 mt-2 text-sm">基礎知識から申請手順まで、わかりやすく解説します</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-4">
          {GUIDE_ARTICLES.map((article, i) => (
            <Link
              key={article.id}
              href={`/souzoku-touki/guide/${article.id}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{article.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500">記事 {i + 1}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">· 読了 {article.readTime}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-ai transition-colors mb-2">{article.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{article.description}</p>
                    <div className="mt-3">
                      <span className="text-sm text-ai font-medium group-hover:translate-x-1 transition-transform inline-block">読む →</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/souzoku-touki/wizard" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow text-center">
            <div className="text-2xl mb-1">🧭</div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">ケース診断ウィザード</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">自分のケースを判定</div>
          </Link>
          <Link href="/souzoku-touki/faq" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow text-center">
            <div className="text-2xl mb-1">❓</div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">よくある質問</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">30問以上のQ&A</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
