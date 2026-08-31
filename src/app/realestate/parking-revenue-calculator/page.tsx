import { Metadata } from "next";
import ParkingClient from "./client";

export const metadata: Metadata = {
  title: "駐車場収益計算機 — 月極・コインパーキング比較・投資回収シミュレーション | 山田ツール",
  description: "月極・コインパーキングの収益・月次利益・投資回収期間を比較計算。空き率シミュレーション・10年/20年累計収益・利回りを一覧表示。登録不要・無料。",
  keywords: ["駐車場 収益 計算", "コインパーキング 収益シミュレーション", "月極駐車場 利回り 計算", "駐車場 投資 回収期間", "コインパーキング 月極 比較", "土地活用 駐車場 収益"],
  alternates: { canonical: "https://yamada-tools.jp/realestate/parking-revenue-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "駐車場収益計算機 — 月極・コインパーキング比較",
    description: "月極・コインパーキングの収益・投資回収期間を比較計算。空き率スライダー対応。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "駐車場収益計算機",
      "url": "https://yamada-tools.jp/realestate/parking-revenue-calculator",
      "description": "月極・コインパーキングの収益・投資回収期間を比較計算する無料ツール。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "不動産・土地活用", "item": "https://yamada-tools.jp/realestate" },
        { "@type": "ListItem", "position": 3, "name": "駐車場収益計算機", "item": "https://yamada-tools.jp/realestate/parking-revenue-calculator" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "月極とコインパーキングどちらが儲かる？", "acceptedAnswer": { "@type": "Answer", "text": "都心部ではコインパーキングが高収益になりやすく、郊外・地方では月極が安定収益を得やすい傾向があります。このツールで条件を入力して比較してみてください。" } },
        { "@type": "Question", "name": "駐車場経営に必要な初期費用は？", "acceptedAnswer": { "@type": "Answer", "text": "舗装工事費（1台あたり5〜15万円）が主な初期費用です。コインパーキングでは精算機・ロック板設置費（50〜150万円）が追加でかかります。月極は初期費用が少なく始めやすい特徴があります。" } },
        { "@type": "Question", "name": "駐車場の固定資産税はいくら？", "acceptedAnswer": { "@type": "Answer", "text": "更地として利用する場合、住宅用地の特例（6分の1）が適用されず税負担が増加します。固定資産税の詳細計算は別途固定資産税計算機をご利用ください。" } }
      ]
    }
  ]
};

export default function ParkingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ParkingClient />
    </>
  );
}
