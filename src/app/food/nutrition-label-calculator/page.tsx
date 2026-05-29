import { Metadata } from "next";
import NutritionClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "食品 栄養成分表示 計算機【食品表示法対応】無料 | 山田ツール",
  description: "原材料の配合割合から栄養成分表示値を計算。食品表示法の義務表示5項目（エネルギー・たんぱく質・脂質・炭水化物・食塩相当量）に対応。100g・1食表示の切替も。",
  keywords: ["栄養成分表示 計算", "食品表示法 計算機", "原材料 栄養計算", "カロリー計算 レシピ", "食塩相当量 計算"],
  alternates: { canonical: "https://yamada-tools.jp/food/nutrition-label-calculator" },
  openGraph: {
    title: "食品 栄養成分表示 計算機【食品表示法対応】",
    description: "原材料から栄養成分表示5項目を自動計算。100g・1食表示対応。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "食品 栄養成分表示 計算機",
      "url": "https://yamada-tools.jp/food/nutrition-label-calculator",
      "description": "原材料の配合割合から栄養成分表示値を計算。食品表示法の義務表示5項目対応。",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "食品・フード", "item": "https://yamada-tools.jp/food" },
        { "@type": "ListItem", "position": 3, "name": "栄養成分表示計算機", "item": "https://yamada-tools.jp/food/nutrition-label-calculator" }
      ]
    }
  ]
};

const tool = getToolById("nutrition-label-calculator")!;

export default function NutritionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NutritionClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
