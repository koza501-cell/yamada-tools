import type { Metadata } from "next";
import FuyouKoujoClient from "./client";

export const metadata: Metadata = {
  title: "扶養控除 判定・計算ツール【2026年改正・特定親族特別控除対応】| 山田ツール",
  description: "子供・親の扶養控除額を正確に計算。2026年改正で新設の特定親族特別控除（19〜22歳・年収123万超）にも対応。年末調整に。",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "扶養控除 判定・計算ツール",
    description: "子供・親の扶養控除額を正確に計算。2026年改正対応。",
    url: "https://yamada-tools.jp/finance/fuyou-koujo-checker",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FuyouKoujoClient />
    </>
  );
}
