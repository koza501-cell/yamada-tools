"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface WordToPdfClientProps {
  faq?: FAQ[];
}

export default function WordToPdfClient({ faq }: WordToPdfClientProps) {
  const tool = pdfTools.find(t => t.id === "word-to-pdf")!;
  return <ToolPage tool={tool} faq={faq} />;
}
