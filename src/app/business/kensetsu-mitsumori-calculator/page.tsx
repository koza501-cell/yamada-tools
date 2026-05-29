import { Metadata } from "next";
import KensetsuMitsumoriClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "建設・内装工事 材料費見積もり計算機【面積から自動計算】| 山田ツール",
  description: "工事種別・面積から必要材料量と費用目安を自動計算。フローリング・クロス・外壁塗装・防水工事対応。工賃込み概算も表示。小規模工務店・DIY向け。",
  keywords: ["建設 材料費 見積もり", "内装工事 費用 計算", "フローリング 材料費", "クロス張替え 費用", "外壁塗装 費用計算"],
  alternates: { canonical: "https://yamada-tools.jp/business/kensetsu-mitsumori-calculator" },
  openGraph: {
    title: "建設・内装工事 材料費見積もり計算機",
    description: "工事種別・面積から必要材料量と費用目安を自動計算。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "建設・内装工事 材料費見積もり計算機",
      "url": "https://yamada-tools.jp/business/kensetsu-mitsumori-calculator",
      "description": "工事種別・面積から必要材料量と費用目安を自動計算。",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "建設・内装工事 材料費見積もり", "item": "https://yamada-tools.jp/business/kensetsu-mitsumori-calculator" }
      ]
    }
  ]
};

const tool = getToolById("kensetsu-mitsumori-calculator")!;

export default function KensetsuMitsumoriPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KensetsuMitsumoriClient />
    
      <RelatedTools currentTool={tool} maxItems={6} /></>
  );
}
