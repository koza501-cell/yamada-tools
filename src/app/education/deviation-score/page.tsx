import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import DeviationScoreClient from "./client";

const tool = getToolById("deviation-score")!;

export const metadata: Metadata = generateToolMetadata({
  tool,
  customTitle: "偏差値計算機【無料】得点・平均・標準偏差を入力するだけ｜登録不要",
  longDescription: "得点・平均点・標準偏差を入力するだけで偏差値を瞬時に計算。受験・模試・成績管理に。登録不要・完全無料。スマホからもOK。",
});

export default function Page() {
  return (
    <>
      <DeviationScoreClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
