import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import SplitClient from "./client";

const tool = pdfTools.find((t) => t.id === "split")!;

const faq = [
  {
    question: "PDF分割は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "何ページでも分割できますか？",
    answer: "はい。ページ数に制限はありません。各ページを個別のPDFファイルに分割します。",
  },
  {
    question: "分割後のファイル形式は？",
    answer: "分割された各ページはPDFファイルとしてZIPファイルでダウンロードできます。",
  },
  {
    question: "元のPDFの品質は維持されますか？",
    answer: "はい。分割しても元の品質は完全に維持されます。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFファイルを複数のファイルに分割する無料オンラインツール。1ページずつ個別のPDFに分割。大きなPDFを小さく分けて管理しやすく。日本国内サーバーで安全処理。",
  keywords: [
    "PDF分割",
    "PDF ページ 分ける",
    "PDF 分離",
    "PDF split",
    "PDF ページ分割",
    "PDF 切り離し",
    "無料 PDF分割",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function SplitPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SplitClient faq={faq} />
    </>
  );
}
