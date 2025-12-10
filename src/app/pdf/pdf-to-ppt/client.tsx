"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface PdfToPptClientProps {
  faq?: FAQ[];
}

export default function PdfToPptClient({ faq }: PdfToPptClientProps) {
  const tool = pdfTools.find(t => t.id === "pdf-to-ppt")!;
  return <ToolPage tool={tool} faq={faq} />;
}
