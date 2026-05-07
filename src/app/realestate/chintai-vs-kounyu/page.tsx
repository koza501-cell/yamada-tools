import type { Metadata } from "next";
import ChintaiVsKounyuClient from "./client";

export const metadata: Metadata = {
  title: "賃貸 vs 購入 比較シミュレーター【中立・35年コスト計算】| 山田ツール",
  description: "賃貸と購入の生涯コストを中立的に比較。不動産会社のバイアスなし。35年・50年の総費用、住宅ローン控除、売却後の実質コストまで計算。",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "賃貸 vs 購入 比較シミュレーター",
    description: "賃貸と購入の生涯コストを中立的に比較。35年・50年総費用を計算。",
    url: "https://yamada-tools.jp/realestate/chintai-vs-kounyu",
    applicationCategory: "FinanceApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ChintaiVsKounyuClient />
    </>
  );
}
