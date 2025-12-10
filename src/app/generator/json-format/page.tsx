import { Metadata } from "next";
import JsonFormatClient from "./client";

export const metadata: Metadata = {
  title: "JSON整形 | 山田ツール - JSONフォーマッター",
  description: "JSONを見やすく整形・圧縮。シンタックスハイライト付き。バリデーション機能。登録不要、完全無料。",
  keywords: ["JSON整形", "JSONフォーマット", "JSON圧縮", "バリデーション", "無料"],
  openGraph: {
    title: "JSON整形 | 山田ツール",
    description: "JSONを見やすく整形・圧縮。完全無料。",
    url: "https://yamada-tools.jp/generator/json-format",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/json-format",
  },
};

export default function JsonFormatPage() {
  return <JsonFormatClient />;
}
