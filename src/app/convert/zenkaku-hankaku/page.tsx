import { Metadata } from "next";
import ZenkakuHankakuClient from "./client";

const faq = [
  {
    question: "全角と半角の違いは何ですか？",
    answer: "全角は日本語入力で使われる幅広の文字（例：Ａ、１、あ）、半角は英数字で使われる幅の狭い文字（例：A、1）です。",
  },
  {
    question: "どんな文字が変換できますか？",
    answer: "英数字（A-Z、a-z、0-9）、カタカナ、記号（！、？、＠など）の全角↔半角変換ができます。",
  },
  {
    question: "変換は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "データは保存されますか？",
    answer: "いいえ。すべての変換はブラウザ内で行われ、サーバーにデータは送信されません。",
  },
];

export const metadata: Metadata = {
  title: "全角・半角変換 | 山田ツール - 無料オンライン変換ツール",
  description: "全角文字を半角に、半角文字を全角に一括変換。英数字、カタカナ、記号に対応。ブラウザ内で処理するため安全・高速。登録不要、完全無料。",
  keywords: ["全角 半角 変換", "全角半角変換", "半角変換", "全角変換", "カタカナ変換", "英数字変換", "無料"],
  openGraph: {
    title: "全角・半角変換 | 山田ツール",
    description: "全角↔半角を一括変換。英数字、カタカナ、記号に対応。完全無料。",
    url: "https://yamada-tools.jp/convert/zenkaku-hankaku",
    siteName: "山田ツール",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "全角・半角変換 | 山田ツール",
    description: "全角↔半角を一括変換。完全無料。",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/convert/zenkaku-hankaku",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "全角・半角変換",
    "description": "全角文字を半角に、半角文字を全角に一括変換するオンラインツール",
    "url": "https://yamada-tools.jp/convert/zenkaku-hankaku",
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

export default function ZenkakuHankakuPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ZenkakuHankakuClient faq={faq} />
    </>
  );
}
