import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import BmiCalculatorClient from "./BmiCalculatorClient";

const tool = getToolById("bmi-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function BmiCalculatorPage() {
  return (
    <>
      <BmiCalculatorClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
