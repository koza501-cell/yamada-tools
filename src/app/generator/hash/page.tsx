import { Metadata } from "next";
import HashClient from "./client";

const faq = [
  {
    question: "ハッシュ値とは何ですか？",
    answer: "ハッシュ値は、データを固定長の文字列に変換したものです。同じデータからは常に同じハッシュ値が生成されます。",
  },
  {
    question: "どのアルゴリズムを使えばいいですか？",
    answer: "一般的にはSHA-256が推奨されます。MD5やSHA-1はセキュリティ上の理由から非推奨です。",
  },
  {
    question: "ファイルのハッシュも計算できますか？",
    answer: "はい。テキストだけでなく、ファイルをアップロードしてハッシュ値を計算することもできます。",
  },
  {
    question: "ハッシュ値から元のデータは復元できますか？",
    answer: "いいえ。ハッシュは一方向の変換なので、ハッシュ値から元のデータを復元することはできません。",
  },
];

export const metadata: Metadata = {
  title: "ハッシュ生成 | 山田ツール - MD5/SHA-256ハッシュ計算",
  description: "テキストやファイルのハッシュ値を生成。MD5、SHA-1、SHA-256、SHA-512対応。登録不要、完全無料。",
  keywords: ["ハッシュ生成", "MD5", "SHA-256", "SHA-512", "ハッシュ計算", "チェックサム", "無料"],
  openGraph: {
    title: "ハッシュ生成 | 山田ツール",
    description: "テキストやファイルのハッシュ値を生成。完全無料。",
    url: "https://yamada-tools.jp/generator/hash",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ハッシュ生成 | 山田ツール",
    description: "テキストやファイルのハッシュ値を生成。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/hash",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ハッシュ生成",
    "description": "テキストやファイルのハッシュ値を生成するオンラインツール",
    "url": "https://yamada-tools.jp/generator/hash",
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

export default function HashPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <HashClient faq={faq} />
    </>
  );
}
