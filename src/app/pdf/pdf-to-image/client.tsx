"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface PdfToImageClientProps {
  faq?: FAQ[];
}

export default function PdfToImageClient({ faq }: PdfToImageClientProps) {
  const tool = pdfTools.find(t => t.id === "pdf-to-image")!;
  return <ToolPage tool={tool} faq={faq} />;
}
