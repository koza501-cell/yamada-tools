import type { Metadata } from "next";
import RetailMarkupClient from "./client";

export const metadata: Metadata = {
  title: "小売・販売 値入率・粗利率 計算機【原価から売価を決める】| 山田ツール",
  description: "値入率（マークアップ）と粗利率（マージン）の違いを正確に計算。小売店・ECショップの価格設定に。業種別粗利率の目安も掲載。",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "小売・販売 値入率・粗利率 計算機",
    description: "値入率と粗利率の違いを計算。小売・ECの価格設定に。",
    url: "https://yamada-tools.jp/business/retail-markup-calculator",
    applicationCategory: "BusinessApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RetailMarkupClient />
    </>
  );
}
