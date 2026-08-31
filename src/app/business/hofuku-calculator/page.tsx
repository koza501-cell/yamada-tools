import { Metadata } from "next";
import HofukuClient from "./client";

export const metadata: Metadata = {
  title: "建設業 法定福利費計算機 — 見積書記載額を自動計算 | 山田ツール",
  description:
    "建設業の法定福利費を労務費から自動計算。2024年度最新保険料率（健康保険・厚生年金・雇用保険・労災保険）対応。見積書テキスト一括コピー機能付き。国土交通省通達準拠。",
  keywords: [
    "法定福利費 計算 建設業",
    "見積書 法定福利費 書き方",
    "法定福利費率 2024",
    "建設業 社会保険 計算機",
    "労務費 法定福利費 計算",
    "法定福利費 義務化 下請け",
    "建設業 見積書 社会保険",
  ],
  alternates: { canonical: "https://yamada-tools.jp/business/hofuku-calculator" },
  openGraph: {
    images: [{ url: "https://yamada-tools.jp/og-image.png", width: 1200, height: 630 }],
    title: "建設業 法定福利費計算機 — 見積書記載額を自動計算",
    description: "労務費から法定福利費を自動計算。見積書テキスト一括コピー付き。2024年度最新保険料率対応。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "建設業 法定福利費計算機",
      url: "https://yamada-tools.jp/business/hofuku-calculator",
      description: "建設業の法定福利費を労務費から自動計算。2024年度保険料率対応。",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      provider: { "@type": "Organization", name: "山田ツール", url: "https://yamada-tools.jp" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "ビジネス", item: "https://yamada-tools.jp/business" },
        { "@type": "ListItem", position: 3, name: "法定福利費計算機", item: "https://yamada-tools.jp/business/hofuku-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "建設業の法定福利費率は何%ですか？", acceptedAnswer: { "@type": "Answer", text: "2024年度の建設業における法定福利費率の合計は約16.34%です（健康保険5.00%＋厚生年金9.15%＋雇用保険0.95%＋労災保険0.88%＋子ども・子育て拠出金0.36%）。" } },
        { "@type": "Question", name: "法定福利費の見積書記載は義務ですか？", acceptedAnswer: { "@type": "Answer", text: "国土交通省の通達（平成24年以降）により、建設業の見積書には法定福利費を明示することが求められています。" } },
      ],
    },
  ],
};

export default function HofukuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HofukuClient />
    </>
  );
}
