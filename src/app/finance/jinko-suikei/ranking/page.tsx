import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import JinkoSuikeiRankingClient from "./client";

const tool = getToolById("jinko-suikei")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <JinkoSuikeiRankingClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
