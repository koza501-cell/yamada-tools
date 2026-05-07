import { Metadata } from "next";
import FoodlossClient from "./client";

export const metadata: Metadata = {
  title: "フードロス コスト計算機【飲食店・食品スーパー向け】| 山田ツール",
  description: "廃棄ロス率から年間損失額を計算。フードロス削減で利益がどれだけ改善するか見える化。業界別ベンチマーク・CO2削減効果・改善ヒント付き。",
  keywords: ["フードロス 計算", "食品廃棄 コスト", "飲食店 廃棄 削減", "フードロス 削減 効果", "食品ロス 計算ツール"],
  alternates: { canonical: "https://yamada-tools.jp/food/foodloss-calculator" },
  openGraph: {
    title: "フードロス コスト計算機【飲食店・食品スーパー向け】",
    description: "廃棄ロス率から年間損失額を計算。削減効果と利益改善を見える化。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "フードロスコスト計算機",
      "url": "https://yamada-tools.jp/food/foodloss-calculator",
      "description": "廃棄ロス率から年間損失額を計算する飲食・食品業向け無料ツール。",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "フードロスコスト計算機", "item": "https://yamada-tools.jp/food/foodloss-calculator" }
      ]
    }
  ]
};

export default function FoodlossPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FoodlossClient />
    </>
  );
}
