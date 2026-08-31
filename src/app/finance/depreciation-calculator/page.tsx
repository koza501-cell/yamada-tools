import { Metadata } from "next";
import DepreciationClient from "./client";

export const metadata: Metadata = {
  title: "減価償却計算機 — 定額法・定率法を比較 | 山田ツール",
  description:
    "取得価額・耐用年数を入力するだけで定額法・定率法の減価償却費を計算・比較。年次テーブルとグラフで可視化。少額減価償却特例（30万円未満）判定付き。無料・登録不要。",
  keywords: [
    "減価償却 計算 簡単 無料",
    "定額法 定率法 比較",
    "耐用年数 パソコン 車 一覧",
    "少額減価償却 30万 特例",
    "減価償却 シミュレーター",
    "固定資産 経費 計算",
  ],
  alternates: { canonical: "https://yamada-tools.jp/finance/depreciation-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "減価償却計算機 — 定額法・定率法を比較",
    description: "定額法・定率法の減価償却を比較計算。耐用年数プルダウン・グラフ付き。無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "減価償却計算機",
      "url": "https://yamada-tools.jp/finance/depreciation-calculator",
      "description": "定額法・定率法を比較できる減価償却計算機。耐用年数プルダウン・少額特例判定付き。",
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
        { "@type": "ListItem", "position": 3, "name": "減価償却計算機", "item": "https://yamada-tools.jp/finance/depreciation-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "定額法と定率法どちらが得ですか？", "acceptedAnswer": { "@type": "Answer", "text": "節税を早期に実現したい場合は定率法が有利です。定率法は初期に多く経費計上できるため、初年度の節税効果が高くなります。一方、定額法は毎年均等に経費計上でき、利益の見通しが立てやすいです。建物・建物付属設備は定額法のみ適用されます。" } },
        { "@type": "Question", "name": "少額減価償却資産の特例とは？", "acceptedAnswer": { "@type": "Answer", "text": "中小企業者等が取得価額30万円未満の減価償却資産を取得した場合、年間300万円を限度に全額を取得年度の経費として計上できる特例です（2026年3月31日まで）。高額なPCや備品でも30万円未満であれば全額経費化できます。" } },
        { "@type": "Question", "name": "耐用年数はどこで確認できますか？", "acceptedAnswer": { "@type": "Answer", "text": "法定耐用年数は国税庁が定めており、資産の種類・材質・用途によって異なります。このツールの耐用年数プルダウンに主要な資産の耐用年数を記載しています。詳細は国税庁「主な減価償却資産の耐用年数表」をご確認ください。" } }
      ]
    }
  ]
};

export default function DepreciationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DepreciationClient />
    </>
  );
}
