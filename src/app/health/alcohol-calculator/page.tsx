import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import AlcoholCalculatorClient from "./AlcoholCalculatorClient";

const tool = getToolById("alcohol-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function AlcoholCalculatorPage() {
  return (
    <>
      <AlcoholCalculatorClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
