import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】医療保険 入院給付金シミュレーター｜入院費用の自己負担を簡単計算 | 山田ツール",
  description: "入院日数・日額・手術の有無を入力するだけで医療保険の給付金と実質自己負担額を自動計算。高額療養費制度も考慮した無料シミュレーター。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
