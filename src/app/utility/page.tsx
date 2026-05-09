import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "便利計算ツール【無料】年齢計算・日付計算・単位変換",
  description: "年齢・干支・星座の自動計算、日数計算・日付加算・曜日計算、坪・畳・尺など日本独自の単位変換に完全対応。日常業務や手続きで頻繁に使う計算をブラウザだけで瞬時に処理。登録不要・完全無料・スマホ対応。",
  keywords: ["年齢 計算", "日付 計算", "単位 変換", "坪 畳 変換", "曜日 計算"],
  alternates: { canonical: "https://yamada-tools.jp/utility" },
  openGraph: {
    title: "便利計算ツール【無料】年齢計算・日付計算・単位変換",
    description: "年齢・干支・星座の自動計算、日数計算・日付加算・曜日計算、坪・畳・尺など日本独自の単位変換に完全対応。日常業務や手続きで頻繁に使う計算をブラウザだけで瞬時に処理。登録不要・完全無料・スマホ対応。",
    url: "https://yamada-tools.jp/utility",
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
    { "@type": "ListItem", position: 2, name: "便利計算ツール", item: "https://yamada-tools.jp/utility" },
  ],
};

const utilityTools = [
  { name: "年齢計算機", url: "/utility/age-calculator", description: "生年月日から年齢・干支・星座を計算。任意の日付時点での年齢計算にも対応", icon: "🎂" },
  { name: "日付計算機", url: "/utility/date-calculator", description: "日数計算・日付加算・曜日計算に対応。営業日計算や納期管理に便利", icon: "📅" },
  { name: "単位変換ツール", url: "/utility/unit-converter", description: "坪・畳・尺・合・升など日本独自の単位に完全対応。長さ・面積・重さ・体積を変換", icon: "📐" },
];

export default function UtilityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">便利計算ツール</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              年齢計算・日付計算・単位変換などの日常便利ツール。<br className="hidden md:block" />
              登録不要、完全無料。
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">無料で使える便利計算ツール一覧</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              日常業務や手続き、書類作成で頻繁に使う計算を、ブラウザだけで瞬時に処理。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {utilityTools.map((tool) => (
                <Link
                  key={tool.url}
                  href={tool.url}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-ai transition-colors mb-2">{tool.name}</h2>
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
