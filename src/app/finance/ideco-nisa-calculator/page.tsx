import { Metadata } from "next";
import IDeCoNisaClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "iDeCo・NISA 節税効果計算機【2025年最新】| 山田ツール",
  description: "iDeCo・NISAで実際にいくら節税・資産形成できるか中立的に計算。金融機関バイアスなし。職業別掛金上限対応。運用複利シミュレーション付き。",
  keywords: ["iDeCo 節税 計算", "NISA 効果 計算", "iDeCo シミュレーター", "新NISA 積立 計算", "老後資金 計算"],
  alternates: { canonical: "https://yamada-tools.jp/finance/ideco-nisa-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "iDeCo・NISA 節税効果計算機【2025年最新】",
    description: "iDeCo・NISAで実際にいくら節税・資産形成できるか中立的に計算。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "iDeCo・NISA節税効果計算機",
      "url": "https://yamada-tools.jp/finance/ideco-nisa-calculator",
      "description": "iDeCo・NISAの節税効果と資産形成を中立的に計算する無料ツール。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "iDeCo・NISA節税効果計算機", "item": "https://yamada-tools.jp/finance/ideco-nisa-calculator" }
      ]
    }
  ]
};

const tool = getToolById("ideco-nisa-calculator")!;

export default function IDeCoNisaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IDeCoNisaClient />
    
      <RelatedTools currentTool={tool} maxItems={6} /></>
  );
}
