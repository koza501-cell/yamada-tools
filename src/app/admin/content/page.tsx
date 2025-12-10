"use client";

import { useState, useEffect } from "react";
import { pdfTools } from "@/config/tools";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

interface ToolContent {
  tool_id: string;
  title?: string;
  description?: string;
  how_to_content?: string;
  seo_keywords?: string[];
  updated_at?: string;
}

export default function ContentManagement() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, ToolContent>>({});
  const [formData, setFormData] = useState<ToolContent>({
    tool_id: "",
    title: "",
    description: "",
    how_to_content: "",
    seo_keywords: [],
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/content`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setContent(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch content:", err);
    }
  };

  const handleSelectTool = (toolId: string) => {
    setSelectedTool(toolId);
    const existingContent = content[toolId];
    if (existingContent) {
      setFormData(existingContent);
    } else {
      const tool = pdfTools.find((t) => t.id === toolId);
      setFormData({
        tool_id: toolId,
        title: tool?.nameJa || "",
        description: tool?.description || "",
        how_to_content: "",
        seo_keywords: [],
      });
    }
    setMessage("");
  };

  const handleSave = async () => {
    if (!selectedTool) return;
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/content/${selectedTool}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("✅ 保存しました");
        fetchAllContent();
      } else {
        setMessage("❌ 保存に失敗しました");
      }
    } catch (err) {
      setMessage("❌ エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const wordCount = (text: string) => {
    return text.replace(/\s/g, "").length;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-kon mb-8">📝 コンテンツ管理</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tool List */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-kon mb-4">ツール一覧</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {pdfTools.map((tool) => {
              const hasContent = content[tool.id]?.how_to_content;
              const count = hasContent ? wordCount(content[tool.id].how_to_content!) : 0;
              
              return (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.id)}
                  className={`w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between ${
                    selectedTool === tool.id
                      ? "bg-kon text-white"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{tool.icon}</span>
                    <span className="text-sm">{tool.nameJa}</span>
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      count >= 600
                        ? "bg-green-100 text-green-700"
                        : count > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}字
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          {selectedTool ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-kon text-lg">
                  {pdfTools.find((t) => t.id === selectedTool)?.icon}{" "}
                  {pdfTools.find((t) => t.id === selectedTool)?.nameJa}
                </h2>
                <div className="flex items-center gap-4">
                  {message && <span className="text-sm">{message}</span>}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-kon text-white px-6 py-2 rounded-xl font-bold hover:bg-ai transition-colors disabled:opacity-50"
                  >
                    {saving ? "保存中..." : "保存"}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-kon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明文
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-kon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEOキーワード（カンマ区切り）
                  </label>
                  <input
                    type="text"
                    value={formData.seo_keywords?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo_keywords: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                    placeholder="PDF結合, PDF まとめる, 無料"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-kon"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      How-to コンテンツ（SEO用）
                    </label>
                    <span
                      className={`text-sm font-bold ${
                        wordCount(formData.how_to_content || "") >= 600
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {wordCount(formData.how_to_content || "")} / 600字
                    </span>
                  </div>
                  <textarea
                    value={formData.how_to_content || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, how_to_content: e.target.value })
                    }
                    rows={15}
                    placeholder="このツールの使い方、メリット、注意点などを600文字以上で記載してください..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-kon font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 AdSense申請には600文字以上のオリジナルコンテンツが必要です
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-400">
              左のリストからツールを選択してください
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
