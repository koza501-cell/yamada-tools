import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "借金返済シミュレーター【無料】返済計画・債務整理・リボ払い計算",
  description: "借金返済の完済期間・利息計算・任意整理・個人再生・自己破産の判定を無料で。リボ払いの危険度診断、繰り上げ返済の効果も計算。日本国内サーバー処理で安心。登録不要・完全無料の借金問題解決ツール集。",
  keywords: ["借金 返済 計算", "債務整理 診断", "リボ払い 計算", "ローン 利息 計算", "任意整理"],
  alternates: { canonical: "https://yamada-tools.jp/debt" },
  openGraph: {
    title: "借金返済シミュレーター【無料】返済計画・債務整理・リボ払い計算",
    description: "借金返済の完済期間・利息計算・任意整理・個人再生・自己破産の判定を無料で。リボ払いの危険度診断、繰り上げ返済の効果も計算。日本国内サーバー処理で安心。登録不要・完全無料の借金問題解決ツール集。",
    url: "https://yamada-tools.jp/debt",
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
    { "@type": "ListItem", position: 2, name: "借金返済シミュレーター", item: "https://yamada-tools.jp/debt" },
  ],
};

const debtTools = [
  { name: "返済シミュレーター", url: "/debt/repayment-simulator", description: "残高・金利・月返済額から完済予定日と総利息を自動計算。複数の借金にも対応", icon: "📊" },
  { name: "債務整理診断", url: "/debt/debt-diagnosis", description: "5つの質問で任意整理・個人再生・自己破産の最適な方法を診断", icon: "⚖️" },
  { name: "債務整理判定", url: "/debt/debt-restructuring-checker", description: "資産・職業から最適な債務整理方法を中立的に判定。信用情報への影響も詳細表示", icon: "🔍" },
  { name: "ローン利息計算機", url: "/debt/loan-interest-calculator", description: "元利均等・元金均等の利息総額を比較。借入前のシミュレーションに", icon: "💰" },
  { name: "リボ払い計算機", url: "/debt/revolving-calculator", description: "リボ払いの総支払額・利息を計算。隠れた高金利の実態を可視化", icon: "⚠️" },
];

export default function DebtPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd]) }} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">借金返済シミュレーター</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              借金返済の計画・債務整理の判定をかんたんシミュレーション。<br className="hidden md:block" />
              登録不要、完全無料。
            </p>
          </div>
        </section>
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">無料で使える借金返済ツール一覧</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              借金問題で悩む方へ。専門家相談前の事前確認に。中立的なシミュレーションで最適な返済プランを。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {debtTools.map((tool) => (
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
