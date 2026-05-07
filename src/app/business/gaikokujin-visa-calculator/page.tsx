import { Metadata } from "next";
import GaikokujinVisaClient from "./client";

export const metadata: Metadata = {
  title: "外国人採用 ビザ費用計算機【技術・人文・国際業務ビザ対応】| 山田ツール",
  description:
    "技術・人文知識・国際業務ビザの申請費用を採用人数・国籍・サポート方法から計算。特定技能との比較も。行政書士費用・更新費用・継続雇用コストを一括試算。無料・登録不要。",
  keywords: [
    "外国人採用 ビザ費用",
    "技術人文国際業務ビザ 費用",
    "就労ビザ 費用計算",
    "行政書士費用 ビザ",
    "外国人雇用 コスト",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/business/gaikokujin-visa-calculator",
  },
  openGraph: {
    title: "外国人採用 ビザ費用計算機【技術・人文・国際業務ビザ対応】",
    description:
      "技術・人文知識・国際業務ビザの申請費用を採用人数・国籍から計算。行政書士費用・更新費用を試算。",
    type: "website",
    url: "https://yamada-tools.jp/business/gaikokujin-visa-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "外国人採用 ビザ費用計算機",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://yamada-tools.jp/business/gaikokujin-visa-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      description:
        "技術・人文知識・国際業務ビザの申請から継続更新までの費用を計算します。",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://yamada-tools.jp" },
        { "@type": "ListItem", position: 2, name: "ビジネス・法人", item: "https://yamada-tools.jp/business" },
        { "@type": "ListItem", position: 3, name: "外国人採用ビザ費用計算機", item: "https://yamada-tools.jp/business/gaikokujin-visa-calculator" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "技術・人文知識・国際業務ビザの許可要件は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "大学卒業以上、または関連分野の実務経験10年以上が必要です。ITエンジニア・経理・営業・通訳・デザイナー等の職種が対象です。",
          },
        },
        {
          "@type": "Question",
          name: "行政書士費用の相場はいくらですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "在留資格認定証明書の新規申請は8万〜20万円、在留資格変更は5万〜15万円、更新申請は3万〜8万円が相場です。",
          },
        },
      ],
    },
  ],
};

export default function GaikokujinVisaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GaikokujinVisaClient />
    </>
  );
}
