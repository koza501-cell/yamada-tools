import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "税金計算ツール【無料】所得税・消費税・ふるさと納税・相続税・贈与税",
  description: "所得税・消費税・ふるさと納税控除上限・相続税・贈与税を無料で計算。登録不要・日本国内サーバー処理・スマホ対応。",
  keywords: ["所得税 計算機", "ふるさと納税 計算", "消費税 計算", "相続税 計算", "贈与税 計算", "税金計算ツール 無料"],
  alternates: { canonical: "https://yamada-tools.jp/tax" },
  openGraph: {
    title: "税金計算ツール【無料】所得税・消費税・ふるさと納税・相続税・贈与税",
    description: "所得税・消費税・ふるさと納税控除上限・相続税・贈与税を無料で計算。登録不要・日本国内サーバー処理・スマホ対応。",
    url: "https://yamada-tools.jp/tax",
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
    { "@type": "ListItem", position: 2, name: "税金計算ツール", item: "https://yamada-tools.jp/tax" },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "税金計算ツール",
  description: "所得税・消費税・ふるさと納税・相続税・贈与税の無料計算ツール集",
  url: "https://yamada-tools.jp/tax",
  hasPart: [
    { "@type": "SoftwareApplication", name: "所得税計算機", url: "https://yamada-tools.jp/tax/income-tax-calculator" },
    { "@type": "SoftwareApplication", name: "消費税計算機", url: "https://yamada-tools.jp/tax/consumption-tax" },
    { "@type": "SoftwareApplication", name: "ふるさと納税計算機", url: "https://yamada-tools.jp/tax/furusato-nozei-calculator" },
    { "@type": "SoftwareApplication", name: "相続税計算機", url: "https://yamada-tools.jp/tax/inheritance-tax-calculator" },
    { "@type": "SoftwareApplication", name: "贈与税計算機", url: "https://yamada-tools.jp/tax/gift-tax-calculator" },
  ],
};

const taxTools = [
  { name: "所得税計算機", url: "/tax/income-tax-calculator", description: "給与・控除から所得税を自動計算。確定申告にも対応", icon: "💴" },
  { name: "消費税計算機", url: "/tax/consumption-tax", description: "税抜・税込価格の相互変換。8%軽減税率にも対応", icon: "🧾" },
  { name: "ふるさと納税計算機", url: "/tax/furusato-nozei-calculator", description: "年収から控除上限額を計算。お得な寄付額がわかる", icon: "🎁" },
  { name: "相続税計算機", url: "/tax/inheritance-tax-calculator", description: "相続財産・相続人から相続税額を試算", icon: "📜" },
  { name: "贈与税計算機", url: "/tax/gift-tax-calculator", description: "贈与額から贈与税を計算。暦年贈与・相続時精算課税対応", icon: "🎀" },
];

export default function TaxPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, collectionJsonLd]) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">税金計算ツール</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              所得税・消費税・ふるさと納税・相続税・贈与税を無料で計算。<br className="hidden md:block" />
              登録不要、日本国内サーバー処理。
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">無料で使える税金計算ツール一覧</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              日本の税制に完全対応した計算ツール。確定申告・節税対策にお役立てください。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {taxTools.map((tool) => (
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
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">yamada-tools.jpの税金計算ツールについて</h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>日本の税制に完全対応した無料ツールです。確定申告・節税対策・相続対策など、日常的な税務計算をシンプルにサポートします。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">確定申告を控えた方</h3>
                  <p className="text-sm">所得税・ふるさと納税の控除計算を事前に把握したい方。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">相続・贈与を検討中の方</h3>
                  <p className="text-sm">相続税・贈与税の目安を事前に把握したい方。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">ふるさと納税をお考えの方</h3>
                  <p className="text-sm">年収から控除上限額を正確に把握したい方。</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400"><time dateTime="2026-04-01">最終更新: 2026年4月</time></p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
