'use client';

import { useState, useEffect } from 'react';

const PHRASES = [
  'PDFを結合したい',
  '画像を圧縮したい',
  '請求書を作りたい',
  '宛名を印刷したい',
  '全銀データを作りたい',
  '縦書き文書を作りたい',
];

export default function TypingText() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-7 mb-6 flex items-center justify-center">
      <span
        className="text-sm text-gray-400 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        「{PHRASES[index]}」を探していますか？
      </span>
    </div>
  );
}
