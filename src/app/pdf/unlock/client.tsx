"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface UnlockClientProps {
  faq?: FAQ[];
}

export default function UnlockClient({ faq }: UnlockClientProps) {
  const tool = pdfTools.find(t => t.id === "unlock")!;
  return <ToolPage tool={tool} faq={faq} />;
}
