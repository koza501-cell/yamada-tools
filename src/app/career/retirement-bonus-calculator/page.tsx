import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import RetirementBonusCalculatorClient from "./RetirementBonusCalculatorClient";

const tool = getToolById("retirement-bonus-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function RetirementBonusCalculatorPage() {
  return (
    <>
      <RetirementBonusCalculatorClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
