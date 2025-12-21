import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import MergeClient from "./client";
import ToolSchema from '@/components/ToolSchema';
import { toolSchemas } from '@/data/toolSchemas';

const tool = pdfTools.find((t) => t.id === "merge")!;

const faq = [
  {
    question: "PDF結合は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "何ファイルまで結合できますか？",
    answer: "最大50ファイルまで一度に結合できます。",
  },
  {
    question: "ファイルサイズの制限はありますか？",
    answer: "1ファイルあたり最大20MBまでアップロード可能です。",
  },
  {
    question: "アップロードしたファイルは安全ですか？",
    answer: "はい。ファイルは日本国内のサーバーで処理され、60分以内に自動削除されます。SSL暗号化通信で安全に転送されます。",
  },
  {
    question: "結合後のPDFの品質は変わりますか？",
    answer: "いいえ。元のPDFの品質を維持したまま結合されます。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "複数のPDFファイルを1つに結合する無料オンラインツール。最大50ファイルまで対応。日本国内サーバーで処理するため、機密文書も安心してご利用いただけます。登録不要、ファイルは60分で自動削除。",
  keywords: [
    "PDF結合",
    "PDF まとめる",
    "PDF 1つにする",
    "複数PDF 結合",
    "PDFファイル 結合",
    "PDF merge",
    "PDF 統合",
    "無料 PDF結合",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);
const schema = toolSchemas['pdf-merge'];

export default function MergePage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ToolSchema {...schema} />
      <MergeClient faq={faq} />
    </>
  );
}
