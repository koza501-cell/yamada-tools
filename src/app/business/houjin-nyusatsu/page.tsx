import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import HoujinNyusatsuClient from "./client";

export const metadata: Metadata = {
  title: "入札・調達情報ツール【無料】法人番号で政府調達実績を検索｜gBizINFO",
  description: "13桁の法人番号から政府・自治体への入札・調達実績（案件名・金額・発注機関）を無料で検索。経済産業省gBizINFO公式データ。登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/business/houjin-nyusatsu" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", name: "入札・調達情報ツール",
      url: "https://yamada-tools.jp/business/houjin-nyusatsu",
      applicationCategory: "BusinessApplication", operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
      { "@type": "ListItem", position: 2, name: "ビジネスツール", item: "https://yamada-tools.jp/business" },
      { "@type": "ListItem", position: 3, name: "入札・調達情報ツール", item: "https://yamada-tools.jp/business/houjin-nyusatsu" },
    ]},
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "このツールは無料で使えますか？",
        acceptedAnswer: { "@type": "Answer", text: "はい、完全無料・登録不要でご利用いただけます。" } },
    ]},
  ],
};

const tool = getToolById("houjin-nyusatsu");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HoujinNyusatsuClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
