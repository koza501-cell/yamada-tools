"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile, forgotPassword } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [companyName, setCompanyName] = useState(user?.company_name || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");
    try {
      await updateProfile({ display_name: displayName, company_name: companyName });
      setSaveMsg("保存しました");
    } catch {
      setSaveMsg("保存に失敗しました");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handlePasswordReset = async () => {
    setPwLoading(true);
    setPwMsg("");
    const result = await forgotPassword(user.email);
    setPwMsg(result.success ? "パスワードリセットメールを送信しました" : "エラーが発生しました");
    setPwLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">プロフィール情報</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input type="email" value={user.email} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="山田 太郎" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#223A70]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">会社名</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="株式会社〇〇" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#223A70]" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-5 py-2 bg-[#223A70] text-white text-sm font-medium rounded-lg hover:bg-[#1a2d57] disabled:opacity-50 transition-colors">
              {saving ? "保存中..." : "保存する"}
            </button>
            {saveMsg && <span className={"text-sm " + (saveMsg.includes("失敗") ? "text-red-600" : "text-green-600")}>{saveMsg}</span>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-2">パスワード変更</h2>
        <p className="text-sm text-gray-500 mb-4">パスワードリセットリンクをメールで送信します。</p>
        <button onClick={handlePasswordReset} disabled={pwLoading} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
          {pwLoading ? "送信中..." : "パスワードリセットメールを送信"}
        </button>
        {pwMsg && <p className="mt-3 text-sm text-green-600">{pwMsg}</p>}
      </div>
    </div>
  );
}
