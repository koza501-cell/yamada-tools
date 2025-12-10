"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface SplitClientProps {
  faq?: FAQ[];
}

export default function SplitClient({ faq }: SplitClientProps) {
  const tool = pdfTools.find(t => t.id === "split")!;
  return <ToolPage tool={tool} faq={faq} />;
}
