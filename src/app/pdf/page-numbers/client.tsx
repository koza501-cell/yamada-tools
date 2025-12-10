"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface PageNumbersClientProps {
  faq?: FAQ[];
}

export default function PageNumbersClient({ faq }: PageNumbersClientProps) {
  const tool = pdfTools.find(t => t.id === "page-numbers")!;
  return <ToolPage tool={tool} faq={faq} />;
}
