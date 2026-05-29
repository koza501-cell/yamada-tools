import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import DebtRestructuringCheckerClient from "./client";

const tool = getToolById("debt-restructuring-checker")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <DebtRestructuringCheckerClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
