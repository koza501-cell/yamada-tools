import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import DeviationScoreClient from "./client";

const tool = getToolById("deviation-score")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <DeviationScoreClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
