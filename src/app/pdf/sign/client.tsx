"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface SignClientProps {
  faq?: FAQ[];
}

export default function SignClient({ faq }: SignClientProps) {
  const tool = pdfTools.find(t => t.id === "sign")!;
  return <ToolPage tool={tool} faq={faq} />;
}
