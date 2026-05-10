"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";

function safeRedirect(url: string | null): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) return "/account";
  return url;
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login, magicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    setRedirectTo(redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : null);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push(safeRedirect(redirectTo));
    }
  }, [user, loading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      router.push(safeRedirect(redirectTo));
    } else {
      setError(result.message);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }
    setSubmitting(true);
    setError("");

    const result = await magicLink(email);
    setSubmitting(false);

    if (result.success) {
      setMagicLinkSent(true);
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⏳</div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-gray-600">ログイン済みです</p>
        </div>
      </div>
    );
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-xl font-bold text-gray-900 mb-4">メールを確認してください</h1>
            <p className="text-gray-600 mb-6">
              {email} にログインリンクを送信しました。<br />
              メール内のリンクをクリックしてログインしてください。
            </p>
            <p className="text-sm text-gray-400">リンクは15分間有効です</p>
          </div>
        </div>
      </div>
    );
  }

  const registerHref = redirectTo
    ? `/auth/register?redirect=${encodeURIComponent(redirectTo)}`
    : "/auth/register";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Image src="/logo-icon.webp" alt="山田ツール" className="w-10 h-10" width={40} height={40} />
            <span className="text-2xl font-bold text-kon">山田ツール</span>
          </Link>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">🔒 SSL暗号化通信</span>
            <span className="flex items-center gap-1">🇯🇵 国内サーバー</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-xl font-bold text-gray-900 text-center mb-6">ログイン</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-danger">*</span>
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kon focus:border-transparent"
                placeholder="8文字以上"
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
              {submitting ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/auth/forgot-password" className="text-sm text-kon hover:underline">
              パスワードをお忘れですか？
            </Link>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">または</span>
            </div>
          </div>

          <button
            onClick={() => setShowMagicLink(!showMagicLink)}
            className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
          >
            📧 メールでログインリンクを受け取る
          </button>

          {showMagicLink && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                パスワードなしでログインできます。メールアドレスを入力してください。
              </p>
              <button
                onClick={handleMagicLink}
                disabled={submitting || !email}
                className="w-full py-2 bg-sakura hover:bg-sakura/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                ログインリンクを送信
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-gray-600 text-sm">
              アカウントをお持ちでない方は
              <Link href={registerHref} className="text-kon font-medium hover:underline ml-1">
                新規登録
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <div className="flex items-center justify-center gap-4">
            <Link href="/legal/terms" className="hover:underline">利用規約</Link>
            <Link href="/legal/privacy" className="hover:underline">プライバシーポリシー</Link>
            <Link href="/about/company" className="hover:underline">会社概要</Link>
          </div>
          <p className="mt-2">運営: 合同会社山田トレード</p>
        </div>
      </div>
    </div>
  );
}
