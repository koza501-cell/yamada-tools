import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import CramSchoolCalculatorClient from "./client";

const tool = getToolById("cram-school-calculator")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <CramSchoolCalculatorClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
