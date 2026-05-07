import { Metadata } from "next";
import ShiryoCostClient from "./client";

export const metadata: Metadata = {
  title: "酪農・畜産 飼料コスト計算機【頭数別・月間飼料費計算】| 山田ツール",
  description:
    "乳牛・肉牛・豚・鶏の頭数と飼料種別から月間飼料費を計算。飼料高騰対策の経営改善に役立つ無料ツール。登録不要。",
  keywords: [
    "飼料コスト 計算機",
    "酪農 飼料費",
    "畜産 飼料高騰",
    "乳牛 飼料費 計算",
    "月間飼料費 計算",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/health/shiryo-cost-calculator",
  },
  openGraph: {
    title: "酪農・畜産 飼料コスト計算機【頭数別・月間飼料費計算】",
    description:
      "乳牛・肉牛・豚・鶏の頭数と飼料種別から月間飼料費を計算。飼料高騰対策の経営改善に。",
    type: "website",
    url: "https://yamada-tools.jp/health/shiryo-cost-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "酪農・畜産 飼料コスト計算機",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://yamada-tools.jp/health/shiryo-cost-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      description:
        "乳牛・肉牛・豚・鶏の頭数と飼料種別から月間・年間の飼料費を計算します。",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "農業・健康", item: "https://yamada-tools.jp/health" },
        { "@type": "ListItem", position: 3, name: "酪農・畜産飼料コスト計算機", item: "https://yamada-tools.jp/health/shiryo-cost-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "飼料費削減のために何ができますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "自給飼料（WCS・稲わら）の拡大、飼料米の活用、TMRセンターの利用、飼料高騰対策補助金の活用などが有効です。",
          },
        },
        {
          "@type": "Question",
          name: "配合飼料の価格はどれくらい上がっていますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "2020年比で配合飼料は約40%上昇しています（2024年度時点）。",
          },
        },
      ],
    },
  ],
};

export default function ShiryoCostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShiryoCostClient />
    </>
  );
}
