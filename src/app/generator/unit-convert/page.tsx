import { Metadata } from "next";
import UnitConvertClient from "./client";
import { getToolById } from "@/config/tools";
import RelatedTools from "@/components/common/RelatedTools";

export const metadata: Metadata = {
  title: "【無料】単位変換｜長さ・重さ・温度を一発変換",
  description: "長さ・重さ・面積・温度などの単位をかんたん変換。リアルタイム計算。登録不要、完全無料。",
  keywords: ["単位変換", "長さ変換", "重さ変換", "温度変換", "坪 平米"],
  alternates: {
    canonical: 'https://yamada-tools.jp/generator/unit-convert',
  },
};

const faq = [
  { question: "坪から平米への変換はできますか？", answer: "はい、1坪=約3.306㎡で変換できます。" },
  { question: "温度変換はできますか？", answer: "はい、摂氏・華氏・ケルビンの相互変換に対応しています。" },
];

const seoContent = {
  intro: "長さ、重さ、面積、温度など様々な単位を相互変換。坪・畳など日本独自の単位にも対応しています。",
  useCases: [
    { title: "🏠 不動産", desc: "坪から平米への変換" },
    { title: "📏 長さ", desc: "cm、inch、尺の変換" },
  ],
  tips: "1坪 = 約3.306㎡、1畳 = 約1.62㎡です。",
};

const tool = getToolById("unit-converter")!;

export default function UnitConvertPage() {
  return (
    <>
      <UnitConvertClient faq={faq} seoContent={seoContent} />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
