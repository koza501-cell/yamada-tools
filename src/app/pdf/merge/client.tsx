"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface SeoContent {
  intro: string;
  useCases?: { title: string; desc: string }[];
  tips?: string;
}

interface MergeClientProps {
  faq?: FAQ[];
  seoContent?: SeoContent;
  customH1?: string;
}

export default function MergeClient({ faq, seoContent, customH1 }: MergeClientProps) {
  const tool = pdfTools.find(t => t.id === "merge")!;
  return <ToolPage tool={tool} customH1={customH1} faq={faq} seoContent={seoContent} />;
}
