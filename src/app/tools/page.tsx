"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  allTools,
  pdfTools,
  documentTools,
  convertTools,
  imageTools,
  generatorTools,
  financeTools,
  taxTools,
  insuranceTools,
  careerTools,
  realestateTools,
  businessTools,
  healthTools,
  educationTools,
  debtTools,
  utilityTools,
  statTools,
  foodTools,
  lifeTools,
  clinicTools,
} from "@/config/tools";

const categories = [
  { id: "pdf", name: "PDFツール", tools: pdfTools, icon: "📄" },
  { id: "document", name: "書類作成", tools: documentTools, icon: "📝" },
  { id: "convert", name: "変換ツール", tools: convertTools, icon: "🔄" },
  { id: "image", name: "画像ツール", tools: imageTools, icon: "🖼️" },
  { id: "generator", name: "計算・生成", tools: generatorTools, icon: "🧮" },
  { id: "finance", name: "金融・投資", tools: financeTools, icon: "💰" },
  { id: "tax", name: "税金・確定申告", tools: taxTools, icon: "📑" },
  { id: "insurance", name: "保険", tools: insuranceTools, icon: "🛡️" },
  { id: "career", name: "キャリア・転職", tools: careerTools, icon: "💼" },
  { id: "realestate", name: "不動産・住まい", tools: realestateTools, icon: "🏠" },
  { id: "business", name: "ビジネス・法人", tools: businessTools, icon: "🏢" },
  { id: "health", name: "健康・生活", tools: healthTools, icon: "💪" },
  { id: "education", name: "教育・学習", tools: educationTools, icon: "🎓" },
  { id: "debt", name: "ローン・借金", tools: debtTools, icon: "💳" },
  { id: "utility", name: "ユーティリティ", tools: utilityTools, icon: "🔧" },
  { id: "stat", name: "統計・データ", tools: statTools, icon: "📊" },
  { id: "food", name: "飲食・食品", tools: foodTools, icon: "🍽️" },
  { id: "life", name: "生活・家計", tools: lifeTools, icon: "🏠" },
  { id: "clinic", name: "クリニック経営", tools: clinicTools, icon: "🏥" },
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
    "/pdf/combini-print", "/pdf/stamp",
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
    return role && ROLE_TABS.some((t) => t.id === role) ? role : "all";
  });
  const availableTools = allTools.filter((t) => t.available);

  const filteredCategories = categories
    .map((cat) => {
      const availableInCat = cat.tools.filter((t) => t.available);
      if (activeRole === "all") return { ...cat, tools: availableInCat };
      const allowedPaths = ROLE_TOOL_IDS[activeRole] || [];
      return {
        ...cat,
        tools: availableInCat.filter((t) => allowedPaths.includes(t.path)),
      };
    })
    .filter((cat) => cat.tools.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-kon dark:text-white mb-2">
            全ツール一覧
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {availableTools.length}種類の無料ツール · 登録不要 · 日本国内サーバー
          </p>
        </header>

        <div className="mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">
            業務ロール別に絞り込む
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {ROLE_TABS.map((tab) => (
              <button type="button"
                key={tab.id}
                onClick={() => setActiveRole(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activeRole === tab.id
                    ? "bg-kon text-white border-kon"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-kon hover:text-kon"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:flex lg:gap-8">
          <aside className="lg:w-56 lg:flex-shrink-0 mb-6 lg:mb-0">
            <nav className="lg:sticky lg:top-20">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-2">
                カテゴリ
              </p>
              <ul className="flex flex-wrap lg:flex-col gap-1">
                {filteredCategories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`#${cat.id}`}
                      className="inline-block px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    >
                      {cat.icon} {cat.name}
                      <span className="ml-1 text-xs text-gray-400">
                        ({cat.tools.length})
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {filteredCategories.length === 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-700 dark:text-gray-300">
                  該当するツールがありません。
                </p>
              </div>
            )}
            {filteredCategories.map((cat) => (
              <section key={cat.id} id={cat.id} className="mb-10 scroll-mt-20">
                <h2 className="text-2xl font-bold text-kon dark:text-white mb-4 flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({cat.tools.length}件)
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-sakura dark:hover:border-sakura hover:shadow-md transition-all"
                    >
                      {tool.isNew && (
                        <span className="absolute -top-2 -right-2 bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{tool.icon}</span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-sakura mb-1">
                            {tool.nameJa}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
