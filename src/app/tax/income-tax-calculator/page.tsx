import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import IncomeTaxCalculatorClient from "./IncomeTaxCalculatorClient";

const tool = getToolById("income-tax-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function IncomeTaxCalculatorPage() {
  return (
    <>
      <IncomeTaxCalculatorClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
