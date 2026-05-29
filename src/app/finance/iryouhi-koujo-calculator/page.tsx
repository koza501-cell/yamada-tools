import type { Metadata } from "next";
import IryouhiKoujoClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "医療費控除 計算機【セルフメディケーション税制比較対応】| 山田ツール",
  description: "年間の医療費から医療費控除額と節税効果を計算。セルフメディケーション税制との比較・どちらが有利か判定付き。家族全員分の医療費を合算可能。",
};

const tool = getToolById("iryouhi-koujo-calculator")!;

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "医療費控除 計算機",
    description: "年間医療費から控除額と節税額を計算。セルフメディケーション税制比較付き。",
    url: "https://yamada-tools.jp/finance/iryouhi-koujo-calculator",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <IryouhiKoujoClient />
    
      <RelatedTools currentTool={tool} maxItems={6} /></>
  );
}
