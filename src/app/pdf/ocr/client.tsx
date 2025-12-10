"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface OcrClientProps {
  faq?: FAQ[];
}

export default function OcrClient({ faq }: OcrClientProps) {
  const tool = pdfTools.find(t => t.id === "ocr")!;
  return <ToolPage tool={tool} faq={faq} />;
}
