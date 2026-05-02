'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { trackBeginCheckout, trackPurchase, trackTrialStart } from '@/lib/analytics';

type BillingPeriod = 'monthly' | 'annual';

const API_URL = 'https://api.yamada-tools.jp/api/payment';

const faqs = [
  {
    q: '無料プランに期限はありますか？',
    a: 'いいえ、無料プランは永久にご利用いただけます。1日5回までの利用制限がありますが、基本的な機能はすべてお使いいただけます。',
  },
  {
    q: 'プランの変更やキャンセルはいつでもできますか？',
    a: 'はい、いつでもプランの変更・キャンセルが可能です。年払いの場合、残りの期間に応じて日割り計算で返金いたします。',
  },
  {
    q: '請求書払いは可能ですか？',
    a: 'TEAMプラン以上で請求書払い（NP掛け払い）に対応しています。月末締め翌月末払いなど、貴社の経理フローに合わせた対応が可能です。',
  },
  {
    q: 'セキュリティ対策について教えてください。',
    a: 'すべてのデータは処理完了後に自動削除されます。ファイルはサーバーに保存されず、SSL/TLS暗号化通信で保護されています。',
  },
  {
    q: 'チームプランの最低利用人数はありますか？',
    a: 'チームプランは5ユーザーからご利用いただけます。ユーザー数の追加・削減はいつでも可能です。',
  },
  {
    q: 'サポートはどのように受けられますか？',
    a: 'プランによって異なります。FREE: メールサポート（support@yamada-tools.jp）、PRO: FAQチャットボット＋メールサポート、TEAM: AIチャットボット（24時間対応）＋優先メールサポート、ENTERPRISE: 専任カスタマーサクセス担当。',
  },
];

const comparisonRows = [
  { feature: 'ツール利用',        free: '140+種類',   pro: '140+種類',   team: '140+種類',   enterprise: '140+種類' },
  { feature: '1日の利用回数',     free: '5回',        pro: '無制限',     team: '無制限',     enterprise: '無制限' },
  { feature: '最大ファイルサイズ', free: '10MB',       pro: '200MB',      team: '200MB',      enterprise: 'カスタム' },
  { feature: '広告',              free: 'あり',       pro: 'なし',       team: 'なし',       enterprise: 'なし' },
  { feature: '処理速度',          free: '標準',       pro: '標準',       team: '標準',       enterprise: '最優先' },
  { feature: 'サポート',          free: 'メール',     pro: 'FAQチャット', team: 'AIチャット（24時間）', enterprise: '専用CS' },
  { feature: '請求書払い',        free: '—',          pro: '—',          team: '✓',          enterprise: '✓' },
  { feature: '領収書発行',        free: '—',          pro: '✓',          team: '✓',          enterprise: '✓' },
  { feature: '利用状況レポート',   free: '—',          pro: '✓',          team: '✓',          enterprise: '✓' },
  { feature: 'チーム管理',        free: '—',          pro: '—',          team: '✓',          enterprise: '✓' },
  { feature: 'SSO/SAML',          free: '—',          pro: '—',          team: '—',          enterprise: '✓' },
  { feature: 'API連携',           free: '—',          pro: '—',          team: '—',          enterprise: '✓' },
];


const envelopeRows = [
  { feature: '住所帳',                   free: '3件（端末保存）',  pro: '100件（端末保存）', team: '2,000件（共有）', enterprise: '無制限' },
  { feature: '一括印刷（CSV）',          free: '5件まで',          pro: '50件まで',          team: '500件まで',       enterprise: '無制限' },
  { feature: '会社ロゴ挿入',             free: '—',                pro: '✓（1件）',          team: '✓（5件）',        enterprise: '無制限' },
  { feature: '印刷履歴',                 free: '3件',              pro: '30件',              team: '全履歴',          enterprise: '全履歴＋監査ログ' },
  { feature: 'カスタマーバーコード',     free: '—',                pro: '✓',                 team: '✓',               enterprise: '✓' },
  { feature: 'QRコード',                 free: '—',                pro: '✓',                 team: '✓',               enterprise: '✓' },
  { feature: 'ラベルシート印刷',         free: '—',                pro: '—',                 team: '✓',               enterprise: '✓' },
  { feature: '封筒デザインテンプレート', free: '—',                pro: '—',                 team: '10種類',          enterprise: 'カスタム無制限' },
  { feature: 'アドレス帳共有',           free: '—',                pro: '—',                 team: '✓',               enterprise: '✓' },
];

export default function PricingClient() {
  const [billing, setBilling] = useState<BillingPeriod>('monthly');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  // Handle Stripe redirect back after payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const sessionId = params.get('session_id');

    if (payment === 'success' && sessionId) {
      const token = localStorage.getItem('session_token');
      if (token) {
        fetch(`${API_URL}/verify/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              const planNames: Record<string, string> = { pro: 'PRO', team: 'TEAM' };
              const name = planNames[data.plan] || data.plan?.toUpperCase() || 'PRO';
              setSuccessMessage(`${name}プランへのアップグレードが完了しました！`);
              const pendingPlan = localStorage.getItem('pending_plan') || 'pro_monthly';
              trackPurchase(pendingPlan, sessionId);
              localStorage.removeItem('pending_plan');
              refreshUser();
            }
          })
          .catch(() => {});
        // Clean URL
        window.history.replaceState({}, '', '/pricing');
      }
    } else if (payment === 'cancelled') {
      window.history.replaceState({}, '', '/pricing');
    }
  }, []);

  const handleUpgrade = async (planKey: string) => {
    if (!user) {
      router.push('/auth/login?redirect=/pricing');
      return;
    }
    const token = localStorage.getItem('session_token');
    if (!token) {
      router.push('/auth/login?redirect=/pricing');
      return;
    }

    setLoadingPlan(planKey);
    try {
      const res = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.checkout_url) {
        localStorage.setItem('pending_plan', planKey);
        trackBeginCheckout(planKey as any);
        window.location.href = data.checkout_url;
      } else {
        console.error('Checkout error:', data);
        setErrorMessage('決済処理に失敗しました。しばらくしてからお試しください。');
        setLoadingPlan(null);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage('通信エラーが発生しました。しばらくしてからお試しください。');
      setLoadingPlan(null);
    }
  };

  const proKey  = billing === 'monthly' ? 'pro_monthly'  : 'pro_annual';
  const teamKey = billing === 'monthly' ? 'team_monthly' : 'team_annual';

  // user.plan is 'free' | 'pro' | 'team' from DB
  const userPlan = user?.plan || 'free';
  const isFreePlan = userPlan === 'free';
  const isProPlan  = userPlan === 'pro';
  const isTeamPlan = userPlan === 'team';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Success banner */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium">
          🎉 {successMessage}
        </div>
      )}

      {/* Error banner */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium flex items-center gap-3">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-white/80 hover:text-white text-lg leading-none">×</button>
        </div>
      )}

      {/* Page Header */}
      <div className="py-16 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-kon dark:text-white mb-4">料金プラン</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          すべてのツールを無料でご利用いただけます。さらに便利に使うならアップグレード。
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-10 px-4">
        <span className={`text-sm font-medium transition-colors ${billing === 'monthly' ? 'text-kon dark:text-white' : 'text-gray-400'}`}>
          月払い
        </span>
        <button
          onClick={() => setBilling(b => b === 'monthly' ? 'annual' : 'monthly')}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-kon focus:ring-offset-2 ${billing === 'annual' ? 'bg-kon' : 'bg-gray-300'}`}
          aria-label="支払いサイクル切り替え"
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${billing === 'annual' ? 'translate-x-7' : 'translate-x-0'}`}
          />
        </button>
        <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${billing === 'annual' ? 'text-kon dark:text-white' : 'text-gray-400'}`}>
          年払い
          {billing === 'annual' && (
            <span className="bg-sakura text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              2ヶ月分お得！
            </span>
          )}
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">

          {/* FREE */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div>
              {isFreePlan ? (
                <span className="inline-block text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full">
                  契約中
                </span>
              ) : (
                <span className="inline-block h-7" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-4 mb-1">
              FREE <span className="text-sm font-normal text-gray-400">フリー</span>
            </h2>
            <div className="mt-2">
              <span className="text-4xl font-bold text-gray-800 dark:text-white">¥0</span>
            </div>
            <p className="text-gray-400 text-sm mt-1 mb-6">永久無料</p>
            <ul className="space-y-2.5 mb-8 flex-1">
              {['全140+ツール利用可能', '1日5回まで利用', '最大ファイルサイズ: 10MB', '広告表示あり', 'メールサポート', '住所帳3件・CSV5件まで'].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>{f}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl font-medium cursor-not-allowed text-sm"
            >
              {isFreePlan ? '現在ご利用中' : 'ダウングレード不可'}
            </button>
          </div>

          {/* PRO */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-sakura p-6 flex flex-col shadow-lg relative hover:shadow-xl transition-shadow lg:scale-[1.03]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              {isProPlan ? (
                <span className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow whitespace-nowrap">
                  契約中
                </span>
              ) : (
                <span className="bg-sakura text-white text-xs font-bold px-4 py-1.5 rounded-full shadow whitespace-nowrap">
                  おすすめ
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-4 mb-1">
              PRO <span className="text-sm font-normal text-gray-400">プロ</span>
            </h2>
            <div className="mt-2 min-h-[72px]">
              {billing === 'monthly' ? (
                <>
                  <div>
                    <span className="text-4xl font-bold text-sakura">¥980</span>
                    <span className="text-gray-500 text-sm ml-1">/月</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">（税込）</p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-sakura">¥665</span>
                    <span className="text-gray-500 text-sm">/月</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">
                    <span className="line-through mr-1">¥980</span>年額 ¥7,980（税込）
                  </p>
                  <span className="inline-block mt-1 text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">33%お得</span>
                </>
              )}
            </div>
            <ul className="space-y-2.5 mt-5 mb-8 flex-1">
              {['全140+ツール利用可能', '無制限利用', '最大ファイルサイズ: 200MB', '広告なし', 'FAQチャットボット', '領収書自動発行', '利用状況レポート', '会社ロゴ・バーコード・QR対応'].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>{f}
                </li>
              ))}
            </ul>
            {isProPlan ? (
              <button
                disabled
                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl font-medium cursor-not-allowed text-sm"
              >
                現在のプラン
              </button>
            ) : isTeamPlan ? (
              <button
                disabled
                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl font-medium cursor-not-allowed text-sm"
              >
                現在より下位プラン
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade(proKey)}
                disabled={loadingPlan === proKey}
                className="w-full py-3 bg-sakura hover:bg-yellow-600 text-white rounded-xl font-bold transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingPlan === proKey ? '処理中...' : 'PROプランを始める'}
              </button>
            )}
          </div>

          {/* TEAM */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-kon dark:border-blue-500 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div>
              {isTeamPlan ? (
                <span className="inline-block text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full">
                  契約中
                </span>
              ) : (
                <span className="inline-block text-xs font-bold text-kon dark:text-blue-400 bg-kon/10 dark:bg-blue-900/40 px-3 py-1 rounded-full">
                  法人向け
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-4 mb-1">
              TEAM <span className="text-sm font-normal text-gray-400">チーム</span>
            </h2>
            <div className="mt-2 min-h-[72px]">
              {billing === 'monthly' ? (
                <>
                  <div>
                    <span className="text-4xl font-bold text-kon dark:text-blue-400">¥1,480</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">/ユーザー/月（税込）</p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-kon dark:text-blue-400">¥980</span>
                    <span className="text-gray-500 text-sm">/ユーザー/月</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">
                    <span className="line-through mr-1">¥1,480</span>年額 ¥11,760/ユーザー（税込）
                  </p>
                  <span className="inline-block mt-1 text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">33%お得</span>
                </>
              )}
            </div>
            <ul className="space-y-2.5 mt-5 mb-8 flex-1">
              {['PROの全機能', '5ユーザーから利用可能', 'チーム管理ダッシュボード', '請求書払い対応（NP掛け払い）', '利用状況レポート', 'AIチャットボット（24時間対応）', '領収書・請求書自動発行', '共有アドレス帳・500件一括印刷'].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>{f}
                </li>
              ))}
            </ul>
            {isTeamPlan ? (
              <button
                disabled
                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-xl font-medium cursor-not-allowed text-sm"
              >
                現在のプラン
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade(teamKey)}
                disabled={loadingPlan === teamKey}
                className="w-full py-3 bg-kon hover:bg-kon/90 text-white rounded-xl font-bold transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingPlan === teamKey ? '処理中...' : 'チームプランを始める'}
              </button>
            )}
          </div>

          {/* ENTERPRISE */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div>
              <span className="inline-block text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                大規模組織向け
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-4 mb-1">
              ENTERPRISE <span className="text-sm font-normal text-gray-400">エンタープライズ</span>
            </h2>
            <div className="mt-2 min-h-[72px]">
              <span className="text-2xl font-bold text-gray-800 dark:text-white">お問い合わせ</span>
              <p className="text-gray-400 text-sm mt-1">ご要望に応じたカスタムプラン</p>
            </div>
            <ul className="space-y-2.5 mt-5 mb-8 flex-1">
              {['TEAMの全機能', 'ユーザー数無制限', 'SSO/SAML認証', 'API連携', 'カスタムSLA', 'オンプレミス対応相談', '導入サポート・研修', '専用カスタマーサクセス', 'API連携・カスタムテンプレート'].map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>{f}
                </li>
              ))}
            </ul>
            <a
              href="mailto:support@yamada-tools.jp?subject=エンタープライズプランのお問い合わせ"
              className="w-full py-3 border-2 border-kon dark:border-blue-500 text-kon dark:text-blue-400 rounded-xl font-bold transition-colors hover:bg-kon/5 dark:hover:bg-blue-900/20 text-sm text-center block"
            >
              お問い合わせ
            </a>
          </div>

        </div>


        {/* Day Pass */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">デイパス <span className="text-sm font-normal text-gray-400">— 月額不要、1日から使える</span></h2>
          <p className="text-center text-sm text-gray-500 mb-6">広告なし・全機能・当日限り有効</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center rounded-xl border-2 border-gray-200 bg-gray-50 dark:bg-gray-800 p-4"><div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">1日パス</div><div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">¥120</div><div className="text-xs text-gray-400 mb-2">税込</div></div>
            <div className="relative flex flex-col items-center rounded-xl border-2 border-blue-500 bg-blue-50 dark:bg-blue-950 p-4"><span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap bg-blue-500 text-white">おすすめ</span><div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">3日パス</div><div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">¥290</div><div className="text-xs text-gray-400 mb-2">税込</div></div>
            <div className="relative flex flex-col items-center rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-950 p-4"><span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap bg-green-500 text-white">最もお得</span><div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">7日パス</div><div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">¥490</div><div className="text-xs text-gray-400 mb-2">税込</div></div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">デイパスはツール利用時に購入できます（Stripe決済）</p>
        </div>

        {/* Comparison Table */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-kon dark:text-white mb-8">プラン比較</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full min-w-[580px] text-sm">
              <thead>
                <tr className="bg-kon text-white">
                  <th className="text-left px-5 py-4 font-semibold w-1/3">機能</th>
                  <th className="px-4 py-4 font-semibold text-center">FREE</th>
                  <th className="px-4 py-4 font-semibold text-center text-yellow-300">PRO</th>
                  <th className="px-4 py-4 font-semibold text-center">TEAM</th>
                  <th className="px-4 py-4 font-semibold text-center">ENTERPRISE</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
                  >
                    <td className="px-5 py-3.5 font-medium text-gray-700 dark:text-gray-300">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center text-gray-500 dark:text-gray-400">{row.free}</td>
                    <td className="px-4 py-3.5 text-center text-gray-800 dark:text-gray-200 font-medium">{row.pro}</td>
                    <td className="px-4 py-3.5 text-center text-gray-700 dark:text-gray-300">{row.team}</td>
                    <td className="px-4 py-3.5 text-center text-gray-700 dark:text-gray-300">{row.enterprise}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 dark:bg-slate-800 border-l-4 border-l-blue-600">
                  <td colSpan={5} className="px-5 py-3 font-bold text-blue-800 dark:text-blue-300 text-sm">
                    📮 封筒印刷機能
                  </td>
                </tr>
                {envelopeRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? 'bg-blue-50/40 dark:bg-slate-800/60' : 'bg-white dark:bg-gray-800'}
                  >
                    <td className="px-5 py-3.5 font-medium text-gray-700 dark:text-gray-300 pl-8">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center text-gray-500 dark:text-gray-400">{row.free}</td>
                    <td className="px-4 py-3.5 text-center text-gray-800 dark:text-gray-200 font-medium">{row.pro}</td>
                    <td className="px-4 py-3.5 text-center text-gray-700 dark:text-gray-300">{row.team}</td>
                    <td className="px-4 py-3.5 text-center text-gray-700 dark:text-gray-300">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-kon dark:text-white mb-8">よくあるご質問</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span
                    className={`text-gray-400 transition-transform duration-200 shrink-0 text-xs ${faqOpen === i ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${faqOpen === i ? 'max-h-48' : 'max-h-0'}`}
                >
                  <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-kon py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            まずは無料でお試しください
          </h2>
          <p className="text-blue-200 mb-8 text-base">
            クレジットカード不要。今すぐすべてのツールをお使いいただけます。
          </p>
          <Link
            href="/"
            className="inline-block bg-sakura hover:bg-yellow-600 text-white font-bold px-10 py-4 rounded-xl transition-colors text-lg"
          >
            無料で始める →
          </Link>
          <p className="text-blue-300 text-sm mt-4">有料プランへのアップグレードはいつでも可能です</p>
        </div>
      </div>

    </div>
  );
}
