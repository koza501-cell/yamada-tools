import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】ふるさと納税 控除上限額計算機｜年収・家族構成から自動計算 | 山田ツール",
  description: "年収と家族構成を入力するだけでふるさと納税の控除上限額を自動計算。所得税還付・住民税控除の内訳も表示。2024年度対応の無料シミュレーター。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
