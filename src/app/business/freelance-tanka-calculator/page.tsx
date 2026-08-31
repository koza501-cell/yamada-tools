import { Metadata } from "next";
import FreelanceTankaClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "フリーランス 適正単価・年収診断ツール【2025年最新相場】| 山田ツール",
  description: "スキル・経験・職種から適正な時間単価・月額単価を診断。2025年ITエンジニア・デザイナー・ライター等の市場相場と比較。目標年収からの逆算も対応。",
  keywords: ["フリーランス 単価 相場", "ITエンジニア 単価 2025", "フリーランス 年収 診断", "適正単価 計算", "フリーランス 時間単価"],
  alternates: { canonical: "https://yamada-tools.jp/business/freelance-tanka-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "フリーランス 適正単価・年収診断ツール【2025年最新相場】",
    description: "スキル・経験・職種から適正な時間単価・月額単価を診断。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "フリーランス 適正単価・年収診断ツール",
      "url": "https://yamada-tools.jp/business/freelance-tanka-calculator",
      "description": "スキル・経験・職種から適正な時間単価・月額単価を診断。",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "フリーランス単価診断", "item": "https://yamada-tools.jp/business/freelance-tanka-calculator" }
      ]
    }
  ]
};

const tool = getToolById("freelance-tanka-calculator")!;

export default function FreelanceTankaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FreelanceTankaClient />
    
      <RelatedTools currentTool={tool} maxItems={6} /></>
  );
}
