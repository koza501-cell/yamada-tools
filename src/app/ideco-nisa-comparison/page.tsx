import { Metadata } from "next";
import IdecoNisaComparisonClient from "./dynamic-client";

export const metadata: Metadata = {
  title: "iDeCo vs NISA 徹底比較ツール - 節税額・手取り・最適配分を自動計算",
  description: "iDeCoとNISAをあなたの年収・職業・予算で徹底比較。節税額・最終手取り・最適配分を自動計算。併用シミュレーションやおすすめ診断も無料で使えます。",
  keywords: ["iDeCo", "NISA", "ideco シミュレーター", "NISA 比較", "節税", "個人型確定拠出年金", "新NISA"],
  alternates: {
    canonical: "https://yamada-tools.jp/ideco-nisa-comparison",
  },
  openGraph: {
    title: "iDeCo vs NISA 徹底比較ツール",
    description: "iDeCoとNISAをあなたの年収・職業・予算で徹底比較。節税額・最終手取り・最適配分を自動計算。",
    url: "https://yamada-tools.jp/ideco-nisa-comparison",
  },
};

export default function Page() {
  return <IdecoNisaComparisonClient />;
}
