import { Metadata } from "next";
import KanzeiClient from "./client";

export const metadata: Metadata = {
  title: "個人輸入・関税計算機【2025年最新】| yamada-tools",
  description: "海外通販・eBay・Amazonの個人輸入にかかる関税・消費税を自動計算。免税判定・免税ライン表示付き。USD・EUR・CNY等8通貨対応",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "個人輸入・関税計算機",
  description: "個人輸入の関税・消費税を自動計算するツール。免税判定付き",
  url: "https://yamada-tools.jp/convert/kanzei-calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
};

export default function KanzeiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KanzeiClient />
    </>
  );
}
