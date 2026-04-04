import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】給与交渉額シミュレーター｜業界・職種別の市場年収と交渉レンジを自動計算 | 山田ツール",
  description: "業界・職種・経験・スキルから市場適正年収と給与交渉レンジ（最低ライン〜ストレッチ目標）を自動計算。交渉トーキングポイントも自動生成。転職・昇給交渉を成功させる無料ツール。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
