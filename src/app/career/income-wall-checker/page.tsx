import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import IncomeWallCheckerClient from "./client";

const tool = getToolById("income-wall-checker")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <IncomeWallCheckerClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
