import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import CorporateTaxCalculatorClient from "./CorporateTaxCalculatorClient";

const tool = getToolById("corporate-tax-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function CorporateTaxCalculatorPage() {
  return (
    <>
      <CorporateTaxCalculatorClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
