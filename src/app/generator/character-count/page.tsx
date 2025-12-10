import { Metadata } from "next";
import CharacterCountClient from "./client";

const faq = [
  {
    question: "どんな文字がカウントされますか？",
    answer: "全角・半角文字、ひらがな、カタカナ、漢字、英数字、記号、スペース、改行など、すべての文字がカウントされます。",
  },
  {
    question: "スペースや改行は含まれますか？",
    answer: "はい。「スペース含む」「改行含む」のオプションで、含めるかどうかを選択できます。",
  },
  {
    question: "最大何文字までカウントできますか？",
    answer: "制限はありません。長文でも瞬時にカウントできます。",
  },
  {
    question: "データは保存されますか？",
    answer: "いいえ。すべての処理はブラウザ内で行われ、サーバーにデータは送信されません。",
  },
];

export const metadata: Metadata = {
  title: "文字数カウント | 山田ツール - 無料オンライン文字数チェック",
  description: "文字数・単語数・行数を瞬時にカウント。全角・半角、スペース除外オプション付き。ブラウザ内処理で安全。登録不要、完全無料。",
  keywords: ["文字数カウント", "文字数チェック", "単語数", "行数カウント", "文字数確認", "無料", "オンライン"],
  openGraph: {
    title: "文字数カウント | 山田ツール",
    description: "文字数・単語数・行数を瞬時にカウント。完全無料。",
    url: "https://yamada-tools.jp/generator/character-count",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "文字数カウント | 山田ツール",
    description: "文字数・単語数・行数を瞬時にカウント。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/character-count",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "文字数カウント",
    "description": "文字数・単語数・行数を瞬時にカウントするオンラインツール",
    "url": "https://yamada-tools.jp/generator/character-count",
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

export default function CharacterCountPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <CharacterCountClient faq={faq} />
    </>
  );
}
