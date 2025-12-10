import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ExcelToPdfClient from "./client";

const tool = pdfTools.find((t) => t.id === "excel-to-pdf")!;

const faq = [
  {
    question: "ExcelからPDF変換は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "対応しているExcelの形式は？",
    answer: ".xls と .xlsx の両方に対応しています。",
  },
  {
    question: "複数シートはどうなりますか？",
    answer: "すべてのシートが1つのPDFにまとめられます。",
  },
  {
    question: "グラフや図形も変換されますか？",
    answer: "はい。グラフ、図形、画像もすべて変換されます。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "ExcelファイルをPDFに変換する無料オンラインツール。xls・xlsx対応。表、グラフ、複数シートを1つのPDFに。印刷用やメール添付に最適。日本国内サーバーで安全処理。",
  keywords: [
    "Excel PDF 変換",
    "xlsx PDF 変換",
    "エクセル PDF",
    "Excel to PDF",
    "xls PDF",
    "スプレッドシート PDF",
    "無料 ExcelPDF変換",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function ExcelToPdfPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ExcelToPdfClient faq={faq} />
    </>
  );
}
