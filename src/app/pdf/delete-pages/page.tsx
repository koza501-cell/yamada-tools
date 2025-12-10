import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import DeletePagesClient from "./client";

const tool = pdfTools.find((t) => t.id === "delete-pages")!;

const faq = [
  {
    question: "PDFページ削除は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "複数ページを一度に削除できますか？",
    answer: "はい。削除したいページ番号をカンマ区切りで指定できます（例：1,3,5）。",
  },
  {
    question: "削除後に元に戻せますか？",
    answer: "新しいPDFが生成されるため、元のファイルは変更されません。",
  },
  {
    question: "パスワード保護されたPDFも対応していますか？",
    answer: "パスワードを解除してからご利用ください。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFから不要なページを削除する無料オンラインツール。特定のページを選んで削除可能。スキャンミスや不要ページの除去に。日本国内サーバーで安全処理。",
  keywords: [
    "PDF ページ削除",
    "PDF ページ 消す",
    "PDF 不要ページ 削除",
    "PDF delete pages",
    "PDF ページ除去",
    "PDF 編集",
    "無料 PDFページ削除",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function DeletePagesPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <DeletePagesClient faq={faq} />
    </>
  );
}
