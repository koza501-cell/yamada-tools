"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { trackTrialStart, trackBeginCheckout } from "@/lib/analytics";

const Icons = {
  CheckCircle: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Loader2: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  Mail: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  Building2: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
    </svg>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  ),
  Gift: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1"/>
      <path d="M12 8v13"/>
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
    </svg>
  ),
};


export default function TrialPage() {
  const { startTrial } = useAuth();
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [trialEndsAt, setTrialEndsAt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }
    setLoading(true);
    setError("");
    const result = await startTrial(email, companyName);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTrialEndsAt(result.trialEndsAt || "");
      trackTrialStart();
      trackBeginCheckout("trial");
    } else {
      setError(result.message);
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sakura/10 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icons.CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            トライアル登録完了！
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            <span className="font-semibold text-sakura">{email}</span> に確認メールを送信しました。
            <br />メール内のリンクをクリックしてログインしてください。
          </p>
          <div className="bg-sakura/10 dark:bg-sakura/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">トライアル期間:</span>
              <br />
              {formatDate(trialEndsAt)} まで（10日間）
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sakura/10 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sakura/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Gift className="w-8 h-8 text-sakura" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            PROプラン 10日間無料トライアル
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            クレジットカード不要・自動課金なし
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4">トライアルに含まれる機能</h2>
          <ul className="space-y-3">
            {[
              "全86+ツール無制限利用",
              "広告完全非表示",
              "100MBまでのファイル処理",
              "作業履歴30日間保存",
              "優先サポート",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Icons.CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                メールアドレス <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@company.co.jp"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sakura focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                会社名 <span className="text-gray-400">(任意)</span>
              </label>
              <div className="relative">
                <Icons.Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="株式会社〇〇"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sakura focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {error && (
              <div className="bg-gray-50 dark:bg-danger/30 text-danger dark:text-danger px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sakura hover:bg-sakura/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Icons.Loader2 className="w-5 h-5 animate-spin" />
                  処理中...
                </>
              ) : (
                <>
                  無料トライアルを始める
                  <Icons.ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            登録することで、
            <Link href="/terms" className="text-sakura hover:underline">利用規約</Link>
            および
            <Link href="/privacy" className="text-sakura hover:underline">プライバシーポリシー</Link>
            に同意したものとみなされます。
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          既にアカウントをお持ちですか？{" "}
          <Link href="/auth/login" className="text-sakura hover:underline font-medium">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
