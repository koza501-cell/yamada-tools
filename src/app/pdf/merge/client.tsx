"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface MergeClientProps {
  faq?: FAQ[];
}

export default function MergeClient({ faq }: MergeClientProps) {
  const tool = pdfTools.find(t => t.id === "merge")!;
  return <ToolPage tool={tool} faq={faq} />;
}
