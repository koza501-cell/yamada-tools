import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
import IkukyuKyufukinCalculator from "@/components/tools/IkukyuKyufukinCalculator";

export const metadata: Metadata = {
  title: "育児休業給付金計算ツール2026｜月給・期間から給付金を月別シミュレーション",
  description: "月給と育休期間を入力するだけで育児休業給付金を月別に自動計算。67%・50%の給付率切り替え、社会保険料免除額、実質手取り率も表示。2026年度の上限額に対応。",
  keywords: ["育児休業給付金 計算", "育休 給付金", "育休中 手取り", "育児休業 シミュレーション", "育休 いくらもらえる"],
  alternates: { canonical: "https://yamada-tools.jp/tools/ikukyu-kyufukin-keisan" },
  openGraph: {
    title: "育児休業給付金計算ツール2026｜月給・期間から給付金を月別シミュレーション",
    description: "育児休業給付金を月別に自動計算。社会保険料免除・実質手取り率も表示。",
    url: "https://yamada-tools.jp/tools/ikukyu-kyufukin-keisan",
  },
};

const faq = [
  { question: "育児休業給付金はいくらもらえますか？", answer: "育休開始から180日間は休業前賃金の67%、181日目以降は50%が支給されます。" },
  { question: "育児休業給付金に税金はかかりますか？", answer: "育児休業給付金は非課税です。所得税・住民税はかかりません。社会保険料も育休中は免除されます。" },
  { question: "パパ育休（産後パパ育休）の給付金はいくらですか？", answer: "出生後8週間以内に取得する産後パパ育休は、休業前賃金の最大100%相当が給付されます（2025年度拡充）。" },
  { question: "育児休業給付金の申請はどこにしますか？", answer: "会社を通じてハローワークに申請します。個人で直接申請することはできません。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "育児休業給付金計算ツール", description: "育休前の給与から育児休業給付金の受給額を自動計算。", path: "/tools/ikukyu-kyufukin-keisan" }} faq={faq} />
      <IkukyuKyufukinCalculator />
    </>
  );
}
