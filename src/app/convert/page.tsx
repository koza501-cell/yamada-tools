import { Metadata } from "next";
import Link from "next/link";
import { convertTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "変換ツール | 山田ツール - 全角半角・和暦西暦・郵便番号変換",
  description: "全角半角変換、和暦西暦変換、郵便番号検索、ふりがな変換など、日本のオフィスワークに必要な変換ツールを無料で提供。登録不要。",
  keywords: "全角半角変換, 和暦西暦変換, 郵便番号検索, ふりがな変換, 電話番号整形, 単位変換, 無料",
};

export default function ConvertToolsPage() {
  const availableTools = convertTools.filter(t => t.available);
  const comingSoonTools = convertTools.filter(t => !t.available);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🔄</div>
          <h1 className="text-3xl font-bold text-kon mb-4">変換ツール</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            全角・半角変換、和暦・西暦変換、郵便番号検索など、
            日本のオフィスワークで頻繁に必要になる変換ツールを無料で提供します。
          </p>
        </div>

        {/* Available Tools */}
        {availableTools.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-kon mb-6">利用可能なツール</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow text-center border border-gray-100"
                >
                  <div className="text-4xl mb-3">{tool.icon}</div>
                  <h3 className="font-bold text-kon mb-2">{tool.nameJa}</h3>
                  <p className="text-sm text-gray-500">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Tools */}
        {comingSoonTools.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-kon mb-6">
              準備中のツール（近日公開）
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {comingSoonTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200 opacity-70"
                >
                  <div className="text-4xl mb-3 grayscale">{tool.icon}</div>
                  <h3 className="font-bold text-kon mb-2">{tool.nameJa}</h3>
                  <p className="text-sm text-gray-500">{tool.description}</p>
                  <span className="inline-block mt-3 text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                    準備中
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block text-kon hover:underline"
          >
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
