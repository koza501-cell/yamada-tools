import { Metadata } from "next";
import FuyoHanteiTool from "@/components/tools/FuyoHanteiTool";

export const metadata: Metadata = {
  title: "扶養控除判定ツール2026｜103万・130万の壁をリアルタイム可視化",
  description: "配偶者の年収を入力するだけで103万・106万・130万・150万・201万円の壁への影響を自動判定。配偶者控除・特別控除の額も即時計算。パート・アルバイトの収入管理に。",
  keywords: ["扶養控除 判定", "103万円の壁", "130万円の壁", "配偶者控除 計算", "年収の壁"],
  alternates: { canonical: "https://yamada-tools.jp/tools/fuyo-koyo-hantei" },
  openGraph: {
    title: "扶養控除判定ツール2026｜103万・130万の壁をリアルタイム可視化",
    description: "配偶者年収を入力して年収の壁（103・130万円等）への影響と控除額を即時確認。",
    url: "https://yamada-tools.jp/tools/fuyo-koyo-hantei",
  },
};

export default function Page() { return <FuyoHanteiTool />; }
