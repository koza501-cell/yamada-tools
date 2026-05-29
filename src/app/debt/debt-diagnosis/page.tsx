import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import DebtDiagnosisClient from "./client";

const tool = getToolById("debt-diagnosis")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <DebtDiagnosisClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
