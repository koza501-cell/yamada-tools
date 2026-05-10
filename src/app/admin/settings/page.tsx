"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

interface SiteSettings {
  site_name: string;
  site_description: string;
  announcement: string | null;
  maintenance_mode: boolean;
  seasonal_theme: string | null;
  mascot_enabled: boolean;
  google_analytics_id: string | null;
  umami_website_id: string | null;
}

const defaultSettings: SiteSettings = {
  site_name: "山田ツール",
  site_description: "PDF・Office・画像の無料オンラインツール",
  announcement: null,
  maintenance_mode: false,
  seasonal_theme: null,
  mascot_enabled: false,
  google_analytics_id: null,
  umami_website_id: null,
};

const seasonalThemes = [
  { value: null, label: "なし", icon: "⚪" },
  { value: "sakura", label: "桜（春）", icon: "🌸" },
  { value: "summer", label: "夏", icon: "🌻" },
  { value: "autumn", label: "紅葉（秋）", icon: "🍁" },
  { value: "winter", label: "雪（冬）", icon: "❄️" },
  { value: "newyear", label: "お正月", icon: "🎍" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSettings(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage("✅ 設定を保存しました");
      } else {
        setMessage("❌ 保存に失敗しました");
      }
    } catch (err) {
      setMessage("❌ エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-kon">⚙️ サイト設定</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-kon text-white px-6 py-2 rounded-xl font-bold hover:bg-ai transition-colors disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-white rounded-xl text-center">{message}</div>
      )}

      <div className="grid gap-6">
        {/* Basic Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-kon mb-4">🏠 基本設定</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                サイト名
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                サイト説明
              </label>
              <input
                type="text"
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Announcement */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-kon mb-4">📢 お知らせ</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              サイト全体のお知らせ（空欄で非表示）
            </label>
            <input
              type="text"
              value={settings.announcement || ""}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value || null })}
              placeholder="例: 12月24日はメンテナンスのため一時停止します"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-kon mb-4">🎨 外観設定</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                季節テーマ
              </label>
              <div className="grid grid-cols-3 gap-3">
                {seasonalThemes.map((theme) => (
                  <button
                    key={theme.value || "none"}
                    onClick={() => setSettings({ ...settings, seasonal_theme: theme.value })}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      settings.seasonal_theme === theme.value
                        ? "border-kon bg-kon/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{theme.icon}</span>
                    <span className="text-sm">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="mascot"
                checked={settings.mascot_enabled}
                onChange={(e) => setSettings({ ...settings, mascot_enabled: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <label htmlFor="mascot" className="text-sm font-medium text-gray-700">
                🤖 マスコットキャラクターを表示する（準備中）
              </label>
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-kon mb-4">🔧 メンテナンス</h2>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="maintenance"
              checked={settings.maintenance_mode}
              onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              className="w-5 h-5 rounded"
            />
            <label htmlFor="maintenance" className="text-sm font-medium text-gray-700">
              メンテナンスモードを有効にする（サイトが一時停止されます）
            </label>
          </div>
          {settings.maintenance_mode && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-danger text-sm">
              ⚠️ メンテナンスモードが有効です。ユーザーはサイトにアクセスできません。
            </div>
          )}
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-kon mb-4">📊 アクセス解析</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={settings.google_analytics_id || ""}
                onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value || null })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Umami Website ID
              </label>
              <input
                type="text"
                value={settings.umami_website_id || ""}
                onChange={(e) => setSettings({ ...settings, umami_website_id: e.target.value || null })}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
