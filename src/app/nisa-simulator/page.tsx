import { Metadata } from "next";
import NisaSimulatorClient from "./client";

export const metadata: Metadata = {
  title: "新NISAシミュレーター Pro - 積立・一括・複数シナリオ対応",
  description: "新NISAの積立・一括投資をシミュレーション。3つの利回りシナリオを同時比較、節税額も計算。1800万円非課税枠の使用状況もわかる無料ツールです。",
  keywords: ["新NISA シミュレーター", "積立 計算", "運用シミュレーション", "節税"],
  alternates: {
    canonical: "https://yamada-tools.jp/tools/nisa-simulator",
  },
  openGraph: {
    title: "新NISAシミュレーター Pro",
    description: "新NISAの積立・一括投資をシミュレーション。3つの利回りシナリオを同時比較。",
    url: "https://yamada-tools.jp/tools/nisa-simulator",
  },
};

export default function Page() {
  return <NisaSimulatorClient />;
}
