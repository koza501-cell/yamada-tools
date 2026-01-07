import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("text-diff")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、データは保存されません。" },
];

const seoContent = {
  intro: "2つのテキストを比較して差分を表示。変更箇所、追加箇所、削除箇所がハイライトされます。",
  useCases: [
    { title: "📝 文書比較", desc: "修正前後の変更点確認" },
    { title: "💻 コード比較", desc: "ソースコードの差分" },
    { title: "📄 契約書", desc: "契約書の変更確認" },
    { title: "🔍 校正", desc: "編集箇所の確認" },
  ],
  tips: "行単位と文字単位の両方で差分を確認できます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】テキスト比較｜2つの文章の差分表示",
  tool,
  longDescription: "2つのテキストを比較して差分を表示。変更箇所、追加箇所、削除箇所がハイライトされます。",
  keywords: ['テキスト 比較', '差分 比較', 'diff', '文章 比較'],
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
