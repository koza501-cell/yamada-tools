'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  category?: string;
  tags?: string[];
  slug: string;
}

interface CtaConfig {
  emoji: string;
  title: string;
  desc: string;
  href: string;
  btnLabel: string;
}

function getCtaConfig(category: string, tags: string[]): CtaConfig {
  const haystack = [category, ...tags].join(' ').toLowerCase();
  if (/nisa|ideco|投資|積立/.test(haystack))
    return { emoji: '📈', title: 'NISAシミュレーター', desc: '積立額・運用期間で将来資産を無料計算', href: '/nisa-simulator', btnLabel: 'シミュレーターを使う' };
  if (/税金|確定申告|インボイス|節税|所得税|住民税/.test(haystack))
    return { emoji: '🧾', title: '税務・申告ツール', desc: 'インボイス・確定申告を無料でサポート', href: '/tax', btnLabel: 'ツールを見る' };
  if (/保険|生命保険|医療保険/.test(haystack))
    return { emoji: '🛡️', title: '保険計算ツール', desc: '保険料・給付金を即シミュレーション', href: '/insurance', btnLabel: 'ツールを使う' };
  if (/不動産|住宅|マンション|土地|ローン/.test(haystack))
    return { emoji: '🏠', title: '不動産ツール', desc: '住宅ローン・査定を無料計算', href: '/realestate', btnLabel: 'ツールを使う' };
  if (/ビジネス|法人|会社|起業|開業|freee|融資/.test(haystack))
    return { emoji: '🏢', title: '法人向けビジネスツール', desc: '起業・会社運営に役立つ無料ツール集', href: '/business', btnLabel: 'ツールを見る' };
  if (/介護|福祉|ケア/.test(haystack))
    return { emoji: '🤝', title: '介護計算ツール', desc: '介護費用・サービス単価を無料計算', href: '/care', btnLabel: 'ツールを使う' };
  if (/キャリア|転職|副業|就職|年収/.test(haystack))
    return { emoji: '💼', title: 'キャリアツール', desc: '年収・スキルを無料でチェック', href: '/career', btnLabel: 'ツールを使う' };
  if (/健康|医療|ダイエット|BMI/.test(haystack))
    return { emoji: '❤️', title: '健康計算ツール', desc: 'BMI・カロリーを無料チェック', href: '/health', btnLabel: 'ツールを使う' };
  if (/財務|会計|簿記|経理|損益/.test(haystack))
    return { emoji: '📊', title: '財務計算ツール', desc: '損益・キャッシュフローを無料計算', href: '/finance', btnLabel: 'ツールを使う' };
  if (/pdf/.test(haystack))
    return { emoji: '📄', title: 'PDFツール', desc: '結合・圧縮・変換を無料で処理', href: '/pdf', btnLabel: 'ツールを使う' };
  if (/画像|写真|image/.test(haystack))
    return { emoji: '🖼️', title: '画像変換ツール', desc: 'リサイズ・変換を無料でまとめて', href: '/image', btnLabel: 'ツールを使う' };
  // default
  return { emoji: '🛠️', title: '山田ツール — 無料業務ツール200種', desc: 'インボイス・PDF・画像変換など登録不要で即使えるツール集', href: '/tools', btnLabel: 'ツール一覧を見る' };
}

export default function FloatingCTA({ category = '', tags = [], slug }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const key = `cta_dismissed_${slug}`;
    if (sessionStorage.getItem(key)) {
      setDismissed(true);
      return;
    }
    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= 0.30) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(`cta_dismissed_${slug}`, '1');
  };

  const cta = getCtaConfig(category, tags);

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-72 transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header bar */}
        <div className="bg-kon px-4 py-2 flex items-center justify-between">
          <span className="text-white text-xs font-semibold tracking-wide">無料ツールのご紹介</span>
          <button
            onClick={dismiss}
            aria-label="閉じる"
            className="text-white/70 hover:text-white transition-colors ml-2 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-4 py-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl leading-none">{cta.emoji}</span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{cta.title}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-snug">{cta.desc}</p>
            </div>
          </div>
          <Link
            href={cta.href}
            className="block w-full text-center bg-kon hover:bg-ai text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            {cta.btnLabel} →
          </Link>
          <button
            onClick={dismiss}
            className="block w-full text-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs mt-2 transition-colors"
          >
            このメッセージを非表示
          </button>
        </div>
      </div>
    </div>
  );
}
