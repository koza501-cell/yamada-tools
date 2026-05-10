import type { Metadata } from "next";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import HoujinNinteiClient from "./client";

export const metadata: Metadata = {
  title: "法人認定情報ツール【無料】法人番号で認定・認証を検索｜gBizINFO",
  description: "13桁の法人番号から国の認定・認証・承認の取得状況（認定名・取得日・有効期限・認定機関）を無料で確認。経済産業省gBizINFO公式データ。登録不要。",
  alternates: { canonical: "https://yamada-tools.jp/business/houjin-nintei" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", name: "認定情報ツール",
      url: "https://yamada-tools.jp/business/houjin-nintei",
      applicationCategory: "BusinessApplication", operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
      { "@type": "ListItem", position: 2, name: "ビジネスツール", item: "https://yamada-tools.jp/business" },
      { "@type": "ListItem", position: 3, name: "認定情報ツール", item: "https://yamada-tools.jp/business/houjin-nintei" },
    ]},
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "このツールは無料で使えますか？",
        acceptedAnswer: { "@type": "Answer", text: "はい、完全無料・登録不要でご利用いただけます。" } },
    ]},
  ],
};

const tool = getToolById("houjin-nintei");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HoujinNinteiClient />
      {tool && <RelatedTools currentTool={tool} maxItems={6} />}
    </>
  );
}
