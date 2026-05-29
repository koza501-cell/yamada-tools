import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import SalaryIncreaseSimulatorClient from "./client";

const tool = getToolById("salary-increase-simulator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <SalaryIncreaseSimulatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
