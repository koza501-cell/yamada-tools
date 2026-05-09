import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "キャリア・給与計算ツール【無料】転職・残業代・失業保険・社会保険",
  description: "転職シミュレーター・残業代計算・失業保険・年収の壁チェッカー・副業税金・社会保険料・退職金・昇給シミュレーターなどキャリアと給与の計算を無料で。手取り額の正確な試算で転職判断・年収交渉に役立つ。登録不要・日本国内サーバー処理。",
  keywords: ["転職 シミュレーター", "残業代 計算", "失業保険 計算", "社会保険 計算", "副業 税金", "年収の壁"],
  alternates: { canonical: "https://yamada-tools.jp/career" },
  openGraph: {
    title: "キャリア・給与計算ツール【無料】転職・残業代・失業保険・社会保険",
    description: "転職シミュレーター・残業代計算・失業保険・年収の壁チェッカー・副業税金・社会保険料・退職金・昇給シミュレーターなどキャリアと給与の計算を無料で。手取り額の正確な試算で転職判断・年収交渉に役立つ。登録不要・日本国内サーバー処理。",
    url: "https://yamada-tools.jp/career",
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
    { "@type": "ListItem", position: 2, name: "キャリア・給与計算ツール", item: "https://yamada-tools.jp/career" },
  ],
};

const careerTools = [
  { name: "転職シミュレーター", url: "/career/job-change-simulator", description: "転職による年収・手取り・生涯収入の変化を試算", icon: "💼" },
  { name: "残業代計算機", url: "/career/overtime-calculator", description: "時給・残業時間から残業代を正確に計算", icon: "⏰" },
  { name: "失業保険計算機", url: "/career/unemployment-calculator", description: "退職理由・勤続年数から失業給付額を計算", icon: "📋" },
  { name: "年収交渉ツール", url: "/career/salary-negotiation", description: "市場価値・スキルから適正年収を診断", icon: "🤝" },
  { name: "昇給シミュレーター", url: "/career/salary-increase-simulator", description: "昇給率・年数から将来の年収を予測", icon: "📈" },
  { name: "年収の壁チェッカー", url: "/career/income-wall-checker", description: "103万・106万・130万の壁を超えた時の影響を計算", icon: "🧱" },
  { name: "副業税金計算機", url: "/career/side-income-tax-calculator", description: "副業収入にかかる税金・確定申告の必要性を診断", icon: "💰" },
  { name: "退職金計算機", url: "/career/retirement-bonus-calculator", description: "勤続年数・給与から退職金の目安を計算", icon: "🎊" },
  { name: "社会保険計算機", url: "/career/social-insurance-calculator", description: "給与から健康保険・厚生年金・雇用保険を計算", icon: "🏛️" },
];

export default function CareerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">キャリア・給与計算ツール</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              転職・残業代・失業保険・社会保険をかんたんシミュレーション。<br className="hidden md:block" />
              登録不要、完全無料。
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">無料で使えるキャリア・給与計算ツール一覧</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              転職・年収交渉・退職を検討中の方に。日本の社会保険制度に完全対応。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careerTools.map((tool) => (
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">yamada-tools.jpのキャリア計算ツールについて</h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>転職・昇給・退職・副業など、キャリアの転換点で必要な計算をすべて無料で提供。日本の社会保険制度・税制に完全対応し、リアルな手取り変化を試算できます。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">転職を検討中の方</h3>
                  <p className="text-sm">転職後の年収・手取り・生涯収入の変化を事前にシミュレーションしたい方。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">副業を始めたい方</h3>
                  <p className="text-sm">副業収入にかかる税金と確定申告の必要性を把握したい方。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">退職を考えている方</h3>
                  <p className="text-sm">失業保険の給付額・退職金の目安を事前に確認したい方。</p>
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
