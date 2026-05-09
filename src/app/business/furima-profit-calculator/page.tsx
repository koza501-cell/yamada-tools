import { Metadata } from "next";
import FurimaClient from "./client";

export const metadata: Metadata = {
  title: "古物商・フリマ仕入れ利益計算機 — メルカリ・eBay・ヤフオク対応 | 山田ツール",
  description:
    "仕入れ値・販売価格・手数料・送料から利益と利益率を自動計算。メルカリ・eBay・ヤフオク・Amazon・ラクマ対応。損益分岐点・目標利益率逆算機能付き。登録不要・完全無料。",
  keywords: [
    "フリマ 利益計算 仕入れ",
    "メルカリ 利益計算機",
    "eBay 利益計算",
    "古物商 仕入れ 利益率",
    "ヤフオク 手数料 計算",
    "転売 利益計算 無料",
    "損益分岐点 販売価格",
    "フリマ 手数料 計算機",
  ],
  alternates: { canonical: "https://yamada-tools.jp/business/furima-profit-calculator" },
  openGraph: {
    title: "古物商・フリマ仕入れ利益計算機 — メルカリ・eBay・ヤフオク対応",
    description: "仕入れ値・手数料・送料から利益と利益率を自動計算。損益分岐点・目標利益率逆算付き。無料。",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "古物商・フリマ仕入れ利益計算機",
      url: "https://yamada-tools.jp/business/furima-profit-calculator",
      description: "フリマアプリ・オークションの仕入れ利益を自動計算。メルカリ・eBay・ヤフオク・Amazon・ラクマ対応。",
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
        { "@type": "ListItem", position: 3, name: "フリマ利益計算機", item: "https://yamada-tools.jp/business/furima-profit-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "メルカリの手数料は何%ですか？", acceptedAnswer: { "@type": "Answer", text: "メルカリの販売手数料は販売価格の10%です。" } },
        { "@type": "Question", name: "損益分岐点とは何ですか？", acceptedAnswer: { "@type": "Answer", text: "損益分岐点販売価格とは、利益がゼロになる最低限の販売価格です。" } },
      ],
    },
  ],
};

export default function FurimaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FurimaClient />
    </>
  );
}
