import { Metadata } from "next";
import CharCountClient from "./client";

export const metadata: Metadata = {
  title: "文字数カウント | 山田ツール - 無料文字数チェッカー",
  description: "テキストの文字数・単語数・行数をリアルタイムでカウント。スペース有無も選択可能。登録不要、完全無料。",
  keywords: ["文字数カウント", "文字数チェック", "単語数", "行数", "無料"],
  openGraph: {
    title: "文字数カウント | 山田ツール",
    description: "文字数・単語数・行数をリアルタイムカウント。完全無料。",
    url: "https://yamada-tools.jp/generator/char-count",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/char-count",
  },
};

export default function CharCountPage() {
  return <CharCountClient />;
}
