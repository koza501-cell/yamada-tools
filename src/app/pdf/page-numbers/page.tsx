import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import PageNumbersClient from "./client";

const tool = pdfTools.find((t) => t.id === "page-numbers")!;

const faq = [
  {
    question: "ページ番号追加は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "ページ番号の位置は選べますか？",
    answer: "上部または下部の中央に配置できます。",
  },
  {
    question: "開始番号は変更できますか？",
    answer: "現在は1から開始します。",
  },
  {
    question: "既存のページ番号と重なりませんか？",
    answer: "既存のページ番号がある場合は重なる可能性があります。",
  }
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFにページ番号を追加する無料オンラインツール。全ページに自動で番号付け。文書管理や印刷に便利。上下の位置選択可能。日本国内サーバーで安全処理。",
  keywords: [
    "PDF ページ番号",
    "PDF 番号追加",
    "PDF ページ番号付け",
    "PDF page numbers",
    "PDF ナンバリング",
    "無料 PDFページ番号",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function PageNumbersPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PageNumbersClient faq={faq} />
    </>
  );
}
