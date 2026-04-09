import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "金融計算ツール【無料】NISA・iDeCo・住宅ローン・FX・老後資金シミュレーター",
  description: "新NISA積立計算、住宅ローンシミュレーション、FX損益計算、老後資金試算、iDeCo vs NISA比較を無料で。登録不要・日本国内サーバー処理・スマホ対応。",
  keywords: ["NISA シミュレーター", "住宅ローン 計算機", "FX 損益計算", "老後資金 計算", "iDeCo NISA 比較", "金融計算ツール 無料"],
  alternates: {
    canonical: "https://yamada-tools.jp/finance",
  },
  openGraph: {
    title: "金融計算ツール【無料】NISA・iDeCo・住宅ローン・FX・老後資金シミュレーター",
    description: "新NISA積立計算、住宅ローンシミュレーション、FX損益計算、老後資金試算、iDeCo vs NISA比較を無料で。登録不要・日本国内サーバー処理・スマホ対応。",
    url: "https://yamada-tools.jp/finance",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
    images: [{
      url: "https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-hub.png",
      width: 1200,
      height: 630,
      alt: "金融計算ツール",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "金融計算ツール【無料】NISA・iDeCo・住宅ローン・FX・老後資金シミュレーター",
    description: "新NISA積立計算、住宅ローンシミュレーション、FX損益計算、老後資金試算、iDeCo vs NISA比較を無料で。登録不要・日本国内サーバー処理・スマホ対応。",
    images: ["https://pub-a1dbb3c658b341fabe5015e209050298.r2.dev/og-finance-hub.png"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp"},
    {"@type": "ListItem", "position": 2, "name": "金融・資産運用ツール", "item": "https://yamada-tools.jp/finance"}
  ]
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "金融計算ツール",
  "description": "新NISA・iDeCo・住宅ローン・FX・老後資金の無料シミュレーター集",
  "url": "https://yamada-tools.jp/finance",
  "datePublished": "2026-01-01",
  "dateModified": "2026-03-28",
  "hasPart": [
    {"@type": "SoftwareApplication", "name": "新NISAシミュレーター Pro", "url": "https://yamada-tools.jp/finance/nisa-simulator"},
    {"@type": "SoftwareApplication", "name": "住宅ローン計算機 Pro", "url": "https://yamada-tools.jp/finance/jutaku-loan"},
    {"@type": "SoftwareApplication", "name": "FX損益計算機 Pro", "url": "https://yamada-tools.jp/finance/fx-calculator"},
    {"@type": "SoftwareApplication", "name": "老後資金シミュレーター Pro", "url": "https://yamada-tools.jp/finance/retirement-simulator"},
    {"@type": "SoftwareApplication", "name": "iDeCo vs NISA 比較ツール", "url": "https://yamada-tools.jp/finance/ideco-nisa-comparison"}
  ]
};

const financeTools = [
  {
    name: "新NISAシミュレーター Pro",
    url: "/finance/nisa-simulator",
    description: "積立・一括・複数シナリオ対応。1800万円非課税枠の使用状況と節税額を計算",
    icon: "📈",
  },
  {
    name: "住宅ローン計算機 Pro",
    url: "/finance/jutaku-loan",
    description: "固定・変動・繰上返済・控除・借り換えを1つで計算。5年ルール対応",
    icon: "🏠",
  },
  {
    name: "FX損益計算機 Pro",
    url: "/finance/fx-calculator",
    description: "損益・証拠金・スワップ・確定申告を完全対応。複数取引の一括計算も",
    icon: "💹",
  },
  {
    name: "老後資金シミュレーター Pro",
    url: "/finance/retirement-simulator",
    description: "年金・iDeCo・NISA・退職金・取り崩しを総合シミュレーション",
    icon: "🏦",
  },
  {
    name: "iDeCo vs NISA 比較ツール",
    url: "/finance/ideco-nisa-comparison",
    description: "節税額・手取り・最適配分を自動計算。あなたへのおすすめ診断付き",
    icon: "⚖️",
  },
];

export default function FinancePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, collectionJsonLd]) }}
      />
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-kon to-ai text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            金融・資産運用ツール
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            無料で使える高精度な金融計算ツール。<br className="hidden md:block" />
            NISA・iDeCo・住宅ローン・FX・老後資金をかんたんシミュレーション。
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            無料で使える金融・資産運用シミュレーター一覧
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            NISAや住宅ローンの計算をかんたんに。登録不要で、スマートフォンからもご利用いただけます。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financeTools.map((tool) => (
              <Link
                key={tool.url}
                href={tool.url}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{tool.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-ai transition-colors mb-2">
                        {tool.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm text-ai font-medium group-hover:translate-x-1 transition-transform">
                          ツールを使う →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* AdSense Slot */}
          <div className="adsense-slot my-6" data-ad-slot="auto"></div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            yamada-tools.jpの金融計算ツールについて
          </h2>
          
          <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
            <p className="text-base">
              yamada-tools.jpの金融・資産運用ツールは、日本の個人投資家、住宅購入を検討中の方、
              老後計画中の方々に向けた、無料で使える高精度な金融計算ツールを提供しています。
              複雑な金融計算をシンプルに、誰でも簡単に利用できることを目指して開発しました。
            </p>
            
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-6">
              提供している5つの金融ツール
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">📈 新NISAシミュレーター</h4>
                <p className="text-sm">
                  毎月の積立額・利回り・期間を入力するだけで、将来資産・節税額・非課税枠の使用率を自動計算。
                  つみたて投資枠・成長投資枠の同時シミュレーションにも対応しています。
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <h4 className="font-bold text-green-700 dark:text-green-300 mb-2">🏠 住宅ローン計算機</h4>
                <p className="text-sm">
                  固定・変動・繰上返済・控除・借り換えを1つで計算。変動金利の将来シナリオ・5年ルール対応。
                  月々返済額、総返済額、利息総額を正確にシミュレーションできます。
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">💹 FX損益計算機</h4>
                <p className="text-sm">
                  損益・証拠金・ロスカット・スワップ・確定申告を完全対応。
                  複数取引の一括計算や損失繰越控除シミュレーターも搭載しています。
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">🏦 老後資金シミュレーター</h4>
                <p className="text-sm">
                  年金・iDeCo・NISA・退職金・取り崩しを総合シミュレーション。
                  老後の資金計画を多角的に分析できます。
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 md:col-span-2">
                <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">⚖️ iDeCo vs NISA 比較ツール</h4>
                <p className="text-sm">
                  年収・職業・予算に応じてiDeCoとNISAを徹底比較。
                  節税額・最終手取り・最適配分を自動計算し、あなたへのおすすめ診断を提供します。
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-6">
              こんな方におすすめ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">個人投資家の方</h4>
                <p className="text-sm">
                  NISAやiDeCoの税制優遇を最大限活用したい方。
                  節税額や将来の資産形成をシミュレーションしたい方。
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">住宅購入検討者の方</h4>
                <p className="text-sm">
                  住宅ローンの返済計画を立てたい方。
                  固定金利と変動金利のどちらを選ぶべきか迷っている方。
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">老後計画中の方</h4>
                <p className="text-sm">
                  老後の資金が足りるか不安な方。
                  年金とiDeCo・NISAを組み合わせた資産形成を検討中の方。
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-6">
              なぜyamada-tools.jpが選ばれるのか
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">日本国内サーバー処理</h4>
                  <p className="text-sm">
                    すべての計算は日本国内のサーバーで行われ、データが海外に送信されることはありません。
                    セキュリティ面でも安心してご利用いただけます。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">完全無料</h4>
                  <p className="text-sm">
                    すべてのツールが無料でご利用いただけます。有料プランや機能制限はありません。
                    広告収入で運営しており、ユーザーに費用負担はありません。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">登録不要</h4>
                  <p className="text-sm">
                    メールアドレスや個人情報の入力は一切不要。アクセスしてすぐに計算を開始できます。
                    煩わしい会員登録やログインの手間がありません。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">スマホ対応</h4>
                  <p className="text-sm">
                    スマートフォンからでも快適にご利用いただけます。
                    電車の中や待ち時間でも簡単に計算できます。
                  </p>
                </div>
              </div>
            </div>

            <p className="text-base mt-6">
              yamada-tools.jpの金融計算ツールは、日本の個人投資家・会社員・フリーランスが日常的に必要とする
              金融計算を無料で提供しています。すべての計算はブラウザ上で行われ、
              個人情報の入力は不要です。まずは気になるツールから試してみてください。
            </p>
          </div>
          
          {/* Last Updated */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <time dateTime="2026-03-28">最終更新: 2026年3月</time>
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
