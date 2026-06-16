import { Metadata } from "next";
import NenmatsuChoseiCalculator from "@/components/tools/NenmatsuChoseiCalculator";

export const metadata: Metadata = {
  title: "年末調整 還付金計算ツール2026｜いくら戻る？事前シミュレーター",
  description:
    "年末調整でいくら還付されるか事前に計算。生命保険・住宅ローン・iDeCo・ふるさと納税など全控除対応。2026年度最新税率。源泉徴収票がなくても概算計算OK。",
  keywords: [
    "年末調整 還付金",
    "年末調整 計算",
    "年末調整 いくら戻る",
    "還付金 計算方法",
    "住宅ローン控除 年末調整",
    "生命保険料控除 上限",
    "iDeCo 年末調整",
    "ふるさと納税 控除",
    "2026年 年末調整",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/tools/nenmatsu-chosei-keisan",
  },
  openGraph: {
    title: "年末調整 還付金計算ツール2026｜いくら戻る？事前シミュレーター",
    description:
      "生命保険・住宅ローン・iDeCo・ふるさと納税など全控除に対応。2026年度最新税率で還付金を事前シミュレーション。",
    url: "https://yamada-tools.jp/tools/nenmatsu-chosei-keisan",
  },
};

export default function Page() {
  return <NenmatsuChoseiCalculator />;
}
