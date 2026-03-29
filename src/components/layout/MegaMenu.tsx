"use client";
import Link from "next/link";
import { pdfTools, documentTools, convertTools, imageTools, generatorTools, financeTools } from "@/config/tools";

type CategoryKey = "pdf" | "document" | "convert" | "image" | "generator" | "finance";

const categoryTools: Record<CategoryKey, { tools: typeof pdfTools; viewAllLabel: string }> = {
  pdf: { tools: pdfTools, viewAllLabel: "すべてのPDFツール →" },
  document: { tools: documentTools, viewAllLabel: "すべての書類作成ツール →" },
  convert: { tools: convertTools, viewAllLabel: "すべての変換ツール →" },
  image: { tools: imageTools, viewAllLabel: "すべての画像ツール →" },
  generator: { tools: generatorTools, viewAllLabel: "すべての計算・生成ツール →" },
  finance: { tools: financeTools, viewAllLabel: "すべての金融ツール →" },
};

interface MegaMenuProps {
  category: CategoryKey;
  href: string;
  onClose: () => void;
}

export default function MegaMenu({ category, href, onClose }: MegaMenuProps) {
  const config = categoryTools[category];
  if (!config) return null;
  const availableTools = config.tools.filter(t => t.available).slice(0, 10);
  return (
    <div className="fixed top-16 left-0 w-screen bg-white shadow-xl border-t border-gray-100 py-6 z-50" onMouseLeave={onClose}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-4">
          {availableTools.map((tool) => (
            <Link key={tool.id} href={tool.path} onClick={onClose} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <p className="font-bold text-kon group-hover:text-ai transition-colors">{tool.nameJa}</p>
                <p className="text-sm text-gray-500 line-clamp-1">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <Link href={href} onClick={onClose} className="text-kon hover:text-ai font-medium transition-colors">{config.viewAllLabel}</Link>
        </div>
      </div>
    </div>
  );
}
