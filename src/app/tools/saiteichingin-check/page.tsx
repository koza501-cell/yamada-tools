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

const faq = [
  { question: "最低賃金は全国一律ですか？", answer: "いいえ。都道府県ごとに地域別最低賃金が設定されています。本ツールで都道府県を選択して確認できます。" },
  { question: "最低賃金を下回る賃金を払うとどうなりますか？", answer: "50万円以下の罰金が科せられます。また差額の支払い義務も生じます。" },
  { question: "特定最低賃金とは何ですか？", answer: "特定の産業・職種に適用される最低賃金で、地域別最低賃金より高い場合はそちらが優先されます。" },
  { question: "2026年の最低賃金はいくらですか？", answer: "都道府県により異なります。本ツールで都道府県を選択すると2026年度の最新最低賃金を確認できます。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "最低賃金チェックツール", description: "都道府県・時給・労働時間から最低賃金違反がないか自動チェック。", path: "/tools/saiteichingin-check" }} faq={faq} />
      <SaiteichinginCheck />
    </>
  );
}
