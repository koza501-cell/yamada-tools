import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import HeikinNenshuIndustryClient from "./client";

const tool = getToolById("heikin-nenshu")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <HeikinNenshuIndustryClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
