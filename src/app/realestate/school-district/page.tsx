import { Metadata } from "next";
import SchoolDistrictClient from "./client";

export const metadata: Metadata = {
  title: "学区チェッカー — 住所で小学校・中学校の学区を確認 | 山田ツール",
  description:
    "住所を入力するだけで小学校区・中学校区を即座に確認。子育て世帯の住まい選びに。国土交通省データ使用、完全無料・登録不要。",
  keywords: [
    "学区 調べ方",
    "小学校区 住所検索",
    "中学校区 確認",
    "学区 不動産",
    "子育て 住まい 学区",
    "学区チェッカー",
    "引越し 学区",
  ],
  openGraph: {
    title: "学区チェッカー — 住所で小学校・中学校の学区を確認",
    description: "住所だけで小学校区・中学校区を即座に確認。子育て世帯の住まい選びに。国土交通省データ使用、無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "学区チェッカー",
      "url": "https://yamada-tools.jp/realestate/school-district",
      "description": "住所を入力するだけで小学校区・中学校区を即座に確認できる無料ツール。",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "provider": { "@type": "Organization", "name": "山田ツール", "url": "https://yamada-tools.jp" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "ホーム", "item": "https://yamada-tools.jp" },
        { "@type": "ListItem", "position": 2, "name": "不動産", "item": "https://yamada-tools.jp/realestate" },
        { "@type": "ListItem", "position": 3, "name": "学区チェッカー", "item": "https://yamada-tools.jp/realestate/school-district" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "学区とは何ですか？", "acceptedAnswer": { "@type": "Answer", "text": "公立小学校・中学校に通う際に、住所によって指定される通学区域のことです。引越しや不動産購入の際に重要な情報です。" } },
        { "@type": "Question", "name": "学区は変わることがありますか？", "acceptedAnswer": { "@type": "Answer", "text": "はい。市区町村の教育委員会の判断により、学区は変更される場合があります。最新情報は必ず各市区町村の教育委員会にご確認ください。" } },
        { "@type": "Question", "name": "学区データが見つからない場合は？", "acceptedAnswer": { "@type": "Answer", "text": "一部の自治体では学区データが国土交通省のデータベースに未登録の場合があります。お住まいの市区町村の教育委員会に直接お問い合わせください。" } }
      ]
    }
  ]
};

export default function SchoolDistrictPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SchoolDistrictClient />
    </>
  );
}
