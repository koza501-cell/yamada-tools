import { Metadata } from "next";
import DateConverterClient from "./client";

const faq = [
  {
    question: "どの年号に対応していますか？",
    answer: "明治、大正、昭和、平成、令和の5つの年号に対応しています。",
  },
  {
    question: "西暦から和暦への変換はできますか？",
    answer: "はい。西暦から和暦、和暦から西暦の双方向変換が可能です。",
  },
  {
    question: "存在しない日付を入力するとどうなりますか？",
    answer: "エラーメッセージが表示されます。例えば、2月30日などは無効な日付として扱われます。",
  },
  {
    question: "干支も表示されますか？",
    answer: "はい。変換結果に対応する干支（十二支）も表示されます。",
  },
];

export const metadata: Metadata = {
  title: "和暦西暦変換 | 山田ツール - 無料オンライン日付変換ツール",
  description: "令和・平成・昭和・大正・明治を西暦に変換。西暦から和暦への変換も可能。干支表示付き。登録不要、完全無料。",
  keywords: ["和暦西暦変換", "令和変換", "平成変換", "昭和変換", "年号変換", "干支", "無料"],
  openGraph: {
    title: "和暦西暦変換 | 山田ツール",
    description: "令和・平成・昭和・大正・明治を西暦に変換。完全無料。",
    url: "https://yamada-tools.jp/convert/date-converter",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "和暦西暦変換 | 山田ツール",
    description: "令和・平成・昭和・大正・明治を西暦に変換。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/convert/date-converter",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "和暦西暦変換",
    "description": "和暦と西暦を相互変換するオンラインツール",
    "url": "https://yamada-tools.jp/convert/date-converter",
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

export default function DateConverterPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <DateConverterClient faq={faq} />
    </>
  );
}
