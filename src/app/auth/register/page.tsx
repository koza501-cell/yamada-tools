"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    setRedirectTo(redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : null);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません");
      return;
    }

    if (!agreeTerms) {
      setError("利用規約に同意してください");
      return;
    }

    setSubmitting(true);
    const result = await register(email, password, companyName);
    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
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

  const loginHref = redirectTo
    ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}`
    : "/auth/login";

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-xl font-bold text-gray-900 mb-4">登録完了</h1>
            <p className="text-gray-600 mb-6">
              {email} に確認メールを送信しました。<br />
              メール内のリンクをクリックしてアカウントを有効化してください。
            </p>
            <p className="text-sm text-gray-400 mb-6">リンクは24時間有効です</p>
            <Link
              href={loginHref}
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
          <h1 className="text-xl font-bold text-gray-900 text-center mb-6">新規アカウント登録</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
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
                パスワード <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kon focus:border-transparent"
                placeholder="8文字以上"
              />
              <p className="text-xs text-gray-500 mt-1">8文字以上で入力してください</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード（確認） <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kon focus:border-transparent"
                placeholder="パスワードを再入力"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                会社名・組織名 <span className="text-gray-400 text-xs">（任意）</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kon focus:border-transparent"
                placeholder="株式会社〇〇"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-kon border-gray-300 rounded focus:ring-kon"
                />
                <span className="text-sm text-gray-600">
                  <Link href="/legal/terms" className="text-kon hover:underline" target="_blank">
                    利用規約
                  </Link>
                  および
                  <Link href="/legal/privacy" className="text-kon hover:underline" target="_blank">
                    プライバシーポリシー
                  </Link>
                  に同意します
                </span>
              </label>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-kon hover:bg-kon/90 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "登録中..." : "アカウントを作成"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-gray-600 text-sm">
              すでにアカウントをお持ちの方は
              <Link href={loginHref} className="text-kon font-medium hover:underline ml-1">
                ログイン
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
