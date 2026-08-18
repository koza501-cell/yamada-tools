import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import JinkoSuikeiAgePyramidClient from "./client";

const tool = getToolById("jinko-suikei")!;

// Override canonical so ?slug= query variants point to the base age-pyramid page,
// not to the parent /finance/jinko-suikei tool (which generateToolMetadata would produce).
export const metadata: Metadata = {
  ...generateToolMetadata({ tool }),
  alternates: {
    canonical: "https://yamada-tools.jp/finance/jinko-suikei/age-pyramid",
  },
};

export default function Page() {
  return (
    <>
      <JinkoSuikeiAgePyramidClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
