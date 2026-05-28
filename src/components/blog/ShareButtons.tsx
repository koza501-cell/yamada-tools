'use client';
import { useState } from 'react';

interface Props {
  title: string;
  url: string;
  layout?: 'desktop' | 'mobile';
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function HatenaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
      <path d="M20.47 0C22.42 0 24 1.58 24 3.53v16.94C24 22.42 22.42 24 20.47 24H3.53C1.58 24 0 22.42 0 20.47V3.53C0 1.58 1.58 0 3.53 0h16.94zm-3.705 14.47c-.78 0-1.41.63-1.41 1.41 0 .78.63 1.41 1.41 1.41.78 0 1.41-.63 1.41-1.41 0-.78-.63-1.41-1.41-1.41zm-8.04-1.125c.97 1.322 2.393 1.982 4.27 1.982 1.013 0 1.906-.21 2.678-.63l-.834-1.79c-.525.3-1.096.45-1.713.45-1.004 0-1.78-.36-2.328-1.08-.548-.72-.822-1.727-.822-3.022 0-1.27.274-2.255.822-2.955.548-.7 1.324-1.05 2.328-1.05.617 0 1.188.157 1.713.47l.834-1.79C14.92 5.21 14.027 5 13.014 5c-1.877 0-3.3.66-4.27 1.98-.97 1.32-1.455 3.154-1.455 5.503 0 2.348.485 4.182 1.455 5.502z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

const BUTTONS = (encodedTitle: string, encodedUrl: string) => [
  {
    label: 'X でシェア',
    href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    icon: <XIcon />,
    color: 'bg-black hover:bg-gray-800 text-white',
  },
  {
    label: 'LINE でシェア',
    href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
    icon: <LineIcon />,
    color: 'bg-[#06C755] hover:bg-[#05b34c] text-white',
  },
  {
    label: 'Facebook でシェア',
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    icon: <FacebookIcon />,
    color: 'bg-[#1877F2] hover:bg-[#1565d8] text-white',
  },
  {
    label: 'はてなブックマーク',
    href: `https://b.hatena.ne.jp/entry/${encodedUrl}`,
    icon: <HatenaIcon />,
    color: 'bg-[#00A4DE] hover:bg-[#008fc2] text-white',
  },
];

export default function ShareButtons({ title, url, layout = 'desktop' }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const buttons = BUTTONS(encodedTitle, encodedUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnBase = 'flex items-center justify-center w-11 h-11 rounded-full transition-colors shadow-sm';

  if (layout === 'desktop') {
    return (
      <div className="sticky top-24 flex flex-col gap-2 items-center pt-1">
        {buttons.map(btn => (
          <a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={btn.label}
            className={`${btnBase} ${btn.color}`}
          >
            {btn.icon}
          </a>
        ))}
        <div className="relative">
          <button
            onClick={handleCopy}
            aria-label="URLをコピー"
            className={`${btnBase} bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300`}
          >
            <CopyIcon />
          </button>
          {copied && (
            <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
              コピーしました
            </span>
          )}
        </div>
      </div>
    );
  }

  // Mobile: horizontal row
  return (
    <div className="flex flex-row gap-2 justify-center flex-wrap py-2">
      {buttons.map(btn => (
        <a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={btn.label}
          className={`${btnBase} ${btn.color}`}
        >
          {btn.icon}
        </a>
      ))}
      <div className="relative">
        <button
          onClick={handleCopy}
          aria-label="URLをコピー"
          className={`${btnBase} bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300`}
        >
          <CopyIcon />
        </button>
        {copied && (
          <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
            コピーしました
          </span>
        )}
      </div>
    </div>
  );
}
