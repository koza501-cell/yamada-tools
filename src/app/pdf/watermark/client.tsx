"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface WatermarkClientProps {
  faq?: FAQ[];
}

export default function WatermarkClient({ faq }: WatermarkClientProps) {
  const tool = pdfTools.find(t => t.id === "watermark")!;
  return <ToolPage tool={tool} faq={faq} />;
}
