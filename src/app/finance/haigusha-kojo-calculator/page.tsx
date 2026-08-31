import type { Metadata } from "next";
import HaigushaKojoClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  alternates: { canonical: "https://yamada-tools.jp/finance/haigusha-kojo-calculator" },
  title: "配偶者控除・配偶者特別控除 計算機【2026年改正対応】| 山田ツール",
  description: "配偶者の年収と世帯主の年収を入力するだけで控除額を自動計算。2026年改正の136万円・178万円の壁にも対応。年末調整・確定申告に。",
};

const tool = getToolById("haigusha-kojo-calculator")!;

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "配偶者控除・配偶者特別控除 計算機",
    description: "配偶者の年収と世帯主の年収を入力するだけで控除額を自動計算。2026年改正対応。",
    url: "https://yamada-tools.jp/finance/haigusha-kojo-calculator",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HaigushaKojoClient />
    
      <RelatedTools currentTool={tool} maxItems={6} /></>
  );
}
