import type { Metadata } from "next";
import KakeiboSimulatorClient from "./client";

export const metadata: Metadata = {
  title: "家計簿 貯蓄シミュレーター【目標別 月々の積立額を逆算】",
  description: "収入・支出から貯蓄可能額を計算。老後・教育費・住宅購入頭金・緊急資金など目標別に必要な月々の積立額を逆算。貯蓄率・3%複利効果も表示。",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "家計簿 貯蓄シミュレーター",
    description: "収入・支出から貯蓄可能額を計算。目標別に必要な月々の積立額を逆算。",
    url: "https://yamada-tools.jp/life/kakeibo-simulator",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <KakeiboSimulatorClient />
    </>
  );
}
