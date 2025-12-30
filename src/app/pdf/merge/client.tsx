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
}

export default function MergeClient({ faq, seoContent }: MergeClientProps) {
  const tool = pdfTools.find(t => t.id === "merge")!;
  return <ToolPage tool={tool} faq={faq} seoContent={seoContent} />;
}
