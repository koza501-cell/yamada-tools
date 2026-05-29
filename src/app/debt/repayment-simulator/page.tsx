import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import RepaymentSimulatorClient from "./client";

const tool = getToolById("repayment-simulator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <RepaymentSimulatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
