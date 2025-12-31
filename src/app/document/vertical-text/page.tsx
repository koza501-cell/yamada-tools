import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import ToolPage from "@/components/tools/ToolPage";

const tool = getToolById("vertical-text")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "横書きのテキストを縦書きに変換。小説、詩、手紙など、縦書きが必要な文書作成に便利です。",
  useCases: [
    { title: "📚 小説執筆", desc: "縦書き形式の原稿作成" },
    { title: "✉️ 手紙", desc: "縦書きの手紙を作成" },
    { title: "📜 詩・俳句", desc: "縦書きの詩や俳句" },
    { title: "🎌 日本語文書", desc: "伝統的な縦書き文書" },
  ],
  tips: "ルビ（ふりがな）を付ける場合は、別途設定が必要です。",
};

export const metadata: Metadata = generateToolMetadata({
  tool,
  longDescription: "横書きのテキストを縦書きに変換。小説、詩、手紙など、縦書きが必要な文書作成に便利です。",
  keywords: ['縦書き 変換', '縦書き ツール', '横書き 縦書き', '縦書き エディタ'],
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
