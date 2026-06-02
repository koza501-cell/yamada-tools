"use client";
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Mascot, { MascotState } from '@/components/common/Mascot';
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

// Feature F: saved document type
interface SavedDoc {
  id: string;
  title: string;
  author: string;
  body: string;
  fontSize: number;
  lineHeight: number;
  font: string;
  paperSize: string;
  createdAt: string;
}

const SAVED_DOCS_KEY = 'yamada_vertical_documents';
const SAVED_DOCS_MAX = 5;

// Feature E: formatting toolbar items
const FORMAT_BUTTONS = [
  { label: '「」', insert: ['「', '」'], title: '鉤括弧で囲む' },
  { label: '『』', insert: ['『', '』'], title: '二重鉤括弧で囲む' },
  { label: '——', insert: ['——', ''], title: '段落ダッシュを挿入' },
  { label: '……', insert: ['……', ''], title: '三点リーダーを挿入' },
  { label: '　', insert: ['　', ''], title: '全角スペースを挿入' },
] as const;

interface DocState {
  text: string;
  title: string;
  author: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  paperSize: 'A4' | 'A5' | 'B5' | 'はがき';
  punctuationStyle: 'japanese' | 'western';
  kanjiNumbers: boolean;
  // Feature G: advanced settings
  indentFirst: boolean;
  kinsoku: boolean;
  letterSpacing: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  genkouyoshi: boolean;
}

const PAPER_SIZES: Record<DocState['paperSize'], { width: number; height: number; label: string }> = {
  'A4': { width: 210, height: 297, label: 'A4' },
  'A5': { width: 148, height: 210, label: 'A5' },
  'B5': { width: 182, height: 257, label: 'B5' },
  'はがき': { width: 100, height: 148, label: 'はがき' },
};

const FONT_FAMILIES = [
  { value: '"Noto Serif JP", serif', label: '明朝体' },
  { value: '"Noto Sans JP", sans-serif', label: 'ゴシック体' },
  { value: 'cursive', label: '教科書体' },
];

const TEMPLATES = [
  {
    label: '式辞',
    title: '入学式式辞',
    author: '校長 山田太郎',
    text: '本日ここに 令和七年度入学式を挙行するにあたり 新入生の皆さん ご入学おめでとうございます\n\n保護者の皆様におかれましても お子様のご入学を心よりお祝い申し上げます\n\n新入生の皆さんは 今日から新しい学校生活が始まります 希望と不安が入り混じっていることと思いますが どうか自分を信じて一歩一歩 前に進んでください\n\nこの学び舎で 多くの友人と出会い 多くのことを学び 大きく成長されることを願っております\n\n結びに 本日ご臨席賜りました皆様方に厚く御礼申し上げ 式辞といたします',
  },
  {
    label: '祝辞',
    title: '結婚祝辞',
    author: '友人代表 鈴木花子',
    text: 'ただいまご紹介にあずかりました 新婦の友人の鈴木花子でございます\n\n○○さん △△さん ご結婚おめでとうございます\n\n私と○○さんは大学時代からの友人で かれこれ十年以上のお付き合いになります\n\nどうかお二人で手を取り合い 笑顔あふれる温かい家庭を築いてください\n\n本日は誠におめでとうございます',
  },
  {
    label: '弔辞',
    title: '弔辞',
    author: '友人代表',
    text: '○○さんのご霊前に謹んでお別れの言葉を申し上げます\n\nあなたが旅立たれてから まだ信じられない思いでおります\n\n私たちが初めて出会ったのは もう何十年も前のことでした\n\nあなたの笑顔 あなたの優しい言葉 それらは私たちの心の中に永遠に生き続けます\n\nどうか安らかにお眠りください 心よりご冥福をお祈りいたします',
  },
  {
    label: '手紙',
    title: 'お礼状',
    author: '山田太郎',
    text: '拝啓\n\n時下ますますご清栄のこととお慶び申し上げます\n\n先日は大変お世話になりました 心より御礼申し上げます\n\n今後とも変わらぬご厚誼を賜りますよう お願い申し上げます\n\n敬具',
  },
  {
    label: '俳句',
    title: '俳句集',
    author: '',
    text: '古池や蛙飛び込む水の音\n\n閑さや岩にしみ入る蝉の声\n\n夏草や兵どもが夢の跡',
  },
  {
    label: '賞状',
    title: '感謝状',
    author: '令和七年三月吉日',
    text: '感謝状\n\n　あなたはこれまで長年にわたり 本会の発展にご尽力いただきました\n\nその功績は誠に顕著であります\n\nここにその業績を称え 感謝の意を表するとともに 記念品を贈呈いたします',
  },
];

const KANJI_MAP: Record<string, string> = {
  '0': '〇', '1': '一', '2': '二', '3': '三', '4': '四',
  '5': '五', '6': '六', '7': '七', '8': '八', '9': '九',
};


// ── Ruby markup helpers ──────────────────────────────────────────────────────
type RubySegment = { type: 'text'; text: string } | { type: 'ruby'; text: string; ruby: string };

function parseRubyText(input: string): RubySegment[] {
  const parts: RubySegment[] = [];
  const regex = /《([^|》\n]+)\|([^》\n]+)》/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(input)) !== null) {
    if (m.index > last) parts.push({ type: 'text', text: input.slice(last, m.index) });
    parts.push({ type: 'ruby', text: m[1], ruby: m[2] });
    last = regex.lastIndex;
  }
  if (last < input.length) parts.push({ type: 'text', text: input.slice(last) });
  return parts;
}

function flattenToGenkoCells(text: string): Array<{ ch: string; ruby?: string } | null> {
  const segments = parseRubyText(text);
  const cells: Array<{ ch: string; ruby?: string } | null> = [];
  for (const seg of segments) {
    if (seg.type === 'text') {
      for (const ch of [...seg.text]) {
        if (ch === '\n') cells.push(null);
        else cells.push({ ch });
      }
    } else {
      const baseChars = [...seg.text];
      baseChars.forEach((ch, i) => {
        cells.push({ ch, ruby: i === 0 ? seg.ruby : undefined });
      });
    }
  }
  return cells;
}

// ── 原稿用紙 preview component ────────────────────────────────────────────────
const GENKO_COLS = 20;
const GENKO_ROWS = 20;
const GENKO_PER_PAGE = GENKO_COLS * GENKO_ROWS;

function GenkouyoshiPreview({
  previewDoc,
  containerW,
  genkouPage,
  setGenkouPage,
  getDisplayText,
  isDark,
}: {
  previewDoc: DocState;
  containerW: number;
  genkouPage: number;
  setGenkouPage: React.Dispatch<React.SetStateAction<number>>;
  getDisplayText: (stripRuby?: boolean) => string;
  isDark: boolean;
}) {
  const cellSize = containerW / GENKO_COLS;
  const fontSize = cellSize * 0.72;
  const lineColor = isDark ? '#444' : '#ccc';

  const rawText = getDisplayText(false);
  const cells = flattenToGenkoCells(rawText);
  const totalPages = Math.max(1, Math.ceil(cells.length / GENKO_PER_PAGE));
  const pageCells = cells.slice(genkouPage * GENKO_PER_PAGE, (genkouPage + 1) * GENKO_PER_PAGE);

  return (
    <div className="absolute inset-0 flex flex-col bg-white">
      {/* Column numbers row */}
      <div style={{ display: 'flex', flexDirection: 'row-reverse', height: `${cellSize * 0.4}px`, borderBottom: `1px solid ${lineColor}` }}>
        {Array.from({ length: GENKO_COLS }, (_, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: `${cellSize * 0.25}px`, color: '#999', lineHeight: `${cellSize * 0.4}px` }}>
            {i + 1}
          </div>
        ))}
      </div>
      {/* Grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row-reverse', overflow: 'hidden' }}>
        {Array.from({ length: GENKO_COLS }, (_, colIdx) => (
          <div key={colIdx} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {Array.from({ length: GENKO_ROWS }, (_, rowIdx) => {
              const cell = pageCells[colIdx * GENKO_ROWS + rowIdx];
              return (
                <div
                  key={rowIdx}
                  style={{
                    flex: 1,
                    border: `0.5px solid ${lineColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                    writingMode: 'vertical-rl', textOrientation: 'upright',
                    fontFamily: previewDoc.fontFamily,
                    fontSize: `${fontSize}px`,
                    color: isDark ? '#e5e7eb' : '#000',
                  } as React.CSSProperties}
                >
                  {cell?.ch ? cell.ch : ''}
                  {cell?.ruby && (
                    <span style={{ position: 'absolute', right: '-30%', top: 0, fontSize: `${fontSize * 0.45}px`, color: isDark ? '#9ca3af' : '#333', writingMode: 'vertical-rl', lineHeight: 1 }}>
                      {cell.ruby}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Page nav */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '2px 0', fontSize: `${cellSize * 0.35}px`, color: isDark ? '#9ca3af' : '#666', borderTop: `1px solid ${lineColor}` }}>
          <button type="button" onClick={() => setGenkouPage(p => Math.max(0, p - 1))} disabled={genkouPage === 0} style={{ opacity: genkouPage === 0 ? 0.3 : 1, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>◀</button>
          <span>{genkouPage + 1} / {totalPages}ページ</span>
          <button type="button" onClick={() => setGenkouPage(p => Math.min(totalPages - 1, p + 1))} disabled={genkouPage >= totalPages - 1} style={{ opacity: genkouPage >= totalPages - 1 ? 0.3 : 1, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>▶</button>
        </div>
      )}
    </div>
  );
}

const initialDoc: DocState = {
  text: '',
  title: '',
  author: '',
  fontSize: 16,
  fontFamily: 'serif',
  lineHeight: 2,
  paperSize: 'A4',
  punctuationStyle: 'japanese',
  kanjiNumbers: false,
  indentFirst: false,
  kinsoku: true,
  letterSpacing: 0,
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 20,
  marginRight: 20,
  genkouyoshi: false,
};

export default function VerticalTextClient() {
  const { triggerSuccess } = usePricingContext();


  const [mounted, setMounted] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [doc, setDoc] = useState<DocState>(initialDoc);
  const [history, setHistory] = useState<DocState[]>([initialDoc]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [shareToast, setShareToast] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [mascotMessage, setMascotMessage] = useState('縦書き文書を作成しましょう。テンプレートも使えます！');

  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  // Feature B: debounced preview state
  const [previewDoc, setPreviewDoc] = useState<DocState>(initialDoc);
  const [previewKey, setPreviewKey] = useState(0); // incremented to trigger fade-in

  // Print popover
  const [printPopover, setPrintPopover] = useState(false);
  const [printMargin, setPrintMargin] = useState<'standard' | 'narrow' | 'wide'>('standard');
  const [printOrientation, setPrintOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [printPageNumbers, setPrintPageNumbers] = useState(false);

  // PNG resolution
  const [pngScale, setPngScale] = useState(2);

  // 原稿用紙 + ruby state
  const [genkouPage, setGenkouPage] = useState(0);
  const [containerW, setContainerW] = useState(400);
  const [rubyPopover, setRubyPopover] = useState(false);
  const [rubyReading, setRubyReading] = useState('');
  const [isDark, setIsDark] = useState(false);
  const rubyInputRef = useRef<HTMLInputElement>(null);

  // Feature F: saved documents
  const [savedDocs, setSavedDocs] = useState<SavedDoc[]>([]);
  const [saveToast, setSaveToast] = useState(false);
  const [loadDropOpen, setLoadDropOpen] = useState(false);

  // Feature G: advanced settings panel
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Feature E

  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      const gfLink = document.createElement('link');
      gfLink.rel = 'stylesheet';
      gfLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP&family=Noto+Sans+JP&display=swap';
      document.head.appendChild(gfLink);
    }
    // Defer preview on mobile until container is visible
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setPreviewReady(true);
    } else if (previewRef.current) {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPreviewReady(true); obs.disconnect(); } }, { threshold: 0.1 });
      obs.observe(previewRef.current);
    } else {
      setPreviewReady(true);
    }
    // Restore from URL param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('d');
      if (encoded) {
        try {
          const restored = JSON.parse(atob(encoded)) as DocState;
          setDoc(restored);
          setHistory([restored]);
          setHistoryIndex(0);
        } catch {
          // ignore malformed URL param
        }
      }
      // Feature F: load saved docs
      try {
        const stored = localStorage.getItem(SAVED_DOCS_KEY);
        if (stored) setSavedDocs(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // ResizeObserver for genkouyoshi cell size
  useEffect(() => {
    if (!previewRef.current) return;
    const ro = new ResizeObserver(([e]) => setContainerW(e.contentRect.width));
    ro.observe(previewRef.current);
    return () => ro.disconnect();
  }, [mounted]);

  // Dark mode detection
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Close ruby popover on outside click
  useEffect(() => {
    if (!rubyPopover) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.ruby-popover-container')) setRubyPopover(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [rubyPopover]);

  // Feature B: debounce preview updates 300ms after doc changes
  useEffect(() => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    previewTimerRef.current = setTimeout(() => {
      setPreviewDoc(doc);
      setPreviewKey(k => k + 1);
    }, 300);
    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
  }, [doc]);

  const updateDoc = useCallback((partial: Partial<DocState>) => {
    // If user edits text/title/author manually, deactivate template highlight
    if ('text' in partial || 'title' in partial || 'author' in partial) {
      setActiveTemplate(null);
    }
    setDoc(prev => {
      const next = { ...prev, ...partial };
      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
      historyTimerRef.current = setTimeout(() => {
        setHistory(h => {
          const trimmed = h.slice(0, historyIndex + 1);
          return [...trimmed, next].slice(-50); // keep last 50
        });
        setHistoryIndex(i => Math.min(i + 1, 49));
      }, 500);
      return next;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    setHistoryIndex(i => {
      const newIndex = Math.max(0, i - 1);
      setDoc(history[newIndex]);
      return newIndex;
    });
  }, [history]);

  const redo = useCallback(() => {
    setHistoryIndex(i => {
      const newIndex = Math.min(history.length - 1, i + 1);
      setDoc(history[newIndex]);
      return newIndex;
    });
  }, [history]);

  const loadTemplate = (tpl: typeof TEMPLATES[number]) => {
    const next = { ...doc, text: tpl.text, title: tpl.title, author: tpl.author };
    setDoc(next);
    setActiveTemplate(tpl.label);
    setHistory(h => [...h.slice(0, historyIndex + 1), next]);
    setHistoryIndex(i => i + 1);
    setMascotState('success')
      triggerSuccess('vertical-text');;
    setMascotMessage(`「${tpl.label}」のテンプレートを読み込みました！`);
    setTimeout(() => { setMascotState('idle'); setMascotMessage('縦書き文書を作成しましょう。テンプレートも使えます！'); }, 3000);
  };

  // Feature E: insert formatting character(s) at cursor / wrap selection
  const insertFormat = (before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const current = doc.text;
    let next: string;
    let newCursor: number;
    if (start !== end) {
      // Wrap selection
      next = current.slice(0, start) + before + current.slice(start, end) + after + current.slice(end);
      newCursor = end + before.length + after.length;
    } else {
      // Insert at cursor
      next = current.slice(0, start) + before + after + current.slice(start);
      newCursor = start + before.length;
    }
    updateDoc({ text: next });
    // Restore focus + cursor after React re-render
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(newCursor, newCursor);
    });
  };

  // Feature F: save / load / delete documents
  const saveDoc = () => {
    const entry: SavedDoc = {
      id: Date.now().toString(),
      title: doc.title || '（無題）',
      author: doc.author,
      body: doc.text,
      fontSize: doc.fontSize,
      lineHeight: doc.lineHeight,
      font: doc.fontFamily,
      paperSize: doc.paperSize,
      createdAt: new Date().toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setSavedDocs(prev => {
      const next = [entry, ...prev].slice(0, SAVED_DOCS_MAX);
      try { localStorage.setItem(SAVED_DOCS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const loadSavedDoc = (saved: SavedDoc) => {
    const next: DocState = {
      ...doc,
      text: saved.body,
      title: saved.title === '（無題）' ? '' : saved.title,
      author: saved.author,
      fontSize: saved.fontSize,
      lineHeight: saved.lineHeight,
      fontFamily: saved.font,
      paperSize: saved.paperSize as DocState['paperSize'],
    };
    setDoc(next);
    setHistory(h => [...h.slice(0, historyIndex + 1), next]);
    setHistoryIndex(i => i + 1);
    setLoadDropOpen(false);
  };

  const deleteSavedDoc = (id: string) => {
    setSavedDocs(prev => {
      const next = prev.filter(d => d.id !== id);
      try { localStorage.setItem(SAVED_DOCS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const getDisplayText = (stripRuby = false) => {
    let t = doc.text;
    if (stripRuby) t = t.replace(/《([^|》]+)\|[^》]+》/g, '$1');
    if (doc.punctuationStyle === 'western') {
      t = t.replace(/。/g, '．').replace(/、/g, '，');
    }
    if (doc.kanjiNumbers) {
      t = t.replace(/[0-9]/g, d => KANJI_MAP[d] ?? d);
    }
    return t;
  };

  const insertRuby = (reading: string) => {
    const ta = textareaRef.current;
    if (!ta || !reading.trim()) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const current = doc.text;
    const base = start !== end ? current.slice(start, end) : 'text';
    const tag = `《${base}|${reading.trim()}》`;
    const next = current.slice(0, start) + tag + current.slice(end);
    const newCursor = start + tag.length;
    updateDoc({ text: next });
    setRubyPopover(false);
    setRubyReading('');
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(newCursor, newCursor); });
  };

  const estimatedReadTime = Math.ceil(doc.text.length / 400);

  const handlePrint = () => {
    window.print();
  };

  const generateShareUrl = () => {
    const encoded = btoa(JSON.stringify(doc));
    const url = `${window.location.origin}${window.location.pathname}?d=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    });
  };

  const exportPng = () => {
    const paper = PAPER_SIZES[doc.paperSize];
    const scale = pngScale;
    const canvas = document.createElement('canvas');

    if (doc.genkouyoshi) {
      canvas.width = paper.width * scale;
      canvas.height = paper.height * scale;
      const gCtx = canvas.getContext('2d')!;
      gCtx.fillStyle = '#fff';
      gCtx.fillRect(0, 0, canvas.width, canvas.height);

      const COLS = 20, ROWS = 20;
      const margin = 8 * scale;
      const gridW = canvas.width - 2 * margin;
      const gridH = canvas.height - 2 * margin;
      const cellW = gridW / COLS;
      const cellH = gridH / ROWS;
      const genkoFontSize = Math.min(cellW, cellH) * 0.72;

      gCtx.strokeStyle = '#cccccc';
      gCtx.lineWidth = 1;
      for (let c = 0; c <= COLS; c++) {
        gCtx.beginPath(); gCtx.moveTo(margin + c * cellW, margin); gCtx.lineTo(margin + c * cellW, margin + gridH); gCtx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        gCtx.beginPath(); gCtx.moveTo(margin, margin + r * cellH); gCtx.lineTo(margin + gridW, margin + r * cellH); gCtx.stroke();
      }

      gCtx.fillStyle = '#999';
      gCtx.font = `${cellW * 0.25}px sans-serif`;
      gCtx.textAlign = 'center';
      gCtx.textBaseline = 'middle';
      for (let c = 0; c < COLS; c++) {
        gCtx.fillText(String(c + 1), margin + (COLS - 1 - c) * cellW + cellW / 2, margin * 0.5);
      }

      const genkoCells = flattenToGenkoCells(getDisplayText(false));
      gCtx.fillStyle = '#000';
      gCtx.textBaseline = 'middle';
      gCtx.textAlign = 'center';

      genkoCells.slice(0, COLS * ROWS).forEach((cell, i) => {
        if (!cell || !cell.ch) return;
        const col = Math.floor(i / ROWS);
        const row = i % ROWS;
        const cx = margin + (COLS - 1 - col) * cellW + cellW / 2;
        const cy = margin + row * cellH + cellH / 2;
        gCtx.font = `${genkoFontSize}px ${doc.fontFamily}`;
        gCtx.fillStyle = '#000';
        gCtx.fillText(cell.ch, cx, cy);
        if (cell.ruby) {
          const rubySize = genkoFontSize * 0.4;
          gCtx.font = `${rubySize}px ${doc.fontFamily}`;
          gCtx.fillStyle = '#555';
          gCtx.fillText(cell.ruby[0] ?? '', cx + cellW * 0.36, cy);
        }
      });

      const link = document.createElement('a');
      link.download = `原稿用紙_${doc.title || 'document'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      return;
    }

    canvas.width = paper.height * scale; // landscape: height = canvas width for vertical
    canvas.height = paper.width * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pxPerMm = scale;
    const paddingMm = 15;
    const fontPx = doc.fontSize * pxPerMm * 0.35;
    const lineHeightPx = fontPx * doc.lineHeight;

    ctx.fillStyle = '#000';
    ctx.font = `${fontPx}px ${doc.fontFamily}`;
    ctx.textBaseline = 'top';

    const displayText = getDisplayText(true); // strip ruby markup for PNG
    const chars = displayText.split('');
    const startX = canvas.width - paddingMm * pxPerMm;
    const startY = paddingMm * pxPerMm;

    let x = startX;
    let y = startY;

    if (doc.title) {
      ctx.font = `bold ${fontPx * 1.3}px ${doc.fontFamily}`;
      const titleChars = doc.title.split('');
      for (const ch of titleChars) {
        ctx.fillText(ch, x - fontPx * 0.65, y);
        y += lineHeightPx * 1.3;
      }
      x -= lineHeightPx * 1.8;
      y = startY;
      ctx.font = `${fontPx}px ${doc.fontFamily}`;
    }

    for (const ch of chars) {
      if (ch === '\n') {
        x -= lineHeightPx;
        y = startY;
        continue;
      }
      if (y + fontPx > canvas.height - paddingMm * pxPerMm) {
        x -= lineHeightPx;
        y = startY;
      }
      ctx.fillText(ch, x - fontPx * 0.5, y);
      y += fontPx * 1.1;
    }

    const link = document.createElement('a');
    link.download = `縦書き_${doc.title || 'document'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrintWithOptions = () => {
    setPrintPopover(false);
    window.print();
  };

  const exportPdf = () => {
    window.print();
  };

  const exportSvg = () => {
    const paper = PAPER_SIZES[doc.paperSize];
    const mmToPx = 3.78;
    const W = Math.round(paper.height * mmToPx);
    const H = Math.round(paper.width * mmToPx);
    const padding = Math.round(15 * mmToPx);
    const fontPx = Math.round(doc.fontSize * 0.35 * mmToPx);
    const lineHeightPx = Math.round(fontPx * doc.lineHeight);
    const displayText = getDisplayText(true);
    const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    let els = '';
    let x = W - padding;
    let y = padding;
    if (doc.title) {
      const titlePx = Math.round(fontPx * 1.3);
      for (const ch of doc.title) {
        els += `<text x="${x - titlePx * 0.5}" y="${y}" font-family="${esc(doc.fontFamily)}" font-size="${titlePx}" font-weight="bold" fill="#000" dominant-baseline="hanging">${esc(ch)}</text>`;
        y += titlePx * 1.2;
      }
      x -= lineHeightPx * 1.8;
      y = padding;
    }
    for (const ch of displayText) {
      if (ch === '\n') { x -= lineHeightPx; y = padding; continue; }
      if (y + fontPx > H - padding) { x -= lineHeightPx; y = padding; }
      els += `<text x="${x - fontPx * 0.5}" y="${y}" font-family="${esc(doc.fontFamily)}" font-size="${fontPx}" fill="#000" dominant-baseline="hanging">${esc(ch)}</text>`;
      y += fontPx * 1.1;
    }
    const svgStr = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n<rect width="${W}" height="${H}" fill="white"/>\n${els}\n</svg>`;
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `縦書き_${doc.title || 'document'}.svg`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportText = () => {
    const parts: string[] = [];
    if (doc.title) parts.push(doc.title);
    if (doc.author) parts.push(doc.author);
    if (parts.length) parts.push('');
    parts.push(getDisplayText(true));
    const blob = new Blob([parts.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `${doc.title || 'document'}.txt`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const paper = PAPER_SIZES[doc.paperSize];
  const previewRatio = paper.height / paper.width; // tate preview: width=height of paper in portrait

  if (!mounted) return <div className="min-h-[500px]" aria-hidden="true" />;

  return (
    <div className="w-full">
      {/* H1 — primary keyword, above-fold */}
      <h1 className="text-2xl font-bold text-kon dark:text-gray-200 mb-4">縦書き変換ツール</h1>
            {/* Mascot */}
      <div className="mb-6">
        <Mascot state={mascotState} message={mascotMessage} />
      </div>

      {/* Mobile tab bar */}
      <div className="flex lg:hidden border-b border-gray-200 dark:border-gray-700 mb-4">
        <button type="button"
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${mobileTab === 'edit' ? 'text-kon dark:text-gray-300 border-b-2 border-kon dark:border-kon' : 'text-gray-500'}`}
        >
          編集
        </button>
        <button type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${mobileTab === 'preview' ? 'text-kon dark:text-gray-300 border-b-2 border-kon dark:border-kon' : 'text-gray-500'}`}
        >
          プレビュー
        </button>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel: controls */}
        <div className={mobileTab === 'preview' ? 'hidden lg:block' : ''}>
          {/* Templates + Save/Load — Feature A & F */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">テンプレート</p>
              {/* Feature F: save/load controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">保存: {savedDocs.length}/{SAVED_DOCS_MAX}件</span>
                <button type="button"
                  onClick={saveDoc}
                  disabled={savedDocs.length >= SAVED_DOCS_MAX}
                  className="relative px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-40"
                  title="現在の文書を保存"
                >
                  💾 保存
                  {saveToast && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                      保存しました
                    </span>
                  )}
                </button>
                {/* Load dropdown */}
                <div className="relative">
                  <button type="button"
                    onClick={() => setLoadDropOpen(o => !o)}
                    disabled={savedDocs.length === 0}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-40"
                    title="保存済み文書を読み込む"
                  >
                    📂 読み込み
                  </button>
                  {loadDropOpen && savedDocs.length > 0 && (
                    <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl w-56 max-w-[min(224px,calc(100vw-2rem))] overflow-hidden">
                      {savedDocs.map(saved => (
                        <div key={saved.id} className="flex items-center gap-1 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <button type="button"
                            onClick={() => loadSavedDoc(saved)}
                            className="flex-1 text-left"
                          >
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{saved.title}</p>
                            <p className="text-xs text-gray-400">{saved.createdAt}</p>
                          </button>
                          <button type="button"
                            onClick={() => deleteSavedDoc(saved.id)}
                            className="text-gray-400 hover:text-danger flex-shrink-0 p-1"
                            title="削除"
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map(tpl => (
                <button type="button"
                  key={tpl.label}
                  onClick={() => loadTemplate(tpl)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium ${
                    activeTemplate === tpl.label
                      ? 'bg-kon text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-kon hover:text-white dark:hover:bg-ai'
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
              <button type="button"
                onClick={() => { updateDoc({ genkouyoshi: !doc.genkouyoshi }); setGenkouPage(0); }}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium ${
                  doc.genkouyoshi
                    ? 'bg-kon text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-kon hover:text-white dark:hover:bg-ai'
                }`}
                title="原稿用紙モード (20×20マス)"
              >
                📝 原稿用紙
              </button>
            </div>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-2 mb-4">
            <button type="button"
              onClick={undo}
              disabled={historyIndex === 0}
              aria-label="元に戻す"
              aria-disabled={historyIndex === 0}
              className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ↩ 元に戻す
            </button>
            <button type="button"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              aria-label="やり直し"
              aria-disabled={historyIndex >= history.length - 1}
              className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ↪ やり直し
            </button>
          </div>

          {/* Title + Author */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">タイトル</label>
              <input
                type="text"
                value={doc.title}
                onChange={e => updateDoc({ title: e.target.value })}
                placeholder="式辞、手紙など"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-kon/30"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">差出人</label>
              <input
                type="text"
                value={doc.author}
                onChange={e => updateDoc({ author: e.target.value })}
                placeholder="氏名"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-kon/30"
              />
            </div>
          </div>

          {/* Main textarea — Feature E: formatting toolbar above */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">本文</label>
              {/* Formatting toolbar */}
              <div className="flex gap-1 items-center">
                {FORMAT_BUTTONS.map(btn => (
                  <button
                    key={btn.label}
                    type="button"
                    title={btn.title}
                    onClick={() => insertFormat(btn.insert[0], btn.insert[1])}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-2 py-1 text-sm cursor-pointer transition-colors leading-none"
                  >
                    {btn.label}
                  </button>
                ))}
                {/* Ruby button with popover */}
                <div className="relative ruby-popover-container">
                  <button
                    type="button"
                    title="ルビを振る (《漢字|かんじ》)"
                    onClick={() => { setRubyPopover(p => !p); setTimeout(() => rubyInputRef.current?.focus(), 50); }}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-2 py-1 text-sm cursor-pointer transition-colors leading-none"
                  >
                    ルビ
                  </button>
                  {rubyPopover && (
                    <div className="absolute top-full right-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 w-44">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">ふりがな</p>
                      <input
                        ref={rubyInputRef}
                        type="text"
                        value={rubyReading}
                        onChange={e => setRubyReading(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') insertRuby(rubyReading); if (e.key === 'Escape') setRubyPopover(false); }}
                        placeholder="かんじ"
                        className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 mb-2"
                      />
                      <button type="button"
                        onClick={() => insertRuby(rubyReading)}
                        className="w-full py-1 text-xs bg-kon text-white rounded hover:bg-kon/90"
                      >
                        適用
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={doc.text}
              onChange={e => updateDoc({ text: e.target.value })}
              rows={10}
              placeholder="ここに本文を入力してください..."
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-kon/30 resize-y"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              ルビ: 《漢字|かんじ》の形式 または ルビボタンを使用
            </p>
          </div>

          {/* Char count + stats panel */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <button
                type="button"
                onClick={() => setStatsOpen(o => !o)}
                className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center gap-1"
              >
                <span aria-live="polite" aria-atomic="true">{doc.text.length}文字</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${statsOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20" fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {doc.text.length > 0 && (
                <span>読了目安 約{Math.ceil(doc.text.length / 300)}分</span>
              )}
            </div>
            {statsOpen && (() => {
              const t = doc.text;
              const noSpace = t.replace(/\s/g, '');
              const lines = t === '' ? 0 : t.split('\n').length;
              const paras = t === '' ? 0 : t.split(/\n\s*\n/).filter(p => p.trim()).length || (t.trim() ? 1 : 0);
              const kanjiCount = (t.match(/[\u4e00-\u9fff]/g) || []).length;
              const hiraCount  = (t.match(/[\u3040-\u309f]/g) || []).length;
              const kataCount  = (t.match(/[\u30a0-\u30ff]/g) || []).length;
              const alphaCount = (t.match(/[a-zA-Z0-9]/g) || []).length;
              const total = t.length;
              const pct = (n: number) => total > 0 ? Math.round(n / total * 100) : 0;
              const rows: [string, string][] = [
                ['空白含む', `${total}字`],
                ['空白除く', `${noSpace.length}字`],
                ['行数', `${lines}`],
                ['段落数', `${paras}`],
                ['漢字', `${kanjiCount}字(${pct(kanjiCount)}%)`],
                ['ひらがな', `${hiraCount}字(${pct(hiraCount)}%)`],
                ['カタカナ', `${kataCount}字(${pct(kataCount)}%)`],
                ['英数字', `${alphaCount}字(${pct(alphaCount)}%)`],
              ];
              return (
                <div className="mt-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm overflow-hidden"
                  style={{ animation: 'vtPreviewFadeIn 0.2s ease-out' }}>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {rows.map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">{label}</span>
                        <span className="text-gray-700 dark:text-gray-200 text-xs font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Speech length guide */}
          {(() => {
            const charCount = doc.text.length;
            // Scale: 0–2000 chars total width
            const SCALE = 2000;
            const markerPct = Math.min(charCount / SCALE * 100, 100);
            // Segment widths as % of bar
            // green 0–900 (45%), blue 900–1500 (30%), amber 1500–1700 (10%), red 1700–2000 (15%)
            return (
              <div className="mb-4">
                {/* Segmented bar */}
                <div className="relative mb-1">
                  <div className="h-3 rounded-full overflow-hidden flex">
                    <div className="bg-green-400" style={{ width: '45%' }} title="〜900字 3分" />
                    <div className="bg-kon"  style={{ width: '30%' }} title="〜1500字 5分" />
                    <div className="bg-kon" style={{ width: '10%' }} title="〜1700字 7分" />
                    <div className="bg-danger"   style={{ width: '15%' }} title="1700字〜" />
                  </div>
                  {/* Triangle marker */}
                  {charCount > 0 && (
                    <div
                      className="absolute -top-0.5 transition-all duration-300"
                      style={{ left: `calc(${markerPct}% - 5px)` }}
                    >
                      {/* Down-pointing triangle */}
                      <div style={{
                        width: 0, height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: '7px solid #374151',
                      }} />
                    </div>
                  )}
                </div>
                {/* Segment labels */}
                <div className="flex text-xs text-gray-400 mb-1" style={{ fontSize: '10px' }}>
                  <span style={{ width: '45%' }}>3分</span>
                  <span style={{ width: '30%' }}>5分</span>
                  <span style={{ width: '10%' }}>7分</span>
                  <span style={{ width: '15%' }}>超過</span>
                </div>
                {/* Tip */}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  💡 式辞の目安: 3分＝約900字 / 5分＝約1,500字
                </p>
              </div>
            );
          })()}

          {/* Sliders: font size, line height, font family */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">文字サイズ: {doc.fontSize}pt</label>
              <input
                type="range" min={12} max={48} step={1}
                value={doc.fontSize}
                onChange={e => updateDoc({ fontSize: Number(e.target.value) })}
                className="w-full accent-kon"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">行間: {doc.lineHeight}x</label>
              <input
                type="range" min={1} max={3} step={0.1}
                value={doc.lineHeight}
                onChange={e => updateDoc({ lineHeight: Number(e.target.value) })}
                className="w-full accent-kon"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">フォント</label>
              <select
                value={doc.fontFamily}
                onChange={e => updateDoc({ fontFamily: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none"
              >
                {FONT_FAMILIES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-600 dark:text-gray-300">句読点</span>
              <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                <button type="button"
                  onClick={() => updateDoc({ punctuationStyle: 'japanese' })}
                  className={`px-2 py-1 text-xs transition-colors ${doc.punctuationStyle === 'japanese' ? 'bg-kon text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
                >
                  。、
                </button>
                <button type="button"
                  onClick={() => updateDoc({ punctuationStyle: 'western' })}
                  className={`px-2 py-1 text-xs transition-colors ${doc.punctuationStyle === 'western' ? 'bg-kon text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
                >
                  ．，
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={doc.kanjiNumbers}
                onChange={e => updateDoc({ kanjiNumbers: e.target.checked })}
                className="accent-kon"
              />
              <span className="text-xs text-gray-600 dark:text-gray-300">漢数字変換</span>
            </label>
          </div>

          {/* Advanced settings — Feature G */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setAdvancedOpen(o => !o)}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${advancedOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20" fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
              ⚙️ 詳細設定
            </button>

            {advancedOpen && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 space-y-3">

                {/* Checkboxes row */}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={doc.indentFirst}
                      onChange={e => updateDoc({ indentFirst: e.target.checked })}
                      className="accent-kon"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-300">字下げ</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={doc.kinsoku}
                      onChange={e => updateDoc({ kinsoku: e.target.checked })}
                      className="accent-kon"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-300">禁則処理</span>
                  </label>
                </div>

                {/* Letter spacing */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    文字間隔: {doc.letterSpacing}px
                  </label>
                  <input
                    type="range" min={0} max={5} step={0.5}
                    value={doc.letterSpacing}
                    onChange={e => updateDoc({ letterSpacing: Number(e.target.value) })}
                    className="w-full accent-kon"
                  />
                </div>

                {/* Margins */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">余白 (mm)</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(['marginTop', 'marginBottom', 'marginLeft', 'marginRight'] as const).map(key => (
                      <div key={key}>
                        <label className="block text-xs text-center text-gray-400 dark:text-gray-500 mb-0.5">
                          {key === 'marginTop' ? '上' : key === 'marginBottom' ? '下' : key === 'marginLeft' ? '左' : '右'}
                        </label>
                        <input
                          type="number" min={0} max={60} step={1}
                          value={doc[key]}
                          onChange={e => updateDoc({ [key]: Number(e.target.value) })}
                          className="w-full px-1.5 py-1 text-xs text-center border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-kon"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">

            {/* 印刷 button with popover */}
            <div className="relative">
              <button type="button"
                onClick={() => setPrintPopover(p => !p)}
                className="px-4 py-2 text-sm bg-kon text-white rounded-xl hover:bg-kon/90 transition-colors min-h-[44px]"
              >
                🖨 印刷
              </button>
              {printPopover && (
                <div className="absolute left-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl p-4 w-56 max-w-[min(224px,calc(100vw-2rem))] overflow-auto">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-3">印刷設定</p>

                  {/* Margin */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">余白</p>
                    <div className="flex gap-1">
                      {(['standard','narrow','wide'] as const).map(m => (
                        <label key={m} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio" name="printMargin" value={m}
                            checked={printMargin === m}
                            onChange={() => setPrintMargin(m)}
                            className="accent-kon"
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {m === 'standard' ? '標準' : m === 'narrow' ? '狭い' : '広い'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Orientation */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">用紙方向</p>
                    <div className="flex gap-3">
                      {(['portrait','landscape'] as const).map(o => (
                        <label key={o} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio" name="printOri" value={o}
                            checked={printOrientation === o}
                            onChange={() => setPrintOrientation(o)}
                            className="accent-kon"
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            {o === 'portrait' ? '縦' : '横'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Page numbers */}
                  <label className="flex items-center gap-2 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={printPageNumbers}
                      onChange={e => setPrintPageNumbers(e.target.checked)}
                      className="accent-kon"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-300">ページ番号</span>
                  </label>

                  <button type="button"
                    onClick={handlePrintWithOptions}
                    className="w-full py-2 text-sm bg-kon text-white rounded-lg hover:bg-kon/90 transition-colors"
                  >
                    印刷する
                  </button>
                </div>
              )}
            </div>

            {/* PNG出力 with resolution selector */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
              <button type="button"
                onClick={exportPng}
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                🖼 PNG出力
              </button>
              <select
                value={pngScale}
                onChange={e => setPngScale(Number(e.target.value))}
                className="px-1 py-2 text-xs bg-gray-100 dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 focus:outline-none cursor-pointer"
                title="解像度"
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={3}>3x</option>
              </select>
            </div>

            {/* PDF出力 */}
            <button type="button"
              onClick={exportPdf}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              📄 PDF出力
            </button>

            {/* SVG出力 */}
            <button type="button"
              onClick={exportSvg}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              🗂 SVG出力
            </button>

            {/* テキスト出力 */}
            <button type="button"
              onClick={exportText}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              📝 テキスト
            </button>

            {/* URLをコピー */}
            <button type="button"
              onClick={generateShareUrl}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative"
            >
              🔗 URLをコピー
              {shareToast && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  コピーしました！
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right panel: preview */}
        <div className={`${mobileTab === 'edit' ? 'hidden lg:block' : ''} lg:sticky lg:top-6 lg:self-start`}>
          {/* Paper size selector */}
          <div className="flex gap-1 mb-4">
            {(Object.keys(PAPER_SIZES) as DocState['paperSize'][]).map(size => (
              <button type="button"
                key={size}
                onClick={() => updateDoc({ paperSize: size })}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${doc.paperSize === size ? 'bg-kon text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                {PAPER_SIZES[size].label}
              </button>
            ))}
          </div>

          {/* Vertical preview — Feature B */}
          <div
            ref={previewRef}
            className="relative bg-white dark:bg-gray-900 shadow-lg mx-auto overflow-hidden border border-gray-200 dark:border-gray-700"
            style={{
              width: '100%',
              maxWidth: '400px',
              aspectRatio: `${paper.width} / ${paper.height}`,
            }}
          >
            {/* Fade-in wrapper — key changes trigger remount = animation restart */}
            {previewReady && <div
              key={previewKey}
              className="absolute inset-0 overflow-hidden"
              style={{ animation: 'vtPreviewFadeIn 0.3s ease-out' }}
            >
              {/* Empty placeholder */}
              {!previewDoc.text && !previewDoc.title && !previewDoc.author ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'upright',
                      color: '#d1d5db',
                      fontSize: '14px',
                      fontFamily: 'sans-serif',
                      letterSpacing: '0.1em',
                    }}
                  >
                    プレビュー
                  </span>
                </div>
              ) : previewDoc.genkouyoshi ? (
                <GenkouyoshiPreview
                  previewDoc={previewDoc}
                  containerW={containerW}
                  genkouPage={genkouPage}
                  setGenkouPage={setGenkouPage}
                  getDisplayText={(stripRuby?: boolean) => {
                    let t = previewDoc.text;
                    if (stripRuby) t = t.replace(/《([^|》]+)\|[^》]+》/g, '$1');
                    if (previewDoc.punctuationStyle === 'western') t = t.replace(/。/g, '．').replace(/、/g, '，');
                    if (previewDoc.kanjiNumbers) t = t.replace(/[0-9]/g, (d: string) => KANJI_MAP[d] ?? d);
                    return t;
                  }}
                  isDark={isDark}
                />
              ) : (
                <div
                  className="absolute inset-0 p-4 overflow-hidden bg-white"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'upright',
                    fontFamily: previewDoc.fontFamily,
                    fontSize: `${previewDoc.fontSize * 0.6}px`,
                    lineHeight: previewDoc.lineHeight,
                    direction: 'rtl',
                    color: '#000',
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Title — appears top-right (first in rtl flow) */}
                  {previewDoc.title && (
                    <span
                      style={{
                        fontWeight: 'bold',
                        fontSize: `${previewDoc.fontSize * 0.75}px`,
                        alignSelf: 'flex-start',
                        marginLeft: '0.4em',
                        flexShrink: 0,
                      }}
                    >
                      {previewDoc.title}{'　'}
                    </span>
                  )}

                  {/* Body text — ruby-aware rendering */}
                  <span style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden' }}>
                    {parseRubyText((() => {
                      let t = previewDoc.text;
                      if (previewDoc.punctuationStyle === 'western') t = t.replace(/。/g, '．').replace(/、/g, '，');
                      if (previewDoc.kanjiNumbers) t = t.replace(/[0-9]/g, d => KANJI_MAP[d] ?? d);
                      return t;
                    })()).map((seg, i) =>
                      seg.type === 'ruby' ? (
                        <ruby key={i} style={{ rubyAlign: 'center' } as React.CSSProperties}>
                          {seg.text}
                          <rt style={{ fontSize: `${previewDoc.fontSize * 0.28}px`, fontFamily: previewDoc.fontFamily }}>
                            {seg.ruby}
                          </rt>
                        </ruby>
                      ) : (
                        <span key={i}>{seg.text}</span>
                      )
                    )}
                  </span>

                  {/* Author — appears bottom-left (last in rtl flow) */}
                  {previewDoc.author && (
                    <span
                      style={{
                        fontSize: `${previewDoc.fontSize * 0.5}px`,
                        alignSelf: 'flex-end',
                        marginRight: '0.4em',
                        flexShrink: 0,
                      }}
                    >
                      {'　'}{previewDoc.author}
                    </span>
                  )}
                </div>
              )}
            </div>}
          </div>

          <div className="flex justify-between items-center text-xs text-gray-400 mt-2 px-1">
            <span>{paper.label} ({paper.width}×{paper.height}mm)</span>
            {doc.genkouyoshi && (
              <span>
                {Math.max(1, Math.ceil(doc.text.replace(/《[^|》]*\|[^》]*》/g, m => m.split('|')[0].slice(1)).replace(/\s/g, '').length / 400))}ページ
                {doc.text.replace(/《[^|》]*\|[^》]*》/g, m => m.split('|')[0].slice(1)).replace(/\s/g, '').length}字
              </span>
            )}
          </div>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>

      {/* Styles: print + preview animation */}
      <style>{`
        @keyframes vtPreviewFadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media print {
          body > *:not(#print-area) { display: none !important; }
          #print-area {
            display: block !important;
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-size: 14pt;
            line-height: 2;
          }
          @page {
            size: ${printOrientation === 'landscape' ? 'landscape' : 'portrait'};
            margin: ${printMargin === 'narrow' ? '10mm' : printMargin === 'wide' ? '30mm' : '20mm'};
          }
          ${printPageNumbers ? `
          body::after {
            content: counter(page);
            position: fixed;
            bottom: 8mm;
            right: 10mm;
            font-size: 9pt;
            color: #666;
          }
          ` : ''}
        }
      `}</style>
    </div>
  );
}
