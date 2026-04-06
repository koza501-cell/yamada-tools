import { Metadata } from "next";

export const metadata: Metadata = {
  title: "【無料】年収の壁 診断ツール｜103万・106万・130万・178万円の壁を一括チェック 2026年版 ",
  description: "年収を入力するだけで6つの年収の壁（100万・103万・106万・130万・150万・178万円）を一括診断。2026年税制改正（178万円の壁）完全対応。手取りが逆転しない年収帯もわかります。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
