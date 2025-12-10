import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import WordToPdfClient from "./client";

const tool = pdfTools.find((t) => t.id === "word-to-pdf")!;

const faq = [
  {
    question: "WordからPDF変換は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "対応しているWordの形式は？",
    answer: ".doc と .docx の両方に対応しています。",
  },
  {
    question: "フォントや書式は維持されますか？",
    answer: "はい。フォント、書式、レイアウトを可能な限り維持して変換します。",
  },
  {
    question: "画像や表も変換されますか？",
    answer: "はい。画像、表、グラフなども含めて変換されます。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "WordファイルをPDFに変換する無料オンラインツール。doc・docx対応。フォントやレイアウトを維持して変換。ビジネス文書の共有に最適。日本国内サーバーで安全処理。",
  keywords: [
    "Word PDF 変換",
    "docx PDF 変換",
    "ワード PDF",
    "Word to PDF",
    "doc PDF",
    "文書 PDF化",
    "無料 WordPDF変換",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function WordToPdfPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <WordToPdfClient faq={faq} />
    </>
  );
}
