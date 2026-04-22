'use client';

interface PrivacyBadgeProps {
  mode: 'browser-only' | 'server-processed';
  className?: string;
}

export default function PrivacyBadge({ mode, className = '' }: PrivacyBadgeProps) {
  if (mode === 'browser-only') {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 ${className}`}
        role="note"
        aria-label="プライバシー情報: ブラウザ内処理"
      >
        <span aria-hidden="true">🔒</span>
        <span>このファイルはブラウザ内で処理されています（サーバーに送信されません）</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800 ${className}`}
      role="note"
      aria-label="プライバシー情報: 日本国内サーバー処理"
    >
      <span aria-hidden="true">🇯🇵</span>
      <span>日本国内サーバーで処理・60分後に自動削除</span>
    </div>
  );
}
