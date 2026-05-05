import { Metadata } from "next";
import PopulationClient from "./client";

export const metadata: Metadata = {
  title: "人口推計チェッカー — 住所で2050年までの人口変化を確認 | 山田ツール",
  description:
    "住所を入力するだけで2050年までの人口推移・将来推計を確認。不動産購入・事業立地・移住検討に。国土交通省データ使用、完全無料。",
  keywords: [
    "人口推計 住所検索",
    "将来人口 確認",
    "人口減少 エリア",
    "不動産 人口動態",
    "2050年 人口推計",
    "移住 人口",
    "人口密度 確認",
  ],
  openGraph: {
    title: "人口推計チェッカー — 住所で2050年までの人口変化を確認",
    description: "住所だけで500mメッシュ単位の人口推計（2020〜2070年）を確認。不動産・移住・事業立地の参考に。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "人口推計チェッカー",
      "url": "https://yamada-tools.jp/realestate/population",
      "description": "住所を入力するだけで将来推計人口（2020〜2070年）を確認できる無料ツール。",
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
        { "@type": "ListItem", "position": 3, "name": "人口推計チェッカー", "item": "https://yamada-tools.jp/realestate/population" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "人口推計データとは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "国土交通省が提供する500mメッシュ単位の将来推計人口データです。2020年から2070年まで5年ごとの人口推計が含まれ、不動産・まちづくり・事業立地の参考として活用できます。" } },
        { "@type": "Question", "name": "人口集中地区（DID）とは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "人口密度が1km²あたり4,000人以上の地区が隣接し、合計人口が5,000人以上となる地区のことです。都市的な土地利用がなされているエリアの目安となります。" } },
        { "@type": "Question", "name": "データはどの単位で表示されますか？", "acceptedAnswer": { "@type": "Answer", "text": "500m×500mのメッシュ（約0.25km²）単位のデータです。住所が含まれるメッシュの推計人口を表示しています。" } }
      ]
    }
  ]
};

export default function PopulationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PopulationClient />
    </>
  );
}
