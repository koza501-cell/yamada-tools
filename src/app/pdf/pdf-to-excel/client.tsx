"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface PdfToExcelClientProps {
  faq?: FAQ[];
}

export default function PdfToExcelClient({ faq }: PdfToExcelClientProps) {
  const tool = pdfTools.find(t => t.id === "pdf-to-excel")!;
  return <ToolPage tool={tool} faq={faq} />;
}
