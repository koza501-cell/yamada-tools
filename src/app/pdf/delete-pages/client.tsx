"use client";

import { useState } from "react";
import ToolPage from "@/components/tools/ToolPage";
import { pdfTools } from "@/config/tools";

interface FAQ {
  question: string;
  answer: string;
}

interface DeletePagesClientProps {
  faq?: FAQ[];
}

export default function DeletePagesClient({ faq }: DeletePagesClientProps) {
  const tool = pdfTools.find(t => t.id === "delete-pages")!;
  const [pages, setPages] = useState("");

  const extraFields = (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        削除するページ番号
      </label>
      <input
        type="text"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        placeholder="例: 1,3,5 または 2-5"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kon focus:border-transparent"
      />
      <p className="text-xs text-gray-500">
        カンマ区切りで複数指定、ハイフンで範囲指定ができます
      </p>
    </div>
  );

  return (
    <ToolPage 
      tool={tool} 
      faq={faq} 
      extraFields={extraFields}
      extraFormData={{ pages }}
    />
  );
}
