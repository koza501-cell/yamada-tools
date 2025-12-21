import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import CompressClient from "./client";
import ToolSchema from '@/components/ToolSchema';
import { toolSchemas } from '@/data/toolSchemas';

const tool = pdfTools.find((t) => t.id === "compress")!;

const faq = [
  {
    question: "PDF圧縮は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "どのくらい圧縮できますか？",
    answer: "平均して40-70%のファイルサイズ削減が可能です。",
  },
  {
    question: "画質は劣化しますか？",
    answer: "圧縮レベルを選択できます。高品質モードでは画質をほぼ保ちながら圧縮できます。",
  },
  {
    question: "アップロードしたファイルは安全ですか？",
    answer: "はい。ファイルは日本国内のサーバーで処理され、60分以内に自動削除されます。",
  },
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFファイルのサイズを圧縮する無料オンラインツール。画質を保ちながら最大70%のサイズ削減が可能。日本国内サーバーで安全に処理。",
  keywords: [
    "PDF圧縮",
    "PDF サイズ縮小",
    "PDF 軽くする",
    "PDF compress",
    "無料 PDF圧縮",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);
const schema = toolSchemas['pdf-compress'];

export default function CompressPage() {
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
      <CompressClient faq={faq} />
    </>
  );
}
