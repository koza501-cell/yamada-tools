import type { Metadata } from "next";
import InvoiceSonekiClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  alternates: { canonical: "https://yamada-tools.jp/finance/invoice-soneki-calculator" },
  title: "インボイス登録 損益判定ツール【免税事業者向け】",
  description: "免税事業者がインボイス登録すべきか、消費税負担と手取りの変化を計算。原則課税・簡易課税・2割特例を比較して最適な選択を判定。",
};

const tool = getToolById("invoice-soneki-calculator")!;

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "インボイス登録 損益判定ツール",
    description: "免税事業者のインボイス登録判断をサポート。消費税4方式を比較。",
    url: "https://yamada-tools.jp/finance/invoice-soneki-calculator",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InvoiceSonekiClient />
    
      <RelatedTools currentTool={tool} maxItems={6} /></>
  );
}
