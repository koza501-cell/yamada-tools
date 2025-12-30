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

interface SplitClientProps {
  faq?: FAQ[];
  seoContent?: SeoContent;
}

export default function SplitClient({ faq, seoContent }: SplitClientProps) {
  const tool = pdfTools.find(t => t.id === "split")!;
  return <ToolPage tool={tool} faq={faq} seoContent={seoContent} />;
}
