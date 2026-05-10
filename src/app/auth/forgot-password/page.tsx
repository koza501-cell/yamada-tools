"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await forgotPassword(email);
    setSubmitting(false);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.message);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-xl font-bold text-gray-900 mb-4">メールを送信しました</h1>
            <p className="text-gray-600 mb-6">
              {email} にパスワードリセットのリンクを送信しました。<br />
              メール内のリンクをクリックして新しいパスワードを設定してください。
            </p>
            <p className="text-sm text-gray-400 mb-6">リンクは1時間有効です</p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-kon text-white font-medium rounded-lg hover:bg-kon/90 transition-colors"
            >
              ログインページへ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Image src="/logo-icon.webp" alt="山田ツール" className="w-10 h-10" width={40} height={40} />
            <span className="text-2xl font-bold text-kon">山田ツール</span>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-xl font-bold text-gray-900 text-center mb-2">パスワードをお忘れですか？</h1>
          <p className="text-gray-600 text-sm text-center mb-6">
            登録したメールアドレスを入力してください。<br />
            パスワードリセットのリンクをお送りします。
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kon focus:border-transparent"
                placeholder="example@company.co.jp"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-danger text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-kon hover:bg-kon/90 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "送信中..." : "リセットリンクを送信"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <Link href="/auth/login" className="text-kon hover:underline text-sm">
              ← ログインページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
