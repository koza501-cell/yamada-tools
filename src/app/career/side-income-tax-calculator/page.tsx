import { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import SideIncomeTaxCalculatorClient from "./SideIncomeTaxCalculatorClient";

const tool = getToolById("side-income-tax-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function SideIncomeTaxCalculatorPage() {
  return (
    <>
      <SideIncomeTaxCalculatorClient />
      <div className="max-w-4xl mx-auto px-4">
        <RelatedTools currentTool={tool} maxItems={6} />
      </div>
    </>
  );
}
