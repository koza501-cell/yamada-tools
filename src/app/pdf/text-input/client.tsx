// @ts-nocheck
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import ShareButtons from "@/components/common/ShareButtons";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

/* ── Types ───────────────────────────────────────────────────────────────── */
interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; useCases?: { title: string; desc: string }[]; tips?: string; }
interface Props { faq: FAQ[]; seoContent?: SeoContent; }

type StampShape = "circle" | "square";
type FontFamily = "sans-serif" | "serif" | "monospace" | "cursive";
type TAlign = "left" | "center" | "right";

interface PdfElement {
  id: string;
  page: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: FontFamily;
  color: string;
  bold: boolean;
  textAlign: TAlign;
  isStamp?: boolean;
  stampName?: string;
  stampSize?: number;
  stampShape?: StampShape;
  isSignature?: boolean;
  isImage?: boolean;
  imageData?: string;
  width?: number;
  height?: number;
  isHighlight?: boolean;
}

/* ── Library Loading ─────────────────────────────────────────────────────── */
let pdfjsLib: any = null;
let PDFLib: any = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error("Failed: " + src));
    document.head.appendChild(s);
  });
}

async function ensureLibs() {
  if (!pdfjsLib) {
    await loadScript("/pdf.min.js");
    pdfjsLib = (window as any).pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }
  if (!PDFLib) {
    await loadScript("/pdf-lib.min.js");
    PDFLib = (window as any).PDFLib;
  }
}

/* ── Constants ───────────────────────────────────────────────────────────── */
const FONTS: { value: FontFamily; label: string }[] = [
  { value: "sans-serif", label: "ゴシック体" },
  { value: "serif",      label: "明朝体" },
  { value: "monospace",  label: "等幅" },
  { value: "cursive",    label: "手書き風" },
];
const COLORS = [
  { value: "#000000", label: "黒" }, { value: "#333333", label: "濃灰" },
  { value: "#0000FF", label: "青" }, { value: "#FF0000", label: "赤" },
  { value: "#006400", label: "緑" }, { value: "#800080", label: "紫" },
];
const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5];
const HIGHLIGHT_COLORS = [
  { value: "rgba(255,255,0,0.4)",   label: "黄", solid: "#FFE000" },
  { value: "rgba(144,238,144,0.4)", label: "緑", solid: "#7BC97B" },
  { value: "rgba(173,216,230,0.4)", label: "青", solid: "#88B8D0" },
  { value: "rgba(255,182,193,0.4)", label: "赤", solid: "#FFB6C1" },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function getJapaneseDate() {
  const n = new Date();
  return `令和${n.getFullYear() - 2018}年${n.getMonth() + 1}月${n.getDate()}日`;
}
function getWesternDate() {
  const n = new Date();
  return `${n.getFullYear()}年${n.getMonth() + 1}月${n.getDate()}日`;
}

function drawStamp(ctx: CanvasRenderingContext2D, el: PdfElement, cx: number, cy: number, sz: number) {
  const chars = (el.stampName ?? "").split("");
  const lw = Math.max(2, sz * 0.04);
  ctx.save();
  ctx.strokeStyle = "#CC0000"; ctx.fillStyle = "#CC0000";
  if (el.stampShape === "square") {
    const hs = sz / 2 - lw;
    ctx.lineWidth = lw;
    ctx.strokeRect(cx - hs, cy - hs, hs * 2, hs * 2);
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - hs + 3, cy - hs + 3, (hs - 3) * 2, (hs - 3) * 2);
  } else {
    ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(cx, cy, sz / 2 - lw, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, sz / 2 - lw - 3, 0, Math.PI * 2); ctx.stroke();
  }
  if (chars.length > 0) {
    const csz = Math.floor((sz * 0.55) / Math.max(chars.length, 1));
    ctx.font = `bold ${csz}px serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const th = chars.length * csz;
    chars.forEach((ch, i) => ctx.fillText(ch, cx, cy - th / 2 + csz / 2 + i * csz));
  }
  ctx.restore();
}

/* ── Subcomponents ───────────────────────────────────────────────────────── */
function SignatureModal({ onConfirm, onCancel }: { onConfirm: (url: string) => void; onCancel: () => void }) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const pos = (e: React.PointerEvent) => { const r = cvs.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-lg w-full">
        <h3 className="text-lg font-bold mb-3">✍️ 署名を描く</h3>
        <p className="text-sm text-gray-500 mb-3">下の枠にサインを書いてください</p>
        <canvas ref={cvs} width={480} height={200}
          className="border-2 border-gray-300 rounded-xl bg-white w-full touch-none" style={{ cursor: "crosshair" }}
          onPointerDown={e => {
            e.currentTarget.setPointerCapture(e.pointerId); setDrawing(true);
            const p = pos(e); last.current = p;
            const ctx = cvs.current!.getContext("2d")!; ctx.beginPath(); ctx.moveTo(p.x, p.y);
          }}
          onPointerMove={e => {
            if (!drawing) return;
            const p = pos(e); const ctx = cvs.current!.getContext("2d")!;
            ctx.lineWidth = 2; ctx.strokeStyle = "#000"; ctx.lineCap = "round"; ctx.lineJoin = "round";
            if (last.current) { ctx.quadraticCurveTo(last.current.x, last.current.y, (last.current.x + p.x) / 2, (last.current.y + p.y) / 2); ctx.stroke(); }
            last.current = p;
          }}
          onPointerUp={() => { setDrawing(false); last.current = null; }}
          onPointerLeave={() => { setDrawing(false); last.current = null; }}
        />
        <div className="flex gap-3 mt-4">
          <button onClick={() => cvs.current!.getContext("2d")!.clearRect(0, 0, 480, 200)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold">クリア</button>
          <button onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold">キャンセル</button>
          <button onClick={() => onConfirm(cvs.current!.toDataURL("image/png"))} className="flex-1 px-4 py-2 bg-kon hover:bg-ai text-white rounded-lg font-bold">確定</button>
        </div>
      </div>
    </div>
  );
}

function PasswordDialog({ onSubmit, onCancel }: { onSubmit: (p: string) => void; onCancel: () => void }) {
  const [pwd, setPwd] = useState("");
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold mb-3">🔒 パスワードで保護されたPDF</h3>
        <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && onSubmit(pwd)}
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-gray-200" placeholder="パスワードを入力" autoFocus />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold">キャンセル</button>
          <button onClick={() => onSubmit(pwd)} className="flex-1 px-4 py-2 bg-kon hover:bg-ai text-white rounded-lg font-bold">開く</button>
        </div>
      </div>
    </div>
  );
}

function MinimapSidebar({ pdfDoc, totalPages, currentPage, onSelect }: { pdfDoc: any; totalPages: number; currentPage: number; onSelect: (p: number) => void }) {
  const [thumbs, setThumbs] = useState<string[]>([]);
  useEffect(() => {
    if (!pdfDoc) return;
    (async () => {
      const urls: string[] = [];
      for (let i = 1; i <= totalPages; i++) {
        const pg = await pdfDoc.getPage(i);
        const vp = pg.getViewport({ scale: 0.15 });
        const c = document.createElement("canvas");
        c.width = Math.round(vp.width); c.height = Math.round(vp.height);
        await pg.render({ canvasContext: c.getContext("2d")!, viewport: vp }).promise;
        urls.push(c.toDataURL());
      }
      setThumbs(urls);
    })();
  }, [pdfDoc, totalPages]);
  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto pr-1" style={{ width: 72, maxHeight: "70vh" }}>
      {thumbs.map((url, i) => (
        <button key={i} onClick={() => onSelect(i + 1)}
          className={`rounded-lg overflow-hidden border-2 transition-all ${currentPage === i + 1 ? "border-gray-200 shadow-md" : "border-gray-200 hover:border-ai"}`}>
          <img src={url} alt={`p${i + 1}`} className="w-full block" />
          <div className={`text-center text-xs py-0.5 ${currentPage === i + 1 ? "text-kon font-bold" : "text-gray-400"}`}>{i + 1}</div>
        </button>
      ))}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function PdfTextClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [mascotState, setMascotState] = useState<MascotState>("idle");

  // PDF
  const [pdfDoc, setPdfDoc]       = useState<any>(null);
  const [pdfBytes, setPdfBytes]   = useState<ArrayBuffer | null>(null);
  const [pdfFile, setPdfFile]     = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfPageWidths, setPdfPageWidths] = useState<number[]>([]);

  // UI
  const [step, setStep]           = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const pendingPwdCb              = useRef<((p: string) => void) | null>(null);

  // Elements
  const [elements, setElements]   = useState<PdfElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<PdfElement[][]>([]);
  const [redoStack, setRedoStack] = useState<PdfElement[][]>([]);
  const [clipboard, setClipboard] = useState<PdfElement | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Drag
  const [isDragging, setIsDragging] = useState(false);
  const [dragId, setDragId]         = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const preDragSnap                 = useRef<PdfElement[] | null>(null);

  // Modes
  const [isTextMode, setIsTextMode]           = useState(false);
  const [isHankoMode, setIsHankoMode]         = useState(false);
  const [isSignatureMode, setIsSignatureMode] = useState(false);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [highlightColor, setHighlightColor]   = useState(HIGHLIGHT_COLORS[0].value);
  const [hlDraw, setHlDraw]                   = useState<{ sx: number; sy: number; ex: number; ey: number } | null>(null);

  // Format
  const [fontSize, setFontSize]     = useState(16);
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans-serif");
  const [color, setColor]           = useState("#000000");
  const [bold, setBold]             = useState(false);
  const [textAlign, setTextAlign]   = useState<TAlign>("left");

  // Hanko
  const [showHankoPanel, setShowHankoPanel] = useState(false);
  const [hankoName, setHankoName]   = useState("");
  const [hankoSize, setHankoSize]   = useState(60);
  const [hankoShape, setHankoShape] = useState<StampShape>("circle");

  // Draft & canvas size
  const [draftBanner, setDraftBanner] = useState<{elements: PdfElement[], filename: string} | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  // Other
  const [isGridSnap, setIsGridSnap] = useState(false);
  const [zoomLevel, setZoomLevel]   = useState(1.0);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Refs
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const overlayRef      = useRef<HTMLDivElement>(null);
  const containerRef    = useRef<HTMLDivElement>(null);
  const scrollRef       = useRef<HTMLDivElement>(null);
  const hankoPreviewRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef   = useRef<any>(null);
  const pdfCacheRef     = useRef<{ page: number; zoom: number; data: ImageData } | null>(null);
  const rafRef          = useRef<number | null>(null);
  const imgCacheRef     = useRef(new Map<string, HTMLImageElement>());

  // Derived
  const selectedEl   = elements.find(e => e.id === selectedId) ?? null;
  const currentEls   = elements.filter(e => e.page === currentPage);
  const validEls     = elements.filter(e =>
    e.isStamp ? !!e.stampName :
    (e.isSignature || e.isImage) ? !!e.imageData :
    e.isHighlight ? (e.width ?? 0) > 0 : e.text.trim().length > 0
  );

  /* ── Undo / Redo ───────────────────────────────────────────────────────── */
  const pushUndo = useCallback((snap?: PdfElement[]) => {
    setUndoStack(prev => [...prev.slice(-49), [...(snap ?? elements)]]);
    setRedoStack([]);
  }, [elements]);

  const undo = useCallback(() => {
    setUndoStack(prev => {
      if (!prev.length) return prev;
      const snap = prev[prev.length - 1];
      setRedoStack(r => [[...elements], ...r.slice(0, 49)]);
      setElements(snap); setSelectedId(null);
      return prev.slice(0, -1);
    });
  }, [elements]);

  const redo = useCallback(() => {
    setRedoStack(prev => {
      if (!prev.length) return prev;
      const snap = prev[0];
      setUndoStack(u => [...u.slice(-49), [...elements]]);
      setElements(snap); setSelectedId(null);
      return prev.slice(1);
    });
  }, [elements]);

  /* ── Element Helpers ───────────────────────────────────────────────────── */
  const deleteEl = useCallback((id: string) => {
    pushUndo();
    setElements(prev => prev.filter(e => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [pushUndo, selectedId]);

  const duplicateEl = useCallback((id: string) => {
    const el = elements.find(e => e.id === id); if (!el) return;
    pushUndo();
    const copy = { ...el, id: crypto.randomUUID(), x: Math.min(el.x + 3, 90), y: Math.min(el.y + 3, 90) };
    setElements(prev => [...prev, copy]); setSelectedId(copy.id);
  }, [elements, pushUndo]);

  const updateEl = useCallback((id: string, upd: Partial<PdfElement>) => {
    setElements(prev => prev.map(e => e.id === id ? { ...e, ...upd } : e));
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 1500);
  }, []);
  const copySelected = useCallback(() => {
    if (selectedEl) { setClipboard({ ...selectedEl }); showToast("コピーしました"); }
  }, [selectedEl, showToast]);

  const pasteEl = useCallback(() => {
    if (!clipboard) return; pushUndo();
    const copy = { ...clipboard, id: crypto.randomUUID(), x: Math.min(clipboard.x + 2, 95), y: Math.min(clipboard.y + 2, 95), page: currentPage };
    setElements(prev => [...prev, copy]); setSelectedId(copy.id);
  }, [clipboard, currentPage, pushUndo]);

  const insertDate = useCallback((fmt: "western" | "japanese") => {
    if (!selectedEl || selectedEl.isStamp) return;
    updateEl(selectedEl.id, { text: selectedEl.text + (fmt === "japanese" ? getJapaneseDate() : getWesternDate()) });
  }, [selectedEl, updateEl]);

  /* ── Format Sync ───────────────────────────────────────────────────────── */
  const isTextEl = !!(selectedEl && !selectedEl.isStamp && !selectedEl.isSignature && !selectedEl.isImage && !selectedEl.isHighlight);

  useEffect(() => {
    if (!isTextEl || !selectedEl) return;
    if (selectedEl.fontSize === fontSize && selectedEl.fontFamily === fontFamily && selectedEl.color === color && selectedEl.bold === bold && selectedEl.textAlign === textAlign) return;
    updateEl(selectedEl.id, { fontSize, fontFamily, color, bold, textAlign });
  }, [fontSize, fontFamily, color, bold, textAlign]);

  useEffect(() => {
    if (!isTextEl || !selectedEl) return;
    setFontSize(selectedEl.fontSize); setFontFamily(selectedEl.fontFamily); setColor(selectedEl.color); setBold(selectedEl.bold); setTextAlign(selectedEl.textAlign ?? "left");
  }, [selectedId]);

  /* ── Hanko Preview ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const c = hankoPreviewRef.current; if (!c || !hankoName) return;
    const sz = 64; c.width = sz; c.height = sz;
    const ctx = c.getContext("2d")!; ctx.clearRect(0, 0, sz, sz);
    drawStamp(ctx, { id:"", page:1, x:0, y:0, text:"", fontSize:16, fontFamily:"serif", color:"#CC0000", bold:true, textAlign:"left", isStamp:true, stampName:hankoName, stampSize:sz, stampShape:hankoShape }, sz/2, sz/2, sz);
  }, [hankoName, hankoShape]);

  /* ── Draw Elements (via ref to avoid stale closures) ──────────────────── */
  const drawElementsRef = useRef<(ctx: CanvasRenderingContext2D, pageNum: number, dW: number, dH: number) => void>(() => {});

  const scheduleRedraw = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const cache = pdfCacheRef.current;
      const canvas = canvasRef.current;
      if (!cache || !canvas) { rafRef.current = null; return; }
      const dpr = window.devicePixelRatio || 1;
      const dW = parseFloat(canvas.style.width) || 0;
      const dH = parseFloat(canvas.style.height) || 0;
      if (!dW || !dH) { rafRef.current = null; return; }
      const ctx = canvas.getContext("2d")!;
      ctx.putImageData(cache.data, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawElementsRef.current(ctx, cache.page, dW, dH);
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    drawElementsRef.current = (ctx: CanvasRenderingContext2D, pageNum: number, dW: number, dH: number) => {
      const pdfPageW = pdfPageWidths[pageNum - 1] ?? 595;
      const scaleX = dW / pdfPageW;
      const pageEls = elements.filter(e => e.page === pageNum);

      if (hlDraw) {
        const x = (Math.min(hlDraw.sx, hlDraw.ex) / 100) * dW;
        const y = (Math.min(hlDraw.sy, hlDraw.ey) / 100) * dH;
        const w = (Math.abs(hlDraw.ex - hlDraw.sx) / 100) * dW;
        const h = (Math.abs(hlDraw.ey - hlDraw.sy) / 100) * dH;
        ctx.fillStyle = highlightColor; ctx.fillRect(x, y, w, h);
      }

      for (const el of pageEls) {
        const x = (el.x / 100) * dW;
        const y = (el.y / 100) * dH;
        const sel = el.id === selectedId;
        ctx.save();
        if (el.isHighlight) {
          const w = ((el.width ?? 10) / 100) * dW;
          const h = ((el.height ?? 5) / 100) * dH;
          ctx.fillStyle = el.color; ctx.fillRect(x, y, w, h);
          if (sel) {
            ctx.strokeStyle = "#f97316"; ctx.lineWidth = 2; ctx.setLineDash([4,4]); ctx.strokeRect(x-2,y-2,w+4,h+4); ctx.setLineDash([]);
            const hs=4; ctx.fillStyle="#f97316";
            [[x-2,y-2],[x-2+w+4,y-2],[x-2,y-2+h+4],[x-2+w+4,y-2+h+4]].forEach(([hx,hy])=>ctx.fillRect(hx-hs,hy-hs,hs*2,hs*2));
          }
        } else if (el.isSignature || el.isImage) {
          const w = ((el.width ?? 30) / 100) * dW;
          const h = ((el.height ?? 10) / 100) * dH;
          const src = el.imageData!;
          if (src && imgCacheRef.current.has(src)) {
            ctx.drawImage(imgCacheRef.current.get(src)!, x, y, w, h);
          } else if (src) {
            const img = new Image(); img.src = src;
            img.onload = () => { imgCacheRef.current.set(src, img); scheduleRedraw(); };
            ctx.fillStyle = "rgba(100,100,200,0.08)"; ctx.fillRect(x, y, w, h);
            ctx.fillStyle = "#8888cc"; ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(el.isSignature ? "署名" : "画像", x + w/2, y + h/2);
          }
          if (sel) {
            ctx.strokeStyle = "#f97316"; ctx.lineWidth = 2; ctx.setLineDash([4,4]); ctx.strokeRect(x-4,y-4,w+8,h+8); ctx.setLineDash([]);
            const hs=4; ctx.fillStyle="#f97316";
            [[x-4,y-4],[x-4+w+8,y-4],[x-4,y-4+h+8],[x-4+w+8,y-4+h+8]].forEach(([hx,hy])=>ctx.fillRect(hx-hs,hy-hs,hs*2,hs*2));
          }
        } else if (el.isStamp) {
          const sp = (el.stampSize ?? 60) * scaleX;
          drawStamp(ctx, el, x + sp/2, y + sp/2, sp);
          if (sel) {
            ctx.strokeStyle = "#f97316"; ctx.lineWidth = 2; ctx.setLineDash([4,4]); ctx.strokeRect(x-4,y-4,sp+8,sp+8); ctx.setLineDash([]);
            const hs=4; ctx.fillStyle="#f97316";
            [[x-4,y-4],[x-4+sp+8,y-4],[x-4,y-4+sp+8],[x-4+sp+8,y-4+sp+8]].forEach(([hx,hy])=>ctx.fillRect(hx-hs,hy-hs,hs*2,hs*2));
          }
        } else if (el.text) {
          const sz = el.fontSize * scaleX;
          ctx.font = `${el.bold?"bold ":""}${sz}px ${el.fontFamily}`;
          ctx.fillStyle = el.color; ctx.textBaseline = "top"; ctx.textAlign = el.textAlign ?? "left";
          const lines = el.text.split("\n"); const lh = sz * 1.4;
          lines.forEach((line, i) => ctx.fillText(line, x, y + i * lh));
          if (sel) {
            const mw = Math.max(...lines.map(l => ctx.measureText(l).width));
            ctx.strokeStyle = "#f97316"; ctx.lineWidth = 2; ctx.setLineDash([4,4]);
            ctx.strokeRect(x-4, y-4, mw+8, lines.length*lh+8); ctx.setLineDash([]);
            const hs=4; ctx.fillStyle="#f97316";
            [[x-4,y-4],[x-4+mw+8,y-4],[x-4,y-4+lines.length*lh+8],[x-4+mw+8,y-4+lines.length*lh+8]].forEach(([hx,hy])=>ctx.fillRect(hx-hs,hy-hs,hs*2,hs*2));
          }
        }
        ctx.restore();
      }
    };
  });

  /* ── Render Page ───────────────────────────────────────────────────────── */
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current || !scrollRef.current) return;
    const page = await pdfDoc.getPage(pageNum);
    const cont = scrollRef.current;
    const availW = cont.clientWidth - (showMinimap && totalPages >= 5 ? 90 : 8) - 4;
    const fitScale = availW / page.getViewport({ scale: 1 }).width;
    const viewport = page.getViewport({ scale: fitScale * zoomLevel });

    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const dW = Math.round(viewport.width);
    const dH = Math.round(viewport.height);
    canvas.width  = Math.floor(dW * dpr);
    canvas.height = Math.floor(dH * dpr);
    canvas.style.width  = dW + "px";
    canvas.style.height = dH + "px";
    setCanvasSize({ w: dW, h: dH });

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (renderTaskRef.current) { try { renderTaskRef.current.cancel(); } catch {} }
    const task = page.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;
    try {
      await task.promise;
      pdfCacheRef.current = { page: pageNum, zoom: zoomLevel, data: ctx.getImageData(0, 0, canvas.width, canvas.height) };
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawElementsRef.current(ctx, pageNum, dW, dH);
    } catch (e: any) { if (e?.name !== "RenderingCancelledException") throw e; }
  }, [pdfDoc, zoomLevel, showMinimap, totalPages]);

  useEffect(() => { if (pdfDoc) renderPage(currentPage); }, [pdfDoc, currentPage, zoomLevel, showMinimap]);

  /* ── ResizeObserver: re-render on container resize ─────────────────────── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => { if (pdfDoc) renderPage(currentPage); });
    observer.observe(el);
    return () => observer.disconnect();
  }, [pdfDoc, currentPage, renderPage]);
  useEffect(() => { scheduleRedraw(); }, [elements, selectedId, hlDraw]);

  /* ── PDF Load ──────────────────────────────────────────────────────────── */
  const loadPdf = useCallback(async (file: File, pwd?: string) => {
    setIsLoading(true); setMascotState("working"); setError("");
    try {
      await ensureLibs();
      const buf = await file.arrayBuffer();
      setPdfBytes(buf.slice(0)); setPdfFile(file);
      const task = pdfjsLib.getDocument({ data: new Uint8Array(buf), password: pwd ?? "" });
      task.onPassword = (cb: (p: string) => void) => { pendingPwdCb.current = cb; setIsPasswordOpen(true); setIsLoading(false); };
      const doc = await task.promise;
      const widths: number[] = [];
      for (let i = 1; i <= doc.numPages; i++) widths.push((await doc.getPage(i)).getViewport({ scale: 1 }).width);
      setPdfPageWidths(widths); setPdfDoc(doc); setTotalPages(doc.numPages);
      setCurrentPage(1); setElements([]); setSelectedId(null); setUndoStack([]); setRedoStack([]);
      setStep(2); setIsLoading(false); setMascotState("success");
      try {
        const _dKey = 'yamada-pdf-text-draft-' + file.name;
        const _saved = localStorage.getItem(_dKey);
        if (_saved) { const _p = JSON.parse(_saved); if (_p.elements?.length > 0) setDraftBanner({ elements: _p.elements, filename: _p.filename }); }
      } catch {}
      triggerSuccess('text-input');;
      if (doc.numPages >= 5) setShowMinimap(true);
      setTimeout(() => setMascotState("idle"), 2000);
    } catch (e: any) {
      if (e?.name !== "PasswordException") { setIsLoading(false); setError("PDFの読み込みに失敗しました: " + (e?.message ?? e)); setMascotState("error"); }
    }
  }, []);

  /* ── Hit Test ──────────────────────────────────────────────────────────── */
  const hitTest = useCallback((xPct: number, yPct: number): PdfElement | null => {
    const canvas = canvasRef.current; if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const dW = parseFloat(canvas.style.width) || canvas.width / dpr;
    const dH = parseFloat(canvas.style.height) || canvas.height / dpr;
    const pdfPageW = pdfPageWidths[currentPage - 1] ?? 595;
    const scaleX = dW / pdfPageW;
    const px = (xPct / 100) * dW, py = (yPct / 100) * dH;
    const ctx = canvas.getContext("2d")!;
    for (const el of [...currentEls].reverse()) {
      const ex = (el.x / 100) * dW, ey = (el.y / 100) * dH;
      if (el.isHighlight) {
        const ew = ((el.width ?? 10) / 100) * dW, eh = ((el.height ?? 5) / 100) * dH;
        if (px >= ex && px <= ex + ew && py >= ey && py <= ey + eh) return el;
      } else if (el.isSignature || el.isImage) {
        const ew = ((el.width ?? 30) / 100) * dW, eh = ((el.height ?? 10) / 100) * dH;
        if (px >= ex-8 && px <= ex+ew+8 && py >= ey-8 && py <= ey+eh+8) return el;
      } else if (el.isStamp) {
        const sp = (el.stampSize ?? 60) * scaleX;
        if (px >= ex-8 && px <= ex+sp+8 && py >= ey-8 && py <= ey+sp+8) return el;
      } else if (el.text) {
        const sz = el.fontSize * scaleX;
        ctx.font = `${el.bold?"bold ":""}${sz}px ${el.fontFamily}`;
        const lines = el.text.split("\n");
        const mw = Math.max(...lines.map(l => ctx.measureText(l).width));
        const th = lines.length * sz * 1.4;
        if (px >= ex-8 && px <= ex+mw+8 && py >= ey-8 && py <= ey+th+8) return el;
      }
    }
    return null;
  }, [currentEls, pdfPageWidths, currentPage]);

  /* ── Pointer Coords ────────────────────────────────────────────────────── */
  const getPct = useCallback((e: React.PointerEvent | React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)),
      y: Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100)),
    };
  }, []);

  /* ── Overlay Pointer Handlers ──────────────────────────────────────────── */
  const handlePtrDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (step < 2) return;
    const { x, y } = getPct(e);
    if (isHighlightMode) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setHlDraw({ sx: x, sy: y, ex: x, ey: y }); return;
    }
    const hit = hitTest(x, y);
    if (hit) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setSelectedId(hit.id); setIsDragging(true); setDragId(hit.id);
      setDragOffset({ x: x - hit.x, y: y - hit.y });
      preDragSnap.current = [...elements]; return;
    }
    if (isTextMode) {
      pushUndo();
      const el: PdfElement = { id: crypto.randomUUID(), page: currentPage, x, y, text: "", fontSize, fontFamily, color, bold, textAlign };
      setElements(prev => [...prev, el]); setSelectedId(el.id); setIsTextMode(false); return;
    }
    if (isHankoMode && hankoName.trim()) {
      pushUndo();
      const el: PdfElement = { id: crypto.randomUUID(), page: currentPage, x, y, text: hankoName, fontSize: 16, fontFamily: "serif", color: "#CC0000", bold: true, textAlign: "left", isStamp: true, stampName: hankoName.trim(), stampSize: hankoSize, stampShape: hankoShape };
      setElements(prev => [...prev, el]); setSelectedId(el.id);
      setIsHankoMode(false); setShowHankoPanel(false); return;
    }
    setSelectedId(null);
    setElements(prev => prev.filter(e => e.isStamp || e.isSignature || e.isImage || e.isHighlight || e.text.trim()));
  }, [step, isHighlightMode, isTextMode, isHankoMode, hitTest, getPct, pushUndo, currentPage, fontSize, fontFamily, color, bold, textAlign, hankoName, hankoSize, hankoShape, elements]);

  const handlePtrMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (hlDraw) { const { x, y } = getPct(e); setHlDraw(prev => prev ? { ...prev, ex: x, ey: y } : null); return; }
    if (!isDragging || !dragId) return;
    const { x, y } = getPct(e);
    let nx = x - dragOffset.x, ny = y - dragOffset.y;
    if (isGridSnap) { nx = Math.round(nx / 5) * 5; ny = Math.round(ny / 5) * 5; }
    nx = Math.max(0, Math.min(95, nx)); ny = Math.max(0, Math.min(95, ny));
    setElements(prev => prev.map(el => el.id === dragId ? { ...el, x: nx, y: ny } : el));
  }, [hlDraw, isDragging, dragId, dragOffset, isGridSnap, getPct]);

  const handlePtrUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (hlDraw) {
      const { x, y } = getPct(e);
      const sx = Math.min(hlDraw.sx, x), sy = Math.min(hlDraw.sy, y);
      const w = Math.abs(x - hlDraw.sx), h = Math.abs(y - hlDraw.sy);
      if (w > 0.5 && h > 0.5) {
        pushUndo();
        const el: PdfElement = { id: crypto.randomUUID(), page: currentPage, x: sx, y: sy, text: "ハイライト", fontSize: 0, fontFamily: "sans-serif", bold: false, textAlign: "left", color: highlightColor, isHighlight: true, width: w, height: h };
        setElements(prev => [...prev, el]); setSelectedId(el.id);
      }
      setHlDraw(null); return;
    }
    if (isDragging) {
      setIsDragging(false); setDragId(null);
      if (preDragSnap.current) {
        setUndoStack(prev => [...prev.slice(-49), preDragSnap.current!]);
        setRedoStack([]); preDragSnap.current = null;
      }
    }
  }, [hlDraw, isDragging, getPct, pushUndo, currentPage, highlightColor]);

  /* ── Keyboard Shortcuts ────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (step < 2) return;
      const tag = (e.target as HTMLElement).tagName;
      const inInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && !e.shiftKey && e.key === "z") { e.preventDefault(); undo(); return; }
      if (ctrl && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); return; }
      if (ctrl && e.key === "s") { e.preventDefault(); downloadPdf(); return; }
      if (!inInput && ctrl && e.key === "c") { e.preventDefault(); copySelected(); return; }
      if (!inInput && ctrl && e.key === "v") { e.preventDefault(); pasteEl(); return; }
      if (!inInput && ctrl && e.key === "d") { e.preventDefault(); if (selectedId) duplicateEl(selectedId); return; }
      if (e.key === "Escape" && inInput) {
        e.preventDefault();
        e.stopPropagation(); // block textarea's own onKeyDown from clearing selectedId
        (document.activeElement as HTMLElement)?.blur();
        return; // keep selectedId intact — user can now Ctrl+C the still-selected element
      }
      if (inInput) return;
      if (selectedId && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const _c = canvasRef.current;
      const _dW = _c ? (parseFloat(_c.style.width) || 100) : 100;
      const _dH = _c ? (parseFloat(_c.style.height) || 100) : 100;
      const _px = e.shiftKey ? 10 : 1;
      const dX = (_px / _dW) * 100;
      const dY = (_px / _dH) * 100;
        setElements(prev => prev.map(el => {
          if (el.id !== selectedId) return el;
          let { x, y } = el;
          if (e.key === "ArrowUp")    y = Math.max(0, y - dY);
          if (e.key === "ArrowDown")  y = Math.min(95, y + dY);
          if (e.key === "ArrowLeft")  x = Math.max(0, x - dX);
          if (e.key === "ArrowRight") x = Math.min(95, x + dX);
          if (isGridSnap) { x = Math.round(x/5)*5; y = Math.round(y/5)*5; }
          return { ...el, x, y };
        })); return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) { e.preventDefault(); deleteEl(selectedId); return; }
      if (e.key === "Escape") {
        setSelectedId(null); setIsTextMode(false); setIsHankoMode(false); setIsHighlightMode(false); setHlDraw(null);
        setElements(prev => prev.filter(e => e.isStamp || e.isSignature || e.isImage || e.isHighlight || e.text.trim()));
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [step, selectedId, undo, redo, copySelected, pasteEl, duplicateEl, deleteEl, isGridSnap]);

  /* ── Ctrl+Scroll Zoom ──────────────────────────────────────────────────── */
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const h = (e: WheelEvent) => {
      if (!e.ctrlKey) return; e.preventDefault();
      setZoomLevel(prev => {
        const idx = ZOOM_LEVELS.findIndex(z => z >= prev - 0.01);
        return ZOOM_LEVELS[e.deltaY < 0 ? Math.min(idx+1, ZOOM_LEVELS.length-1) : Math.max(idx-1, 0)];
      });
    };
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, []);

  /* ── Image / Signature Insertion ───────────────────────────────────────── */
  /* Auto-Save Draft */
  useEffect(() => {
    if (!pdfFile || elements.length === 0) return;
    const key = 'yamada-pdf-text-draft-' + pdfFile.name;
    try { localStorage.setItem(key, JSON.stringify({ elements, filename: pdfFile.name })); } catch {}
  }, [elements, pdfFile]);

  const handleImageInsert = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = ev => {
      pushUndo();
      setElements(prev => [...prev, { id: crypto.randomUUID(), page: currentPage, x: 10, y: 10, text: "画像", fontSize: 0, fontFamily: "sans-serif", color: "#000", bold: false, textAlign: "left", isImage: true, imageData: ev.target!.result as string, width: 25, height: 15 }]);
    };
    reader.readAsDataURL(file);
  }, [currentPage, pushUndo]);

  const handleSignatureConfirm = useCallback((url: string) => {
    pushUndo();
    setElements(prev => [...prev, { id: crypto.randomUUID(), page: currentPage, x: 10, y: 40, text: "署名", fontSize: 0, fontFamily: "sans-serif", color: "#000", bold: false, textAlign: "left", isSignature: true, imageData: url, width: 30, height: 10 }]);
    setIsSignatureMode(false);
  }, [currentPage, pushUndo]);

  /* ── Download PDF ──────────────────────────────────────────────────────── */
  const downloadPdf = useCallback(async () => {
    if (!pdfBytes || !validEls.length) { setError("テキストまたはハンコを追加してからダウンロードしてください"); return; }
    setIsDownloading(true); setMascotState("working"); setError("");
    try {
      await ensureLibs();
      const pdfLibDoc = await PDFLib.PDFDocument.load(pdfBytes);
      const n = pdfLibDoc.getPageCount();
      for (let pi = 0; pi < n; pi++) {
        const pageEls = validEls.filter(el => el.page === pi + 1);
        if (!pageEls.length) continue;
        const libPage = pdfLibDoc.getPage(pi);
        const { width: pdfW, height: pdfH } = libPage.getSize();
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        const renderScale = 2.0 * dpr;
        const pdfJsPage = await pdfDoc.getPage(pi + 1);
        const viewport = pdfJsPage.getViewport({ scale: renderScale });
        const off = document.createElement("canvas");
        off.width  = Math.round(viewport.width);
        off.height = Math.round(viewport.height);
        const octx = off.getContext("2d")!;
        octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = "high";
        await pdfJsPage.render({ canvasContext: octx, viewport }).promise;
        const scaleX = viewport.width / pdfW;
        for (const el of pageEls) {
          const cx = (el.x / 100) * viewport.width;
          const cy = (el.y / 100) * viewport.height;
          if (el.isHighlight) {
            octx.fillStyle = el.color;
            octx.fillRect(cx, cy, ((el.width??10)/100)*viewport.width, ((el.height??5)/100)*viewport.height);
          } else if (el.isSignature || el.isImage) {
            if (el.imageData) {
              const img = new Image();
              await new Promise(r => { img.onload = r; img.src = el.imageData!; });
              octx.drawImage(img, cx, cy, ((el.width??30)/100)*viewport.width, ((el.height??10)/100)*viewport.height);
            }
          } else if (el.isStamp) {
            const sp = (el.stampSize ?? 60) * scaleX;
            drawStamp(octx, el, cx + sp/2, cy + sp/2, sp);
          } else if (el.text) {
            const sz = el.fontSize * scaleX;
            octx.font = `${el.bold?"bold ":""}${sz}px ${el.fontFamily}`;
            octx.fillStyle = el.color; octx.textAlign = el.textAlign ?? "left"; octx.textBaseline = "top";
            el.text.split("\n").forEach((line, i) => octx.fillText(line, cx, cy + i * sz * 1.3));
          }
        }
        const blob = await new Promise<Blob>(r => off.toBlob(b => r(b!), "image/png", 1.0));
        const pngImg = await pdfLibDoc.embedPng(new Uint8Array(await blob.arrayBuffer()));
        libPage.drawImage(pngImg, { x: 0, y: 0, width: pdfW, height: pdfH });
      }
      const out = await pdfLibDoc.save();
      const outPageCount = pdfLibDoc.getPageCount();
      if (outPageCount !== n) console.warn(`[PDF Verify] Page count mismatch: expected ${n}, got ${outPageCount}`);
      if (out.length <= (pdfBytes?.byteLength ?? 0)) console.warn(`[PDF Verify] Output smaller than input`);
      else console.log(`[PDF Verify] OK — ${outPageCount} pages, ${out.length}B`);
      const url = URL.createObjectURL(new Blob([out], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url; a.download = (pdfFile?.name ?? "document").replace(/\.pdf$/i, "") + "_text_yamada-tools.pdf";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMascotState("success")
      triggerSuccess('text-input');; setStep(3);
    } catch (e: any) { setError("ダウンロードに失敗しました: " + (e?.message ?? e)); setMascotState("error"); }
    finally { setIsDownloading(false); }
  }, [pdfBytes, pdfDoc, pdfFile, validEls]);

  /* ── File Handlers ─────────────────────────────────────────────────────── */
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f?.type === "application/pdf") loadPdf(f); };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) loadPdf(f); };
  const exitAllModes = () => { setIsTextMode(false); setIsHankoMode(false); setIsHighlightMode(false); setHlDraw(null); };

  const pageEls = currentEls.filter(e => e.isStamp ? !!e.stampName : (e.isSignature||e.isImage) ? !!e.imageData : e.isHighlight ? (e.width??0)>0 : e.text.trim());

  /* ── JSX ───────────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl mx-auto">
{toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg pointer-events-none">
          {toastMsg}
        </div>
      )}
      {draftBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-gray-200 rounded-2xl shadow-xl p-4 w-80">
          <p className="font-bold text-gray-800 mb-1">💾 前回の作業を復元しますか？</p>
          <p className="text-xs text-gray-500 mb-3">{draftBanner.filename} — {draftBanner.elements.length}件の要素</p>
          <div className="flex gap-2">
            <button onClick={() => { pushUndo(); setElements(draftBanner.elements); setDraftBanner(null); }} className="flex-1 bg-kon hover:bg-ai text-white font-bold py-2 rounded-xl text-sm">復元</button>
            <button onClick={() => { try { localStorage.removeItem('yamada-pdf-text-draft-' + draftBanner.filename); } catch {} setDraftBanner(null); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-sm">破棄</button>
          </div>
        </div>
      )}
      {showHelp && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">⌨️ キーボードショートカット</h3>
            <table className="w-full text-sm">
              <tbody>
                {([["Ctrl+Z","元に戻す"],["Ctrl+Y","やり直す"],["Ctrl+C","コピー"],["Ctrl+V","貼り付け"],["Ctrl+D","複製"],["Delete","削除"],["↑↓←→","1px移動"],["Shift+矢印","10px移動"]] as [string,string][]).map(([k,v])=>(
                  <tr key={k} className="border-b last:border-0">
                    <td className="py-2 pr-4"><span className="font-mono bg-gray-100 rounded px-2 py-0.5 text-xs">{k}</span></td>
                    <td className="py-2 pl-3 text-gray-700">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-4 w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700" onClick={() => setShowHelp(false)}>閉じる</button>
          </div>
        </div>
      )}
      {isSignatureMode && <SignatureModal onConfirm={handleSignatureConfirm} onCancel={() => setIsSignatureMode(false)} />}
      {isPasswordOpen && (
        <PasswordDialog
          onSubmit={pwd => { setIsPasswordOpen(false); if (pendingPwdCb.current) { pendingPwdCb.current(pwd); pendingPwdCb.current = null; } }}
          onCancel={() => { setIsPasswordOpen(false); setIsLoading(false); setError("パスワード入力がキャンセルされました"); }}
        />
      )}



      <header className="text-center mb-8">
        <div className="text-5xl mb-3">✏️</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">PDFに文字入力</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">申請書・契約書・履歴書に直接テキスト＆ハンコを追加</p>
        <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料・登録不要</span>
          <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
          <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">📱 スマホ対応</span>
        </div>
      </header>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {[{n:1,label:"PDFを選択",icon:"📄"},{n:2,label:"文字・ハンコ入力",icon:"✏️"},{n:3,label:"ダウンロード",icon:"💾"}].map(s => (
          <div key={s.n} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${step>=s.n?"bg-kon text-white shadow-md":"bg-gray-200 text-gray-500"}`}>
            <span>{s.icon}</span><span>ステップ{s.n}: {s.label}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="border-4 border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gray-50 dark:bg-gray-800 hover:bg-ai transition cursor-pointer"
          onDrop={handleDrop} onDragOver={e => e.preventDefault()}
          onClick={() => !isLoading && document.getElementById("pdf-in")?.click()}>
          {isLoading ? (
            <><div className="text-6xl mb-4">⏳</div><p className="text-xl font-bold text-gray-700 mb-2">読み込み中...</p>
            <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden"><div className="h-full bg-kon rounded-full animate-pulse" style={{width:"70%"}} /></div></>
          ) : (
            <><div className="text-6xl mb-4">📄</div>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">PDFファイルをここにドロップ</p>
            <p className="text-gray-500 mb-4">または下のボタンで選択</p>
            <button className="bg-kon hover:bg-ai text-white font-bold py-4 px-10 rounded-xl text-lg shadow-lg transition transform hover:scale-105">📁 PDFを選択する</button>
            <input id="pdf-in" type="file" accept=".pdf" className="hidden" onChange={handleFile} />
            <p className="text-sm text-gray-400 mt-4">🔒 ファイルはサーバーに送信されません</p></>
          )}
        </div>
      )}

      {step >= 2 && pdfDoc && (
        <div>
          <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-2 border-gray-200 rounded-xl p-3 mb-4 shadow-lg">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => { exitAllModes(); setIsTextMode(t => !t); setShowHankoPanel(false); }}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${isTextMode?"bg-kon text-white ring-2 ring-orange-300":"bg-gray-50 text-kon hover:bg-ai"}`}>
                ➕ テキスト
              </button>
              <button onClick={() => { exitAllModes(); setShowHankoPanel(p => !p); setIsHankoMode(false); }}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${showHankoPanel||isHankoMode?"bg-danger text-white ring-2 ring-danger":"bg-gray-50 text-danger hover:bg-gray-50 border border-gray-200"}`}>
                🔴 ハンコ
              </button>
              <button onClick={() => { exitAllModes(); setIsSignatureMode(true); }}
                className="px-3 py-2 rounded-lg text-sm font-bold bg-gray-50 text-kon hover:bg-ai border border-kon whitespace-nowrap">
                ✍️ 署名
              </button>
              <label className="px-3 py-2 rounded-lg text-sm font-bold bg-gray-50 text-kon hover:bg-ai border border-gray-200 whitespace-nowrap cursor-pointer">
                🖼️ 画像
                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageInsert(f); e.target.value=""; }} />
              </label>
              <button onClick={() => { exitAllModes(); setIsHighlightMode(p => !p); }}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${isHighlightMode?"bg-yellow-400 text-yellow-900 ring-2 ring-yellow-200":"bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"}`}>
                🖍️ マーカー
              </button>
              <div className="h-6 border-l border-gray-300 mx-0.5" />
              <button onClick={undo} disabled={!undoStack.length} className="px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 hover:bg-gray-200 disabled:opacity-30 whitespace-nowrap" title="Ctrl+Z">↩ 戻す</button>
              <button onClick={redo} disabled={!redoStack.length} className="px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 hover:bg-gray-200 disabled:opacity-30 whitespace-nowrap" title="Ctrl+Shift+Z">↪ やり直す</button>
              <div className="flex-1" />
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
                <button onClick={() => setZoomLevel(prev => { const i=ZOOM_LEVELS.findIndex(z=>z>=prev-0.01); return ZOOM_LEVELS[Math.max(i-1,0)]; })} className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded font-bold text-lg leading-none">−</button>
                <span className="text-xs font-bold text-gray-600 w-10 text-center">{Math.round(zoomLevel*100)}%</span>
                <button onClick={() => setZoomLevel(prev => { const i=ZOOM_LEVELS.findIndex(z=>z>=prev-0.01); return ZOOM_LEVELS[Math.min(i+1,ZOOM_LEVELS.length-1)]; })} className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded font-bold text-lg leading-none">＋</button>
              </div>
              <button onClick={() => setIsGridSnap(p=>!p)} className={`px-2 py-2 rounded-lg text-xs font-bold transition ${isGridSnap?"bg-green-500 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`} title="グリッドスナップ">📐</button>
              <button onClick={() => setShowMinimap(p=>!p)} className={`px-2 py-2 rounded-lg text-xs font-bold transition ${showMinimap?"bg-kon text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`} title="ページマップ">🗺️</button>
              <button onClick={() => setShowHelp(true)} title="キーボードショートカット" className="px-2 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold">?</button>
              <button onClick={() => { pushUndo(); setElements([]); setSelectedId(null); }} title="全削除" className="px-2 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-danger font-bold">🗑</button>
            </div>

            {showHankoPanel && (
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                    {hankoName ? <canvas ref={hankoPreviewRef} width={64} height={64} className="w-full h-full" /> : <span className="text-gray-300 text-xs text-center leading-tight">名前を<br/>入力</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <input type="text" value={hankoName} onChange={e => setHankoName(e.target.value.slice(0,4))} placeholder="名前（1〜4文字）" maxLength={4}
                      className="border-2 border-gray-200 rounded-lg px-3 py-2 text-base font-bold w-36 focus:outline-none focus:border-danger" />
                    <select value={hankoSize} onChange={e => setHankoSize(Number(e.target.value))} className="border rounded-lg px-2 py-2 text-sm">
                      <option value={40}>小</option><option value={50}>中小</option><option value={60}>中</option><option value={80}>大</option><option value={100}>特大</option>
                    </select>
                    <select value={hankoShape} onChange={e => setHankoShape(e.target.value as StampShape)} className="border rounded-lg px-2 py-2 text-sm">
                      <option value="circle">⚪ 丸印</option><option value="square">⬜ 角印</option>
                    </select>
                    <button onClick={() => {
                      pushUndo();
                      const _now = new Date();
                      const _ds = String(_now.getMonth()+1) + '.' + String(_now.getDate());
                      const _el: PdfElement = { id: crypto.randomUUID(), page: currentPage, x: 50, y: 40, text: _ds, fontSize: 16, fontFamily: 'serif', color: '#CC0000', bold: true, textAlign: 'left', isStamp: true, stampName: _ds, stampSize: 90, stampShape: 'circle' };
                      setElements(prev => [...prev, _el]); setSelectedId(_el.id);
                    }} className="bg-kon hover:bg-ai text-white font-bold py-2 px-4 rounded-lg text-sm whitespace-nowrap">📅 日付印</button>
                    <button onClick={() => { if (!hankoName.trim()) return; setIsHankoMode(true); setIsTextMode(false); }} disabled={!hankoName.trim()}
                      className="bg-danger hover:bg-danger disabled:opacity-40 text-white font-bold py-2 px-4 rounded-lg text-sm whitespace-nowrap">📍 PDFに配置</button>
                  </div>
                </div>
                {isHankoMode && <div className="mt-2 bg-gray-50 text-danger text-sm font-bold p-2 rounded-lg text-center animate-pulse">📍 PDFの好きな場所をクリックしてハンコを配置</div>}
              </div>
            )}

            {isHighlightMode && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-bold">マーカー色:</span>
                {HIGHLIGHT_COLORS.map(c => (
                  <button key={c.value} onClick={() => setHighlightColor(c.value)}
                    className={`w-7 h-7 rounded-full border-2 transition ${highlightColor===c.value?"border-gray-200 scale-125":"border-gray-300"}`}
                    style={{backgroundColor:c.solid}} title={c.label} />
                ))}
                <span className="text-xs text-gray-400 ml-1">ドラッグしてハイライト</span>
              </div>
            )}

            {isTextEl && selectedEl && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-bold">書式:</span>
                <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="border rounded-lg px-1 py-1 text-sm font-bold">
                  {[8,9,10,11,12,14,16,18,20,24,28,32,36,48].map(s => <option key={s} value={s}>{s}pt</option>)}
                </select>
                <select value={fontFamily} onChange={e => setFontFamily(e.target.value as FontFamily)} className="border rounded-lg px-1 py-1 text-sm">
                  {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <div className="flex border rounded-lg overflow-hidden">
                  {(["left","center","right"] as TAlign[]).map(a => (
                    <button key={a} onClick={() => setTextAlign(a)} title={a==="left"?"左揃え":a==="center"?"中央":"右揃え"}
                      className={`px-2 py-1 text-sm ${textAlign===a?"bg-kon text-white":"bg-white text-gray-600 hover:bg-gray-100"}`}>
                      {a==="left"?"⬅":a==="center"?"≡":"➡"}
                    </button>
                  ))}
                </div>
                <button onClick={() => setBold(b=>!b)} className={`px-2.5 py-1 rounded-lg text-sm font-bold border-2 ${bold?"bg-kon text-white border-gray-200":"bg-white text-gray-600 border-gray-300"}`}>B</button>
                <div className="flex gap-1">
                  {COLORS.map(c => <button key={c.value} onClick={() => setColor(c.value)} className={`w-6 h-6 rounded-full border-2 transition ${color===c.value?"border-gray-200 scale-110":"border-gray-300"}`} style={{backgroundColor:c.value}} title={c.label} />)}
                </div>
                <div className="h-4 border-l border-gray-300" />
                <button onClick={() => insertDate("western")} className="px-2 py-1 bg-gray-50 text-kon rounded text-xs font-bold hover:bg-ai border border-gray-200">📅 西暦</button>
                <button onClick={() => insertDate("japanese")} className="px-2 py-1 bg-gray-50 text-kon rounded text-xs font-bold hover:bg-ai border border-gray-200">📅 令和</button>
                <div className="h-4 border-l border-gray-300" />
                <button onClick={() => duplicateEl(selectedEl.id)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-sm font-bold" title="複製 Ctrl+D">⧉</button>
                <button onClick={() => deleteEl(selectedEl.id)} className="px-2 py-1 bg-gray-50 hover:bg-gray-50 text-danger rounded text-sm font-bold" title="削除 Del">🗑</button>
              </div>
            )}

            {selectedEl?.isStamp && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-bold">ハンコ:</span>
                <span className="text-sm font-bold text-danger">{selectedEl.stampName}</span>
                <button onClick={() => duplicateEl(selectedEl.id)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-sm font-bold">⧉</button>
                <button onClick={() => deleteEl(selectedEl.id)} className="px-2 py-1 bg-gray-50 hover:bg-gray-50 text-danger rounded text-sm font-bold">🗑</button>
              </div>
            )}
          </div>

          {isTextEl && selectedEl && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-3 mb-4 flex items-start gap-3">
              <span className="text-xl mt-1">✏️</span>
              <div className="flex-1">
                <textarea autoFocus value={selectedEl.text} onChange={e => updateEl(selectedEl.id, { text: e.target.value })}
                  placeholder="テキストを入力（複数行OK）..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-kon" rows={2}
                  onKeyDown={e => { if (e.key==="Escape") { if (!selectedEl.text.trim()) deleteEl(selectedEl.id); else setSelectedId(null); } }} />
                <p className="text-xs text-gray-400 mt-1">Escで確定・矢印キーで移動{isGridSnap?" (グリッド5%)":""} ・ <span className="font-mono bg-gray-100 px-1 rounded">X:{Math.round(selectedEl.x)}% Y:{Math.round(selectedEl.y)}%</span></p>
              </div>
              <button onClick={() => deleteEl(selectedEl.id)} className="text-danger hover:text-danger text-lg">🗑️</button>
            </div>
          )}

          <div className="flex gap-2 items-start">
            {showMinimap && totalPages >= 5 && (
              <div className="flex-shrink-0 pt-1">
                <MinimapSidebar pdfDoc={pdfDoc} totalPages={totalPages} currentPage={currentPage} onSelect={setCurrentPage} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div ref={scrollRef} className="overflow-auto">
                <div ref={containerRef} className="border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-100 block w-full relative">
                  <canvas ref={canvasRef} className="block" />
                  <div ref={overlayRef} className="absolute inset-0"
                    style={{ cursor: isTextMode||isHankoMode||isHighlightMode ? "crosshair" : isDragging ? "grabbing" : "default" }}
                    onPointerDown={handlePtrDown} onPointerMove={handlePtrMove} onPointerUp={handlePtrUp}
                    onPointerLeave={e => { if (isDragging || hlDraw) handlePtrUp(e); }} />
                  {selectedEl && canvasSize.w > 0 && (
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded-lg font-mono pointer-events-none z-10">
                      X:&#8197;{Math.round(selectedEl.x / 100 * canvasSize.w)}px&#8195;Y:&#8197;{Math.round(selectedEl.y / 100 * canvasSize.h)}px
                    </div>
                  )}
                  {(isTextMode||isHankoMode) && (
                    <div className="absolute top-2 left-2 bg-kon text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg animate-pulse pointer-events-none">
                      {isTextMode?"📍 クリックしてテキストを配置":"📍 クリックしてハンコを配置"}
                    </div>
                  )}
                  {isHighlightMode && <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg pointer-events-none">🖍️ ドラッグしてハイライト</div>}
                </div>
              </div>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-3">
              <button onClick={() => setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage<=1} className="bg-gray-200 hover:bg-gray-300 disabled:opacity-40 px-4 py-2 rounded-lg font-bold">← 前</button>
              <span className="font-bold text-gray-600">{currentPage} / {totalPages} ページ</span>
              <button onClick={() => setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage>=totalPages} className="bg-gray-200 hover:bg-gray-300 disabled:opacity-40 px-4 py-2 rounded-lg font-bold">次 →</button>
            </div>
          )}

          {pageEls.length > 0 && (
            <div className="mt-3 bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500 font-bold mb-2">📝 このページの要素 ({pageEls.length}件)</div>
              <div className="space-y-1">
                {pageEls.map(el => (
                  <div key={el.id} onClick={() => setSelectedId(el.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer ${el.id===selectedId?"bg-gray-50 border-2 border-gray-200":"bg-white border border-gray-200 hover:border-ai"}`}>
                    <span className="w-4 h-4 rounded-full flex-shrink-0" style={{backgroundColor: el.isStamp?"#CC0000":el.color.startsWith("rgba")?"#FFE000":el.color}} />
                    <span className="flex-1 truncate text-gray-700">
                      {el.isStamp?`🔴 ${el.stampName}`:el.isSignature?"✍️ 署名":el.isImage?"🖼️ 画像":el.isHighlight?"🖍️ ハイライト":el.text.split("\n")[0]||"（空）"}
                    </span>
                    <span className="text-xs text-gray-400">{el.isStamp?`${el.stampSize}px`:(!el.isSignature&&!el.isImage&&!el.isHighlight)?`${el.fontSize}pt`:""}</span>
                    <button onClick={ev=>{ev.stopPropagation();duplicateEl(el.id);}} className="text-gray-400 hover:text-ai px-1 text-base" title="複製">⧉</button>
                    <button onClick={ev=>{ev.stopPropagation();deleteEl(el.id);}} className="text-danger hover:text-danger px-1" title="削除">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <button onClick={downloadPdf} disabled={isDownloading||!validEls.length}
              className="bg-kon hover:bg-ai disabled:opacity-40 text-white font-bold py-3 px-10 rounded-xl text-lg shadow-lg transition transform hover:scale-105">
              {isDownloading?"⏳ 処理中...":"💾 PDFをダウンロード"}
            </button>
          </div>

          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-sm text-kon">
            他のPDFツール →{" "}
            <Link href="/pdf/compress" className="text-kon font-bold underline hover:text-ai">PDF圧縮</Link>{" | "}
            <Link href="/pdf/merge" className="text-kon font-bold underline hover:text-ai">PDF結合</Link>{" | "}
            <Link href="/pdf/split" className="text-kon font-bold underline hover:text-ai">PDF分割</Link>
          </div>

          <div className="text-center mt-3">
            <button onClick={() => { setPdfDoc(null);setPdfFile(null);setPdfBytes(null);setElements([]);setSelectedId(null);setStep(1);setError("");exitAllModes();setShowHankoPanel(false);setShowMinimap(false);pdfCacheRef.current=null; }}
              className="text-kon hover:text-ai text-sm underline">別のPDFを読み込む</button>
          </div>
        </div>
      )}

      {error && <div className="bg-gray-50 border border-gray-200 text-danger rounded-xl p-3 mt-4 text-sm">⚠️ {error}</div>}

      <div className="mt-6">
        <Mascot state={mascotState}
          idleMessage="PDFを選んで「テキスト追加」→ PDFをクリック → 文字入力！"
          workingMessage="PDF処理中..." successMessage={step===3?"ダウンロード完了！友達にもシェアしてね♪":"PDFを読み込みました！「テキスト追加」で入力開始"}
          errorMessage="エラーが発生しました" />
        {step===3 && <ShareButtons toolName="PDFに文字入力" />}
      </div>

      {faq.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">❓ よくある質問</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50">{item.question}</summary>
                <div className="px-4 py-3 text-sm text-gray-600 border-t">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      )}

      {seoContent && (
        <div className="mt-10">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-3">📝 PDFに文字入力とは？</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{seoContent.intro}</p>
            {seoContent.useCases && (
              <div className="grid gap-3 sm:grid-cols-2">
                {seoContent.useCases.map((uc, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-gray-200">
                    <div className="font-bold text-sm text-gray-700">{uc.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{uc.desc}</div>
                  </div>
                ))}
              </div>
            )}
            {seoContent.tips && <p className="text-sm text-gray-500 mt-4 italic">{seoContent.tips}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
