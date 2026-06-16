import { Metadata } from "next";
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

export default function Page() {
  return <ShakaiHokenCalculator />;
}
