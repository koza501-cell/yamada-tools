import { Metadata } from "next";
import HojinkaClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "個人事業主 法人化 節税シミュレーター | 山田ツール",
  description: "年収・経費から個人事業と法人の税負担を比較。いくら稼いだら法人化すべきか？所得税・法人税・社会保険を総合計算。合同会社・株式会社の検討にも。",
  keywords: ["法人化 節税 計算", "個人事業主 法人化 目安", "法人化 メリット シミュレーター", "法人税 個人税 比較", "合同会社 節税"],
  alternates: { canonical: "https://yamada-tools.jp/finance/hojinka-simulator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "個人事業主 法人化 節税シミュレーター",
    description: "年収・経費から個人事業と法人の税負担を比較。いくら稼いだら法人化すべきか？",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "個人事業主 法人化節税シミュレーター",
      "url": "https://yamada-tools.jp/finance/hojinka-simulator",
      "description": "年収・経費から個人事業と法人の税負担を比較計算する無料ツール。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "法人化節税シミュレーター", "item": "https://yamada-tools.jp/finance/hojinka-simulator" }
      ]
    }
  ]
};

const tool = getToolById("hojinka-simulator")!;

export default function HojinkaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HojinkaClient />
    
      <RelatedTools currentTool={tool} maxItems={6} /></>
  );
}
