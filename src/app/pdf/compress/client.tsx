"use client";

import { useState } from "react";
import ToolPage from "@/components/tools/ToolPage";
import ToolFeedbackWidget from "@/components/feedback/ToolFeedbackWidget";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface SeoContent {
  intro: string;
  useCases?: { title: string; desc: string }[];
  tips?: string;
}

interface CompressClientProps {
  customH1?: string;
  faq?: FAQ[];
  seoContent?: SeoContent;
}

export default function CompressClient({ customH1, faq, seoContent }: CompressClientProps) {
  const tool = pdfTools.find(t => t.id === "compress")!;
  const [quality, setQuality] = useState("medium");
  const [feedbackVisible, setFeedbackVisible] = useState(false);

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
      customH1={customH1}
      faq={faq}
      seoContent={seoContent}
      extraFields={extraFields}
      extraFormData={{ quality }}
      onSuccess={() => setFeedbackVisible(true)}
      feedbackWidget={
        <ToolFeedbackWidget
          toolSlug="pdf/compress"
          visible={feedbackVisible}
          lang="ja"
        />
      }
    />
  );
}
