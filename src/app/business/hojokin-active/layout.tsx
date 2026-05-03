import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "補助金検索ツール【無料・募集中】中小企業・個人事業主向け｜Jグランツ公式",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
