"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import ShareButtons from "@/components/common/ShareButtons";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';
interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; useCases?: { title: string; desc: string }[]; tips?: string; }
interface Props { faq: FAQ[]; seoContent?: SeoContent; }
interface StampPlacement {
  page: number;
  x: number;
  y: number;
  size: number;
}
type HankoShape = "circle" | "square" | "date";

// Load libs from public/ via script tags (avoids webpack SSR issues)
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

// ---- Hanko generator ----
function generateHanko(
  name: string,
  shape: HankoShape,
  color: string,
  dateLine: string
): string {
  const size = 200;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.45;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  if (shape === "circle") {
    // Outer circle
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Vertical text
    const chars = name.split("");
    const charCount = chars.length;
    const fontSize = Math.min(r * 1.2 / Math.max(charCount, 1), r * 0.8);
    ctx.font = `bold ${fontSize}px "Yu Mincho", "Hiragino Mincho Pro", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const totalH = charCount * fontSize * 0.95;
    const startY = cy - totalH / 2 + fontSize / 2;

    for (let i = 0; i < charCount; i++) {
      ctx.fillText(chars[i], cx, startY + i * fontSize * 0.95);
    }
  } else if (shape === "square") {
    // Outer square
    ctx.lineWidth = 4;
    const s = r * 1.8;
    ctx.strokeRect((size - s) / 2, (size - s) / 2, s, s);

    // Text (up to 4 chars in 2x2 grid, or vertical)
    const chars = name.split("");
    const charCount = chars.length;

    if (charCount <= 2) {
      const fontSize = r * 0.9;
      ctx.font = `bold ${fontSize}px "Yu Mincho", "Hiragino Mincho Pro", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const totalH = charCount * fontSize * 0.9;
      const startY = cy - totalH / 2 + fontSize / 2;
      for (let i = 0; i < charCount; i++) {
        ctx.fillText(chars[i], cx, startY + i * fontSize * 0.9);
      }
    } else if (charCount <= 4) {
      // 2x2 grid (right-to-left, top-to-bottom for Japanese)
      const fontSize = r * 0.7;
      ctx.font = `bold ${fontSize}px "Yu Mincho", "Hiragino Mincho Pro", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const positions = charCount === 3
        ? [[cx + fontSize * 0.35, cy - fontSize * 0.35], [cx - fontSize * 0.35, cy - fontSize * 0.35], [cx, cy + fontSize * 0.45]]
        : [[cx + fontSize * 0.35, cy - fontSize * 0.35], [cx - fontSize * 0.35, cy - fontSize * 0.35], [cx + fontSize * 0.35, cy + fontSize * 0.45], [cx - fontSize * 0.35, cy + fontSize * 0.45]];
      for (let i = 0; i < charCount; i++) {
        ctx.fillText(chars[i], positions[i][0], positions[i][1]);
      }
    } else {
      const fontSize = Math.min(r * 1.2 / charCount, r * 0.55);
      ctx.font = `bold ${fontSize}px "Yu Mincho", "Hiragino Mincho Pro", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const totalH = charCount * fontSize * 0.85;
      const startY = cy - totalH / 2 + fontSize / 2;
      for (let i = 0; i < charCount; i++) {
        ctx.fillText(chars[i], cx, startY + i * fontSize * 0.85);
      }
    }
  } else if (shape === "date") {
    // Date stamp: outer circle, horizontal dividers, name top, date middle, role bottom
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Inner circle
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
    ctx.stroke();

    // Horizontal lines
    const lineY1 = cy - r * 0.3;
    const lineY2 = cy + r * 0.3;
    const lineHalfW = Math.sqrt(r * r * 0.85 - r * r * 0.09) * 0.92;

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - lineHalfW, lineY1);
    ctx.lineTo(cx + lineHalfW, lineY1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - lineHalfW, lineY2);
    ctx.lineTo(cx + lineHalfW, lineY2);
    ctx.stroke();

    // Top: name
    const topFontSize = Math.min(r * 0.35, r * 0.8 / Math.max(name.length, 1));
    ctx.font = `bold ${topFontSize}px "Yu Mincho", "Hiragino Mincho Pro", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, cx, cy - r * 0.58);

    // Middle: date
    const dateFontSize = r * 0.28;
    ctx.font = `${dateFontSize}px "Yu Mincho", "Hiragino Mincho Pro", serif`;
    ctx.fillText(dateLine || formatDate(), cx, cy);

    // Bottom: 印
    const bottomFontSize = r * 0.35;
    ctx.font = `bold ${bottomFontSize}px "Yu Mincho", "Hiragino Mincho Pro", serif`;
    ctx.fillText("印", cx, cy + r * 0.58);
  }

  return canvas.toDataURL("image/png");
}

function formatDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}.${m}.${day}`;
}

// ===================== Component =====================

export default function PdfStampClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  
  

  // PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

  // Stamp state
  const [stampImg, setStampImg] = useState<HTMLImageElement | null>(null);
  const [stampDataUrl, setStampDataUrl] = useState<string>("");
  const [stampMode, setStampMode] = useState<"upload" | "generate">("generate");

  // Hanko maker
  const [hankoName, setHankoName] = useState("");
  const [hankoShape, setHankoShape] = useState<HankoShape>("circle");
  const [hankoColor, setHankoColor] = useState("#e03030");
  const [hankoDate, setHankoDate] = useState(formatDate());

  // Placement
  const [placements, setPlacements] = useState<StampPlacement[]>([]);
  const [stampSize, setStampSize] = useState(60);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("PDFと印鑑を用意して押印しよう！");
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [processing, setProcessing] = useState(false);

  const renderScaleRef = useRef(1.5);

  useEffect(() => {
    setMounted(true);

  }, []);

  // ---- Render PDF page ----
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: renderScaleRef.current });

    const canvas = canvasRef.current;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    setPageWidth(viewport.width);
    setPageHeight(viewport.height);

    const ctx = canvas.getContext("2d")!;
    // Cancel any in-progress render
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch(_e) {}
    }
    const task = page.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;
    try { await task.promise; } catch(e: any) { if (e?.name === "RenderingCancelledException") return; throw e; }

    // Draw stamps on this page
    drawStampsOnCanvas(ctx, pageNum, viewport.width, viewport.height);
  }, [pdfDoc, placements, stampImg, stampSize]);

  useEffect(() => {
    if (pdfDoc) renderPage(currentPage);
  }, [pdfDoc, currentPage, renderPage, placements, stampSize]);

  const drawStampsOnCanvas = (ctx: CanvasRenderingContext2D, pageNum: number, cw: number, ch: number) => {
    if (!stampImg) return;
    const pageStamps = placements.filter((p) => p.page === pageNum - 1);
    for (const st of pageStamps) {
      const sx = (st.x / 100) * cw - (st.size * renderScaleRef.current) / 2;
      const sy = (st.y / 100) * ch - (st.size * renderScaleRef.current) / 2;
      const displaySize = st.size * renderScaleRef.current;
      ctx.drawImage(stampImg, sx, sy, displaySize, displaySize);
    }
  };

  // ---- Load PDF ----
  const loadPdf = async (f: File) => {
    await ensureLibs();
    
    setPdfFile(f);
    setPlacements([]);
    setIsComplete(false);

    const buf = await f.arrayBuffer();
    const bufCopy = buf.slice(0); // keep a clean copy for pdf-lib
    setPdfBytes(bufCopy);

    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise;
    setPdfDoc(doc);
    setTotalPages(doc.numPages);
    setCurrentPage(1);
    setMascotState("success")
      triggerSuccess('stamp');;
    setMascotMessage("PDF読み込み完了！印鑑を用意して、PDFをクリックして押印してね！");
  };

  // ---- Load stamp image ----
  const loadStampImage = (dataUrl: string) => {
    const img = new window.Image();
    img.onload = () => {
      setStampImg(img);
      setStampDataUrl(dataUrl);
    };
    img.src = dataUrl;
  };

  const handleStampUpload = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => loadStampImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  const generateAndSetHanko = () => {
    if (!hankoName.trim()) return;
    const dataUrl = generateHanko(hankoName.trim(), hankoShape, hankoColor, hankoDate);
    loadStampImage(dataUrl);
    setMascotState("success")
      triggerSuccess('stamp');;
    setMascotMessage("印影を作成しました！PDFをクリックして押印してね！");
  };

  // ---- Canvas click to place stamp ----
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!stampImg || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check if clicking an existing stamp (for drag)
    const existing = placements.findIndex((p) => {
      if (p.page !== currentPage - 1) return false;
      const sx = (p.x / 100) * canvas.width;
      const sy = (p.y / 100) * canvas.height;
      const half = (p.size * renderScaleRef.current) / 2;
      return Math.abs(clickX - sx) < half && Math.abs(clickY - sy) < half;
    });

    if (existing >= 0) return; // Will be handled by mousedown for drag

    // Place new stamp
    const xPct = (clickX / canvas.width) * 100;
    const yPct = (clickY / canvas.height) * 100;
    setPlacements((prev) => [...prev, { page: currentPage - 1, x: xPct, y: yPct, size: stampSize }]);
  };

  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!stampImg || !canvasRef.current || !e.touches[0]) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const tx = (e.touches[0].clientX - rect.left) * scaleX;
    const ty = (e.touches[0].clientY - rect.top) * scaleY;

    const xPct = (tx / canvas.width) * 100;
    const yPct = (ty / canvas.height) * 100;
    setPlacements((prev) => [...prev, { page: currentPage - 1, x: xPct, y: yPct, size: stampSize }]);
  };

  // ---- Drag stamp ----
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const idx = placements.findIndex((p) => {
      if (p.page !== currentPage - 1) return false;
      const sx = (p.x / 100) * canvas.width;
      const sy = (p.y / 100) * canvas.height;
      const half = (p.size * renderScaleRef.current) / 2;
      return Math.abs(mx - sx) < half && Math.abs(my - sy) < half;
    });

    if (idx >= 0) {
      e.preventDefault();
      setDragging(idx);
      const sx = (placements[idx].x / 100) * canvas.width;
      const sy = (placements[idx].y / 100) * canvas.height;
      setDragOffset({ x: mx - sx, y: my - sy });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging === null || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX - dragOffset.x;
    const my = (e.clientY - rect.top) * scaleY - dragOffset.y;

    const xPct = Math.max(0, Math.min(100, (mx / canvas.width) * 100));
    const yPct = Math.max(0, Math.min(100, (my / canvas.height) * 100));

    setPlacements((prev) => prev.map((p, i) => i === dragging ? { ...p, x: xPct, y: yPct } : p));
  };

  const handleMouseUp = () => { setDragging(null); };

  // ---- Remove last stamp on current page ----
  const removeLastStamp = () => {
    setPlacements((prev) => {
      const last = [...prev].reverse().findIndex((p) => p.page === currentPage - 1);
      if (last < 0) return prev;
      const actualIdx = prev.length - 1 - last;
      return prev.filter((_, i) => i !== actualIdx);
    });
  };

  const resetAllStamps = () => {
    setPlacements([]);
    setIsComplete(false);
    setMascotState("success")
      triggerSuccess('stamp');;
    setMascotMessage("押印をリセットしました。もう一度押印してね！");
  };

  // ---- Download stamped PDF ----
  const downloadStampedPdf = async () => {
    if (!pdfBytes || !stampDataUrl || placements.length === 0) return;
    setProcessing(true);
    setMascotState("working");
    setMascotMessage("PDF作成中...");

    try {
      await ensureLibs();
      const pdfDocLib = await PDFDocumentLib.load(pdfBytes);

      // Embed stamp image
      let stampImage;
      if (stampDataUrl.includes("image/png")) {
        stampImage = await pdfDocLib.embedPng(stampDataUrl);
      } else {

  const resetAllStamps = () => {
    setPlacements([]);
    setIsComplete(false);
    setMascotState("success")
      triggerSuccess('stamp');;
    setMascotMessage("押印をリセットしました。PDFはそのまま残っています。");
  };
        stampImage = await pdfDocLib.embedJpg(stampDataUrl);
      }

      const pages = pdfDocLib.getPages();

      for (const placement of placements) {
        if (placement.page >= pages.length) continue;
        const page = pages[placement.page];
        const { width: pw, height: ph } = page.getSize();

        // Convert from canvas % to PDF coordinates
        // Canvas: origin top-left, PDF: origin bottom-left
        const stampW = (placement.size / pageWidth) * pw * renderScaleRef.current;
        const stampH = stampW; // Square stamp

        const pdfX = (placement.x / 100) * pw - stampW / 2;
        const pdfY = ph - (placement.y / 100) * ph - stampH / 2;

        page.drawImage(stampImage, {
          x: pdfX,
          y: pdfY,
          width: stampW,
          height: stampH,
        });
      }

      const outBytes = await pdfDocLib.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (pdfFile?.name || "document").replace(/\.pdf$/i, "") + "_stamped_yamada-tools.pdf";
      document.body.appendChild(a);
      a.click();
      // Delay cleanup so download can complete
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 3000);

      setIsComplete(true);
      setMascotState("success")
      triggerSuccess('stamp');;
      setMascotMessage("押印済みPDFをダウンロードしました！友達にもシェアしてね♪");
    } catch (err) {
      setMascotState("idle");
      setMascotMessage("エラーが発生しました。PDFを確認してください。");
      console.error(err);
    }
    setProcessing(false);
  };

  // ---- Drop handlers ----
  const handlePdfDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") loadPdf(f);
  };

  const clearAll = () => {
    setPdfFile(null); setPdfDoc(null); setPdfBytes(null);
    setCurrentPage(1); setTotalPages(0);
    setPlacements([]); setStampImg(null); setStampDataUrl("");
    setHankoName(""); setIsComplete(false); setProcessing(false);
    setMascotState("idle"); setMascotMessage("PDFと印鑑を用意して押印しよう！");
  };

  if (!mounted) return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center"><p>読み込み中...</p></div></div>;

  const currentPageStampCount = placements.filter((p) => p.page === currentPage - 1).length;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔏</div>
          <h1 className="text-3xl font-bold text-kon mb-2">PDFに電子印鑑を押す無料ツール — 認印・角印・社判の挿入に対応</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">PDFに電子印鑑（ハンコ）をかんたん押印</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">📱 スマホ対応</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          <div className="mb-6"><Mascot state={mascotState} message={mascotMessage} /></div>



          {/* Step 1: PDF Upload */}
          {!pdfDoc ? (
            <div>
              <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-3">📄 Step 1: PDFをアップロード</h3>
              <div
                onDrop={handlePdfDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? "border-kon bg-sakura/20" : "border-gray-300 dark:border-gray-600 hover:border-kon"}`}
              >
                <div className="text-4xl mb-3">📄</div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">PDFをドラッグ＆ドロップ</p>
                <label className="inline-block px-6 py-2 bg-kon text-white rounded-lg cursor-pointer hover:bg-ai transition-colors">
                  PDFを選択
                  <input type="file" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) loadPdf(e.target.files[0]); }} className="hidden" />
                </label>
              </div>
            </div>
          ) : (
            <div>
              {/* Step 2: Stamp selection */}
              <div className="mb-5 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-3">🔏 Step 2: 印鑑を用意</h3>

                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setStampMode("generate")}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${stampMode === "generate" ? "bg-kon text-white" : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200"}`}>
                    ✏️ かんたん印影メーカー
                  </button>
                  <button type="button" onClick={() => setStampMode("upload")}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${stampMode === "upload" ? "bg-kon text-white" : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200"}`}>
                    📁 画像アップロード
                  </button>
                </div>

                {stampMode === "generate" ? (
                  <div className="space-y-3">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 block mb-1">名前</label>
                        <input type="text" value={hankoName} onChange={(e) => setHankoName(e.target.value)}
                          placeholder="山田" maxLength={6}
                          className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-600 dark:border-gray-500" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">形</label>
                        <div className="flex gap-1">
                          {([
                            { key: "circle" as HankoShape, label: "丸印" },
                            { key: "square" as HankoShape, label: "角印" },
                            { key: "date" as HankoShape, label: "日付印" },
                          ]).map((s) => (
                            <button type="button" key={s.key} onClick={() => setHankoShape(s.key)}
                              className={`px-2 py-2 rounded text-xs font-medium ${hankoShape === s.key ? "bg-kon text-white" : "bg-white dark:bg-gray-500 text-gray-700 dark:text-gray-200"}`}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {hankoShape === "date" && (
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">日付</label>
                        <input type="text" value={hankoDate} onChange={(e) => setHankoDate(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-600 dark:border-gray-500" />
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <label className="text-xs text-gray-500">色:</label>
                      <input type="color" value={hankoColor} onChange={(e) => setHankoColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0" />
                      {["#e03030", "#cc0000", "#b22222", "#333333"].map((c) => (
                        <button type="button" key={c} onClick={() => setHankoColor(c)}
                          className={`w-6 h-6 rounded-full border-2 ${hankoColor === c ? "border-kon scale-110" : "border-gray-300"}`}
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>

                    <button type="button" onClick={generateAndSetHanko} disabled={!hankoName.trim()}
                      className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${hankoName.trim() ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
                      🔏 印影を生成
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="inline-block px-4 py-2 bg-kon text-white rounded-lg cursor-pointer hover:bg-ai transition-colors text-xs">
                      印鑑画像を選択（PNG推奨）
                      <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleStampUpload(e.target.files[0]); }} className="hidden" />
                    </label>
                    <p className="text-[10px] text-gray-400 mt-1">背景透明のPNG画像がきれいに仕上がります</p>
                  </div>
                )}

                {/* Stamp preview */}
                {stampImg && (
                  <div className="mt-3 flex items-center gap-3 bg-white dark:bg-gray-600 rounded-lg p-2">
                    <img src={stampDataUrl} alt="印影" className="w-16 h-16 object-contain" />
                    <span className="text-xs text-green-600 font-bold">✓ 印鑑セット完了</span>
                  </div>
                )}
              </div>

              {/* Step 3: Place stamp on PDF */}
              <div className="mb-4">
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-2">📍 Step 3: PDFをクリックして押印</h3>

                {/* Page navigation */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <button type="button" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm disabled:opacity-30">◀ 前</button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{currentPage} / {totalPages}ページ</span>
                    <button type="button" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-lg text-sm disabled:opacity-30">次 ▶</button>
                  </div>
                )}

                {/* Stamp size */}
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs text-gray-500">印鑑サイズ: {stampSize}px</label>
                  <input type="range" min="20" max="150" value={stampSize}
                    onChange={(e) => setStampSize(+e.target.value)} className="flex-1 accent-kon" />
                </div>

                {/* PDF canvas */}
                <div ref={containerRef}
                  className="bg-gray-200 dark:bg-gray-900 rounded-xl p-2 overflow-auto">
                  {!stampImg && (
                    <p className="text-center text-xs text-kon bg-gray-50 rounded-lg p-2 mb-2">⚠ まず印鑑を用意してからPDFをクリックしてください</p>
                  )}
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onTouchEnd={handleCanvasTouch}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`max-w-full mx-auto rounded shadow-lg ${stampImg ? "cursor-crosshair" : "cursor-default"}`}
                    style={{ display: "block" }}
                  />
                </div>

                {/* Stamp info */}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    このページの押印: {currentPageStampCount}個 ｜ 全ページ合計: {placements.length}個
                  </p>
                  {placements.length > 0 && (
                    <div className="flex gap-2">
                      <button type="button" onClick={removeLastStamp} className="px-4 py-2 bg-gray-50 text-kon border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                        ↩ 元に戻す（Undo）
                      </button>
                      <button type="button" onClick={resetAllStamps} className="px-4 py-2 bg-gray-50 text-danger border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                        🗑️ 全押印リセット
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Download */}
              <div className="flex gap-2">
                <button type="button" onClick={downloadStampedPdf} disabled={processing || placements.length === 0}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${processing || placements.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg"}`}>
                  {processing ? "⏳ PDF作成中..." : `💾 押印済みPDFをダウンロード（${placements.length}箇所）`}
                </button>
                <button type="button" onClick={clearAll} className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  クリア
                </button>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500 mb-3">このツールが役に立ったら、友達にもシェアしてね！</p>
              <ShareButtons title="PDF押印ツール - 山田ツール" description="PDFに電子印鑑を押すツール。印影自動生成機能付き。無料・ブラウザ処理で安全。" />
            </div>
          )}
        </section>

        {seoContent && (
          <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-kon mb-4 text-lg">PDF押印について</h2>
            <div className="prose prose-gray max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4 text-base">{seoContent.intro}</p>
              {seoContent.useCases && (
                <div className="grid sm:grid-cols-2 gap-3 my-4">
                  {seoContent.useCases.map((uc, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{uc.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{uc.desc}</p>
                    </div>
                  ))}
                </div>
              )}
              {seoContent.tips && (
                <div className="bg-gray-50 dark:bg-kon/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-kon dark:text-gray-300">💡 <strong>ヒント:</strong> {seoContent.tips}</p>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-8 bg-sakura/20 dark:bg-sakura/10 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3">使い方</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>・PDFファイルをアップロード</p>
            <p>・印鑑画像をアップロード、または印影メーカーで作成</p>
            <p>・PDFプレビュー上でクリックして押印位置を指定</p>
            <p>・サイズ調整、ドラッグで位置調整</p>
            <p>・「押印済みPDFをダウンロード」をクリック</p>
          </div>
        </section>

        <section className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-gray-200 dark:border-kon">
          <h2 className="font-bold text-kon mb-6 text-lg text-center">📖 かんたん3ステップ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ icon: "📄", step: "Step 1", text: "PDFをアップロード" }, { icon: "🔏", step: "Step 2", text: "印鑑を用意して押印" }, { icon: "💾", step: "Step 3", text: "押印済みPDFをダウンロード" }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-3xl">{s.icon}</div>
                <h3 className="font-bold text-kon mb-1">{s.step}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {faq && faq.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問（FAQ）</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden group">
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 list-none flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="text-kon">Q.</span>{item.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-kon font-medium">A.</span> {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 grid md:grid-cols-3 gap-4">
          {[{ icon: "🆓", title: "完全無料", desc: "登録不要、制限なし" }, { icon: "🔒", title: "ブラウザ内処理", desc: "PDFがサーバーに送信されません" }, { icon: "📱", title: "スマホ対応", desc: "タップ操作で押印" }].map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </section>

        <div className="mt-8 text-center">
          <Link href="/pdf" className="text-kon hover:text-ai transition-colors">← PDFツール一覧に戻る</Link>
        </div>
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 すべての処理はブラウザ内で行われます。PDFや印鑑画像がサーバーに送信されることはありません。</p>
        </footer>
      </div>
    </div>
  );
}
