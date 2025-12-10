"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface ProtectClientProps {
  faq?: FAQ[];
}

export default function ProtectClient({ faq }: ProtectClientProps) {
  const tool = pdfTools.find(t => t.id === "protect")!;
  return <ToolPage tool={tool} faq={faq} />;
}
