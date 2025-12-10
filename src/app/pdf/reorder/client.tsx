"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface ReorderClientProps {
  faq?: FAQ[];
}

export default function ReorderClient({ faq }: ReorderClientProps) {
  const tool = pdfTools.find(t => t.id === "reorder")!;
  return <ToolPage tool={tool} faq={faq} />;
}
