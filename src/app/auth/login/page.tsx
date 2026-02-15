"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email);
    setLoading(false);
    if (result.success) { setSent(true); }
    else { setError(result.message); }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-kon mb-4">メールを確認してください</h1>
          <p className="text-gray-600 mb-6">{email} にログインリンクを送信しました。<br/>メール内のリンクをクリックしてログインしてください。</p>
          <p className="text-sm text-gray-400">リンクは15分間有効です</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-kon mb-2">ログイン / 新規登録</h1>
          <p className="text-gray-600">メールアドレスを入力してください</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sakura focus:border-transparent"
              placeholder="example@email.com" />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-sakura hover:bg-sakura/90 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
            {loading ? "送信中..." : "ログインリンクを送信"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>パスワード不要！メールのリンクをクリックするだけでログインできます</p>
        </div>
        <div className="mt-6 pt-6 border-t text-center">
          <Link href="/" className="text-kon hover:underline">← ホームに戻る</Link>
        </div>
      </div>
    </div>
  );
}
