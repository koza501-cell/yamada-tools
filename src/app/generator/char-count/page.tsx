import { Metadata } from "next";
import CharCountClient from "./client";

export const metadata: Metadata = {
  title: "文字数カウント | 山田ツール - 無料文字数チェッカー",
  description: "文字数、単語数、行数をリアルタイムでカウント。レポートやブログ記事の文字数制限確認に便利です。",
  keywords: ["文字数カウント", "文字数 数える", "ワードカウント", "文字数チェック"],
};

const faq = [
  { question: "スペースは含まれますか？", answer: "スペースを含む/含まないを選択できます。" },
  { question: "改行は1文字ですか？", answer: "改行は文字数にカウントされません。行数として別途表示されます。" },
];

const seoContent = {
  intro: "文字数、単語数、行数をリアルタイムでカウント。レポートやブログ記事の文字数制限確認に便利です。",
  useCases: [
    { title: "📝 レポート", desc: "文字数制限の確認" },
    { title: "📱 SNS投稿", desc: "Twitter文字数の確認" },
  ],
  tips: "スペースを含む/含まないの切り替えができます。",
};

export default function CharCountPage() {
  return <CharCountClient faq={faq} seoContent={seoContent} />;
}
