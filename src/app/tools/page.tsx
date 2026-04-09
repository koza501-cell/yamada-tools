"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { allTools, pdfTools, documentTools, convertTools, imageTools, generatorTools, seoTools } from "@/config/tools";

const categories = [
  { id: "seo", name: "SEO・AIツール", tools: seoTools, icon: "🔍" },
  { id: "pdf", name: "PDFツール", tools: pdfTools, icon: "📄" },
  { id: "document", name: "書類作成", tools: documentTools, icon: "📝" },
  { id: "convert", name: "変換ツール", tools: convertTools, icon: "🔄" },
  { id: "image", name: "画像ツール", tools: imageTools, icon: "🖼️" },
  { id: "generator", name: "計算・生成", tools: generatorTools, icon: "🧮" },
];

const ROLE_TABS = [
  { id: "all", label: "すべて", icon: "🗂️" },
  { id: "accounting", label: "経理・財務", icon: "🏦" },
  { id: "hr", label: "人事・給与", icon: "👥" },
  { id: "general", label: "総務・庶務", icon: "🏢" },
  { id: "pdf", label: "PDF処理", icon: "📄" },
  { id: "marketing", label: "マーケ・営業", icon: "📊" },
];

const ROLE_TOOL_IDS: Record<string, string[]> = {
  accounting: [
    "/convert/bank-format", "/document/invoice", "/document/receipt",
    "/document/quotation", "/document/delivery-slip", "/generator/t-number",
    "/generator/nenmatsu-calc", "/tax/furusato-nozei-calculator",
    "/tax/income-tax-calculator", "/generator/tax-calculator",
  ],
  hr: [
    "/generator/salary-calc", "/career/overtime-calculator",
    "/career/unemployment-calculator", "/career/social-insurance-calculator",
    "/career/retirement-bonus-calculator", "/career/income-wall-checker",
    "/generator/nenmatsu-calc", "/generator/age-calculator",
  ],
  general: [
    "/generator/envelope-print", "/generator/hanko", "/document/cover-letter",
    "/pdf/combini-print", "/document/business-card", "/pdf/compress",
    "/pdf/merge", "/pdf/split", "/pdf/protect", "/image/qr-code",
    "/convert/wareki-seireki", "/convert/furigana",
  ],
  pdf: [
    "/pdf/compress", "/pdf/merge", "/pdf/split", "/pdf/rotate",
    "/pdf/text-input", "/pdf/protect", "/pdf/unlock", "/pdf/ocr",
    "/pdf/sign", "/pdf/delete-pages", "/pdf/watermark", "/pdf/page-numbers",
    "/pdf/combini-print",
  ],
  marketing: [
    "/image/compress", "/image/resize", "/image/qr-code", "/image/banner",
    "/document/business-card", "/generator/lorem-ipsum",
    "/image/format-convert", "/convert/url-encode",
  ],
};

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const [activeRole, setActiveRole] = useState(() => {
    const role = searchParams.get("role");
    return role && ROLE_TABS.some(t => t.id === role) ? role : "all";
  });
  const availableTools = allTools.filter(t => t.available);

  const filteredCategories = categories.map(cat => {
    if (activeRole === "all") return cat;
    const allowedPaths = ROLE_TOOL_IDS[activeRole] || [];
    return {
      ...cat,
      tools: cat.tools.filter(t => allowedPaths.includes(t.path)),
    };
  }).filter(cat => cat.tools.filter(t => t.available).length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-kon mb-2">全ツール一覧</h1>
          <p className="text-gray-600">{availableTools.length}種類の無料ツール · 登録不要 · 日本国内サーバー</p>
        </header>

        {/* Role-based tabs */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 text-center mb-3">業務ロール別に絞り込む</p>
          <div className="flex flex-wrap justify-center gap-2">
            {ROLE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveRole(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activeRole === tab.id
                    ? "bg-kon text-white border-kon"
                    : "bg-white text-gray-700 border-gray-200 hover:border-kon hover:text-kon"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category anchor nav */}
        {activeRole === "all" && (
          <nav className="mb-8 flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <a key={cat.id} href={`#${cat.id}`} className="px-4 py-2 bg-white rounded-full border hover:border-kon text-sm transition-colors">
                {cat.icon} {cat.name}
              </a>
            ))}
          </nav>
        )}

        {filteredCategories.map(cat => (
          <section key={cat.id} id={cat.id} className="mb-12">
            <h2 className="text-2xl font-bold text-kon mb-6">{cat.icon} {cat.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cat.tools.filter(t => t.available).map(tool => (
                <Link key={tool.id} href={tool.path} className="bg-white rounded-xl p-4 border hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-gray-800">{tool.nameJa}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p>このロールに対応するツールが見つかりませんでした</p>
            <button onClick={() => setActiveRole("all")} className="mt-4 text-kon underline text-sm">すべて表示</button>
          </div>
        )}
      </div>
    </div>
  );
}
