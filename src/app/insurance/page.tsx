import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "保険シミュレーター【無料】医療保険・生命保険の必要保障額を計算",
  description: "医療保険の給付金・生命保険の必要保障額を無料シミュレーション。高額療養費制度・遺族年金を考慮した正確な試算で、あなたに本当に必要な保険金額がわかります。登録不要・日本国内サーバー処理。",
  keywords: ["保険 シミュレーター", "医療保険 計算", "生命保険 必要額", "高額療養費 計算", "遺族年金"],
  alternates: { canonical: "https://yamada-tools.jp/insurance" },
  openGraph: {
    title: "保険シミュレーター【無料】医療保険・生命保険の必要保障額を計算",
    description: "医療保険の給付金・生命保険の必要保障額を無料シミュレーション。高額療養費制度・遺族年金を考慮した正確な試算で、あなたに本当に必要な保険金額がわかります。登録不要・日本国内サーバー処理。",
    url: "https://yamada-tools.jp/insurance",
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
    { "@type": "ListItem", position: 2, name: "保険シミュレーター", item: "https://yamada-tools.jp/insurance" },
  ],
};

const insuranceTools = [
  { name: "医療保険シミュレーター", url: "/insurance/medical-insurance-sim", description: "入院日数・日額・手術の有無から給付金と実質自己負担額を自動計算。高額療養費制度も考慮", icon: "🏥" },
  { name: "生命保険必要額計算機", url: "/insurance/life-insurance-calculator", description: "家族構成・収入・支出から必要な生命保険額を算出。遺族年金との関係も明示", icon: "🛡️" },
];

export default function InsurancePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">保険シミュレーター</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              医療保険・生命保険の必要保障額をかんたんシミュレーション。<br className="hidden md:block" />
              登録不要、完全無料。
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">無料で使える保険シミュレーター一覧</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              保険会社の営業に頼らず、中立的に必要保障額を算出。日本の社会保障制度を考慮した正確な計算。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insuranceTools.map((tool) => (
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
