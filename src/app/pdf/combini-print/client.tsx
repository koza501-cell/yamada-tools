// @ts-nocheck
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import ShareButtons from "@/components/common/ShareButtons";

interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; useCases?: { title: string; desc: string }[]; tips?: string; }
interface Props { faq: FAQ[]; seoContent?: SeoContent; }

let pdfjsLib: any = null;
let jsPDFLib: any = null;

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
}

async function ensureJsPDF() {
  if (!jsPDFLib) {
    await loadScript("https://unpkg.com/jspdf@2.5.2/dist/jspdf.umd.min.js");
    jsPDFLib = (window as any).jspdf.jsPDF;
  }
}

export default function CombiniPrintClient({ faq, seoContent }: Props) {
  const [mounted, setMounted] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPreview, setCurrentPreview] = useState(1);
  const [scale, setScale] = useState(95);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [previewMode, setPreviewMode] = useState<"before" | "after">("after");

  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Render preview of a page
  const renderPreview = useCallback(async (pageNum: number) => {
    if (!pdfBytes) return;
    try {
      await ensureLibs();
      const doc = await pdfjsLib.getDocument({ data: pdfBytes.slice(0) }).promise;
      const page = await doc.getPage(pageNum);
      const vp = page.getViewport({ scale: 1 });

      // Determine canvas display size (fit within 500px width)
      const maxW = 500;
      const displayScale = Math.min(maxW / vp.width, 1.5);
      const viewport = page.getViewport({ scale: displayScale });

      // Before canvas (original)
      const bCanvas = beforeCanvasRef.current;
      if (bCanvas) {
        bCanvas.width = viewport.width;
        bCanvas.height = viewport.height;
        const ctx = bCanvas.getContext("2d")!;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, bCanvas.width, bCanvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;

        // Draw red danger zones (5mm edges)
        const mmToPx = (mm: number) => mm * (displayScale * 72 / 25.4);
        const danger = mmToPx(5);
        ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(danger, danger, bCanvas.width - danger * 2, bCanvas.height - danger * 2);
        ctx.setLineDash([]);

        // Red overlay on edges
        ctx.fillStyle = "rgba(239, 68, 68, 0.08)";
        ctx.fillRect(0, 0, bCanvas.width, danger); // top
        ctx.fillRect(0, bCanvas.height - danger, bCanvas.width, danger); // bottom
        ctx.fillRect(0, 0, danger, bCanvas.height); // left
        ctx.fillRect(bCanvas.width - danger, 0, danger, bCanvas.height); // right
      }

      // After canvas (with margin)
      const aCanvas = afterCanvasRef.current;
      if (aCanvas) {
        aCanvas.width = viewport.width;
        aCanvas.height = viewport.height;
        const ctx = aCanvas.getContext("2d")!;

        // White background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, aCanvas.width, aCanvas.height);

        // Draw scaled content
        const s = scale / 100;
        const sw = viewport.width * s;
        const sh = viewport.height * s;
        const ox = (viewport.width - sw) / 2;
        const oy = (viewport.height - sh) / 2;

        ctx.save();
        ctx.translate(ox, oy);
        ctx.scale(s, s);
        await page.render({ canvasContext: ctx, viewport }).promise;
        ctx.restore();

        // Draw safe zone indicator (green)
        const mmToPx = (mm: number) => mm * (displayScale * 72 / 25.4);
        const danger = mmToPx(5);
        ctx.strokeStyle = "rgba(34, 197, 94, 0.5)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(danger, danger, aCanvas.width - danger * 2, aCanvas.height - danger * 2);
        ctx.setLineDash([]);
      }

      doc.destroy();
    } catch (e: any) {
      console.error("Preview error:", e);
    }
  }, [pdfBytes, scale]);

  useEffect(() => {
    if (pdfBytes && pageCount > 0) {
      renderPreview(currentPreview);
    }
  }, [pdfBytes, pageCount, currentPreview, scale, renderPreview]);

  const loadPdf = async (file: File) => {
    setError("");
    setIsDone(false);
    setPdfFile(file);
    setMascotState("working");

    try {
      await ensureLibs();
      const buf = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
      setPdfBytes(buf);
      setPageCount(doc.numPages);
      setCurrentPreview(1);
      setMascotState("success");
      doc.destroy();
    } catch (e: any) {
      setError("PDFの読み込みに失敗しました: " + e.message);
      setMascotState("error");
    }
  };

  const processPdf = async () => {
    if (!pdfBytes) return;
    setIsProcessing(true);
    setMascotState("working");
    setError("");

    try {
      await ensureLibs();
      await ensureJsPDF();
      const doc = await pdfjsLib.getDocument({ data: pdfBytes.slice(0) }).promise;
      const s = scale / 100;
      let outputPdf: any = null;

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 2 }); // 2x for quality

        // Render original page to canvas
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport: vp }).promise;

        // Create output canvas with white background + scaled content
        const outCanvas = document.createElement("canvas");
        outCanvas.width = vp.width;
        outCanvas.height = vp.height;
        const outCtx = outCanvas.getContext("2d")!;
        outCtx.fillStyle = "#FFFFFF";
        outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);

        // Draw scaled content centered
        const sw = vp.width * s;
        const sh = vp.height * s;
        const ox = (vp.width - sw) / 2;
        const oy = (vp.height - sh) / 2;
        outCtx.drawImage(canvas, ox, oy, sw, sh);

        // Get page size in mm (PDF points to mm: 1pt = 0.352778mm)
        const origVp = page.getViewport({ scale: 1 });
        const widthMm = origVp.width * 0.352778;
        const heightMm = origVp.height * 0.352778;
        const orientation = widthMm > heightMm ? "l" : "p";

        if (i === 1) {
          outputPdf = new jsPDFLib({ orientation, unit: "mm", format: [widthMm, heightMm] });
        } else {
          outputPdf.addPage([widthMm, heightMm], orientation);
        }

        const imgData = outCanvas.toDataURL("image/jpeg", 0.92);
        outputPdf.addImage(imgData, "JPEG", 0, 0, widthMm, heightMm);
      }

      doc.destroy();
      const fileName = (pdfFile?.name || "document").replace(/\.pdf$/i, "") + "_combini_yamada-tools.pdf";
      const blob = outputPdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      setIsDone(true);
      setMascotState("success");
    } catch (e: any) {
      setError("処理に失敗しました: " + e.message);
      setMascotState("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") loadPdf(f);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadPdf(f);
  };

  const clearAll = () => {
    setPdfFile(null);
    setPdfBytes(null);
    setPageCount(0);
    setCurrentPreview(1);
    setScale(95);
    setIsDone(false);
    setIsProcessing(false);
    setError("");
    setMascotState("idle");
    setPreviewMode("after");
  };

  // Margin in mm for current scale
  const marginMm = ((1 - scale / 100) / 2 * 210).toFixed(1); // A4 width=210mm approximation

  if (!mounted) return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center"><p>読み込み中...</p></div></div>;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🏪</div>
          <h1 className="text-3xl font-bold text-kon mb-2">コンビニ印刷用 余白追加</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">セブン・ローソン・ファミマで端が切れずにきれいに印刷</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">📱 スマホ対応</span>
          </div>
        </header>

        {/* Main Tool Area */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          <div className="mb-6">
            <Mascot
              state={mascotState}
              idleMessage="コンビニ印刷で端が切れる？PDFをアップロードして余白を追加しよう！"
              workingMessage="PDFを処理中..."
              successMessage={isDone ? "ダウンロード完了！コンビニできれいに印刷できるよ♪" : "PDFを読み込みました！プレビューを確認してね！"}
              errorMessage="エラーが発生しました"
            />
          </div>

          {/* Upload Area */}
          {!pdfBytes ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                isDragging ? "border-kon bg-sakura/20" : "border-gray-300 dark:border-gray-600 hover:border-kon"
              }`}
              onClick={() => document.getElementById("pdf-upload")?.click()}
            >
              <div className="text-5xl mb-3">📄</div>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg font-bold">PDFファイルをドラッグ＆ドロップ</p>
              <p className="text-gray-400 mb-4">または下のボタンで選択</p>
              <button className="px-8 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors text-lg">
                📁 PDFを選択する
              </button>
              <input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileInput} />
              <p className="text-sm text-gray-400 mt-4">※ファイルはサーバーに送信されません（ブラウザ内処理）</p>
            </div>
          ) : (
            <div>
              {/* File Info */}
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate max-w-[200px] sm:max-w-none">{pdfFile?.name}</p>
                    <p className="text-xs text-gray-500">{pageCount}ページ • {((pdfFile?.size || 0) / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded-lg hover:bg-red-50 transition">
                  ✕ 閉じる
                </button>
              </div>

              {/* Problem Explanation */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-bold text-red-800 dark:text-red-200 text-sm">コンビニのコピー機は端から約5mmが印刷されません</p>
                    <p className="text-red-600 dark:text-red-300 text-xs mt-1">赤い点線の外側にあるコンテンツは切れてしまいます。余白を追加して解決しましょう。</p>
                  </div>
                </div>
              </div>

              {/* Scale Control */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-sm text-blue-800 dark:text-blue-200">📐 縮小率</label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{scale}%</span>
                    <span className="text-xs text-blue-500 bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded-full">
                      余白 約{marginMm}mm
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="85"
                  max="99"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-kon"
                />
                <div className="flex justify-between text-xs text-blue-500 mt-1">
                  <span>85%（余白多め）</span>
                  <span className="font-bold">← 95%推奨 →</span>
                  <span>99%（余白少なめ）</span>
                </div>
                {/* Quick presets */}
                <div className="flex gap-2 mt-3">
                  {[
                    { label: "93%", value: 93, desc: "安全重視" },
                    { label: "95%", value: 95, desc: "おすすめ" },
                    { label: "97%", value: 97, desc: "最小余白" },
                  ].map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setScale(p.value)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        scale === p.value
                          ? "bg-kon text-white shadow-md"
                          : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-blue-200 dark:border-gray-600 hover:bg-blue-100"
                      }`}
                    >
                      <div>{p.label}</div>
                      <div className="text-[10px] opacity-70">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Toggle */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  onClick={() => setPreviewMode("before")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    previewMode === "before"
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  ❌ 処理前
                </button>
                <button
                  onClick={() => setPreviewMode("after")}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    previewMode === "after"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  ✅ 処理後
                </button>
              </div>

              {/* Preview Canvases */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-3 mb-4">
                <div className="flex justify-center">
                  <canvas
                    ref={beforeCanvasRef}
                    className="rounded-lg shadow-md border border-gray-300"
                    style={{ display: previewMode === "before" ? "block" : "none", maxWidth: "100%" }}
                  />
                  <canvas
                    ref={afterCanvasRef}
                    className="rounded-lg shadow-md border border-gray-300"
                    style={{ display: previewMode === "after" ? "block" : "none", maxWidth: "100%" }}
                  />
                </div>

                {/* Preview label */}
                <div className="text-center mt-2">
                  {previewMode === "before" ? (
                    <span className="text-xs text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full">
                      ⚠️ 赤い点線の外側は切れます
                    </span>
                  ) : (
                    <span className="text-xs text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">
                      ✅ 緑の点線内に収まっています（{scale}%縮小）
                    </span>
                  )}
                </div>

                {/* Page navigation */}
                {pageCount > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <button
                      onClick={() => setCurrentPreview(Math.max(1, currentPreview - 1))}
                      disabled={currentPreview <= 1}
                      className="px-3 py-1 bg-white dark:bg-gray-700 rounded-lg text-sm font-bold disabled:opacity-30 hover:bg-gray-200 transition"
                    >
                      ◀ 前
                    </button>
                    <span className="text-sm text-gray-500 font-bold">{currentPreview} / {pageCount}</span>
                    <button
                      onClick={() => setCurrentPreview(Math.min(pageCount, currentPreview + 1))}
                      disabled={currentPreview >= pageCount}
                      className="px-3 py-1 bg-white dark:bg-gray-700 rounded-lg text-sm font-bold disabled:opacity-30 hover:bg-gray-200 transition"
                    >
                      次 ▶
                    </button>
                  </div>
                )}
              </div>

              {/* Process Button */}
              <button
                onClick={processPdf}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isProcessing ? "⏳ 処理中..." : "🏪 コンビニ印刷用に変換してダウンロード"}
              </button>

              {/* Convenience store tips */}
              <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <h3 className="font-bold text-amber-800 dark:text-amber-200 text-sm mb-2">🏪 コンビニでの印刷手順</h3>
                <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                  <p>1. このツールでPDFを変換してダウンロード</p>
                  <p>2. netprint（セブン）またはネットワークプリント（ローソン・ファミマ）にアップロード</p>
                  <p>3. コピー機で「用紙に合わせる」をオフにして「実際のサイズ」で印刷</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mt-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Share on completion */}
          {isDone && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500 mb-3">このツールが役に立ったら、友達にもシェアしてね！</p>
              <ShareButtons title="コンビニ印刷用 余白追加 - 山田ツール" description="コンビニで印刷すると端が切れる問題を解決するツール。無料・ブラウザ処理で安全。" />
            </div>
          )}
        </section>

        {/* SEO Content */}
        {seoContent && (
          <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-kon mb-4 text-lg">コンビニ印刷用 余白追加とは？</h2>
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
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">💡 <strong>ヒント:</strong> {seoContent.tips}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* How-to Steps */}
        <section className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
          <h2 className="font-bold text-kon mb-6 text-lg text-center">📖 かんたん3ステップ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "📄", step: "Step 1", text: "PDFをアップロード" },
              { icon: "📐", step: "Step 2", text: "縮小率を調整（95%推奨）" },
              { icon: "🏪", step: "Step 3", text: "変換してコンビニで印刷" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-3xl">{s.icon}</div>
                <h3 className="font-bold text-kon mb-1">{s.step}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why edges get cut */}
        <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="font-bold text-kon mb-4 text-lg">🖨️ なぜコンビニ印刷で端が切れるの？</h2>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3 leading-relaxed">
            <p>コンビニに設置されているマルチコピー機（富士フイルム製・SHARP製など）には、<strong>非印刷領域</strong>があります。用紙の端から約3〜5mmの範囲はインクが届かないため、何も印刷されません。</p>
            <p>多くのPDFは、ページの端ギリギリまでコンテンツが配置されています。特にページ番号、ヘッダー、フッター、罫線などは端に配置されることが多く、印刷時に切れてしまいます。</p>
            <p>本ツールは、PDFの内容を少し縮小して中央に配置し、四辺に白い余白を追加します。これにより、非印刷領域にコンテンツが入らなくなり、きれいに印刷できます。</p>
          </div>
        </section>

        {/* Supported stores */}
        <section className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { icon: "🏪", title: "セブンイレブン", desc: "netprint対応・全国約21,000店" },
            { icon: "🏪", title: "ローソン", desc: "ネットワークプリント対応" },
            { icon: "🏪", title: "ファミリーマート", desc: "ネットワークプリント対応" },
          ].map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* FAQ */}
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

        {/* Feature badges */}
        <section className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { icon: "🆓", title: "完全無料", desc: "登録不要、制限なし" },
            { icon: "🔒", title: "ブラウザ内処理", desc: "ファイルはサーバーに送信されません" },
            { icon: "📱", title: "スマホ対応", desc: "外出先でもPDFを変換" },
          ].map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Related tools */}
        <div className="mt-8 text-center">
          <Link href="/pdf" className="text-kon hover:text-ai transition-colors">← PDFツール一覧に戻る</Link>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 すべての処理はブラウザ内で行われます。ファイルがサーバーに送信されることはありません。</p>
        </footer>
      </div>
    </div>
  );
}
