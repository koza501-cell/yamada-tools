// @ts-nocheck
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { LazyFAQ } from "@/components/common/LazyFAQ";
import Mascot from "@/components/common/Mascot";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ { question: string; answer: string; }
interface Props { faq: FAQ[]; seoContent?: { intro: string }; }

const RELATED_TOOLS = [
  { emoji: "🔄", label: "画像回転", href: "/image/rotate", desc: "画像を任意の角度に回転" },
  { emoji: "✂️", label: "リサイズ", href: "/image/resize", desc: "画像のサイズを変更" },
  { emoji: "🖼️", label: "圧縮", href: "/image/compress", desc: "画像ファイルを軽量化" },
  { emoji: "📄", label: "PDF変換", href: "/image/to-pdf", desc: "画像をPDFに変換" },
];

const MIME = { PNG: "image/png", JPG: "image/jpeg", WebP: "image/webp" };
const INIT_TRANSFORM = { flipH: false, flipV: false, rotation: 0 };
const norm = (deg) => ((Math.round(deg) % 360) + 360) % 360;

const RESIZE_PRESETS = [
  { label: "オリジナル", w: null, h: null },
  { label: "1920×1080", w: 1920, h: 1080 },
  { label: "1280×720",  w: 1280, h: 720  },
  { label: "800×600",   w: 800,  h: 600  },
  { label: "カスタム",  w: null, h: null },
];

const formatBytes = (bytes) => {
  if (bytes == null) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function FlipClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  // ── Single-image state ────────────────────────────────────────────────
  const [image, setImage] = useState(null);
  const [mascotState, setMascotState] = useState("idle");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [angleInput, setAngleInput] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [outputFormat, setOutputFormat] = useState("PNG");
  const [quality, setQuality] = useState(92);
  const [estSize, setEstSize] = useState(null);
  const [copyToast, setCopyToast] = useState(false);
  const [undoStack, setUndoStack] = useState({ history: [INIT_TRANSFORM], index: 0 });
  const canvasRef = useRef(null);
  const originalRef = useRef(null);

  // ── Batch mode state ──────────────────────────────────────────────────
  const [batchMode, setBatchMode] = useState(false);
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchProgress, setBatchProgress] = useState(null);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchIsDragging, setBatchIsDragging] = useState(false);

  // ── Comparison slider state ───────────────────────────────────────────
  const [compareMode, setCompareMode] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [processedDataUrl, setProcessedDataUrl] = useState(null);
  const compareRef = useRef(null);
  const isDraggingSlider = useRef(false);

  // ── Resize state ──────────────────────────────────────────────────────
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [resizeW, setResizeW] = useState(0);
  const [resizeH, setResizeH] = useState(0);
  const [resizeLocked, setResizeLocked] = useState(true);
  const [resizePreset, setResizePreset] = useState("オリジナル");

  // ── JSZip CDN loader ──────────────────────────────────────────────────
  const jszipLoaded = useRef(false);
  const [jszipLoading, setJszipLoading] = useState(false);
  const loadJSZip = (): Promise<void> => new Promise((resolve) => {
    if (jszipLoaded.current || (window as any).JSZip) { jszipLoaded.current = true; resolve(); return; }
    setJszipLoading(true);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = () => { jszipLoaded.current = true; setJszipLoading(false); resolve(); };
    document.head.appendChild(script);
  });

  // ── Comparison slider global drag listeners ───────────────────────────
  useEffect(() => {
    const move = (clientX) => {
      if (!isDraggingSlider.current || !compareRef.current) return;
      const rect = compareRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      setSliderPos(pos);
    };
    const onMouseMove = (e) => move(e.clientX);
    const onMouseUp = () => { isDraggingSlider.current = false; };
    const onTouchMove = (e) => { if (e.touches[0]) move(e.touches[0].clientX); };
    const onTouchEnd = () => { isDraggingSlider.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const canUndo = undoStack.index > 0;
  const canRedo = undoStack.index < undoStack.history.length - 1;

  // ── History helpers ───────────────────────────────────────────────────
  const pushHistory = (newState) => {
    setUndoStack(prev => {
      const trimmed = prev.history.slice(0, prev.index + 1);
      return { history: [...trimmed, newState], index: prev.index + 1 };
    });
  };

  const undoAction = () => {
    if (!canUndo) return;
    const newIndex = undoStack.index - 1;
    const s = undoStack.history[newIndex];
    setFlipH(s.flipH); setFlipV(s.flipV); setRotation(s.rotation); setAngleInput(s.rotation);
    setUndoStack(prev => ({ ...prev, index: newIndex }));
  };

  const redoAction = () => {
    if (!canRedo) return;
    const newIndex = undoStack.index + 1;
    const s = undoStack.history[newIndex];
    setFlipH(s.flipH); setFlipV(s.flipV); setRotation(s.rotation); setAngleInput(s.rotation);
    setUndoStack(prev => ({ ...prev, index: newIndex }));
  };

  const resetTransforms = () => {
    setFlipH(false); setFlipV(false); setRotation(0); setAngleInput(0);
    setUndoStack({ history: [INIT_TRANSFORM], index: 0 });
  };

  // ── Transform action handlers ─────────────────────────────────────────
  const handleFlipH = () => {
    const ns = { flipH: !flipH, flipV, rotation };
    setFlipH(ns.flipH);
    pushHistory(ns);
  };

  const handleFlipV = () => {
    const ns = { flipH, flipV: !flipV, rotation };
    setFlipV(ns.flipV);
    pushHistory(ns);
  };

  const handleRotate = (delta) => {
    const newRot = norm(rotation + delta);
    setRotation(newRot); setAngleInput(newRot);
    pushHistory({ flipH, flipV, rotation: newRot });
  };

  const handleAngleChange = (val) => {
    const newRot = norm(Number(val));
    setAngleInput(Number(val)); setRotation(newRot);
    pushHistory({ flipH, flipV, rotation: newRot });
  };

  // ── Image loading ─────────────────────────────────────────────────────
  const loadImage = (file) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setFileSize(file.size);
    setMascotState("working");
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalRef.current = img;
        setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
        setImage(e.target.result);
        setThumbnailUrl(e.target.result);
        setFlipH(false); setFlipV(false); setRotation(0); setAngleInput(0);
        setUndoStack({ history: [INIT_TRANSFORM], index: 0 });
        setResizeW(img.naturalWidth);
        setResizeH(img.naturalHeight);
        setResizePreset("オリジナル");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Ctrl+V paste (single mode only)
  useEffect(() => {
    const handlePaste = (e) => {
      if (image || batchMode) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) { loadImage(item.getAsFile()); break; }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [image, batchMode]);

  // ── Canvas transform ──────────────────────────────────────────────────
  const applyTransform = useCallback(() => {
    if (!originalRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = originalRef.current;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (rotation === 0) {
      canvas.width = w; canvas.height = h;
      ctx.save();
      ctx.translate(flipH ? w : 0, flipV ? h : 0);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    } else {
      const rad = (rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const newW = Math.round(w * cos + h * sin);
      const newH = Math.round(w * sin + h * cos);
      canvas.width = newW; canvas.height = newH;
      ctx.save();
      ctx.translate(newW / 2, newH / 2);
      ctx.rotate(rad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -w / 2, -h / 2);
      ctx.restore();
    }
  }, [flipH, flipV, rotation]);

  useEffect(() => { if (image) applyTransform(); }, [image, applyTransform]);

  // Update estSize and processedDataUrl after canvas transform
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const mime = MIME[outputFormat];
    const q = outputFormat === "PNG" ? undefined : quality / 100;
    const dataUrl = canvasRef.current.toDataURL(mime, q);
    const base64 = dataUrl.split(",")[1] || "";
    setEstSize(Math.round(base64.length * 0.75));
    setProcessedDataUrl(canvasRef.current.toDataURL("image/png"));
  }, [image, flipH, flipV, rotation, outputFormat, quality]);

  // ── Resize helpers ────────────────────────────────────────────────────
  const getOriginalAspect = () => dimensions.w && dimensions.h ? dimensions.w / dimensions.h : 1;

  const handleResizeW = (val) => {
    const w = parseInt(val) || 0;
    setResizeW(w);
    if (resizeLocked && w > 0) setResizeH(Math.round(w / getOriginalAspect()));
    setResizePreset("カスタム");
  };

  const handleResizeH = (val) => {
    const h = parseInt(val) || 0;
    setResizeH(h);
    if (resizeLocked && h > 0) setResizeW(Math.round(h * getOriginalAspect()));
    setResizePreset("カスタム");
  };

  const handleResizePreset = (label) => {
    setResizePreset(label);
    const preset = RESIZE_PRESETS.find(p => p.label === label);
    if (!preset || !preset.w) {
      if (label === "オリジナル" && dimensions.w) { setResizeW(dimensions.w); setResizeH(dimensions.h); }
      return;
    }
    if (resizeLocked && dimensions.w && dimensions.h) {
      const ratio = getOriginalAspect();
      const pr = preset.w / preset.h;
      if (ratio > pr) { setResizeW(preset.w); setResizeH(Math.round(preset.w / ratio)); }
      else             { setResizeH(preset.h); setResizeW(Math.round(preset.h * ratio)); }
    } else {
      setResizeW(preset.w); setResizeH(preset.h);
    }
  };

  const toggleResizeLock = () => {
    const next = !resizeLocked;
    setResizeLocked(next);
    if (next && resizeW > 0) setResizeH(Math.round(resizeW / getOriginalAspect()));
  };

  const applyResizeToCanvas = (srcCanvas) => {
    if (!resizeEnabled || resizeW <= 0 || resizeH <= 0) return srcCanvas;
    const dst = document.createElement("canvas");
    dst.width = resizeW; dst.height = resizeH;
    dst.getContext("2d").drawImage(srcCanvas, 0, 0, resizeW, resizeH);
    return dst;
  };

  // Output dimensions for label below preview
  const getCanvasDims = () => {
    if (!dimensions.w) return null;
    const { w, h } = dimensions;
    if (rotation === 0 || rotation === 180) return { w, h };
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad)); const sin = Math.abs(Math.sin(rad));
    return { w: Math.round(w * cos + h * sin), h: Math.round(w * sin + h * cos) };
  };
  const outputDims = resizeEnabled && resizeW > 0 ? { w: resizeW, h: resizeH } : getCanvasDims();

  // ── Output actions ────────────────────────────────────────────────────
  const download = () => {
    setMascotState("success")
      triggerSuccess('flip');;
    if (!canvasRef.current) return;
    const finalCanvas = applyResizeToCanvas(canvasRef.current);
    const mime = MIME[outputFormat];
    const q = outputFormat === "PNG" ? undefined : quality / 100;
    const ext = outputFormat.toLowerCase();
    const a = document.createElement("a");
    a.download = fileName.replace(/\.[^.]+$/, "") + `_flip_yamada-tools.${ext}`;
    a.href = finalCanvas.toDataURL(mime, q);
    a.click();
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopyToast(true);
        setTimeout(() => setCopyToast(false), 2000);
      }, "image/png");
    } catch { /* not supported */ }
  };

  const reset = () => {
    setImage(null); setFileName(""); setFileSize(0);
    setDimensions({ w: 0, h: 0 }); setThumbnailUrl("");
    setFlipH(false); setFlipV(false); setRotation(0); setAngleInput(0);
    setEstSize(null); setProcessedDataUrl(null);
    setUndoStack({ history: [INIT_TRANSFORM], index: 0 });
    setCompareMode(false); setSliderPos(50);
    setResizeEnabled(false); setResizeW(0); setResizeH(0); setResizePreset("オリジナル");
  };

  // ── Process one file for batch (creates its own canvas) ───────────────
  const processFileBlob = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const w = img.naturalWidth; const h = img.naturalHeight;
        if (rotation === 0) {
          canvas.width = w; canvas.height = h;
          ctx.save();
          ctx.translate(flipH ? w : 0, flipV ? h : 0);
          ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
          ctx.drawImage(img, 0, 0); ctx.restore();
        } else {
          const rad = (rotation * Math.PI) / 180;
          const cos = Math.abs(Math.cos(rad)); const sin = Math.abs(Math.sin(rad));
          const nW = Math.round(w * cos + h * sin); const nH = Math.round(w * sin + h * cos);
          canvas.width = nW; canvas.height = nH;
          ctx.save(); ctx.translate(nW / 2, nH / 2); ctx.rotate(rad);
          ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
          ctx.drawImage(img, -w / 2, -h / 2); ctx.restore();
        }
        let finalCanvas = canvas;
        if (resizeEnabled && resizeW > 0 && resizeH > 0) {
          finalCanvas = document.createElement("canvas");
          finalCanvas.width = resizeW; finalCanvas.height = resizeH;
          finalCanvas.getContext("2d").drawImage(canvas, 0, 0, resizeW, resizeH);
        }
        const mime = MIME[outputFormat];
        const q = outputFormat === "PNG" ? undefined : quality / 100;
        finalCanvas.toBlob(resolve, mime, q);
      };
      img.src = e.target.result as string;
    };
    reader.readAsDataURL(file);
  });

  const downloadBatchZip = async () => {
    if (batchFiles.length === 0) return;
    if (!window.JSZip) { alert("JSZip の読み込み中です。少し待ってから再度お試しください。"); return; }
    setBatchProcessing(true);
    const zip = new window.JSZip();
    const ext = outputFormat.toLowerCase();
    for (let i = 0; i < batchFiles.length; i++) {
      setBatchProgress(`${i + 1}/${batchFiles.length} 処理中...`);
      const { file, name } = batchFiles[i];
      const blob = await processFileBlob(file);
      zip.file(name.replace(/\.[^.]+$/, "") + `_flipped.${ext}`, blob);
    }
    setBatchProgress("ZIP作成中...");
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.download = "yamada_flip_batch.zip";
    a.href = URL.createObjectURL(zipBlob);
    a.click();
    URL.revokeObjectURL(a.href);
    setBatchProgress(null);
    setBatchProcessing(false);
  };

  // ── Batch file handlers ───────────────────────────────────────────────
  const addBatchFiles = (files) => {
    const newItems = Array.from(files)
      .filter((f: File) => f.type.startsWith("image/"))
      .map((f: File) => ({ id: Math.random().toString(36).slice(2), file: f, name: f.name, size: f.size }));
    setBatchFiles(prev => [...prev, ...newItems]);
  };

  const removeBatchFile = (id) => setBatchFiles(prev => prev.filter(f => f.id !== id));

  const toggleBatchMode = async () => {
    if (!batchMode) {
      await loadJSZip();
    }
    setBatchMode(prev => !prev);
    setBatchFiles([]); setBatchProgress(null); setBatchProcessing(false);
    if (image) reset();
  };

  // ── Status label ──────────────────────────────────────────────────────
  const statusParts = [];
  if (flipH) statusParts.push("左右反転");
  if (flipV) statusParts.push("上下反転");
  if (rotation !== 0) statusParts.push(`${rotation}°回転`);
  const statusText = statusParts.length > 0 ? `適用中: ${statusParts.join(" + ")}` : "変換なし";

  const btnBase = "px-4 py-2 rounded-xl font-bold text-sm transition-all";
  const btnNormal = `${btnBase} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600`;
  const btnDisabled = `${btnBase} bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed`;

  // ── Shared resize UI panel ────────────────────────────────────────────
  const ResizePanel = () => (
    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
      <label className="flex items-center gap-2 cursor-pointer mb-3">
        <input type="checkbox" checked={resizeEnabled} onChange={e => setResizeEnabled(e.target.checked)} className="accent-kon w-4 h-4" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">リサイズ</span>
      </label>
      {resizeEnabled && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 w-6">幅</span>
              <input type="number" min={1} max={9999} value={resizeW} onChange={e => handleResizeW(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" />
              <span className="text-xs text-gray-400">px</span>
            </div>
            <button onClick={toggleResizeLock}
              className={`px-2 py-1 rounded-lg text-sm border transition-colors ${resizeLocked ? "bg-kon text-white border-kon" : "bg-white dark:bg-gray-700 text-gray-500 border-gray-300 dark:border-gray-600"}`}
              title={resizeLocked ? "縦横比ロック中" : "縦横比ロック解除"}>
              {resizeLocked ? "🔒" : "🔓"}
            </button>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 w-6">高さ</span>
              <input type="number" min={1} max={9999} value={resizeH} onChange={e => handleResizeH(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" />
              <span className="text-xs text-gray-400">px</span>
            </div>
          </div>
          <select value={resizePreset} onChange={e => handleResizePreset(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            {RESIZE_PRESETS.map(p => <option key={p.label} value={p.label}>{p.label}{p.w ? ` (${p.w}×${p.h})` : ""}</option>)}
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔄</div>
          <h1 className="text-3xl font-bold text-kon mb-2">画像反転（左右・上下）</h1>
          <p className="text-gray-600 text-lg">写真を水平反転・垂直反転・回転</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <Mascot state={mascotState} />

          {/* ── Batch mode toggle (always visible) ── */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleBatchMode}
              disabled={jszipLoading}
              aria-pressed={batchMode}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${
                batchMode
                  ? "bg-kon text-white border-kon shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-kon hover:text-kon"
              }`}
            >
              {jszipLoading ? "読み込み中..." : `📦 まとめて処理 ${batchMode ? "ON" : "OFF"}`}
            </button>
          </div>

          {/* ════════ BATCH MODE ════════ */}
          {batchMode && (
            <div>
              {/* Batch upload zone */}
              <div
                onDrop={(e) => { e.preventDefault(); setBatchIsDragging(false); addBatchFiles(e.dataTransfer.files); }}
                onDragOver={(e) => { e.preventDefault(); setBatchIsDragging(true); }}
                onDragLeave={() => setBatchIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer mb-4 transition-colors ${
                  batchIsDragging ? "border-kon bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600 hover:border-kon dark:hover:border-blue-400"
                }`}
                onClick={() => document.getElementById("batch-upload")?.click()}
              >
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg font-bold">複数の画像をドラッグ＆ドロップ</p>
                <button className="px-8 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors text-lg">
                  📁 画像を選択（複数可）
                </button>
                <input
                  id="batch-upload" type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => { if (e.target.files) addBatchFiles(e.target.files); e.target.value = ""; }}
                />
                <p className="text-sm text-gray-400 mt-4">JPG, PNG, WebP, BMP, GIF対応 | 複数ファイル選択可</p>
              </div>

              {/* Batch file list */}
              {batchFiles.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    選択中のファイル ({batchFiles.length}件)
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {batchFiles.map(({ id, name, size }) => (
                      <div key={id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-700">
                        <span className="text-lg flex-shrink-0">🖼️</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{name}</p>
                          <p className="text-xs text-gray-400">{formatBytes(size)}</p>
                        </div>
                        <button
                          onClick={() => removeBatchFile(id)}
                          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors font-bold text-xs"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transform settings for batch */}
              {batchFiles.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3">適用する変換設定（全ファイル共通）</p>
                  <div className="flex justify-center gap-4 mb-4">
                    <button onClick={handleFlipH} aria-pressed={flipH} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${flipH ? "bg-kon text-white shadow-md" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                      ↔️ 水平反転 {flipH ? "ON" : "OFF"}
                    </button>
                    <button onClick={handleFlipV} aria-pressed={flipV} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${flipV ? "bg-kon text-white shadow-md" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                      ↕️ 垂直反転 {flipV ? "ON" : "OFF"}
                    </button>
                  </div>
                  <div className="flex justify-center gap-3 mb-3">
                    <button onClick={() => handleRotate(-90)} className={btnNormal}>↩️ 90°左</button>
                    <button onClick={() => handleRotate(90)}  className={btnNormal}>↪️ 90°右</button>
                    <button onClick={() => handleRotate(180)} className={btnNormal}>🔄 180°</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 dark:text-gray-300 flex-shrink-0">📐 角度:</span>
                    <input type="number" min={0} max={360} step={1} value={angleInput}
                      onChange={(e) => handleAngleChange(e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" />
                    <input type="range" min={0} max={360} step={1} value={angleInput}
                      onChange={(e) => handleAngleChange(e.target.value)}
                      className="flex-1 accent-kon" />
                    <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">{rotation}°</span>
                  </div>
                  <div className={`text-center text-xs px-3 py-2 rounded-lg mt-3 font-medium ${statusParts.length > 0 ? "bg-kon/10 text-kon dark:text-blue-300" : "bg-gray-100 dark:bg-gray-700/30 text-gray-400"}`}>
                    {statusText}
                  </div>
                </div>
              )}

              {/* Output format + resize for batch */}
              {batchFiles.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3">出力設定</p>
                  <div className="flex gap-3 mb-3">
                    {["PNG", "JPG", "WebP"].map(fmt => (
                      <label key={fmt} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="batchOutputFormat" value={fmt} checked={outputFormat === fmt} onChange={() => setOutputFormat(fmt)} className="accent-kon" />
                        <span className="text-sm text-gray-700 dark:text-gray-200">{fmt}</span>
                      </label>
                    ))}
                  </div>
                  {outputFormat !== "PNG" && (
                    <div className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">品質</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{quality}</span>
                      </div>
                      <input type="range" min={1} max={100} step={1} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-kon" />
                    </div>
                  )}
                  <ResizePanel />
                </div>
              )}

              {/* Batch download button */}
              {batchFiles.length > 0 && (
                <div className="space-y-2">
                  {batchProgress && (
                    <div className="text-center text-sm font-medium text-kon dark:text-blue-300 bg-kon/10 px-4 py-2 rounded-xl">
                      <span aria-live="polite">⏳ {batchProgress}</span>
                    </div>
                  )}
                  <button
                    onClick={downloadBatchZip}
                    disabled={batchProcessing}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                      batchProcessing
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg"
                    }`}
                  >
                    {batchProcessing ? "⏳ 処理中..." : `📦 まとめてダウンロード (ZIP) — ${batchFiles.length}件`}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ════════ SINGLE MODE — upload zone ════════ */}
          {!batchMode && !image && (
            <div
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) loadImage(f); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              role="button"
              aria-label="画像ファイルをアップロード。JPG、PNG、WebP、BMP、GIF対応"
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-kon bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600 hover:border-kon dark:hover:border-blue-400"}`}
              onClick={() => document.getElementById("img-upload")?.click()}
            >
              <div className="text-5xl mb-3">🖼️</div>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg font-bold">画像をドラッグ＆ドロップ</p>
              <button className="px-8 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors text-lg">📁 画像を選択</button>
              <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
              <p className="text-sm text-gray-400 mt-4">JPG, PNG, WebP, BMP, GIF対応</p>
              <p className="text-xs text-gray-400 mt-1">📋 Ctrl+Vで貼り付け可</p>
            </div>
          )}

          {/* ════════ SINGLE MODE — image editing ════════ */}
          {!batchMode && image && (
            <div>
              {/* File info */}
              <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-4">
                {thumbnailUrl && (
                  <img src={thumbnailUrl} alt="thumbnail"
                    className="rounded-lg object-contain flex-shrink-0 border border-gray-200 dark:border-gray-600"
                    style={{ maxWidth: "200px", maxHeight: "120px" }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800 dark:text-gray-100 truncate mb-1">{fileName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{dimensions.w} × {dimensions.h} px</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(fileSize)}</p>
                </div>
                <button onClick={reset} aria-label="ファイルを削除" className="flex-shrink-0 text-sm text-red-500 hover:text-red-600 font-bold transition-colors">✕削除</button>
              </div>

              {/* Undo / Redo / Reset */}
              <div className="flex justify-center gap-2 mb-4">
                <button onClick={undoAction} disabled={!canUndo} aria-label="元に戻す" aria-disabled={!canUndo} className={canUndo ? btnNormal : btnDisabled}>↩ 元に戻す</button>
                <button onClick={redoAction} disabled={!canRedo} aria-label="やり直し" aria-disabled={!canRedo} className={canRedo ? btnNormal : btnDisabled}>↪ やり直し</button>
                <button onClick={resetTransforms} className={`${btnBase} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400`}>🔄 リセット</button>
              </div>

              {/* Flip toggles */}
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={handleFlipH} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${flipH ? "bg-kon text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                  ↔️ 水平反転 {flipH ? "ON" : "OFF"}
                </button>
                <button onClick={handleFlipV} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${flipV ? "bg-kon text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                  ↕️ 垂直反転 {flipV ? "ON" : "OFF"}
                </button>
              </div>

              {/* Rotation controls */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3">回転</p>
                <div className="flex justify-center gap-3 mb-4">
                  <button onClick={() => handleRotate(-90)} className={btnNormal}>↩️ 90°左</button>
                  <button onClick={() => handleRotate(90)}  className={btnNormal}>↪️ 90°右</button>
                  <button onClick={() => handleRotate(180)} className={btnNormal}>🔄 180°</button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 dark:text-gray-300 flex-shrink-0">📐 角度:</span>
                  <input type="number" min={0} max={360} step={1} value={angleInput}
                    onChange={(e) => handleAngleChange(e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200" />
                  <input type="range" min={0} max={360} step={1} value={angleInput}
                    onChange={(e) => handleAngleChange(e.target.value)}
                    className="flex-1 accent-kon" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right flex-shrink-0">{rotation}°</span>
                </div>
              </div>

              {/* Status */}
              <div className={`text-center text-xs px-3 py-2 rounded-lg mb-4 font-medium ${statusParts.length > 0 ? "bg-kon/10 text-kon dark:text-blue-300" : "bg-gray-50 dark:bg-gray-700/30 text-gray-400 dark:text-gray-500"}`}>
                <span aria-live="polite" aria-atomic="true">{statusText}</span>
              </div>

              {/* Output settings + resize */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3">出力設定</p>
                <div className="flex gap-3 mb-3">
                  {["PNG", "JPG", "WebP"].map(fmt => (
                    <label key={fmt} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="outputFormat" value={fmt} checked={outputFormat === fmt} onChange={() => setOutputFormat(fmt)} className="accent-kon" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">{fmt}</span>
                    </label>
                  ))}
                </div>
                {outputFormat !== "PNG" && (
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">品質</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{quality}</span>
                    </div>
                    <input type="range" min={1} max={100} step={1} value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-kon" />
                  </div>
                )}
                {estSize != null && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">推定サイズ: 約{formatBytes(estSize)}</p>
                )}
                <ResizePanel />
              </div>

              {/* Compare mode toggle (single mode only) */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">プレビュー</p>
                <button
                  onClick={() => setCompareMode(prev => !prev)}
                  aria-pressed={compareMode}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all border ${
                    compareMode
                      ? "bg-kon text-white border-kon shadow-md"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-kon hover:text-kon"
                  }`}
                >
                  ⟺ 比較表示 {compareMode ? "ON" : "OFF"}
                </button>
              </div>

              {/* Preview area */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 mb-2">
                {/* Canvas always rendered in single mode — hidden when compare is ON */}
                <canvas
                  ref={canvasRef}
                  className={compareMode ? "hidden" : "block mx-auto rounded-lg shadow-md max-w-full"}
                  style={compareMode ? {} : { maxHeight: "500px" }}
                />

                {/* Before/After comparison slider */}
                {compareMode && processedDataUrl && (
                  <div
                    ref={compareRef}
                    className="relative select-none rounded-lg overflow-hidden"
                    style={{ cursor: "col-resize", touchAction: "none" }}
                    onMouseDown={(e) => { isDraggingSlider.current = true; e.preventDefault(); }}
                    onTouchStart={() => { isDraggingSlider.current = true; }}
                  >
                    {/* Bottom layer: processed (変換後) */}
                    <img
                      src={processedDataUrl}
                      alt="変換後"
                      className="block w-full mx-auto rounded-lg"
                      style={{ maxHeight: "500px", objectFit: "contain", userSelect: "none" }}
                      draggable={false}
                    />
                    {/* Top layer: original (変換前) — clipped to left of slider */}
                    <img
                      src={thumbnailUrl}
                      alt="変換前"
                      className="absolute inset-0 w-full h-full rounded-lg"
                      style={{
                        objectFit: "contain",
                        clipPath: `inset(0 ${(100 - sliderPos).toFixed(2)}% 0 0)`,
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                      draggable={false}
                    />
                    {/* Divider line + handle */}
                    <div
                      className="absolute top-0 bottom-0 pointer-events-none"
                      style={{ left: `${sliderPos.toFixed(2)}%`, transform: "translateX(-50%)", width: "2px" }}
                    >
                      <div className="w-full h-full bg-white shadow-md" />
                      <div
                        role="slider"
                        aria-label="比較スライダー"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(sliderPos)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowLeft") setSliderPos((p) => Math.max(0, p - 5));
                          if (e.key === "ArrowRight") setSliderPos((p) => Math.min(100, p + 5));
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-auto"
                        style={{ width: "44px", height: "44px", fontSize: "15px", cursor: "col-resize", userSelect: "none" }}
                      >⟺</div>
                    </div>
                    {/* Labels */}
                    <span className="absolute top-2 left-2 bg-black/55 text-white text-xs px-2 py-0.5 rounded pointer-events-none select-none">変換前</span>
                    <span className="absolute top-2 right-2 bg-black/55 text-white text-xs px-2 py-0.5 rounded pointer-events-none select-none">変換後</span>
                  </div>
                )}
              </div>

              {/* Output dimensions label */}
              {outputDims && (
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-4">
                  出力サイズ: {outputDims.w} × {outputDims.h} px
                  {resizeEnabled && <span className="ml-1 text-kon dark:text-blue-400 font-medium">(リサイズ適用)</span>}
                </p>
              )}

              {/* Download + Clipboard */}
              <div className="relative flex flex-wrap gap-3">
                {copyToast && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg z-10 whitespace-nowrap">
                    コピーしました！
                  </div>
                )}
                <button onClick={download} className="flex-1 py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all">
                  💾 ダウンロード ({outputFormat})
                </button>
                <button onClick={copyToClipboard} className="py-4 px-5 border-2 border-kon text-kon dark:text-white dark:border-white rounded-xl font-bold text-sm hover:bg-kon/5 transition-all">
                  📋 クリップボードにコピー
                </button>
              </div>
            </div>
          )}
        </section>

        {seoContent && (
          <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-kon mb-4 text-lg">画像反転とは？</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{seoContent.intro}</p>
          </section>
        )}

        <section className="mt-8">
          <h2 className="font-bold text-kon mb-4 text-lg">こんな時に使える！活用例</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { emoji: "📱", title: "SNSサムネイル", desc: "左右対称のサムネイルで差をつける" },
              { emoji: "🖨️", title: "アイロンプリント", desc: "転写シートは鏡像で印刷が必要" },
              { emoji: "🖼️", title: "デザイン確認", desc: "左右対称かチェックするのに便利" },
              { emoji: "📸", title: "自撮り補正", desc: "インカメラの左右反転を元に戻す" },
              { emoji: "🔍", title: "文字・ロゴ確認", desc: "文字の向きや配置を鏡像で確認" },
              { emoji: "🎨", title: "イラスト反転", desc: "ポーズや構図のバリエーションを増やす" },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-1">{item.emoji}</div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {faq?.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問（FAQ）</h2>
            <LazyFAQ faq={faq} />
          </section>
        )}

        <section className="mt-8">
          <h2 className="font-bold text-kon mb-4 text-lg">🔧 関連ツール</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RELATED_TOOLS.map(tool => (
              <Link key={tool.href} href={tool.href}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-3 group">
                <span className="text-3xl">{tool.emoji}</span>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-kon transition-colors">{tool.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/image" className="text-kon hover:text-ai">← 画像ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
