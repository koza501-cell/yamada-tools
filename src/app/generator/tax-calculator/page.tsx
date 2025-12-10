import { Metadata } from "next";
import TaxCalculatorClient from "./client";

const faq = [
  {
    question: "軽減税率8%が適用される品目は？",
    answer: "飲食料品（酒類・外食を除く）と週2回以上発行される新聞（定期購読）が軽減税率8%の対象です。",
  },
  {
    question: "税込価格から税抜価格を計算できますか？",
    answer: "はい。「税込→税抜」モードを選択すると、税込価格から税抜価格と消費税額を計算できます。",
  },
  {
    question: "複数の税率を同時に計算できますか？",
    answer: "はい。8%と10%の品目を別々に入力し、合計金額を計算できます。",
  },
  {
    question: "計算結果は保存されますか？",
    answer: "いいえ。すべての計算はブラウザ内で行われ、データは保存されません。",
  },
];

export const metadata: Metadata = {
  title: "消費税計算 | 山田ツール - 無料オンライン税込・税抜計算",
  description: "消費税8%・10%の税込・税抜価格を瞬時に計算。軽減税率にも対応。ブラウザ内処理で安全。登録不要、完全無料。",
  keywords: ["消費税計算", "税込計算", "税抜計算", "軽減税率", "8%", "10%", "無料"],
  openGraph: {
    title: "消費税計算 | 山田ツール",
    description: "消費税8%・10%を瞬時に計算。完全無料。",
    url: "https://yamada-tools.jp/generator/tax-calculator",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "消費税計算 | 山田ツール",
    description: "消費税を瞬時に計算。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/tax-calculator",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "消費税計算",
    "description": "消費税8%・10%の税込・税抜価格を計算するオンラインツール",
    "url": "https://yamada-tools.jp/generator/tax-calculator",
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

export default function TaxCalculatorPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <TaxCalculatorClient faq={faq} />
    </>
  );
}
