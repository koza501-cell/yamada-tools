import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "補助金履歴検索【無料】法人の過去受給歴を検索｜gBizINFO公式",
  alternates: { canonical: "https://yamada-tools.jp/business/hojokin-history" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
