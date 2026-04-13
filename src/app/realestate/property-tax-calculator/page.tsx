import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import PropertyTaxCalculatorClient from "./PropertyTaxCalculatorClient";

const tool = getToolById("property-tax-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function PropertyTaxCalculatorPage() {
  return (
    <>
      <PropertyTaxCalculatorClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
