import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】生命保険 必要保障額計算機｜万が一に必要な保険金額を診断 | 山田ツール",
  description: "生命保険の必要保障額を無料で簡単計算。年収・家族構成・貯蓄・住宅ローンを入力するだけで万が一に必要な保険金額を自動診断。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
