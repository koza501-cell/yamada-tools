import { Metadata } from "next";
import RandomPickerClient from "./client";

const faq = [
  {
    question: "どのような場面で使えますか？",
    answer: "会議の発表順、当番決め、プレゼント抽選、チーム分けなど、公平にランダムで選びたい場面で使えます。",
  },
  {
    question: "最大何人まで登録できますか？",
    answer: "制限はありません。必要な数だけ項目を追加できます。",
  },
  {
    question: "結果は保存されますか？",
    answer: "いいえ。すべての処理はブラウザ内で行われ、データは保存されません。",
  },
  {
    question: "複数人を同時に選べますか？",
    answer: "はい。抽選人数を設定することで、複数人を一度に選ぶことができます。",
  },
];

export const metadata: Metadata = {
  title: "ランダム抽選 | 山田ツール - 無料オンライン抽選・くじ引きツール",
  description: "名前やアイテムをランダムに抽選。会議の順番決め、当番決め、プレゼント抽選に。登録不要、完全無料。",
  keywords: ["ランダム抽選", "くじ引き", "抽選ツール", "順番決め", "当番決め", "無料"],
  openGraph: {
    title: "ランダム抽選 | 山田ツール",
    description: "名前やアイテムをランダムに抽選。完全無料。",
    url: "https://yamada-tools.jp/generator/random-picker",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ランダム抽選 | 山田ツール",
    description: "名前やアイテムをランダムに抽選。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/random-picker",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ランダム抽選",
    "description": "名前やアイテムをランダムに抽選するオンラインツール",
    "url": "https://yamada-tools.jp/generator/random-picker",
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

export default function RandomPickerPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <RandomPickerClient faq={faq} />
    </>
  );
}
