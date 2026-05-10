"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

interface Banner {
  id?: string;
  title: string;
  message: string;
  link?: string;
  bg_color: string;
  text_color: string;
  position: string;
  active: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

const defaultBanner: Banner = {
  title: "",
  message: "",
  link: "",
  bg_color: "#223A70",
  text_color: "#FFFFFF",
  position: "top",
  active: true,
  start_date: "",
  end_date: "",
};

export default function BannersManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/banners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBanners(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setMessage("");

    try {
      const token = localStorage.getItem("admin_token");
      const url = isNew
        ? `${API_BASE}/api/admin/banners`
        : `${API_BASE}/api/admin/banners/${editing.id}`;
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
        fetchBanners();
      } else {
        setMessage("❌ 保存に失敗しました");
      }
    } catch (err) {
      setMessage("❌ エラーが発生しました");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このバナーを削除しますか？")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchBanners();
      }
    } catch (err) {
      console.error("Failed to delete banner:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-kon">🎨 バナー管理</h1>
        <button
          onClick={() => {
            setEditing(defaultBanner);
            setIsNew(true);
          }}
          className="bg-kon text-white px-6 py-2 rounded-xl font-bold hover:bg-ai transition-colors"
        >
          ＋ 新規作成
        </button>
      </div>

      {/* Banner List */}
      <div className="grid gap-4 mb-8">
        {banners.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
            バナーがありません。「新規作成」をクリックして追加してください。
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              {/* Preview */}
              <div
                className="rounded-xl p-4 mb-4 text-center"
                style={{
                  backgroundColor: banner.bg_color,
                  color: banner.text_color,
                }}
              >
                <strong>{banner.title}</strong>: {banner.message}
                {banner.link && (
                  <span className="underline ml-2">詳細 →</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      banner.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {banner.active ? "有効" : "無効"}
                  </span>
                  <span>位置: {banner.position}</span>
                  {banner.start_date && <span>開始: {banner.start_date}</span>}
                  {banner.end_date && <span>終了: {banner.end_date}</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(banner);
                      setIsNew(false);
                    }}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id!)}
                    className="px-4 py-2 bg-gray-50 text-danger rounded-lg hover:bg-gray-50"
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
              {isNew ? "新規バナー作成" : "バナー編集"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル
                </label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="🎉 新機能"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メッセージ
                </label>
                <input
                  type="text"
                  value={editing.message}
                  onChange={(e) => setEditing({ ...editing, message: e.target.value })}
                  placeholder="PDF OCR機能が追加されました！"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  リンク（任意）
                </label>
                <input
                  type="text"
                  value={editing.link || ""}
                  onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                  placeholder="/pdf/ocr"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    背景色
                  </label>
                  <input
                    type="color"
                    value={editing.bg_color}
                    onChange={(e) => setEditing({ ...editing, bg_color: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    文字色
                  </label>
                  <input
                    type="color"
                    value={editing.text_color}
                    onChange={(e) => setEditing({ ...editing, text_color: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  表示位置
                </label>
                <select
                  value={editing.position}
                  onChange={(e) => setEditing({ ...editing, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                >
                  <option value="top">ページ上部</option>
                  <option value="bottom">ページ下部</option>
                  <option value="popup">ポップアップ</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    開始日（任意）
                  </label>
                  <input
                    type="date"
                    value={editing.start_date || ""}
                    onChange={(e) => setEditing({ ...editing, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    終了日（任意）
                  </label>
                  <input
                    type="date"
                    value={editing.end_date || ""}
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

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  プレビュー
                </label>
                <div
                  className="rounded-xl p-4 text-center"
                  style={{
                    backgroundColor: editing.bg_color,
                    color: editing.text_color,
                  }}
                >
                  <strong>{editing.title || "タイトル"}</strong>:{" "}
                  {editing.message || "メッセージ"}
                  {editing.link && <span className="underline ml-2">詳細 →</span>}
                </div>
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
