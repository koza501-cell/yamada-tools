import { Metadata } from "next";
import KyuyoTedoriCalculator from "@/components/tools/KyuyoTedoriCalculator";
import ToolSchema from "@/components/tools/ToolSchema";

export const metadata: Metadata = {
  title: "給与手取り計算ツール2026｜月収・年収から社会保険料・税金を自動計算",
  description:
    "月収・年収を入力するだけで所得税・住民税・社会保険料を自動計算。2026年度最新レートに対応。扶養家族・都道府県別健康保険料も考慮した正確な手取りシミュレーター。",
  keywords: [
    "手取り計算",
    "給与 控除",
    "社会保険料 計算方法",
    "住民税 計算",
    "所得税 計算",
    "厚生年金 計算",
    "健康保険料 計算",
    "手取り シミュレーター",
    "2026年 手取り",
  ],
  alternates: {
    canonical: "https://yamada-tools.jp/tools/kyuyo-tedori-keisan",
  },
  openGraph: {
    title: "給与手取り計算ツール2026｜月収・年収から社会保険料・税金を自動計算",
    description:
      "月収・年収を入力するだけで所得税・住民税・社会保険料を自動計算。2026年度最新レート対応。",
    url: "https://yamada-tools.jp/tools/kyuyo-tedori-keisan",
  },
};

const faq = [
  { question: "手取り計算ツールは無料で使えますか？", answer: "はい、完全無料です。登録不要でご利用いただけます。" },
  { question: "2026年度の最新の社会保険料率に対応していますか？", answer: "はい。2026年度の協会けんぽ料率・厚生年金料率・雇用保険料率に対応しています。" },
  { question: "都道府県によって手取りが変わるのはなぜですか？", answer: "健康保険料率が都道府県ごとに異なるためです。同じ月収でも都道府県が違うと年間数万円の差が生じることがあります。" },
  { question: "扶養家族がいる場合の計算もできますか？", answer: "はい。扶養人数を入力することで配偶者控除・扶養控除を考慮した手取り額を計算できます。" },
];

export default function Page() {
  return (
    <>
      <ToolSchema tool={{
        nameJa: "給与手取り計算ツール",
        description: "月収・年収を入力するだけで所得税・住民税・社会保険料を自動計算。2026年度最新レートに対応。",
        path: "/tools/kyuyo-tedori-keisan"
      }} faq={faq} />
      <KyuyoTedoriCalculator />
    </>
  );
}
