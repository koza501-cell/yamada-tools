import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
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

const faq = [
  { question: "103万円の壁とは何ですか？", answer: "配偶者の給与収入が103万円を超えると所得税の扶養控除が外れ、配偶者本人にも所得税が発生します。" },
  { question: "130万円の壁を超えると何が変わりますか？", answer: "社会保険の扶養から外れ、自分で健康保険・年金に加入する必要が生じます。手取りが大幅に減る場合があります。" },
  { question: "2026年から扶養控除の制度は変わりましたか？", answer: "はい。特定扶養親族（19〜22歳）の控除額見直しなど、2026年度税制改正で変更があります。本ツールは最新ルールに対応しています。" },
  { question: "配偶者特別控除はいつまで受けられますか？", answer: "配偶者の年収が201万円以下の場合に段階的に受けられます。201万円を超えると控除がゼロになります。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "扶養控除判定ツール", description: "収入・続柄から扶養控除の適用可否を判定。所得税・住民税の節税額も表示。", path: "/tools/fuyo-koyo-hantei" }} faq={faq} />
      <FuyoHanteiTool />
    </>
  );
}
