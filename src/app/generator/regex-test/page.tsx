import { Metadata } from "next";
import RegexTestClient from "./client";

export const metadata: Metadata = {
  title: "正規表現テスター | 山田ツール - Regexチェッカー",
  description: "正規表現をリアルタイムでテスト。マッチ結果をハイライト表示。フラグ設定対応。登録不要、完全無料。",
  keywords: ["正規表現", "Regex", "テスター", "パターンマッチ", "無料"],
  openGraph: {
    title: "正規表現テスター | 山田ツール",
    description: "正規表現をリアルタイムテスト。完全無料。",
    url: "https://yamada-tools.jp/generator/regex-test",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/regex-test",
  },
};

export default function RegexTestPage() {
  return <RegexTestClient />;
}
