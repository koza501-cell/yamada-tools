import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import CertificationRoiClient from "./client";

const tool = getToolById("certification-roi")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <CertificationRoiClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
