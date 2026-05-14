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
  customH1?: string;
  faq?: FAQ[];
  seoContent?: SeoContent;
}

export default function SplitClient({ customH1, faq, seoContent }: SplitClientProps) {
  const tool = pdfTools.find(t => t.id === "split")!;
  return <ToolPage tool={tool} customH1={customH1} faq={faq} seoContent={seoContent} />;
}
