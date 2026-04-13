"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_TEAM = "https://api.yamada-tools.jp/api/team";

export default function InviteAcceptPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "accepting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!token) {
      setStatus("error");
      setErrorMsg("無効な招待リンクです");
      return;
    }
    if (!user) return;
    // Auto-accept if logged in
    acceptInvite();
  }, [user, loading, token]);

  const acceptInvite = async () => {
    setStatus("accepting");
    const sessionToken = localStorage.getItem("session_token");
    try {
      const res = await fetch(`${API_TEAM}/invite/accept?token=${token}`, {
        method: "POST",
        headers: { Authorization: "Bearer " + sessionToken },
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.detail || "エラーが発生しました");
        return;
      }
      setStatus("success");
      await refreshUser();
      setTimeout(() => router.push("/account/team"), 2000);
    } catch {
      setStatus("error");
      setErrorMsg("エラーが発生しました");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#223A70]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4 text-center">
          <div className="text-4xl mb-4">👥</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-2">チームへの招待</h1>
          <p className="text-sm text-gray-500 mb-6">ログインして招待を承認してください</p>
          <a
            href={`/auth/login?redirect=${encodeURIComponent(`/account/team/invite?token=${token}`)}`}
            className="inline-block px-6 py-2.5 bg-[#223A70] text-white text-sm font-medium rounded-lg hover:bg-[#1a2d57] transition-colors"
          >
            ログインする
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4 text-center">
        {status === "accepting" && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#223A70] mx-auto mb-4" />
            <p className="text-sm text-gray-500">招待を承認中...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">チームに参加しました</h1>
            <p className="text-sm text-gray-500">チーム管理ページに移動します...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">エラー</h1>
            <p className="text-sm text-gray-500 mb-4">{errorMsg}</p>
            <a href="/account" className="text-sm text-[#223A70] hover:underline">アカウントに戻る</a>
          </>
        )}
      </div>
    </div>
  );
}
