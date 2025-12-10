import { Metadata } from "next";
import { pdfTools } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ProtectClient from "./client";

const tool = pdfTools.find((t) => t.id === "protect")!;

const faq = [
  {
    question: "PDF保護は無料ですか？",
    answer: "はい、完全無料でご利用いただけます。登録も不要です。",
  },
  {
    question: "どのような保護ができますか？",
    answer: "パスワードによる閲覧制限を設定できます。",
  },
  {
    question: "パスワードを忘れたらどうなりますか？",
    answer: "パスワードは復元できないため、必ずメモしてください。",
  },
  {
    question: "パスワードの強度に制限はありますか？",
    answer: "英数字を含む8文字以上を推奨します。",
  }
];

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription:
    "PDFにパスワード保護を設定する無料オンラインツール。機密文書を暗号化して保護。閲覧制限をかけてセキュリティ強化。日本国内サーバーで安全処理。",
  keywords: [
    "PDF パスワード",
    "PDF 保護",
    "PDF 暗号化",
    "PDF protect",
    "PDF セキュリティ",
    "PDF ロック",
    "無料 PDF保護",
  ],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function ProtectPage() {
  return (
    <>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ProtectClient faq={faq} />
    </>
  );
}
