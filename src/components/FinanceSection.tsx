"use client";

import Link from "next/link";

// Finance tools data
const financeTools = [
  {
    id: "nisa-simulator",
    name: "新NISAシミュレーター",
    description: "積立・一括・複数シナリオ対応。1800万円非課税枠の使用状況と節税額を計算",
    icon: "📈",
    url: "/finance/nisa-simulator",
    keywords: "新NISA シミュレーター 無料",
  },
  {
    id: "jutaku-loan",
    name: "住宅ローン計算機",
    description: "固定・変動・繰上返済・控除・借り換えを1つで計算。5年ルール対応",
    icon: "🏠",
    url: "/finance/jutaku-loan",
    keywords: "住宅ローン 計算機 無料",
  },
  {
    id: "fx-calculator",
    name: "FX損益計算機",
    description: "損益・証拠金・スワップ・確定申告に完全対応。複数取引の一括計算も可能。",
    icon: "💹",
    url: "/finance/fx-calculator",
    keywords: "FX 損益計算",
  },
  {
    id: "retirement-simulator",
    name: "老後資金シミュレーター",
    description: "年金・iDeCo・NISA・退職金・取り崩しを総合シミュレーション",
    icon: "🏦",
    url: "/finance/retirement-simulator",
    keywords: "老後資金 シミュレーター",
  },
  {
    id: "ideco-nisa-comparison",
    name: "iDeCo vs NISA 比較ツール",
    description: "節税額・手取り・最適配分を自動計算。あなたへのおすすめ診断付き",
    icon: "⚖️",
    url: "/finance/ideco-nisa-comparison",
    keywords: "iDeCo 計算 無料",
  },
];

// Generate JSON-LD Structured Data with dynamic site URL
function generateFinanceSectionSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "金融・資産運用ツール一覧 | 山田ツール",
    "description": "新NISA・iDeCo・住宅ローン・FX・老後資金の無料シミュレーター。日本国内サーバー、登録不要。",
    "url": `${siteUrl}/#finance-tools`,
    "numberOfItems": 5,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "新NISAシミュレーター",
        "url": `${siteUrl}/finance/nisa-simulator`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "住宅ローン計算機",
        "url": `${siteUrl}/finance/jutaku-loan`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "FX損益計算機",
        "url": `${siteUrl}/finance/fx-calculator`,
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "老後資金シミュレーター",
        "url": `${siteUrl}/finance/retirement-simulator`,
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "iDeCo vs NISA 比較ツール",
        "url": `${siteUrl}/finance/ideco-nisa-comparison`,
      },
    ],
  };
}

export default function FinanceSection() {
  // Use environment variable for site URL, fallback to production for safety
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yamada-tools.jp";
  const financeSectionSchema = generateFinanceSectionSchema(siteUrl);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financeSectionSchema) }}
      />

      <section
        id="finance-tools"
        aria-labelledby="finance-section-heading"
        className="py-12 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-l-4 border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h2
                id="finance-section-heading"
                className="text-2xl font-bold text-kon dark:text-gray-300"
              >
                <span aria-hidden="true">💰</span> 金融・資産運用ツール
              </h2>

            </div>
            <Link
              href="/finance"
              title="金融・資産運用ツール一覧 | 山田ツール"
              className="text-kon hover:text-ai transition-colors duration-200 text-sm font-medium"
            >
              すべて見る →
            </Link>
          </div>

          {/* Subtitle */}
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm">
            「NISAや住宅ローン・老後資金まで、無料で高精度シミュレーション。登録不要。」
          </p>

          {/* Card Grid - Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {financeTools.map((tool) => (
              <article
                key={tool.id}
                aria-label={tool.name}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Emoji Icon */}
                    <span
                      aria-hidden="true"
                      className="text-4xl flex-shrink-0"
                    >
                      {tool.icon}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Tool Name with Pro Badge */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-bold text-kon dark:text-white leading-tight">
                          {tool.name}
                        </h3>
                        <span className="px-1.5 py-0.5 bg-gray-50 text-kon dark:bg-kon dark:text-amber-200 text-xs font-bold rounded">
                          Pro
                        </span>

                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                        {tool.description}
                      </p>

                      {/* CTA Link */}
                      <Link
                        href={tool.url}
                        aria-label={`${tool.name} Proを使う`}
                        className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      >
                        ツールを使う
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-8 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-gray-700 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  <span aria-hidden="true">📊</span> すべての金融ツールを見る —
                  NISA・iDeCo・住宅ローン・FX・老後資金シミュレーター
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  資産運用 ツール 無料で提供中
                </p>
              </div>
              <Link
                href="/finance"
                aria-label="金融ツール一覧ページへ移動"
                className="inline-flex items-center gap-2 bg-kon text-white px-6 py-3 rounded-xl font-bold hover:bg-ai transition-colors whitespace-nowrap shadow-md hover:shadow-lg"
              >
                金融ツール一覧へ
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
