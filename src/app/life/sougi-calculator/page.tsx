import { Metadata } from "next";
import SougiClient from "./client";

export const metadata: Metadata = {
  title: "葬儀費用 見積もり計算機【2025年版】費用相場・補助金対応 | 山田ツール",
  description: "葬儀の形式・規模・オプションから費用の目安を計算。一般葬・家族葬・直葬の相場と比較。葬祭費補助金の控除も自動計算。登録不要・無料。",
  keywords: ["葬儀費用 計算", "葬儀 相場", "家族葬 費用", "直葬 費用", "葬祭費 補助金", "お布施 相場", "葬儀 見積もり"],
  alternates: { canonical: "https://yamada-tools.jp/life/sougi-calculator" },
  openGraph: {
    title: "葬儀費用 見積もり計算機【2025年版】",
    description: "葬儀形式・規模・オプションから費用目安を計算。補助金控除対応。完全無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "葬儀費用見積もり計算機",
      "url": "https://yamada-tools.jp/life/sougi-calculator",
      "description": "葬儀の形式・規模・オプションから費用の目安を計算。補助金控除対応。",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "ライフ", "item": "https://yamada-tools.jp/life" },
        { "@type": "ListItem", "position": 3, "name": "葬儀費用計算機", "item": "https://yamada-tools.jp/life/sougi-calculator" }
      ]
    }
  ]
};

export default function SougiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SougiClient />
    </>
  );
}
