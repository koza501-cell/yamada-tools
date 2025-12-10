import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ReorderClient from "./client";

const tool = pdfTools.find((t) => t.id === "reorder")!;

const faq = [
  {
    question: "ページ並べ替えは無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "どうやって順番を指定しますか？",
    answer: "新しい順番をカンマ区切りで入力します（例：3,1,2）。",
  },
  {
    question: "ページを削除することもできますか？",
    answer: "並べ替えのみです。削除は「ページ削除」ツールをご利用ください。",
  },
  {
    question: "元の順番に戻せますか？",
    answer: "新しいPDFが作成されるため、元のファイルは変更されません。",
  }
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFのページ順序を並べ替える無料オンラインツール。ページの順番を自由に変更。スキャンミスの修正や資料の整理に。日本国内サーバーで安全処理。",
  keywords: [
    "PDF ページ並べ替え",
    "PDF 順番変更",
    "PDF reorder",
    "PDF ページ順",
    "PDF 並び替え",
    "無料 PDFページ並べ替え",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function ReorderPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ReorderClient faq={faq} />
    </>
  );
}
