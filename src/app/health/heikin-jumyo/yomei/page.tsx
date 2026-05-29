import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import YomeiClient from "./client";

const tool = getToolById("heikin-jumyo")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <YomeiClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
