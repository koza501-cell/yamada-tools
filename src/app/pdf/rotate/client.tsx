"use client";

import { useState } from "react";
import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface RotateClientProps {
  faq?: FAQ[];
}

export default function RotateClient({ faq }: RotateClientProps) {
  const tool = pdfTools.find(t => t.id === "rotate")!;
  const [angle, setAngle] = useState("90");

  const extraFields = (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        回転角度
      </label>
      <div className="flex gap-3">
        {[
          { value: "90", label: "90°", desc: "右回転" },
          { value: "180", label: "180°", desc: "反転" },
          { value: "270", label: "270°", desc: "左回転" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setAngle(opt.value)}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              angle === opt.value
                ? "border-kon bg-kon/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium text-lg">{opt.label}</div>
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
      extraFormData={{ angle }}
    />
  );
}
