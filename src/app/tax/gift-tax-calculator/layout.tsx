import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】贈与税 計算機｜暦年課税・相続時精算課税に対応｜住宅資金特例も | 山田ツール",
  description: "贈与金額と関係性を入力するだけで贈与税を自動計算。暦年課税・相続時精算課税・住宅取得資金贈与の特例に対応。2024年度改正対応の無料シミュレーター。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
