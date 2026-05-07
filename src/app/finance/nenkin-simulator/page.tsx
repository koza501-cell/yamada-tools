import type { Metadata } from "next";
import NenkinSimulatorClient from "./client";

export const metadata: Metadata = {
  title: "年金 受給額 簡易シミュレーター【繰上げ・繰下げ 損得比較】| 山田ツール",
  description: "老齢基礎年金・老齢厚生年金の概算受給額を計算。繰上げ（60歳〜）・繰下げ（66〜75歳）の月額増減と損益分岐点まで一覧表示。",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "年金 受給額 簡易シミュレーター",
    description: "老齢基礎年金・老齢厚生年金の概算受給額を計算。繰上げ・繰下げ比較付き。",
    url: "https://yamada-tools.jp/finance/nenkin-simulator",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NenkinSimulatorClient />
    </>
  );
}
