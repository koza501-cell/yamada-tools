import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import RotateClient from "./client";

const tool = pdfTools.find((t) => t.id === "rotate")!;

const faq = [
  {
    question: "PDF回転は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "何度回転できますか？",
    answer: "90度、180度、270度の回転が可能です。",
  },
  {
    question: "特定のページだけ回転できますか？",
    answer: "現在は全ページを一括で回転します。",
  },
  {
    question: "スキャンしたPDFも回転できますか？",
    answer: "はい。スキャンしたPDFでも問題なく回転できます。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFページを回転させる無料オンラインツール。90度・180度・270度回転に対応。横向きのスキャンPDFを正しい向きに修正。日本国内サーバーで安全処理。",
  keywords: [
    "PDF回転",
    "PDF 向き 変える",
    "PDF 横向き 縦向き",
    "PDF rotate",
    "PDF ページ回転",
    "PDF 90度回転",
    "無料 PDF回転",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function RotatePage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <RotateClient faq={faq} />
    </>
  );
}
