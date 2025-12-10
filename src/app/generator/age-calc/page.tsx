import { Metadata } from "next";
import AgeCalcClient from "./client";

export const metadata: Metadata = {
  title: "年齢計算 | 山田ツール - 生年月日から年齢を計算",
  description: "生年月日から年齢・干支・誕生石を計算。和暦表示にも対応。登録不要、完全無料。",
  keywords: ["年齢計算", "生年月日", "干支", "和暦", "無料"],
  openGraph: {
    title: "年齢計算 | 山田ツール",
    description: "生年月日から年齢を計算。完全無料。",
    url: "https://yamada-tools.jp/generator/age-calc",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/age-calc",
  },
};

export default function AgeCalcPage() {
  return <AgeCalcClient />;
}
