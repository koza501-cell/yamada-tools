import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import SleepCalculatorClient from "./SleepCalculatorClient";

const tool = getToolById("sleep-calculator")!;

export const metadata: Metadata = generateToolMetadata({
  tool,
  customTitle: "睡眠計算｜レム睡眠で逆算｜今から寝たら何時に起きる？",
  longDescription: "今から寝たら何時に起きるか、起きたい時間から何時に寝るべきかを90分の睡眠サイクル（レム睡眠）で瞬時に計算。疲れが取れる最適な睡眠時間がわかる無料ツール。登録不要・スマホ対応。",
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
