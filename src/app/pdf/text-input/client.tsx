// @ts-nocheck
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import ShareButtons from "@/components/common/ShareButtons";

interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; useCases?: { title: string; desc: string }[]; tips?: string; }
interface Props { faq: FAQ[]; seoContent?: SeoContent; }

interface TextEntry {
  id: number;
  page: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  isStamp?: boolean;
  stampName?: string;
  stampSize?: number;
}

// Load libs from public/
let pdfjsLib: any = null;
let PDFDocumentLib: any = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load " + src));
    document.head.appendChild(s);
  });
}

async function ensureLibs() {
  if (!pdfjsLib) {
    await loadScript("/pdf.min.js");
    pdfjsLib = (window as any).pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }
  if (!PDFDocumentLib) {
    await loadScript("/pdf-lib.min.js");
    PDFDocumentLib = (window as any).PDFLib.PDFDocument;
  }
}

function textToImage(text: string, fontSize: number, fontFamily: string, color: string, bold: boolean): { pngBytes: Uint8Array; width: number; height: number } {
  const weight = bold ? "bold" : "normal";
  const lines = text.split("\n");
  const lineHeight = fontSize * 1.4;
  const measureCanvas = document.createElement("canvas");
  const mCtx = measureCanvas.getContext("2d")!;
  mCtx.font = `${weight} ${fontSize}px ${fontFamily}`;
  const maxWidth = Math.max(...lines.map(l => mCtx.measureText(l).width));
  const totalHeight = lines.length * lineHeight;
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(maxWidth * scale) + 4;
  canvas.height = Math.ceil(totalHeight * scale) + 4;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  lines.forEach((line, i) => { ctx.fillText(line, 0, i * lineHeight); });
  const dataUrl = canvas.toDataURL("image/png");
  const b64 = dataUrl.split(",")[1];
  const binaryStr = atob(b64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
  return { pngBytes: bytes, width: maxWidth, height: totalHeight };
}

function hankoToImage(name: string, size: number): { pngBytes: Uint8Array; width: number; height: number } {
  const scale = 3;
  const canvas = document.createElement("canvas");
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#CC0000";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
  ctx.strokeStyle = "#CC0000";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  const chars = name.split("");
  const maxChars = Math.max(chars.length, 1);
  const charSize = (size * 0.52) / maxChars;
  ctx.font = `bold ${charSize}px serif`;
  ctx.fillStyle = "#CC0000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  chars.forEach((char, i) => {
    const y = cy - ((chars.length - 1) * charSize) / 2 + i * charSize;
    ctx.fillText(char, cx, y);
  });
  const dataUrl = canvas.toDataURL("image/png");
  const b64 = dataUrl.split(",")[1];
  const binaryStr = atob(b64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
  return { pngBytes: bytes, width: size, height: size };
}

function getJapaneseDate(): string {
  const now = new Date();
  return `令和${now.getFullYear() - 2018}年${now.getMonth() + 1}月${now.getDate()}日`;
}

function getWesternDate(): string {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
}

const FONTS = [
  { value: "sans-serif", label: "ゴシック体" },
  { value: "serif", label: "明朝体" },
  { value: "monospace", label: "等幅" },
  { value: "cursive", label: "手書き風" },
];

const COLORS = [
  { value: "#000000", label: "黒" },
  { value: "#333333", label: "濃灰" },
  { value: "#0000FF", label: "青" },
  { value: "#FF0000", label: "赤" },
  { value: "#006400", label: "緑" },
  { value: "#800080", label: "紫" },
];

export default function PdfTextClient({ faq, seoContent }: Props) {
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [entries, setEntries] = useState<TextEntry[]>([]);
  const [nextId, setNextId] = useState(1);
  const [activeEntryId, setActiveEntryId] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [color, setColor] = useState("#000000");
  const [bold, setBold] = useState(false);
  const [showHankoPanel, setShowHankoPanel] = useState(false);
  const [hankoName, setHankoName] = useState("");
  const [hankoSize, setHankoSize] = useState(60);
  const [placeHankoMode, setPlaceHankoMode] = useState(false);
  const [pendingHanko, setPendingHanko] = useState<{name: string; size: number} | null>(null);
  const hankoPreviewRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // ---------- Hanko Preview ----------
  useEffect(() => {
    if (!hankoPreviewRef.current || !hankoName) return;
    const canvas = hankoPreviewRef.current;
    const size = 64;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);
    const cx = size / 2, cy = size / 2, r = size / 2 - 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = "#CC0000"; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r - 3, 0, Math.PI * 2); ctx.strokeStyle = "#CC0000"; ctx.lineWidth = 0.8; ctx.stroke();
    const chars = hankoName.split("");
    const charSize = (size * 0.52) / Math.max(chars.length, 1);
    ctx.font = `bold ${charSize}px serif`; ctx.fillStyle = "#CC0000"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    chars.forEach((char, i) => { ctx.fillText(char, cx, cy - ((chars.length - 1) * charSize) / 2 + i * charSize); });
  }, [hankoName]);

  // ---------- Keyboard Shortcuts ----------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (step < 2) return;
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        setEntries(prev => {
          const pageE = prev.filter(en => en.page === currentPage);
          if (pageE.length === 0) return prev;
          const lastId = pageE[pageE.length - 1].id;
          if (activeEntryId === lastId) setActiveEntryId(null);
          return prev.filter(en => en.id !== lastId);
        });
      }
      if (e.ctrlKey && e.key === "b") { e.preventDefault(); setBold(prev => !prev); }
      if (e.ctrlKey && e.key === "s") { e.preventDefault(); downloadPdf(); }
      if (e.key === "Escape") {
        setActiveEntryId(null); setInputMode(false); setPlaceHankoMode(false); setPendingHanko(null);
        setEntries(prev => prev.filter(en => en.isStamp ? !!en.stampName : en.text.trim() !== ""));
      }
      // Arrow keys = nudge selected element
      if (activeEntryId !== null && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 0.2; // Shift = 5x faster
        setEntries(prev => prev.map(en => {
          if (en.id !== activeEntryId) return en;
          let { x, y } = en;
          if (e.key === "ArrowUp") y = Math.max(0, y - step);
          if (e.key === "ArrowDown") y = Math.min(100, y + step);
          if (e.key === "ArrowLeft") x = Math.max(0, x - step);
          if (e.key === "ArrowRight") x = Math.min(100, x + step);
          return { ...en, x, y };
        }));
      }
      if (e.key === "Escape") {
        setActiveEntryId(null); setInputMode(false); setPlaceHankoMode(false); setPendingHanko(null);
        setEntries(prev => prev.filter(en => en.isStamp ? !!en.stampName : en.text.trim() !== ""));
      }
      // Arrow keys = nudge selected element
      if (activeEntryId !== null && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 0.2; // Shift = 5x faster
        setEntries(prev => prev.map(en => {
          if (en.id !== activeEntryId) return en;
          let { x, y } = en;
          if (e.key === "ArrowUp") y = Math.max(0, y - step);
          if (e.key === "ArrowDown") y = Math.min(100, y + step);
          if (e.key === "ArrowLeft") x = Math.max(0, x - step);
          if (e.key === "ArrowRight") x = Math.min(100, x + step);
          return { ...en, x, y };
        }));
      }
      if (e.key === "Escape") {
        setActiveEntryId(null); setInputMode(false); setPlaceHankoMode(false); setPendingHanko(null);
        setEntries(prev => prev.filter(en => en.isStamp ? !!en.stampName : en.text.trim() !== ""));
      }
      // Arrow keys = nudge selected element
      if (activeEntryId !== null && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 1 : 0.2; // Shift = 5x faster
        setEntries(prev => prev.map(en => {
          if (en.id !== activeEntryId) return en;
          let { x, y } = en;
          if (e.key === "ArrowUp") y = Math.max(0, y - step);
          if (e.key === "ArrowDown") y = Math.min(100, y + step);
          if (e.key === "ArrowLeft") x = Math.max(0, x - step);
          if (e.key === "ArrowRight") x = Math.min(100, x + step);
          return { ...en, x, y };
        }));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, currentPage, activeEntryId]);

  // ---------- PDF Load ----------
  const loadPdf = async (f: File) => {
    await ensureLibs();
    setError("");
    try {
      const buf = await f.arrayBuffer();
      const bufCopy = buf.slice(0);
      setPdfBytes(bufCopy);
      const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise;
      setPdfDoc(doc); setTotalPages(doc.numPages); setCurrentPage(1); setPdfFile(f); setEntries([]);
      setStep(2); setMascotState("success");
      setTimeout(() => setMascotState("idle"), 2000);
    } catch (e: any) {
      setError("PDFの読み込みに失敗しました: " + e.message); setMascotState("error");
    }
  };

  // ---------- Render Page ----------
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    const page = await pdfDoc.getPage(pageNum);
    const container = containerRef.current;
    const maxWidth = container ? container.clientWidth - 4 : 700;
    const origViewport = page.getViewport({ scale: 1 });
    const scale = maxWidth / origViewport.width;
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    canvas.width = viewport.width; canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    if (renderTaskRef.current) { try { renderTaskRef.current.cancel(); } catch (_e) {} }
    const task = page.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;
    try { await task.promise; } catch (e: any) { if (e?.name === "RenderingCancelledException") return; throw e; }
    drawTextsOnCanvas(ctx, pageNum, viewport.width, viewport.height);
  }, [pdfDoc, entries, activeEntryId]);

  useEffect(() => { if (pdfDoc) renderPage(currentPage); }, [pdfDoc, currentPage, renderPage]);

  // ---------- Draw Text Previews ----------
  const drawTextsOnCanvas = (ctx: CanvasRenderingContext2D, pageNum: number, cw: number, ch: number) => {
    const pageEntries = entries.filter(e => e.page === pageNum);
    for (const entry of pageEntries) {
      if (!entry.text && !entry.isStamp) continue;
      const x = (entry.x / 100) * cw;
      const y = (entry.y / 100) * ch;
      if (entry.isStamp && entry.stampName) {
        const stampPx = (entry.stampSize || 60) * (cw / 595);
        const ecx = x + stampPx / 2, ecy = y + stampPx / 2, r = stampPx / 2 - 1;
        ctx.beginPath(); ctx.arc(ecx, ecy, r, 0, Math.PI * 2); ctx.strokeStyle = "#CC0000"; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(ecx, ecy, r - 2.5, 0, Math.PI * 2); ctx.strokeStyle = "#CC0000"; ctx.lineWidth = 0.7; ctx.stroke();
        const chars = entry.stampName.split("");
        const charSize = (stampPx * 0.52) / Math.max(chars.length, 1);
        ctx.font = `bold ${charSize}px serif`; ctx.fillStyle = "#CC0000"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        chars.forEach((char, i) => { ctx.fillText(char, ecx, ecy - ((chars.length - 1) * charSize) / 2 + i * charSize); });
        ctx.textAlign = "start";
        if (entry.id === activeEntryId) { ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.strokeRect(x - 4, y - 4, stampPx + 8, stampPx + 8); ctx.setLineDash([]); }
      } else {
        if (!entry.text) continue;
        const scaledSize = entry.fontSize * (cw / 595);
        const weight = entry.bold ? "bold" : "normal";
        ctx.font = `${weight} ${scaledSize}px ${entry.fontFamily}`; ctx.fillStyle = entry.color; ctx.textBaseline = "top";
        const lines = entry.text.split("\n");
        lines.forEach((line, i) => { ctx.fillText(line, x, y + i * (scaledSize * 1.4)); });
        if (entry.id === activeEntryId) {
          const maxLineWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
          const totalHeight = lines.length * scaledSize * 1.4;
          ctx.strokeStyle = "#2563eb"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.strokeRect(x - 4, y - 4, maxLineWidth + 8, totalHeight + 8); ctx.setLineDash([]);
        }
      }
    }
  };

  // ---------- Canvas Click ----------
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || step < 2) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const clickedEntry = findEntryAt(xPct, yPct);
    if (clickedEntry) {
      setActiveEntryId(clickedEntry.id);
      if (!clickedEntry.isStamp) { setFontSize(clickedEntry.fontSize); setFontFamily(clickedEntry.fontFamily); setColor(clickedEntry.color); setBold(clickedEntry.bold); }
      return;
    }
    if (!inputMode && !placeHankoMode) {
      setActiveEntryId(null);
      setEntries(prev => prev.filter(en => en.isStamp ? !!en.stampName : en.text.trim() !== ""));
      return;
    }
    if (placeHankoMode && pendingHanko) {
      const stampEntry: TextEntry = { id: nextId, page: currentPage, x: xPct, y: yPct, text: pendingHanko.name, fontSize: 16, fontFamily: "serif", color: "#CC0000", bold: true, isStamp: true, stampName: pendingHanko.name, stampSize: pendingHanko.size };
      setEntries(prev => [...prev, stampEntry]); setActiveEntryId(nextId); setNextId(prev => prev + 1);
      setPlaceHankoMode(false); setPendingHanko(null); setShowHankoPanel(false);
      return;
    }
    setEntries(prev => prev.filter(en => en.isStamp ? !!en.stampName : en.text.trim() !== ""));
    const newEntry: TextEntry = { id: nextId, page: currentPage, x: xPct, y: yPct, text: "", fontSize, fontFamily, color, bold };
    setEntries(prev => [...prev, newEntry]); setActiveEntryId(nextId); setNextId(prev => prev + 1); setInputMode(false);
  };

  const findEntryAt = (xPct: number, yPct: number): TextEntry | null => {
    if (!canvasRef.current) return null;
    const cw = canvasRef.current.width, ch = canvasRef.current.height;
    const ctx = canvasRef.current.getContext("2d")!;
    const pageEntries = entries.filter(e => e.page === currentPage);
    for (const entry of [...pageEntries].reverse()) {
      const clickX = (xPct / 100) * cw, clickY = (yPct / 100) * ch;
      if (entry.isStamp && entry.stampName) {
        const stampPx = (entry.stampSize || 60) * (cw / 595);
        const ex = (entry.x / 100) * cw, ey = (entry.y / 100) * ch;
        if (clickX >= ex - 10 && clickX <= ex + stampPx + 10 && clickY >= ey - 10 && clickY <= ey + stampPx + 10) return entry;
      } else {
        if (!entry.text) continue;
        const ex = (entry.x / 100) * cw, ey = (entry.y / 100) * ch;
        const scaledSize = entry.fontSize * (cw / 595);
        ctx.font = `${entry.bold ? "bold" : "normal"} ${scaledSize}px ${entry.fontFamily}`;
        const lines = entry.text.split("\n");
        const maxW = Math.max(...lines.map(l => ctx.measureText(l).width));
        const totalH = lines.length * scaledSize * 1.4;
        if (clickX >= ex - 10 && clickX <= ex + maxW + 10 && clickY >= ey - 10 && clickY <= ey + totalH + 10) return entry;
      }
    }
    return null;
  };

  // ---------- Mouse Drag ----------
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || step < 2) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const entry = findEntryAt(xPct, yPct);
    if (entry) { setDragging(entry.id); setDragOffset({ x: xPct - entry.x, y: yPct - entry.y }); setActiveEntryId(entry.id); }
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging === null || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setEntries(prev => prev.map(en => en.id === dragging ? { ...en, x: xPct - dragOffset.x, y: yPct - dragOffset.y } : en));
  };
  const handleMouseUp = () => { if (dragging !== null) setDragging(null); };

  // ---------- Update Active Entry ----------
  const updateActiveEntry = (updates: Partial<TextEntry>) => {
    if (activeEntryId === null) return;
    setEntries(prev => prev.map(e => e.id === activeEntryId ? { ...e, ...updates } : e));
  };

  useEffect(() => {
    if (activeEntryId === null) return;
    const entry = entries.find(e => e.id === activeEntryId);
    if (entry && !entry.isStamp) updateActiveEntry({ fontSize, fontFamily, color, bold });
  }, [fontSize, fontFamily, color, bold]);

  const deleteEntry = (id: number) => { setEntries(prev => prev.filter(e => e.id !== id)); if (activeEntryId === id) setActiveEntryId(null); };

  const undoLast = () => {
    const pageEntries = entries.filter(e => e.page === currentPage);
    if (pageEntries.length === 0) return;
    deleteEntry(pageEntries[pageEntries.length - 1].id);
  };

  const resetAll = () => { setEntries([]); setActiveEntryId(null); setInputMode(false); setPlaceHankoMode(false); setPendingHanko(null); setShowHankoPanel(false); };

  const insertDate = (format: "western" | "japanese") => {
    const dateText = format === "japanese" ? getJapaneseDate() : getWesternDate();
    if (activeEntryId !== null) {
      const entry = entries.find(e => e.id === activeEntryId);
      if (entry) updateActiveEntry({ text: entry.text + dateText });
    }
  };

  // ---------- Download ----------
  const downloadPdf = async () => {
    const validEntries = entries.filter(e => e.isStamp ? !!e.stampName : e.text.trim());
    if (!pdfBytes || validEntries.length === 0) return;
    setIsDownloading(true); setMascotState("working");
    try {
      await ensureLibs();
      const pdfDocLib = await PDFDocumentLib.load(pdfBytes);
      const pages = pdfDocLib.getPages();
      for (const entry of validEntries) {
        const page = pages[entry.page - 1];
        if (!page) continue;
        const { width: pw, height: ph } = page.getSize();
        let pngBytes: Uint8Array, imgW: number, imgH: number;
        if (entry.isStamp && entry.stampName) {
          const stamp = hankoToImage(entry.stampName, entry.stampSize || 60);
          pngBytes = stamp.pngBytes; imgW = stamp.width; imgH = stamp.height;
        } else {
          const text = textToImage(entry.text, entry.fontSize, entry.fontFamily, entry.color, entry.bold);
          pngBytes = text.pngBytes; imgW = text.width; imgH = text.height;
        }
        const pngImage = await pdfDocLib.embedPng(pngBytes);
        const pdfX = (entry.x / 100) * pw;
        const pdfY = ph - (entry.y / 100) * ph - imgH;
        page.drawImage(pngImage, { x: pdfX, y: pdfY, width: imgW, height: imgH });
      }
      const outBytes = await pdfDocLib.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      const fileName = (pdfFile?.name || "document").replace(/\.pdf$/i, "") + "_text_yamada-tools.pdf";
      const reader = new FileReader();
      reader.onloadend = () => {
        const a = document.createElement("a");
        a.href = reader.result as string; a.download = fileName; a.style.display = "none";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      };
      reader.readAsDataURL(blob);
      setMascotState("success"); setStep(3);
    } catch (e: any) {
      setError("ダウンロードに失敗しました: " + e.message); setMascotState("error");
    } finally { setIsDownloading(false); }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f && f.type === "application/pdf") loadPdf(f); };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) loadPdf(f); };

  const activeEntry = entries.find(e => e.id === activeEntryId);
  const pageEntryCount = entries.filter(e => e.page === currentPage && (e.isStamp ? !!e.stampName : e.text.trim())).length;
  const totalEntryCount = entries.filter(e => e.isStamp ? !!e.stampName : e.text.trim()).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-gray-500">
          <li><a href="/" className="hover:text-orange-600">ホーム</a></li>
          <li>/</li>
          <li><a href="/pdf" className="hover:text-orange-600">PDFツール</a></li>
          <li>/</li>
          <li className="text-orange-600 font-medium">PDFに文字入力</li>
        </ol>
      </nav>
      <header className="text-center mb-8">
        <div className="text-5xl mb-4">✏️</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">PDFに文字入力</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">申請書・契約書・履歴書に直接テキスト＆ハンコを追加</p>
        <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料・登録不要</span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
          <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">📱 スマホ対応</span>
        </div>
      </header>
      {/* Step Indicators */}
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {[
          { num: 1, label: "PDFを選択", icon: "📄" },
          { num: 2, label: "文字・ハンコ入力", icon: "✏️" },
          { num: 3, label: "ダウンロード", icon: "💾" },
        ].map(s => (
          <div key={s.num} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            step >= s.num ? "bg-orange-500 text-white shadow-md" : "bg-gray-200 text-gray-500"
          }`}>
            <span className="text-lg">{s.icon}</span>
            <span>ステップ{s.num}: {s.label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div
          className="border-4 border-dashed border-orange-300 rounded-2xl p-12 text-center bg-orange-50 hover:bg-orange-100 transition cursor-pointer"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => document.getElementById("pdf-input")?.click()}
        >
          <div className="text-6xl mb-4">📄</div>
          <p className="text-xl font-bold text-gray-700 mb-2">PDFファイルをここにドロップ</p>
          <p className="text-gray-500 mb-4">または下のボタンで選択</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-xl text-lg shadow-lg transition transform hover:scale-105">
            📁 PDFを選択する
          </button>
          <input id="pdf-input" type="file" accept=".pdf" className="hidden" onChange={handleFileInput} />
          <p className="text-sm text-gray-400 mt-4">🔒 ファイルはサーバーに送信されません（ブラウザ内で安全に処理）</p>
        </div>
      )}

      {/* Step 2: Edit */}
      {step >= 2 && pdfDoc && (
        <div>
          {/* ===== TOOLBAR ===== */}
          <div className="sticky top-0 z-50 bg-white border-2 border-orange-200 rounded-xl p-3 mb-4 shadow-md" style={{ position: "sticky", top: 0 }}>
            {/* Row 1: Main action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  const next = !inputMode;
                  setInputMode(next); setPlaceHankoMode(false); setPendingHanko(null);
                  if (next) { setEntries(prev => prev.filter(en => en.isStamp ? !!en.stampName : en.text.trim() !== "")); setActiveEntryId(null); setShowHankoPanel(false); }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  inputMode ? "bg-orange-500 text-white shadow-md ring-2 ring-orange-300" : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
              >
                {inputMode ? "✏️ テキスト配置モード" : "➕ テキスト追加"}
              </button>

              <button
                onClick={() => { const next = !showHankoPanel; setShowHankoPanel(next); setPlaceHankoMode(false); setPendingHanko(null); if (next) setInputMode(false); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  showHankoPanel || placeHankoMode ? "bg-red-500 text-white shadow-md ring-2 ring-red-300" : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                }`}
              >
                🔴 ハンコ追加
              </button>

              {activeEntryId !== null && !activeEntry?.isStamp && (
                <>
                  <button onClick={() => insertDate("western")} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-200 whitespace-nowrap">📅 西暦</button>
                  <button onClick={() => insertDate("japanese")} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-200 whitespace-nowrap">📅 令和</button>
                </>
              )}

              <div className="flex-1" />

              <button onClick={undoLast} disabled={entries.filter(e => e.page === currentPage).length === 0}
                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-gray-600 font-bold py-2 px-3 rounded-lg text-sm transition whitespace-nowrap" title="Ctrl+Z">
                ↩ 戻す
              </button>
              <button onClick={resetAll} disabled={entries.length === 0}
                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-red-500 font-bold py-2 px-3 rounded-lg text-sm transition whitespace-nowrap">
                🗑
              </button>
            </div>

            {/* Hanko Panel (compact) */}
            {showHankoPanel && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-shrink-0 bg-white rounded-lg border border-red-200 flex items-center justify-center" style={{ width: 72, height: 72 }}>
                    {hankoName ? <canvas ref={hankoPreviewRef} width={64} height={64} /> : <span className="text-gray-300 text-xs text-center">名前を<br/>入力</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                    <input type="text" value={hankoName} onChange={e => setHankoName(e.target.value.slice(0, 4))}
                      placeholder="名前（1〜4文字）" className="border-2 border-red-300 rounded-lg px-3 py-2 text-base font-bold w-40 focus:outline-none focus:border-red-500" maxLength={4} />
                    <select value={hankoSize} onChange={e => setHankoSize(Number(e.target.value))} className="border rounded-lg px-2 py-2 text-sm">
                      <option value={40}>小</option><option value={50}>中小</option><option value={60}>中</option><option value={80}>大</option><option value={100}>特大</option>
                    </select>
                    <button
                      onClick={() => { if (!hankoName.trim()) return; setPendingHanko({ name: hankoName.trim(), size: hankoSize }); setPlaceHankoMode(true); setInputMode(false); setActiveEntryId(null); }}
                      disabled={!hankoName.trim()}
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white font-bold py-2 px-5 rounded-lg text-sm transition whitespace-nowrap"
                    >📍 PDFに配置</button>
                  </div>
                </div>
                {placeHankoMode && (
                  <div className="mt-2 bg-red-100 text-red-700 text-sm font-bold p-2 rounded-lg text-center animate-pulse">
                    📍 PDFの好きな場所をクリックしてハンコを配置
                  </div>
                )}
              </div>
            )}

            {/* Row 2: Formatting (only when text entry selected) */}
            {activeEntry && !activeEntry.isStamp && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-bold">書式:</span>
                <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="border rounded-lg px-1 py-1.5 text-sm font-bold">
                  {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map(s => <option key={s} value={s}>{s}pt</option>)}
                </select>
                <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="border rounded-lg px-1 py-1.5 text-sm">
                  {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <div className="flex gap-1 items-center">
                  {COLORS.map(c => (
                    <button key={c.value} onClick={() => setColor(c.value)}
                      className={`w-6 h-6 rounded-full border-2 transition ${color === c.value ? "border-orange-500 scale-110" : "border-gray-300"}`}
                      style={{ backgroundColor: c.value }} title={c.label} />
                  ))}
                </div>
                <button onClick={() => setBold(!bold)}
                  className={`px-2.5 py-1.5 rounded-lg text-sm font-bold border-2 transition ${bold ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-300"}`}>
                  B
                </button>
              </div>
            )}
          </div>

          {/* Text Input Area */}
          {activeEntry && !activeEntry.isStamp && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 mb-4 flex items-start gap-3">
              <span className="text-xl mt-1">✏️</span>
              <div className="flex-1">
                <textarea autoFocus value={activeEntry.text} onChange={e => updateActiveEntry({ text: e.target.value })}
                  placeholder="テキストを入力（複数行OK）..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-400" rows={2}
                  onKeyDown={e => {
                    if (e.key === "Escape") { if (!activeEntry.text.trim()) deleteEntry(activeEntry.id); else setActiveEntryId(null); setInputMode(false); }
                  }} />
                <p className="text-xs text-gray-400 mt-1">Escで確定 ・ ドラッグまたは矢印キーで移動 ・ <span className="font-mono bg-gray-100 px-1 rounded">X:{Math.round(activeEntry.x)}% Y:{Math.round(activeEntry.y)}%</span></p>
              </div>
              <button onClick={() => deleteEntry(activeEntry.id)} className="text-red-500 hover:text-red-700 text-lg px-2" title="削除">🗑️</button>
            </div>
          )}

          {/* PDF Canvas */}
          <div ref={containerRef} className="border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-100 relative">
            <canvas ref={canvasRef}
              className={`block mx-auto ${inputMode || placeHankoMode ? "cursor-crosshair" : "cursor-default"}`}
              onClick={handleCanvasClick} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} />
            {inputMode && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg animate-pulse">📍 クリックしてテキストを配置</div>
            )}
            {placeHankoMode && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg animate-pulse">🔴 クリックしてハンコを配置</div>
            )}
          </div>

          {/* Page Navigation */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-3">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-40 px-4 py-2 rounded-lg font-bold">← 前</button>
              <span className="font-bold text-gray-600">{currentPage} / {totalPages} ページ</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-40 px-4 py-2 rounded-lg font-bold">次 →</button>
            </div>
          )}

          {/* Entry List */}
          {pageEntryCount > 0 && (
            <div className="mt-3 bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500 font-bold mb-2">📝 このページの入力 ({pageEntryCount}件)</div>
              <div className="space-y-1">
                {entries.filter(e => e.page === currentPage && (e.isStamp ? !!e.stampName : e.text.trim())).map(entry => (
                  <div key={entry.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                    entry.id === activeEntryId ? "bg-blue-100 border border-blue-300" : "bg-white border border-gray-200"}`}>
                    <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: entry.isStamp ? "#CC0000" : entry.color }} />
                    <span className="flex-1 truncate cursor-pointer" onClick={() => {
                      setActiveEntryId(entry.id);
                      if (!entry.isStamp) { setFontSize(entry.fontSize); setFontFamily(entry.fontFamily); setColor(entry.color); setBold(entry.bold); }
                    }}>
                      {entry.isStamp ? `🔴 ${entry.stampName}` : entry.text.split("\n")[0]}
                    </span>
                    <span className="text-xs text-gray-400">{entry.isStamp ? `${entry.stampSize}px` : `${entry.fontSize}pt`}</span>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-400 hover:text-red-600">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download */}
          <div className="flex justify-center mt-4">
            <button onClick={downloadPdf} disabled={isDownloading || totalEntryCount === 0}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold py-3 px-10 rounded-xl text-lg shadow-lg transition transform hover:scale-105">
              {isDownloading ? "⏳ 処理中..." : "💾 PDFをダウンロード"}
            </button>
          </div>

          {/* Cross-promote */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <p className="text-sm text-amber-700">
              他のPDFツール →{" "}
              <Link href="/pdf/compress" className="text-orange-600 font-bold underline hover:text-orange-800">PDF圧縮</Link>{" | "}
              <Link href="/pdf/merge" className="text-orange-600 font-bold underline hover:text-orange-800">PDF結合</Link>{" | "}
              <Link href="/pdf/split" className="text-orange-600 font-bold underline hover:text-orange-800">PDF分割</Link>
            </p>
          </div>

          <div className="text-center mt-3">
            <button onClick={() => {
              setPdfDoc(null); setPdfFile(null); setPdfBytes(null); setEntries([]); setActiveEntryId(null);
              setStep(1); setError(""); setInputMode(false); setPlaceHankoMode(false); setPendingHanko(null); setShowHankoPanel(false);
            }} className="text-orange-500 hover:text-orange-700 text-sm underline">別のPDFを読み込む</button>
          </div>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mt-4 text-sm">⚠️ {error}</div>}

      <div className="mt-6">
        <Mascot state={mascotState}
          idleMessage="PDFを選んで「テキスト追加」→ PDFをクリック → 文字入力！"
          workingMessage="PDF処理中..."
          successMessage={step === 3 ? "ダウンロード完了！友達にもシェアしてね♪" : "PDFを読み込みました！「テキスト追加」で入力開始"}
          errorMessage="エラーが発生しました" />
        {step === 3 && <ShareButtons toolName="PDFに文字入力" />}
      </div>

      {faq.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">❓ よくある質問</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer font-bold text-gray-700 hover:bg-gray-50">{item.question}</summary>
                <div className="px-4 py-3 text-sm text-gray-600 border-t">{item.answer}</div>
              </details>
            ))}
          </div>
        </div>
      )}

      {seoContent && (
        <div className="mt-10">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-3">📝 PDFに文字入力とは？</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{seoContent.intro}</p>
            {seoContent.useCases && (
              <div className="grid gap-3 sm:grid-cols-2">
                {seoContent.useCases.map((uc, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-orange-100">
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
