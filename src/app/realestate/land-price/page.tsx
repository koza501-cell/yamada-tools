import { Metadata } from "next";
import LandPriceClient from "./client";

export const metadata: Metadata = {
  title: "地価チェッカー — 住所で地価公示・地価調査を確認 | 山田ツール",
  description:
    "住所を入力するだけで近隣の地価公示・地価調査データを確認。前年比変動率・エリア平均・最寄り駅情報も表示。相続・売買・固定資産税の参考に。国土交通省データ使用、完全無料。",
  keywords: [
    "地価 調べ方",
    "地価公示 住所検索",
    "土地価格 相場",
    "相続 土地価格",
    "固定資産税 地価",
    "地価 前年比",
    "不動産 相場 確認",
  ],
  openGraph: {
    title: "地価チェッカー — 住所で地価公示を確認",
    description: "住所だけで近隣の地価公示・地価調査データを確認。前年比変動率・エリア平均も表示。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "地価チェッカー",
      "url": "https://yamada-tools.jp/realestate/land-price",
      "description": "住所を入力するだけで近隣の地価公示・地価調査データを確認できる無料ツール。",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "不動産", "item": "https://yamada-tools.jp/realestate" },
        { "@type": "ListItem", "position": 3, "name": "地価チェッカー", "item": "https://yamada-tools.jp/realestate/land-price" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "地価公示とは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "国土交通省が毎年1月1日時点の土地価格を公示するものです。相続税・固定資産税の算定基準や、不動産売買の参考価格として使われます。" } },
        { "@type": "Question", "name": "地価公示と実際の売買価格は違いますか？", "acceptedAnswer": { "@type": "Answer", "text": "地価公示は公的な基準地価であり、実際の売買価格とは異なる場合があります。売買価格は需給や個別条件によって変動します。あくまで参考値としてご利用ください。" } },
        { "@type": "Question", "name": "地価データが見つからない場合は？", "acceptedAnswer": { "@type": "Answer", "text": "地価公示地点は全国に約26,000点あり、すべての住所に近接しているわけではありません。農村部や山間部では地点が少ない場合があります。" } }
      ]
    }
  ]
};

export default function LandPricePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandPriceClient />
    </>
  );
}
