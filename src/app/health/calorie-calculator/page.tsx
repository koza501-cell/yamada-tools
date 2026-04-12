import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import CalorieCalculatorClient from "./CalorieCalculatorClient";

const tool = getToolById("calorie-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function CalorieCalculatorPage() {
  return (
    <>
      <CalorieCalculatorClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
