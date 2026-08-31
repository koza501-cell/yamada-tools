"use client";

import Link from "next/link";

interface Tool {
  name: string;
  url: string;
  icon: string;
}

const allFinanceTools: Tool[] = [
  { name: "新NISAシミュレーター", url: "/finance/nisa-simulator", icon: "📈" },
  { name: "住宅ローン計算機", url: "/finance/jutaku-loan", icon: "🏠" },
  { name: "FX損益計算機", url: "/finance/fx-calculator", icon: "💹" },
  { name: "老後資金シミュレーター", url: "/blog/rougo-shikin-simulation-2026", icon: "🏦" },
  { name: "iDeCo vs NISA 比較ツール", url: "/finance/ideco-nisa-comparison", icon: "⚖️" },
];

interface RelatedToolsProps {
  currentTool: string;
}

export default function RelatedTools({ currentTool }: RelatedToolsProps) {
  const relatedTools = allFinanceTools.filter((tool) => tool.url !== currentTool);

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">💡 あわせて使えるツール</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relatedTools.map((tool) => (
          <Link
            key={tool.url}
            href={tool.url}
            className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all group"
          >
            <span className="text-2xl">{tool.icon}</span>
            <span className="font-medium text-gray-700 group-hover:text-ai transition-colors">
              {tool.name}
            </span>
            <span className="ml-auto text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
