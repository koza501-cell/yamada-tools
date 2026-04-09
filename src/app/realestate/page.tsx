import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "不動産計算ツール【無料】賃貸vs購入・固定資産税・引越し費用",
  description: "賃貸vs購入シミュレーター・固定資産税・引越し費用・家賃計算・不動産取得税を無料で計算。登録不要・日本国内サーバー処理。",
  keywords: ["賃貸 購入 比較", "固定資産税 計算", "引越し費用 計算", "家賃 計算", "不動産取得税"],
  alternates: { canonical: "https://yamada-tools.jp/realestate" },
  openGraph: {
    title: "不動産計算ツール【無料】賃貸vs購入・固定資産税・引越し費用",
    description: "賃貸vs購入シミュレーター・固定資産税・引越し費用・家賃計算・不動産取得税を無料で計算。登録不要・日本国内サーバー処理。",
    url: "https://yamada-tools.jp/realestate",
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
    { "@type": "ListItem", position: 2, name: "不動産計算ツール", item: "https://yamada-tools.jp/realestate" },
  ],
};

const realestateTools = [
  { name: "賃貸vs購入シミュレーター", url: "/realestate/rent-vs-buy", description: "賃貸と購入どちらがお得か総コストで比較", icon: "🏘️" },
  { name: "引越し費用計算機", url: "/realestate/moving-cost-calculator", description: "荷物量・距離から引越し費用の目安を算出", icon: "🚚" },
  { name: "固定資産税計算機", url: "/realestate/property-tax-calculator", description: "土地・建物の評価額から固定資産税を計算", icon: "🏛️" },
  { name: "家賃計算機", url: "/realestate/rental-cost-calculator", description: "年収・手取りから適正家賃を診断", icon: "🔑" },
  { name: "不動産取得税計算機", url: "/realestate/acquisition-tax", description: "不動産購入時の取得税を計算", icon: "📝" },
];

export default function RealEstatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">不動産計算ツール</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              賃貸vs購入・固定資産税・引越し費用を無料でシミュレーション。<br className="hidden md:block" />
              住まい選びの判断材料に。
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">無料で使える不動産計算ツール一覧</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              住宅購入・引越し・不動産投資を検討中の方に。日本の不動産税制に完全対応。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {realestateTools.map((tool) => (
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">yamada-tools.jpの不動産計算ツールについて</h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>住宅購入・賃貸・引越しに関わる費用計算を、日本の税制・市場相場に合わせて提供。大きな買い物の前に、正確な数字で判断材料を揃えましょう。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">住宅購入を検討中の方</h3>
                  <p className="text-sm">賃貸と購入の総コスト比較・固定資産税・取得税を事前に把握したい方。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">引越しを予定している方</h3>
                  <p className="text-sm">引越し費用の目安と適正家賃を確認したい方。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">不動産投資を考えている方</h3>
                  <p className="text-sm">固定資産税・取得税などの保有コストを把握したい方。</p>
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
