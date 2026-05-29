import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import JobChangeSimulatorClient from "./client";

const tool = getToolById("job-change-simulator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <JobChangeSimulatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
