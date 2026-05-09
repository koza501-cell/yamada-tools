import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ビジネス・法人税計算ツール【無料】法人化・役員報酬・フリーランス税金",
  description: "法人化シミュレーター・役員報酬最適化・法人税・フリーランス税金・簡易課税を無料で計算。登録不要・日本国内サーバー処理。",
  keywords: ["法人化 シミュレーター", "役員報酬 最適化", "法人税 計算", "フリーランス 税金", "簡易課税 計算"],
  alternates: { canonical: "https://yamada-tools.jp/business" },
  openGraph: {
    title: "ビジネス・法人税計算ツール【無料】法人化・役員報酬・フリーランス税金",
    description: "法人化シミュレーター・役員報酬最適化・法人税・フリーランス税金・簡易課税を無料で計算。登録不要・日本国内サーバー処理。",
    url: "https://yamada-tools.jp/business",
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
    { "@type": "ListItem", position: 2, name: "ビジネス・法人税計算ツール", item: "https://yamada-tools.jp/business" },
  ],
};

const businessTools = [
  { name: "法人化シミュレーター", url: "/business/incorporation-simulator", description: "個人事業主vs法人の税金・社保を比較", icon: "🏢" },
  { name: "役員報酬最適化ツール", url: "/business/director-salary-optimizer", description: "法人税・所得税・社保のバランスで最適な役員報酬を計算", icon: "👔" },
  { name: "法人税計算機", url: "/business/corporate-tax-calculator", description: "所得金額から法人税・地方税を計算", icon: "🏦" },
  { name: "フリーランス税金計算機", url: "/business/freelance-tax-calculator", description: "フリーランスの所得税・住民税・国保を一括計算", icon: "💻" },
  { name: "簡易課税計算機", url: "/business/simplified-tax-calculator", description: "簡易課税制度での消費税納税額を計算", icon: "📊" },
  { name: "法人番号検索", url: "/business/houjin-bangou-lookup", description: "13桁の法人番号から会社名・所在地・変更履歴を国税庁公式データで即取得", icon: "🔢" },
];

export default function BusinessPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">ビジネス・法人税計算ツール</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              法人化・役員報酬・フリーランス税金を無料でシミュレーション。<br className="hidden md:block" />
              起業・独立を検討中の方に。
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">無料で使えるビジネス・法人税計算ツール一覧</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              個人事業主・フリーランス・法人経営者に。日本の法人税制・社会保険に完全対応。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businessTools.map((tool) => (
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">yamada-tools.jpのビジネス計算ツールについて</h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
              <p>個人事業主・フリーランス・法人経営者が必要とする税金・社会保険の計算を、日本の制度に完全対応した形で無料提供。法人化の判断や役員報酬の最適化にお役立てください。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">法人化を検討中の方</h3>
                  <p className="text-sm">個人事業と法人の税負担・社会保険料を比較して法人化のタイミングを検討したい方。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">フリーランスの方</h3>
                  <p className="text-sm">確定申告前に所得税・住民税・国民健康保険料の見積もりを立てたい方。</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">法人経営者の方</h3>
                  <p className="text-sm">役員報酬の最適額・法人税・簡易課税の消費税納税額を計算したい方。</p>
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
