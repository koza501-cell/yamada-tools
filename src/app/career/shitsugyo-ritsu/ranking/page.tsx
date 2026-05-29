import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import ShitsugyoRitsuRankingClient from "./client";

const tool = getToolById("shitsugyo-ritsu")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <ShitsugyoRitsuRankingClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
