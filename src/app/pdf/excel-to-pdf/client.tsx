"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface ExcelToPdfClientProps {
  faq?: FAQ[];
}

export default function ExcelToPdfClient({ faq }: ExcelToPdfClientProps) {
  const tool = pdfTools.find(t => t.id === "excel-to-pdf")!;
  return <ToolPage tool={tool} faq={faq} />;
}
