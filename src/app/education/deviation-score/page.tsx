import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import DeviationScoreClient from "./client";

const tool = getToolById("deviation-score")!;

export const metadata: Metadata = generateToolMetadata({
  tool,
  customTitle: "偏差値シュミレーター｜得点と順位から計算",
  longDescription: "得点・平均点・標準偏差を入力するだけで偏差値と順位を瞬時に計算できる偏差値シュミレーター。受験・模試・成績管理に活用できます。登録不要・完全無料、スマホからも使えます。",
});

export default function Page() {
  return (
    <>
      <DeviationScoreClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
