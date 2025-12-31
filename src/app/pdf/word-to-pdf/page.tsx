import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("word-to-pdf")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "ファイルは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "WordファイルをPDFに変換。レイアウトを崩さずに、どの環境でも同じ見た目で表示されるPDFを作成します。",
  useCases: [
    { title: "📧 メール送付", desc: "Wordがない相手にも送れる" },
    { title: "📝 提出書類", desc: "編集されたくない文書に" },
    { title: "🖨️ 印刷用", desc: "レイアウト崩れを防止" },
    { title: "📁 アーカイブ", desc: "長期保存用にPDF化" },
  ],
  tips: "フォントが埋め込まれていないと、環境によって表示が変わる場合があります。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "WordファイルをPDFに変換。レイアウトを崩さずに、どの環境でも同じ見た目で表示されるPDFを作成します。",
  keywords: ['Word PDF 変換', 'Word PDF', 'docx PDF', 'ワード PDF'],
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
