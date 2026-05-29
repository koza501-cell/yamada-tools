import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import ConsumptionTaxClient from "./client";

const tool = getToolById("consumption-tax")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <ConsumptionTaxClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
