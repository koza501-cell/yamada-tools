"use client";

import { useState } from "react";
import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface CompressClientProps {
  faq?: FAQ[];
}

export default function CompressClient({ faq }: CompressClientProps) {
  const tool = pdfTools.find(t => t.id === "compress")!;
  const [quality, setQuality] = useState("medium");

  const extraFields = (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        圧縮レベル
      </label>
      <div className="flex gap-3">
        {[
          { value: "low", label: "最大圧縮", desc: "最小サイズ" },
          { value: "medium", label: "標準", desc: "バランス" },
          { value: "high", label: "高品質", desc: "画質維持" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setQuality(opt.value)}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              quality === opt.value
                ? "border-kon bg-kon/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium text-sm">{opt.label}</div>
            <div className="text-xs text-gray-500">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <ToolPage 
      tool={tool} 
      faq={faq} 
      extraFields={extraFields}
      extraFormData={{ quality }}
    />
  );
}
