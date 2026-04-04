import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】年収アップシミュレーター｜転職・昇給・副業・スキルアップで600万円を最短達成 2026年版 | 山田ツール",
  description: "現在の年収と目標を入力し、転職・昇給・副業・スキルアップの4つの戦略を組み合わせて最短達成ルートをシミュレーション。手取り・ROI・回収期間まで自動計算。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
