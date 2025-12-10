import { Metadata } from "next";
import WarekiSeirekiClient from "./client";

const faq = [
  {
    question: "対応している元号は何ですか？",
    answer: "明治、大正、昭和、平成、令和に対応しています。明治は1868年（明治元年）から対応しています。",
  },
  {
    question: "令和以降の新しい元号にも対応しますか？",
    answer: "はい、新しい元号が制定された場合はアップデートで対応予定です。",
  },
  {
    question: "西暦から和暦への変換は正確ですか？",
    answer: "はい。各元号の開始日と終了日を正確に設定しているため、正確な変換が可能です。",
  },
  {
    question: "データは保存されますか？",
    answer: "いいえ。すべての処理はブラウザ内で行われ、サーバーにデータは送信されません。",
  },
];

export const metadata: Metadata = {
  title: "和暦・西暦変換 | 山田ツール - 無料オンライン年号変換",
  description: "和暦（令和・平成・昭和・大正・明治）と西暦を相互変換。生年月日入力で年齢も自動計算。ブラウザ内処理で安全。登録不要、完全無料。",
  keywords: ["和暦 西暦 変換", "令和 西暦", "平成 西暦", "昭和 西暦", "年号変換", "元号変換", "無料"],
  openGraph: {
    title: "和暦・西暦変換 | 山田ツール",
    description: "和暦↔西暦を瞬時に変換。年齢計算も対応。完全無料。",
    url: "https://yamada-tools.jp/convert/wareki-seireki",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "和暦・西暦変換 | 山田ツール",
    description: "和暦↔西暦を瞬時に変換。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/convert/wareki-seireki",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "和暦・西暦変換",
    "description": "和暦と西暦を相互変換するオンラインツール",
    "url": "https://yamada-tools.jp/convert/wareki-seireki",
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

export default function WarekiSeirekiPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <WarekiSeirekiClient faq={faq} />
    </>
  );
}
