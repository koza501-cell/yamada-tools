import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import UnitConverterClient from "./client";

const tool = getToolById("unit-converter")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <UnitConverterClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
