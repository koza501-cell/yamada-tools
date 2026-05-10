"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_TEAM = "https://api.yamada-tools.jp/api/team";

type Member = {
  id: number;
  email: string;
  member_user_id: number | null;
  status: string;
  role: string;
  created_at: string;
};

export default function TeamPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [seatLimit, setSeatLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    if (user.effective_plan !== "team") {
      router.push("/account/subscription");
      return;
    }
    fetchMembers();
  }, [user]);

  const fetchMembers = async () => {
    const token = localStorage.getItem("session_token");
    if (!token) return;
    try {
      const res = await fetch(API_TEAM + "/members", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      setMembers(data.members || []);
      setSeatLimit(data.seat_limit || 5);
    } catch {}
    setLoading(false);
  };

  const handleInvite = async () => {
    setError("");
    setSuccessMsg("");
    if (!inviteEmail) { setError("メールアドレスを入力してください"); return; }
    setInviting(true);
    const token = localStorage.getItem("session_token");
    try {
      const res = await fetch(API_TEAM + "/invite", {
        method: "POST",
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, frontend_url: "https://staging.yamada-tools.jp" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "エラーが発生しました"); setInviting(false); return; }
      setSuccessMsg("招待メールを送信しました");
      setInviteEmail("");
      setShowModal(false);
      fetchMembers();
    } catch { setError("エラーが発生しました"); }
    setInviting(false);
  };

  const handleRemove = async (memberId: number) => {
    if (!confirm("このメンバーを削除しますか？")) return;
    const token = localStorage.getItem("session_token");
    try {
      const res = await fetch(API_TEAM + "/members/" + memberId, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) fetchMembers();
    } catch {}
  };

  if (!user) return null;

  const statusBadge = (status: string) => {
    if (status === "active") return (
      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">有効</span>
    );
    return (
      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700">招待中</span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">チーム管理</h2>
          <p className="text-sm text-gray-500 mt-0.5">{members.length} / {seatLimit} シート使用中</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setError(""); setSuccessMsg(""); }}
          disabled={members.length >= seatLimit}
          className="px-4 py-2 bg-[#223A70] text-white text-sm font-medium rounded-lg hover:bg-[#1a2d57] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          メンバーを招待
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">{successMsg}</div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-8 text-sm text-gray-500">
          メンバーがいません。招待ボタンからチームメンバーを追加してください。
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="pb-3 font-medium">メールアドレス</th>
                <th className="pb-3 font-medium">ステータス</th>
                <th className="pb-3 font-medium">役割</th>
                <th className="pb-3 font-medium">招待日</th>
                <th className="pb-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="py-3 text-gray-700">{m.email}</td>
                  <td className="py-3">{statusBadge(m.status)}</td>
                  <td className="py-3 text-gray-500">{m.role === "member" ? "メンバー" : m.role}</td>
                  <td className="py-3 text-gray-500 text-xs">{m.created_at.slice(0, 10)}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleRemove(m.id)}
                      className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 hover:text-danger hover:border-gray-200 text-gray-600 transition-colors"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">メンバーを招待</h3>
            <p className="text-sm text-gray-500 mb-4">招待するメンバーのメールアドレスを入力してください。招待リンクをメールで送信します。</p>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="example@company.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#223A70] mb-3"
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
            {error && <p className="text-danger text-sm mb-3">{error}</p>}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowModal(false); setInviteEmail(""); setError(""); }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting}
                className="px-4 py-2 bg-[#223A70] text-white text-sm font-medium rounded-lg hover:bg-[#1a2d57] transition-colors disabled:opacity-50"
              >
                {inviting ? "送信中..." : "招待する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
