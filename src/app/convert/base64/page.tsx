import { Metadata } from "next";
import Base64Client from "./client";

const faq = [
  {
    question: "Base64とは何ですか？",
    answer: "バイナリデータをASCII文字列に変換するエンコード方式です。メールやURLでの安全なデータ転送に使われます。",
  },
  {
    question: "日本語も変換できますか？",
    answer: "はい。UTF-8エンコーディングで日本語テキストもBase64に変換できます。",
  },
];

export const metadata: Metadata = {
  title: "Base64変換 | 山田ツール - エンコード・デコード",
  description: "テキストをBase64にエンコード・デコード。ファイルのBase64変換も可能。登録不要、完全無料。",
  keywords: ["Base64", "エンコード", "デコード", "変換", "無料"],
  openGraph: {
    title: "Base64変換 | 山田ツール",
    description: "テキストをBase64にエンコード・デコード。完全無料。",
    url: "https://yamada-tools.jp/convert/base64",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/convert/base64",
  },
};

export default function Base64Page() {
  return <Base64Client faq={faq} />;
}
