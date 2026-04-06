import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】残業代計算機｜法定時間外・深夜・休日・固定残業を一括計算 2026年版 ",
  description: "残業代を種別ごとに正確計算。法定時間外(1.25倍)・月60時間超(1.50倍)・深夜(1.25倍)・休日(1.35倍)に対応。固定残業代の適正チェック機能付き。登録不要・完全無料。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
