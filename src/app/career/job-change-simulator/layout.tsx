import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】転職年収シミュレーター｜転職前後の手取り・税金を比較計算 2026年版 ",
  description: "転職前後の手取り額を正確に比較。社会保険料・所得税・住民税の変化、試用期間の収入損失、損益分岐点まで自動計算。登録不要・完全無料の転職シミュレーター。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
