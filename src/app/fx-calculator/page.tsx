import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import FXCalculatorClient from "./client";

const tool = getToolById("fx-calculator")!;

const faq = [
  { question: "FXの確定申告は必要ですか？", answer: "会社員の場合、FXの利益が20万円を超えると確定申告が必要です。自営業の場合は48万円を超えると申告が必要です。" },
  { question: "スワップポイントは課税されますか？", answer: "はい、スワップポイントも為替差益と同様に「雑所得」として課税されます。" },
  { question: "レバレッジ25倍は安全ですか？", answer: "レバレッジが高いほどリスクも高まります。実効レバレッジ10倍以上はハイレバレッジとされ、注意が必要です。" },
  { question: "ロスカットはいつ発生しますか？", answer: "口座残高が維持証拠金（通常は必要証拠金の50%）を下回ると、強制決済（ロスカット）が発生します。" },
];

export const metadata: Metadata = generateToolMetadata({
  customTitle: "FX損益計算機 Pro｜損益・証拠金・ロスカット・スワップ・確定申告 完全対応",
  tool,
  longDescription: "FX取引の損益・証拠金・ロスカット・スワップ・確定申告を1つで計算。複数取引の一括計算や損失繰越控除シミュレーターも無料で使えます。",
  keywords: ['FX計算', '損益計算', '証拠金計算', 'ロスカット', 'スワップ計算', '確定申告', 'FX税金'],
});

const jsonLd = generateToolJsonLd(tool, faq, [
  { name: "モードを選択", text: "損益計算・証拠金計算・スワップ計算・複数取引・確定申告のいずれかを選択します" },
  { name: "数値を入力", text: "通貨ペア・レート・数量などを入力します" },
  { name: "結果を確認", text: "リアルタイムで計算結果が表示されます" },
  { name: "シェア・保存", text: "結果をコピーまたは画像として保存できます" },
]);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FXCalculatorClient faq={faq} />
    </>
  );
}
