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

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "育児休業給付金計算ツール", description: "育休前の給与から育児休業給付金の受給額を自動計算。", path: "/tools/ikukyu-kyufukin-keisan" }} />
      <IkukyuKyufukinCalculator />
    </>
  );
}
