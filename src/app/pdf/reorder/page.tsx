import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("reorder")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "ファイルは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "PDFのページ順序を変更。ドラッグ&ドロップで簡単にページを並び替えられます。",
  useCases: [
    { title: "📄 順序修正", desc: "間違った順序を修正" },
    { title: "📑 再構成", desc: "章の順番を入れ替え" },
    { title: "📊 報告書整理", desc: "ページ順の最適化" },
    { title: "🖨️ 印刷準備", desc: "印刷用に順序調整" },
  ],
  tips: "プレビューで確認しながら並び替えができます。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "PDFのページ順序を変更。ドラッグ&ドロップで簡単にページを並び替えられます。",
  keywords: ['PDF ページ並び替え', 'PDF 順番変更', 'PDF ページ順', 'PDF 編集'],
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
