import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("text-case")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、データは保存されません。" },
];

const seoContent = {
  intro: "大文字・小文字変換、キャメルケース・スネークケースなど、テキストの形式を変換します。",
  useCases: [
    { title: "💻 プログラミング", desc: "変数名の形式変換" },
    { title: "📝 文書作成", desc: "タイトルの大文字化" },
    { title: "🔤 英語", desc: "大文字小文字の統一" },
    { title: "📊 データ整理", desc: "表記の統一" },
  ],
  tips: "camelCase、snake_case、UPPER_CASE など様々な形式に対応しています。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】大文字小文字変換｜英字ケース変換",
  tool,
  longDescription: "大文字・小文字変換、キャメルケース・スネークケースなど、テキストの形式を変換します。",
  keywords: ['大文字 小文字 変換', 'キャメルケース', 'スネークケース', 'テキスト変換'],
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
