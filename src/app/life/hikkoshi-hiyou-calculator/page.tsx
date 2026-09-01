import type { Metadata } from "next";
import HikkoshiHiyouClient from "./client";

export const metadata: Metadata = {
  title: "引越し費用 見積もり計算機【時期・距離・荷物量で相場チェック】",
  description: "引越し業者に頼む前に相場を把握。時期・距離・荷物量から費用目安を計算。繁忙期割増・特殊事情オプション対応。2025年相場。",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "引越し費用 見積もり計算機",
    description: "時期・距離・荷物量から引越し費用の目安を計算",
    url: "https://yamada-tools.jp/life/hikkoshi-hiyou-calculator",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HikkoshiHiyouClient />
    </>
  );
}
