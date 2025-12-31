import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("password-zip")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、データは保存されません。" },
];

const seoContent = {
  intro: "ファイルをパスワード付きのZIPファイルに圧縮。メール添付時のセキュリティ対策に便利です。",
  useCases: [
    { title: "📧 メール添付", desc: "機密ファイルの安全な送信" },
    { title: "🔒 ファイル保護", desc: "重要ファイルの暗号化" },
    { title: "📦 まとめて圧縮", desc: "複数ファイルを1つに" },
    { title: "💼 取引先送付", desc: "セキュリティ要件への対応" },
  ],
  tips: "パスワードは別のメールや電話で伝えましょう（PPAP方式）。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "ファイルをパスワード付きのZIPファイルに圧縮。メール添付時のセキュリティ対策に便利です。",
  keywords: ['パスワード付きZIP', 'ZIP 暗号化', 'ZIP パスワード', 'ファイル圧縮'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool} faq={faq} seoContent={seoContent} />
    </>
  );
}
