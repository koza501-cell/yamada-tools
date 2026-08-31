import { Metadata } from "next";
import NetSalaryClient from "./client";

export const metadata: Metadata = {
  title: "給与手取り計算機 — 月給・年収から手取りを計算 | 山田ツール",
  description:
    "月給（額面）から手取り額を計算。健康保険・厚生年金・雇用保険・所得税・住民税の内訳を表示。扶養家族の影響も考慮。登録不要・完全無料。",
  keywords: [
    "給与 手取り 計算 月給",
    "月給 手取り いくら",
    "社会保険料 計算",
    "所得税 計算 給与",
    "手取り 年収 換算",
    "給与明細 見方 わからない",
    "パート 手取り 計算",
  ],
  alternates: { canonical: "https://yamada-tools.jp/finance/net-salary-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "給与手取り計算機 — 月給から手取りを即座に計算",
    description: "月給から手取り額・社会保険内訳を計算。扶養家族考慮。登録不要・無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "給与手取り計算機",
      "url": "https://yamada-tools.jp/finance/net-salary-calculator",
      "description": "月給から手取り額・社会保険料内訳を計算できる無料ツール。扶養家族の影響も考慮。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "金融・資産", "item": "https://yamada-tools.jp/finance" },
        { "@type": "ListItem", "position": 3, "name": "給与手取り計算機", "item": "https://yamada-tools.jp/finance/net-salary-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "手取り額の目安はどのくらいですか？", "acceptedAnswer": { "@type": "Answer", "text": "一般的に手取りは額面の75〜85%程度です。月給25万円なら手取りは約19〜21万円、月給35万円なら約26〜29万円が目安です。社会保険料や所得税・住民税の負担により変わります。" } },
        { "@type": "Question", "name": "健康保険料はどうやって計算されますか？", "acceptedAnswer": { "@type": "Answer", "text": "健康保険料は標準報酬月額に保険料率を掛けて計算します。協会けんぽの保険料率は都道府県によって異なりますが、全国平均は約10%前後（労使折半で約5%ずつ）です。" } },
        { "@type": "Question", "name": "住民税はいつから引かれますか？", "acceptedAnswer": { "@type": "Answer", "text": "住民税は前年の収入に基づいて計算され、翌年6月から翌々年5月まで毎月給与から天引きされます。そのため入社1年目の6月までは住民税が引かれません。" } }
      ]
    }
  ]
};

export default function NetSalaryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NetSalaryClient />
    </>
  );
}
