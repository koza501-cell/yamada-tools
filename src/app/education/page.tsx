import { Metadata } from "next";
import Link from "next/link";
import { educationTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "教育費シミュレーター【無料】塾代・学費・偏差値・資格ROI計算",
  description: "幼稚園から大学までの教育費総額、塾代の比較、偏差値の計算、資格取得の費用対効果を無料で算出。公立・私立の選択別比較、学資保険vsNISA比較も対応。子育て家庭の教育費計画を支援する完全無料ツール集。",
  keywords: ["教育費 シミュレーター", "塾代 計算", "偏差値 計算", "資格 ROI", "学費 比較"],
  alternates: { canonical: "https://yamada-tools.jp/education" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "教育費シミュレーター【無料】塾代・学費・偏差値・資格ROI計算",
    description: "幼稚園から大学までの教育費総額、塾代の比較、偏差値の計算、資格取得の費用対効果を無料で算出。公立・私立の選択別比較、学資保険vsNISA比較も対応。子育て家庭の教育費計画を支援する完全無料ツール集。",
    url: "https://yamada-tools.jp/education",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
    { "@type": "ListItem", position: 2, name: "教育費シミュレーター", item: "https://yamada-tools.jp/education" },
  ],
};


export default function EducationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">教育費シミュレーター</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              教育費・塾代・偏差値・資格ROIをかんたんシミュレーション。<br className="hidden md:block" />
              登録不要、完全無料。
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">無料で使える教育費ツール一覧</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              子育て・進学・キャリアアップに。教育投資の意思決定を支援する正確な計算ツール。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educationTools.filter((t) => t.available).map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-ai transition-colors mb-2">{tool.nameJa}</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                        <div className="mt-4">
                          <span className="text-sm text-ai font-medium group-hover:translate-x-1 transition-transform inline-block">ツールを使う →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
