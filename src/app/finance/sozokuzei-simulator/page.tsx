import { Metadata } from "next";
import SozokuzeiClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "相続税 簡易シミュレーター【相続税がかかるかチェック】",
  description: "遺産総額と相続人数を入力するだけで相続税の有無と概算額を計算。基礎控除・配偶者控除・小規模宅地等の特例対応。専門家に相談前の事前確認に。",
  keywords: ["相続税 計算", "相続税 シミュレーター", "相続税 いくら", "基礎控除 計算", "相続税 かかるか"],
  alternates: { canonical: "https://yamada-tools.jp/finance/sozokuzei-simulator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "相続税 簡易シミュレーター【相続税がかかるかチェック】",
    description: "遺産と相続人を入力するだけで相続税の有無と概算額を計算。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "相続税簡易シミュレーター",
      "url": "https://yamada-tools.jp/finance/sozokuzei-simulator",
      "description": "遺産総額と相続人数を入力するだけで相続税の有無と概算額を計算。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "相続税簡易シミュレーター", "item": "https://yamada-tools.jp/finance/sozokuzei-simulator" }
      ]
    }
  ]
};

const tool = getToolById("sozokuzei-simulator")!;

export default function SozokuzeiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SozokuzeiClient />
    
      <RelatedTools currentTool={tool} maxItems={6} /></>
  );
}
