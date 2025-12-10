"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface PptToPdfClientProps {
  faq?: FAQ[];
}

export default function PptToPdfClient({ faq }: PptToPdfClientProps) {
  const tool = pdfTools.find(t => t.id === "ppt-to-pdf")!;
  return <ToolPage tool={tool} faq={faq} />;
}
