import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import RegexTestClient from "./client";

const tool = getToolById("regex-test")!;

const faq = [
  { question: "無料で使えますか？", answer: "はい、完全無料で登録も不要です。" },
  { question: "スマホからも使えますか？", answer: "はい、iPhone・Androidどちらからも利用可能です。" },
  { question: "データは安全ですか？", answer: "日本国内サーバーで処理され、60分後に自動削除されます。" },
];

const seoContent = {
  intro: "正規表現のパターンをリアルタイムでテスト。マッチ結果やグループのハイライト表示に対応。",
  useCases: [
    { title: "💻 開発", desc: "正規表現パターンの検証" },
    { title: "🔍 検索", desc: "テキストパターンの確認" },
    { title: "📝 置換", desc: "置換パターンのテスト" },
    { title: "📚 学習", desc: "正規表現の学習" },
  ],
  tips: "よく使うパターン（メール、電話番号など）のサンプルも用意しています。",
};

export const metadata: Metadata = generateToolMetadata({
  customTitle: "【無料】正規表現テスト｜リアルタイム検証",
  tool,
  longDescription: "正規表現のパターンをリアルタイムでテスト。マッチ結果やグループのハイライト表示に対応。",
  keywords: ['正規表現 テスト', 'regex テスト', '正規表現 確認', '正規表現 ツール'],
});

const jsonLd = generateToolJsonLd(tool, faq);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RegexTestClient />
    </>
  );
}
