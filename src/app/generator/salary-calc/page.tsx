import { Metadata } from "next";
import SalaryCalcClient from "./client";

export const metadata: Metadata = {
  title: "給与手取り計算 - 無料オンラインツール | Yamada Tools",
  description: "額面給与から手取り額をシミュレーション。社会保険料・所得税・住民税を自動計算。転職・年収交渉に最適。",
  keywords: ["給与計算", "手取り計算", "社会保険", "所得税", "住民税", "年収シミュレーション"],
  openGraph: {
    title: "給与手取り計算 - 無料オンラインツール",
    description: "額面給与から手取り額をシミュレーション。",
    type: "website",
  },
};

export default function SalaryCalcPage() {
  return <SalaryCalcClient />;
}
