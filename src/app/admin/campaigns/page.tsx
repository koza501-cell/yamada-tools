"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

interface Campaign {
  id?: string;
  name: string;
  description: string;
  discount_percent?: number;
  banner_id?: string;
  tools?: string[];
  active: boolean;
  start_date: string;
  end_date: string;
  created_at?: string;
}

const defaultCampaign: Campaign = {
  name: "",
  description: "",
  discount_percent: 0,
  banner_id: "",
  tools: [],
  active: false,
  start_date: "",
  end_date: "",
};

export default function CampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCampaigns(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setMessage("");

    try {
      const token = localStorage.getItem("admin_token");
      const url = isNew
        ? `${API_BASE}/api/admin/campaigns`
        : `${API_BASE}/api/admin/campaigns/${editing.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editing),
      });

      if (res.ok) {
        setMessage("✅ 保存しました");
        setEditing(null);
        setIsNew(false);
        fetchCampaigns();
      } else {
        setMessage("❌ 保存に失敗しました");
      }
    } catch (err) {
      setMessage("❌ エラーが発生しました");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このキャンペーンを削除しますか？")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/campaigns/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchCampaigns();
      }
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    }
  };

  const getStatusBadge = (campaign: Campaign) => {
    const now = new Date();
    const start = new Date(campaign.start_date);
    const end = new Date(campaign.end_date);

    if (!campaign.active) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">無効</span>;
    }
    if (now < start) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">予定</span>;
    }
    if (now > end) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">終了</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">実施中</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-kon">🎯 キャンペーン管理</h1>
        <button
          onClick={() => {
            setEditing(defaultCampaign);
            setIsNew(true);
          }}
          className="bg-kon text-white px-6 py-2 rounded-xl font-bold hover:bg-ai transition-colors"
        >
          ＋ 新規作成
        </button>
      </div>

      {/* Campaign List */}
      <div className="grid gap-4 mb-8">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
            キャンペーンがありません。「新規作成」をクリックして追加してください。
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{campaign.name}</h3>
                    {getStatusBadge(campaign)}
                  </div>
                  <p className="text-gray-600 mb-3">{campaign.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📅 {campaign.start_date} 〜 {campaign.end_date}</span>
                    {campaign.discount_percent && (
                      <span className="text-red-500 font-bold">
                        {campaign.discount_percent}% OFF
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(campaign);
                      setIsNew(false);
                    }}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id!)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-kon mb-6">
              {isNew ? "新規キャンペーン作成" : "キャンペーン編集"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  キャンペーン名
                </label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="🎄 年末キャンペーン"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  説明
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="年末限定！すべてのツールが使い放題..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    開始日
                  </label>
                  <input
                    type="date"
                    value={editing.start_date}
                    onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    終了日
                  </label>
                  <input
                    type="date"
                    value={editing.end_date}
                    onChange={(e) => setEditing({ ...editing, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  有効にする
                </label>
              </div>
            </div>

            {message && <p className="mt-4 text-center">{message}</p>}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setEditing(null);
                  setIsNew(false);
                  setMessage("");
                }}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
