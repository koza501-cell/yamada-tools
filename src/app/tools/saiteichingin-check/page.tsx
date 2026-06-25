import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
import SaiteichinginCheck from "@/components/tools/SaiteichinginCheck";

export const metadata: Metadata = {
  title: "最低賃金チェックツール2026｜都道府県別・時給・日給・月給を自動判定",
  description: "都道府県を選んで時給・日給・月給を入力するだけで最低賃金違反を即チェック。2026年度の全47都道府県の最低賃金に対応。アルバイト・パートの給与確認に。",
  keywords: ["最低賃金 チェック", "最低賃金 2026", "時給 違反", "都道府県 最低賃金", "最低賃金法"],
  alternates: { canonical: "https://yamada-tools.jp/tools/saiteichingin-check" },
  openGraph: {
    title: "最低賃金チェックツール2026｜都道府県別・時給・日給・月給を自動判定",
    description: "全47都道府県の2026年度最低賃金と実際の賃金を即時比較。時給・日給・月給に対応。",
    url: "https://yamada-tools.jp/tools/saiteichingin-check",
  },
};

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "最低賃金チェックツール", description: "都道府県・時給・労働時間から最低賃金違反がないか自動チェック。", path: "/tools/saiteichingin-check" }} />
      <SaiteichinginCheck />
    </>
  );
}
