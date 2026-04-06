import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】相続税 簡易計算機｜基礎控除・配偶者控除を自動計算 ",
  description: "遺産総額と相続人の人数を入力するだけで相続税を簡単計算。基礎控除・配偶者控除・法定相続分を自動反映。2024年度税制対応の無料シミュレーター。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
