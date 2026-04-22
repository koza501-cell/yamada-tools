'use client';

import Link from 'next/link';

interface SuggestedTool {
  label: string;
  href: string;
  emoji: string;
}

const SUGGESTIONS: Record<string, SuggestedTool[]> = {
  'envelope-print': [
    { label: '請求書作成',     href: '/document/invoice',        emoji: '📋' },
    { label: '名刺作成',       href: '/document/business-card',  emoji: '💼' },
    { label: '見積書作成',     href: '/document/quotation',      emoji: '📝' },
  ],
  'bank-format': [
    { label: '年末調整計算',   href: '/generator/nenmatsu-calc', emoji: '📊' },
    { label: '消費税計算',     href: '/generator/tax-calculator',emoji: '🧮' },
    { label: 'インボイス番号', href: '/convert/t-number',        emoji: '🔢' },
  ],
  'random-picker': [
    { label: 'チーム分け',     href: '/generator/team-split',    emoji: '👥' },
    { label: 'トーナメント表', href: '/generator/tournament',    emoji: '🏆' },
  ],
  'image-mirror': [
    { label: '画像圧縮',       href: '/image/compress',          emoji: '📦' },
    { label: '画像リサイズ',   href: '/image/resize',            emoji: '📐' },
    { label: '画像モザイク',   href: '/image/mosaic',            emoji: '🔲' },
  ],
  'vertical-text': [
    { label: 'ふりがな変換',   href: '/convert/furigana',        emoji: '🔤' },
    { label: 'PDF圧縮',        href: '/pdf/compress',            emoji: '📄' },
    { label: '封筒印刷',       href: '/generator/envelope-print',emoji: '✉️' },
  ],
};

interface NextToolStripProps {
  currentTool: keyof typeof SUGGESTIONS;
  className?: string;
}

export default function NextToolStrip({ currentTool, className = '' }: NextToolStripProps) {
  const tools = SUGGESTIONS[currentTool];
  if (!tools || tools.length === 0) return null;

  return (
    <div className={`mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4 ${className}`}>
      <p className="mb-3 text-sm font-medium text-gray-600">次に使えるツール</p>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:border-kon/40 hover:text-kon hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kon"
          >
            <span aria-hidden="true">{tool.emoji}</span>
            {tool.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
