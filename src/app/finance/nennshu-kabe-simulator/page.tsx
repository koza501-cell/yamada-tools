import { Metadata } from "next";
import NennshuKabeClient from "./client";

export const metadata: Metadata = {
  title: "年収の壁シミュレーター【2025年改正・123万円対応】| 山田ツール",
  description: "パート・配偶者の年収が壁を超えたらいくら損する？2025年改正後の123万円の壁を正確に計算。社会保険・所得税・住民税・配偶者控除への影響を一括シミュレーション。",
  keywords: ["年収の壁", "103万円の壁", "123万円の壁", "扶養 計算", "パート 年収 損", "配偶者控除"],
  alternates: { canonical: "https://yamada-tools.jp/finance/nennshu-kabe-simulator" },
  openGraph: {
    title: "年収の壁シミュレーター【2025年改正・123万円対応】",
    description: "パート・配偶者の年収が壁を超えたらいくら損するか計算。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "年収の壁シミュレーター",
      "url": "https://yamada-tools.jp/finance/nennshu-kabe-simulator",
      "description": "2025年改正・123万円対応。パート・配偶者の年収と壁の影響を正確に計算。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "年収の壁シミュレーター", "item": "https://yamada-tools.jp/finance/nennshu-kabe-simulator" }
      ]
    }
  ]
};

export default function NennshuKabePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NennshuKabeClient />
    </>
  );
}
