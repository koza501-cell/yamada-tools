import { Metadata } from "next";
import KyuyoTedoriCalculator from "@/components/tools/KyuyoTedoriCalculator";
import ToolSchema from "@/components/tools/ToolSchema";

export const metadata: Metadata = {
  title: "給与手取り計算ツール2026｜月収・年収から社会保険料・税金を自動計算",
  description:
    "月収・年収を入力するだけで所得税・住民税・社会保険料を自動計算。2026年度最新レートに対応。扶養家族・都道府県別健康保険料も考慮した正確な手取りシミュレーター。",
  keywords: [
    "手取り計算",
    "給与 控除",
    "社会保険料 計算方法",
    "住民税 計算",
    "所得税 計算",
    "厚生年金 計算",
    "健康保険料 計算",
    "手取り シミュレーター",
    "2026年 手取り",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/tools/kyuyo-tedori-keisan",
  },
  openGraph: {
    title: "給与手取り計算ツール2026｜月収・年収から社会保険料・税金を自動計算",
    description:
      "月収・年収を入力するだけで所得税・住民税・社会保険料を自動計算。2026年度最新レート対応。",
    url: "https://yamada-tools.jp/tools/kyuyo-tedori-keisan",
  },
};

export default function Page() {
  return (
    <>
      <ToolSchema tool={{
        nameJa: "給与手取り計算ツール",
        description: "月収・年収を入力するだけで所得税・住民税・社会保険料を自動計算。2026年度最新レートに対応。",
        path: "/tools/kyuyo-tedori-keisan"
      }} />
      <KyuyoTedoriCalculator />
    </>
  );
}
