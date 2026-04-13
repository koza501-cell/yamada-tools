import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import MovingCostCalculatorClient from "./MovingCostCalculatorClient";

const tool = getToolById("moving-cost-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function MovingCostCalculatorPage() {
  return (
    <>
      <MovingCostCalculatorClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
