import { Metadata } from "next";
import UnitConverterClient from "./client";

const faq = [
  {
    question: "どのような単位に対応していますか？",
    answer: "長さ、重さ、面積、体積、温度、時間、データ容量など、日常でよく使う単位に対応しています。",
  },
  {
    question: "日本の単位（坪、畳など）に対応していますか？",
    answer: "はい。坪、畳、尺、寸、合、升などの日本独自の単位にも対応しています。",
  },
  {
    question: "計算結果は正確ですか？",
    answer: "はい。国際単位系（SI）に基づいた正確な変換を行います。",
  },
  {
    question: "データは保存されますか？",
    answer: "いいえ。すべての計算はブラウザ内で行われ、データは保存されません。",
  },
];

export const metadata: Metadata = {
  title: "単位変換 | 山田ツール - 無料オンライン単位換算",
  description: "長さ・重さ・面積・体積・温度など、様々な単位を瞬時に変換。坪・畳など日本の単位にも対応。登録不要、完全無料。",
  keywords: ["単位変換", "単位換算", "長さ変換", "重さ変換", "面積変換", "坪", "畳", "無料"],
  openGraph: {
    title: "単位変換 | 山田ツール",
    description: "様々な単位を瞬時に変換。完全無料。",
    url: "https://yamada-tools.jp/convert/unit",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "単位変換 | 山田ツール",
    description: "様々な単位を瞬時に変換。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/convert/unit",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "単位変換",
    "description": "様々な単位を変換するオンラインツール",
    "url": "https://yamada-tools.jp/convert/unit",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  }
];

export default function UnitConverterPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <UnitConverterClient faq={faq} />
    </>
  );
}
