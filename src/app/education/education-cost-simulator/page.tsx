import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import EducationCostSimulatorClient from "./client";

const tool = getToolById("education-cost-simulator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <EducationCostSimulatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
