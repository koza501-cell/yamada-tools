"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

interface Stats {
  tools_with_content: number;
  total_tools: number;
  active_banners: number;
  active_campaigns: number;
  total_banners: number;
  total_campaigns: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "コンテンツ完成",
      value: stats ? `${stats.tools_with_content}/${stats.total_tools}` : "-",
      icon: "📝",
      color: "bg-kon",
      href: "/admin/content",
    },
    {
      label: "有効バナー",
      value: stats ? `${stats.active_banners}` : "-",
      icon: "🎨",
      color: "bg-green-500",
      href: "/admin/banners",
    },
    {
      label: "有効キャンペーン",
      value: stats ? `${stats.active_campaigns}` : "-",
      icon: "🎯",
      color: "bg-kon",
      href: "/admin/campaigns",
    },
    {
      label: "総ツール数",
      value: stats ? `${stats.total_tools}` : "-",
      icon: "🛠️",
      color: "bg-kon",
      href: "/admin/content",
    },
  ];

  const quickActions = [
    { label: "新しいバナーを作成", href: "/admin/banners", icon: "➕" },
    { label: "キャンペーンを開始", href: "/admin/campaigns", icon: "🚀" },
    { label: "コンテンツを編集", href: "/admin/content", icon: "✏️" },
    { label: "サイト設定", href: "/admin/settings", icon: "⚙️" },
  ];

  const todoList = [
    { task: "PDF結合ページに600文字以上のコンテンツを追加", done: false },
    { task: "季節テーマ（桜）を設定", done: false },
    { task: "特定商取引法ページの会社情報を更新", done: false },
    { task: "Google Analytics IDを設定", done: false },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-kon mb-8">📊 ダッシュボード</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`${card.color} text-white p-3 rounded-xl text-xl`}>
                {card.icon}
              </span>
              <span className="text-3xl font-bold text-kon">{card.value}</span>
            </div>
            <p className="text-gray-600">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-kon mb-4">⚡ クイックアクション</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-kon mb-4">📋 やることリスト</h2>
          <ul className="space-y-3">
            {todoList.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.done}
                  className="w-5 h-5 rounded border-gray-300"
                  readOnly
                />
                <span className={item.done ? "text-gray-400 line-through" : "text-gray-700"}>
                  {item.task}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content Progress */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-kon mb-4">📈 コンテンツ進捗</h2>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>AdSense申請準備</span>
            <span className="font-bold">
              {stats ? Math.round((stats.tools_with_content / stats.total_tools) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-kon h-4 rounded-full transition-all"
              style={{
                width: stats
                  ? `${(stats.tools_with_content / stats.total_tools) * 100}%`
                  : "0%",
              }}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          各ツールページに600文字以上のコンテンツを追加するとAdSense申請の準備が完了します。
        </p>
      </div>
    </div>
  );
}
