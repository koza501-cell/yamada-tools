import { Metadata } from "next";
import UrlEncodeClient from "./client";

const faq = [
  {
    question: "URLエンコードとは何ですか？",
    answer: "URLで使用できない文字（日本語、スペースなど）を%XXの形式に変換することです。",
  },
  {
    question: "いつ使いますか？",
    answer: "日本語を含むURLの作成、APIパラメータの送信、フォームデータの送信などで使用します。",
  },
];

export const metadata: Metadata = {
  title: "URLエンコード | 山田ツール - URL変換ツール",
  description: "URLエンコード・デコード変換。日本語URLの変換に。登録不要、完全無料。",
  keywords: ["URLエンコード", "URLデコード", "パーセントエンコード", "日本語URL", "無料"],
  openGraph: {
    title: "URLエンコード | 山田ツール",
    description: "URLエンコード・デコード変換。完全無料。",
    url: "https://yamada-tools.jp/convert/url-encode",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/convert/url-encode",
  },
};

export default function UrlEncodePage() {
  return <UrlEncodeClient faq={faq} />;
}
