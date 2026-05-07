import type { Metadata } from "next";
import FukugyouShinkokuClient from "./client";

export const metadata: Metadata = {
  title: "副業 確定申告 必要判定ツール【会社員向け・20万円ルール】| 山田ツール",
  description: "副業収入・所得から確定申告が必要かを瞬時に判定。会社員の20万円ルール・住民税申告も完全対応。フリーランス・アルバイト・不動産収入など複数副業に対応。",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "副業 確定申告 必要判定ツール",
    description: "副業収入・所得から確定申告が必要かを瞬時に判定。会社員の20万円ルール対応。",
    url: "https://yamada-tools.jp/finance/fukugyou-shinkoku-checker",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FukugyouShinkokuClient />
    </>
  );
}
