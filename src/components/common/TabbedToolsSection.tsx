"use client";
import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { cardCls } from "@/components/ui/Card";
import Emoji from "@/components/ui/Emoji";

interface Tool {
  id: string;
  path: string;
  icon: string;
  nameJa: string;
  description: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface TabData {
  id: string;
  label: string;
  icon: string;
  href: string;
  tools: Tool[];
}

interface TabbedToolsSectionProps {
  pdfTools: Tool[];
  documentTools: Tool[];
  convertTools: Tool[];
  imageTools: Tool[];
  generatorTools: Tool[];
  financeTools?: Tool[];
  careerTools?: Tool[];
  taxTools?: Tool[];
  realestateTools?: Tool[];
  businessTools?: Tool[];
  healthTools?: Tool[];
  foodTools?: Tool[];
  lifeTools?: Tool[];
  clinicTools?: Tool[];
}

export default function TabbedToolsSection({
  pdfTools,
  documentTools,
  convertTools,
  imageTools,
  generatorTools,
  financeTools = [],
  careerTools = [],
  taxTools = [],
  realestateTools = [],
  businessTools = [],
  healthTools = [],
  foodTools = [],
  lifeTools = [],
  clinicTools = [],
}: TabbedToolsSectionProps) {
  const [activeTab, setActiveTab] = useState("pdf");

  const allTabs: TabData[] = [
    { id: "pdf",        label: "PDF",       icon: "📄", href: "/pdf",        tools: pdfTools },
    { id: "document",   label: "書類",       icon: "📝", href: "/document",   tools: documentTools },
    { id: "convert",    label: "変換",       icon: "🔄", href: "/convert",    tools: convertTools },
    { id: "image",      label: "画像",       icon: "🖼️", href: "/image",      tools: imageTools },
    { id: "generator",  label: "ツール・計算", icon: "⚡", href: "/generator",  tools: generatorTools },
    { id: "finance",    label: "金融",       icon: "💰", href: "/finance",    tools: financeTools },
    { id: "career",     label: "キャリア",   icon: "💼", href: "/career",     tools: careerTools },
    { id: "tax",        label: "税金",       icon: "💴", href: "/tax",        tools: taxTools },
    { id: "realestate", label: "不動産",     icon: "🏘️", href: "/realestate", tools: realestateTools },
    { id: "business",   label: "法人",       icon: "🏢", href: "/business",   tools: businessTools },
    { id: "health",     label: "健康",       icon: "💪", href: "/health",     tools: healthTools },
    { id: "food",       label: "飲食",       icon: "🍽️", href: "/food",       tools: foodTools },
    { id: "life",       label: "生活",       icon: "🏠", href: "/life",       tools: lifeTools },
    { id: "clinic",     label: "クリニック", icon: "🏥", href: "/clinic",     tools: clinicTools },
  ];

  const tabs = allTabs.filter((t) => t.tools.length > 0);
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section id="tools-tabs" className="py-section bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <span><Emoji symbol="🛠️" size="lg" label="ツール" /></span>
            <h2 className="text-2xl font-bold text-kon dark:text-gray-300">カテゴリ別ツール</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">タブをクリックしてカテゴリを切り替え</p>
        </div>

        <div className="flex justify-center mb-6 overflow-x-auto pb-1">
          <div
            className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700 flex-wrap gap-1"
            role="tablist"
            aria-label="ツールカテゴリ"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-kon text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={activeTab}
        >
          <div className="flex justify-end mb-4">
            <Link
              href={currentTab.href}
              className="text-kon dark:text-gray-300 hover:text-ai transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Emoji symbol={currentTab.icon} size="sm" />
              {currentTab.label}をすべて見る →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-6">
            {currentTab.tools.slice(0, 8).map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className={`${cardCls('default')} relative p-4 text-center hover:border-sakura dark:hover:border-sakura`}
              >
                {tool.isNew && (
                  <Badge variant="new" className="absolute -top-2 -right-2">NEW</Badge>
                )}
                {tool.isPopular && !tool.isNew && (
                  <Badge variant="popular" className="absolute -top-2 -right-2">人気</Badge>
                )}
                <div className="mb-2">
                  <Emoji symbol={tool.icon} size="lg" label={tool.nameJa} />
                </div>
                <h3 className="font-bold text-base text-kon dark:text-gray-300 leading-tight">{tool.nameJa}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 font-normal">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
