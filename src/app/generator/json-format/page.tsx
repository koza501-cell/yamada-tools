import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import JsonFormatClient from "./client";
import RelatedTools from "@/components/common/RelatedTools";

const tool = getToolById("json-format")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "JSONデータを見やすく整形（フォーマット）。圧縮されたJSONを読みやすく展開、または圧縮します。",
  useCases: [
    { title: "💻 開発", desc: "APIレスポンスの確認" },
    { title: "🔍 デバッグ", desc: "JSONデータの検証" },
    { title: "📝 編集", desc: "JSONファイルの編集" },
    { title: "📦 圧縮", desc: "JSONの軽量化" },
  ],
  tips: "シンタックスエラーがある場合は、エラー箇所が表示されます。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】JSON整形｜見やすくフォーマット",
  tool,
  longDescription: "JSONデータを見やすく整形（フォーマット）。圧縮されたJSONを読みやすく展開、または圧縮します。",
  keywords: ['JSON 整形', 'JSON フォーマット', 'JSON 変換', 'JSON 圧縮'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JsonFormatClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>

    </>
  );
}
