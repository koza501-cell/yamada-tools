import { Metadata } from "next";
import ToolSchema from "@/components/tools/ToolSchema";
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

const faq = [
  { question: "年末調整で還付金が出るのはなぜですか？", answer: "毎月の源泉徴収は概算のため、年間の正確な税額と差が生じます。払いすぎた分が還付されます。" },
  { question: "年末調整と確定申告の違いは何ですか？", answer: "年末調整は会社が代わりに行う税精算です。副業収入や医療費控除がある場合は別途確定申告が必要です。" },
  { question: "生命保険料控除の上限はいくらですか？", answer: "所得税では各区分最大4万円・合計12万円、住民税では各区分最大2.8万円・合計7万円が上限です。" },
  { question: "住宅ローン控除は年末調整で受けられますか？", answer: "2年目以降は年末調整で適用可能です。初年度は確定申告が必要です。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{ nameJa: "年末調整還付金計算ツール", description: "源泉徴収票の数字を入力して年末調整の還付金・追加納税額を計算。", path: "/tools/nenmatsu-chosei-keisan" }} faq={faq} />
      <NenmatsuChoseiCalculator />
    </>
  );
}
