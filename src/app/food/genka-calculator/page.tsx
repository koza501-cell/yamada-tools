import { Metadata } from "next";
import GenkaClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "飲食店 メニュー原価率計算機【無料】食材費・FLコスト自動計算 | 山田ツール",
  description: "食材費からメニューの原価率・適正売価・FLコストを自動計算。飲食店経営の利益改善に。目標原価率から適正売価を逆算。登録不要・完全無料。",
  keywords: ["原価率 計算", "飲食店 原価 計算機", "メニュー 原価率", "FL比率 計算", "適正売価 計算", "食材費 計算"],
  alternates: { canonical: "https://yamada-tools.jp/food/genka-calculator" },
  openGraph: {
    title: "飲食店 メニュー原価率計算機【無料】",
    description: "食材費から原価率・適正売価・FLコストを自動計算。飲食店経営の利益改善に。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "飲食店メニュー原価率計算機",
      "url": "https://yamada-tools.jp/food/genka-calculator",
      "description": "食材費からメニューの原価率・適正売価・FLコストを自動計算。",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "飲食・フード", "item": "https://yamada-tools.jp/food" },
        { "@type": "ListItem", "position": 3, "name": "メニュー原価率計算機", "item": "https://yamada-tools.jp/food/genka-calculator" }
      ]
    }
  ]
};

const tool = getToolById("genka-calculator")!;

export default function GenkaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GenkaClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
