import { Metadata } from "next";
import ChukaiClient from "./client";

export const metadata: Metadata = {
  title: "不動産 仲介手数料計算機【法定上限・早見表付き】売買・賃貸対応",
  description: "売買・賃貸の仲介手数料の法定上限を自動計算。400万円以下の特例・2024年改正対応。早見表付き。賃貸の借主・貸主上限も計算。登録不要・無料。",
  keywords: ["仲介手数料 計算", "不動産 仲介手数料 上限", "仲介手数料 計算機", "3%+6万 計算", "賃貸 仲介手数料", "仲介手数料 無料 交渉"],
  alternates: { canonical: "https://yamada-tools.jp/realestate/chukaishusuryocalculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "不動産 仲介手数料計算機【法定上限・早見表付き】",
    description: "売買・賃貸の仲介手数料の法定上限を即計算。2024年改正対応。早見表付き。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "不動産仲介手数料計算機",
      "url": "https://yamada-tools.jp/realestate/chukaishusuryocalculator",
      "description": "売買・賃貸の仲介手数料の法定上限を自動計算。2024年改正対応。",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "不動産", "item": "https://yamada-tools.jp/realestate" },
        { "@type": "ListItem", "position": 3, "name": "仲介手数料計算機", "item": "https://yamada-tools.jp/realestate/chukaishusuryocalculator" }
      ]
    }
  ]
};

export default function ChukaiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ChukaiClient />
    </>
  );
}
