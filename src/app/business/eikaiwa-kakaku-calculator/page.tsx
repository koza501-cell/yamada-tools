import { Metadata } from "next";
import EikaiwaSingleClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "英会話・語学教室 レッスン単価計算機【適正料金を逆算】| 山田ツール",
  description: "フリーランス英会話講師・個人語学教室向け。目標年収から適正なレッスン料金を逆算。経費・所得税・社会保険を含む損益シミュレーション。",
  keywords: ["英会話 レッスン料金 相場", "フリーランス 英語講師 単価", "英会話教室 料金設定", "語学教室 適正価格"],
  alternates: { canonical: "https://yamada-tools.jp/business/eikaiwa-kakaku-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "英会話・語学教室 レッスン単価計算機",
    description: "目標年収から適正なレッスン料金を逆算。経費・税・社保を含む損益計算。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "英会話・語学教室 レッスン単価計算機",
      "url": "https://yamada-tools.jp/business/eikaiwa-kakaku-calculator",
      "description": "目標年収から適正なレッスン料金を逆算。経費・税・社保を含む損益計算。",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "英会話レッスン単価計算機", "item": "https://yamada-tools.jp/business/eikaiwa-kakaku-calculator" }
      ]
    }
  ]
};

const tool = getToolById("eikaiwa-kakaku-calculator")!;

export default function EikaiwaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EikaiwaSingleClient />
    
      <RelatedTools currentTool={tool} maxItems={6} /></>
  );
}
