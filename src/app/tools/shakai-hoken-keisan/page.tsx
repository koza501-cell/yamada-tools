import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
import ShakaiHokenCalculator from "@/components/tools/ShakaiHokenCalculator";

export const metadata: Metadata = {
  title: "社会保険料計算ツール2026｜月給・賞与の従業員・会社負担を自動計算",
  description:
    "月給や賞与から社会保険料（厚生年金・健康保険・介護保険・雇用保険）の従業員負担と会社負担を自動計算。標準報酬月額等級表示。都道府県別健康保険料対応。2026年度版。",
  keywords: [
    "社会保険料 計算",
    "社会保険料 会社負担",
    "標準報酬月額",
    "厚生年金 計算",
    "健康保険料 計算",
    "介護保険料 40歳",
    "雇用保険料 計算",
    "社会保険料 シミュレーター",
    "2026年 社会保険料",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/tools/shakai-hoken-keisan",
  },
  openGraph: {
    title: "社会保険料計算ツール2026｜月給・賞与の従業員・会社負担を自動計算",
    description:
      "月給や賞与から社会保険料の従業員負担と会社負担を自動計算。標準報酬月額等級・都道府県別健康保険料対応。2026年度版。",
    url: "https://yamada-tools.jp/tools/shakai-hoken-keisan",
  },
};

const faq = [
  { question: "社会保険料はいつから変わりますか？", answer: "協会けんぽの料率は毎年3月分（4月納付分）から改定されます。本ツールは2026年度最新料率に対応しています。" },
  { question: "社会保険料の会社負担分はどのくらいですか？", answer: "健康保険・厚生年金はほぼ労使折半です。雇用保険は会社負担が従業員よりわずかに多くなっています。" },
  { question: "標準報酬月額とは何ですか？", answer: "社会保険料計算の基準となる金額で、毎年4〜6月の平均給与をもとに決定されます。" },
  { question: "パートタイムでも社会保険に加入しますか？", answer: "週20時間以上・月収8.8万円以上などの条件を満たす場合、社会保険への加入が義務付けられています。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "社会保険料シミュレーター", description: "月収から健康保険料・厚生年金・雇用保険料を都道府県別に自動計算。", path: "/tools/shakai-hoken-keisan" }} faq={faq} />
      <ShakaiHokenCalculator />
    </>
  );
}
