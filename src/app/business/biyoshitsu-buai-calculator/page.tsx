import { Metadata } from "next";
import BiyoshitsuClient from "./client";

export const metadata: Metadata = {
  title: "美容室 スタッフ歩合給計算機【無料】美容師・スタイリスト対応 | 山田ツール",
  description: "美容師・スタイリストの歩合給を自動計算。売上・指名料・店販歩合から手取り額まで一発計算。社会保険料・所得税控除も対応。登録不要・完全無料。",
  keywords: ["美容室 歩合 計算", "美容師 給料 計算", "スタイリスト 歩合給", "美容室 人件費率", "業務委託 美容師 計算", "指名料 歩合"],
  alternates: { canonical: "https://yamada-tools.jp/business/biyoshitsu-buai-calculator" },
  openGraph: {
    title: "美容室 スタッフ歩合給計算機【無料】",
    description: "売上・指名・店販歩合から手取りまで一発計算。社保・所得税控除対応。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "美容室スタッフ歩合給計算機",
      "url": "https://yamada-tools.jp/business/biyoshitsu-buai-calculator",
      "description": "美容師・スタイリストの歩合給を売上・指名・店販から自動計算。",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "ビジネス", "item": "https://yamada-tools.jp/business" },
        { "@type": "ListItem", "position": 3, "name": "美容室歩合給計算機", "item": "https://yamada-tools.jp/business/biyoshitsu-buai-calculator" }
      ]
    }
  ]
};

export default function BiyoshitsuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BiyoshitsuClient />
    </>
  );
}
