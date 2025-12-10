import { Metadata } from "next";
import TextCaseClient from "./client";

export const metadata: Metadata = {
  title: "大文字・小文字変換 | 山田ツール - テキスト変換ツール",
  description: "テキストを大文字・小文字・タイトルケースなどに変換。登録不要、完全無料。",
  keywords: ["大文字変換", "小文字変換", "テキスト変換", "ケース変換", "無料"],
  openGraph: {
    title: "大文字・小文字変換 | 山田ツール",
    description: "テキストのケースを変換。完全無料。",
    url: "https://yamada-tools.jp/generator/text-case",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/text-case",
  },
};

export default function TextCasePage() {
  return <TextCaseClient />;
}
