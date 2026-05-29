import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import SalaryNegotiationClient from "./client";

const tool = getToolById("salary-negotiation")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <SalaryNegotiationClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
