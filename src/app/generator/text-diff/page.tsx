import { Metadata } from "next";
import TextDiffClient from "./client";

const faq = [
  {
    question: "どのような差分を検出できますか？",
    answer: "追加、削除、変更された行や単語を検出し、色分けして表示します。",
  },
  {
    question: "日本語に対応していますか？",
    answer: "はい。日本語を含むすべてのテキストに対応しています。",
  },
  {
    question: "長いテキストも比較できますか？",
    answer: "はい。制限なく比較できます。ただし非常に長いテキストは処理に時間がかかる場合があります。",
  },
  {
    question: "差分結果を保存できますか？",
    answer: "はい。差分結果をテキストファイルとしてダウンロードできます。",
  },
];

export const metadata: Metadata = {
  title: "テキスト差分比較 | 山田ツール - 無料オンライン差分チェック",
  description: "2つのテキストの差分を比較。追加・削除・変更を色分け表示。コード比較にも対応。登録不要、完全無料。",
  keywords: ["テキスト比較", "差分比較", "diff", "テキスト差分", "コード比較", "無料"],
  openGraph: {
    title: "テキスト差分比較 | 山田ツール",
    description: "2つのテキストの差分を比較。完全無料。",
    url: "https://yamada-tools.jp/generator/text-diff",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "テキスト差分比較 | 山田ツール",
    description: "2つのテキストの差分を比較。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/text-diff",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "テキスト差分比較",
    "description": "2つのテキストの差分を比較するオンラインツール",
    "url": "https://yamada-tools.jp/generator/text-diff",
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

export default function TextDiffPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <TextDiffClient faq={faq} />
    </>
  );
}
