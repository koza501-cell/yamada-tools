import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import InheritanceTaxCalculatorClient from "./client";

const tool = getToolById("inheritance-tax-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <InheritanceTaxCalculatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
