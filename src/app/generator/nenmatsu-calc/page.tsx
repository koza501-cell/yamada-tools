import { Metadata } from "next";
import NenmatsuCalcClient from "./client";

export const metadata: Metadata = {
  title: "年末調整計算 | 山田ツール - 還付金シミュレーター",
  description: "年末調整の還付金・追加徴収額をシミュレーション。源泉徴収票から簡単計算。配偶者控除・扶養控除・保険料控除対応。登録不要、完全無料。",
  keywords: ["年末調整", "還付金", "計算", "シミュレーション", "源泉徴収", "控除"],
  openGraph: {
    title: "年末調整計算 | 山田ツール",
    description: "年末調整の還付金をシミュレーション。完全無料。",
    url: "https://yamada-tools.jp/generator/nenmatsu-calc",
  },
  alternates: {
    canonical: "https://yamada-tools.jp/generator/nenmatsu-calc",
  },
};

export default function NenmatsuCalcPage() {
  return <NenmatsuCalcClient />;
}
