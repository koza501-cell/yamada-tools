import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import SleepCalculatorClient from "./SleepCalculatorClient";

const tool = getToolById("sleep-calculator")!;

export const metadata: Metadata = generateToolMetadata({
  tool,
  customTitle: "睡眠計算機【無料】起床時間から逆算・就寝時間の目安を瞬時に計算",
  longDescription: "起床時間を入力するだけで最適な就寝時間を計算。90分サイクルで疲れが取れる睡眠時間がわかる。登録不要・完全無料。スマホからもOK。",
});

export default function SleepCalculatorPage() {
  return (
    <>
      <SleepCalculatorClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
