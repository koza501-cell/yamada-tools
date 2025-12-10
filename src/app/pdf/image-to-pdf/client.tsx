"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface ImageToPdfClientProps {
  faq?: FAQ[];
}

export default function ImageToPdfClient({ faq }: ImageToPdfClientProps) {
  const tool = pdfTools.find(t => t.id === "image-to-pdf")!;
  return <ToolPage tool={tool} faq={faq} />;
}
