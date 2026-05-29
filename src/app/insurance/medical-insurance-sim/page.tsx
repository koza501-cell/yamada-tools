import type { Metadata } from "next";
import { getToolById } from "@/config/tools";
import { generateToolMetadata } from "@/lib/seo";
import RelatedTools from "@/components/common/RelatedTools";
import MedicalInsuranceSimClient from "./client";

const tool = getToolById("medical-insurance-sim")!;

export const metadata: Metadata = generateToolMetadata({ tool });

export default function Page() {
  return (
    <>
      <MedicalInsuranceSimClient />
      <RelatedTools currentTool={tool} maxItems={6} />
    </>
  );
}
