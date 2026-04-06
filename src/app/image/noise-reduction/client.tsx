// @ts-nocheck
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import ShareButtons from "@/components/common/ShareButtons";

interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; useCases?: { title: string; desc: string }[]; tips?: string; }
interface Props { faq: FAQ[]; seoContent?: SeoContent; }

const STRENGTH_PRESETS = [
  { label: "弱", value: 2 },
  { label: "中", value: 4 },
  { label: "強", value: 7 },
  { label: "最強", value: 12 },
];

// =====================================================================
// GPU-accelerated blur using Canvas filter (hardware accelerated)
// =====================================================================
function gpuBlur(src: ImageData, radius: number): ImageData {
  const w = src.width, h = src.height;
  // Source canvas
  const sc = document.createElement("canvas");
  sc.width = w; sc.height = h;
  sc.getContext("2d")!.putImageData(src, 0, 0);
  // Blur canvas
  const bc = document.createElement("canvas");
  bc.width = w; bc.height = h;
  const bctx = bc.getContext("2d")!;
  bctx.filter = `blur(${radius}px)`;
  bctx.drawImage(sc, 0, 0);
  return bctx.getImageData(0, 0, w, h);
}

// =====================================================================
// Sobel edge detection → edge strength map (0-255)
// =====================================================================
function computeEdgeMap(src: Uint8ClampedArray, w: number, h: number): Float32Array {
  const edgeMap = new Float32Array(w * h);

  // Convert to grayscale first
  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const idx = i * 4;
    gray[i] = src[idx] * 0.299 + src[idx + 1] * 0.587 + src[idx + 2] * 0.114;
  }

  // Sobel kernels
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const tl = gray[(y-1)*w+(x-1)], tc = gray[(y-1)*w+x], tr = gray[(y-1)*w+(x+1)];
      const ml = gray[y*w+(x-1)],                             mr = gray[y*w+(x+1)];
      const bl = gray[(y+1)*w+(x-1)], bc = gray[(y+1)*w+x], br = gray[(y+1)*w+(x+1)];

      const gx = -tl - 2*ml - bl + tr + 2*mr + br;
      const gy = -tl - 2*tc - tr + bl + 2*bc + br;
      edgeMap[y * w + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  return edgeMap;
}

// =====================================================================
// Edge-aware compositing: blend blurred into flat areas, keep original at edges
// =====================================================================
function edgeAwareBlend(
  original: Uint8ClampedArray,
  blurred: Uint8ClampedArray,
  edgeMap: Float32Array,
  w: number, h: number,
  edgeThreshold: number,  // higher = more areas treated as flat = more smoothing
  blendStrength: number   // 0-1, how much to smooth flat areas
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(original.length);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const idx = i * 4;

      // Normalize edge strength: 0 = flat area, 1 = strong edge
      const edgeStrength = Math.min(1, edgeMap[i] / edgeThreshold);

      // Smooth transition: flat areas get blurred, edges keep original
      // Use smooth step for natural transition
      const t = edgeStrength * edgeStrength * (3 - 2 * edgeStrength); // smoothstep
      const smoothWeight = (1 - t) * blendStrength;

      for (let c = 0; c < 3; c++) {
        out[idx + c] = Math.round(
          original[idx + c] * (1 - smoothWeight) +
          blurred[idx + c] * smoothWeight
        );
      }
      out[idx + 3] = original[idx + 3];
    }
  }
  return out;
}

// =====================================================================
// Median filter for salt-and-pepper noise (optimized)
// =====================================================================
function medianFilter3x3(src: Uint8ClampedArray, w: number, h: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(src.length);
  const buf = new Uint8Array(9);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const ny = Math.min(h - 1, Math.max(0, y + dy));
          for (let dx = -1; dx <= 1; dx++) {
            const nx = Math.min(w - 1, Math.max(0, x + dx));
            buf[n++] = src[(ny * w + nx) * 4 + c];
          }
        }
        // Sort 9 elements (insertion sort)
        for (let i = 1; i < 9; i++) {
          const key = buf[i];
          let j = i - 1;
          while (j >= 0 && buf[j] > key) { buf[j + 1] = buf[j]; j--; }
          buf[j + 1] = key;
        }
        out[idx + c] = buf[4]; // median
      }
      out[idx + 3] = src[idx + 3];
    }
  }
  return out;
}

// =====================================================================
// Unsharp mask for detail restoration
// =====================================================================
function unsharpMask(original: ImageData, blurRadius: number, amount: number): ImageData {
  const blurred = gpuBlur(original, blurRadius);
  const src = original.data;
  const blur = blurred.data;
  const out = new Uint8ClampedArray(src.length);

  for (let i = 0; i < src.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const detail = src[i + c] - blur[i + c];
      out[i + c] = Math.max(0, Math.min(255, Math.round(src[i + c] + detail * amount)));
    }
    out[i + 3] = src[i + 3];
  }
          // @ts-ignore
  return new ImageData(out, original.width, original.height);
}

type FilterMode = "smart" | "strong" | "median";

export default function NoiseReductionClient({ faq, seoContent }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalDataRef = useRef<ImageData | null>(null);
  const processedDataRef = useRef<ImageData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [strength, setStrength] = useState(4);
  const [filterMode, setFilterMode] = useState<FilterMode>("smart");
  const [passes, setPasses] = useState(2);
  const [sharpen, setSharpen] = useState(30);
  const [processing, setProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [comparePos, setComparePos] = useState(50);
  const [compareMode, setCompareMode] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("画像をアップロードしてノイズを除去しよう！");
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ---- Draw result to canvas ----
  const drawResult = useCallback(() => {
    const canvas = canvasRef.current;
    const original = originalDataRef.current;
    const processed = processedDataRef.current;
    if (!canvas || !original) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = original.width;
    canvas.height = original.height;

    if (showOriginal || !processed) {
      ctx.putImageData(original, 0, 0);
      return;
    }

    if (compareMode) {
      const splitX = Math.round((comparePos / 100) * original.width);
      // Left = processed
      ctx.putImageData(processed, 0, 0);
      // Right = original (clip)
      const oc = document.createElement("canvas");
      oc.width = original.width; oc.height = original.height;
      oc.getContext("2d")!.putImageData(original, 0, 0);
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, original.width - splitX, original.height);
      ctx.clip();
      ctx.drawImage(oc, 0, 0);
      ctx.restore();
      // Divider line
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = Math.max(2, original.width / 300);
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 3;
      ctx.beginPath(); ctx.moveTo(splitX, 0); ctx.lineTo(splitX, original.height); ctx.stroke();
      // Arrow handle
      const handleY = original.height / 2;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(splitX, handleY, Math.max(12, original.width / 50), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowColor = "transparent";
      ctx.fillStyle = "#333";
      ctx.font = `bold ${Math.max(10, original.width / 60)}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("⇔", splitX, handleY);
      // Labels
      const fontSize = Math.max(11, Math.round(original.width / 45));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.7)"; ctx.shadowBlur = 4;
      ctx.fillStyle = "#fff"; ctx.textAlign = "center";
      ctx.fillText("✨ 除去後", splitX / 2, fontSize + 10);
      ctx.fillText("📷 元画像", splitX + (original.width - splitX) / 2, fontSize + 10);
      ctx.shadowBlur = 0; ctx.shadowColor = "transparent";
    } else {
      ctx.putImageData(processed, 0, 0);
    }
  }, [showOriginal, compareMode, comparePos, imgEl]);

  useEffect(() => { drawResult(); }, [drawResult]);

  // ---- Main processing ----
  const processImage = useCallback(async () => {
    const original = originalDataRef.current;
    if (!original) return;
    setProcessing(true);
    setMascotState("working");
    await new Promise(r => setTimeout(r, 30));

    const w = original.width, h = original.height;
          // @ts-ignore
    let currentData = new ImageData(
      new Uint8ClampedArray(original.data), w, h
    );

    for (let pass = 0; pass < passes; pass++) {
      setProgressMsg(`パス ${pass + 1}/${passes}...`);
      setMascotMessage(`ノイズ除去中... パス ${pass + 1}/${passes}`);
      await new Promise(r => setTimeout(r, 20));

      // Reduce blur radius on subsequent passes
      const passStrength = pass === 0 ? strength : Math.max(1, strength * 0.5);
      const blurRadius = passStrength;

      switch (filterMode) {
        case "smart": {
          // Smart mode: GPU blur + edge-aware compositing
          // Step 1: GPU-accelerated gaussian blur
          const blurred = gpuBlur(currentData, blurRadius);
          // Step 2: Edge detection on current data
          const edgeMap = computeEdgeMap(currentData.data, w, h);
          // Step 3: Edge-aware blend
          // Higher threshold = more smoothing (more areas treated as flat)
          const edgeThreshold = 20 + passStrength * 8;
          const result = edgeAwareBlend(
            currentData.data, blurred.data, edgeMap,
            w, h, edgeThreshold, 0.95
          );
          // @ts-ignore
          currentData = new ImageData(new Uint8ClampedArray(result.buffer as ArrayBuffer), w, h);
          break;
        }
        case "strong": {
          // Strong mode: pure GPU blur (no edge preservation, maximum smoothing)
          currentData = gpuBlur(currentData, blurRadius * 1.2);
          break;
        }
        case "median": {
          // Median: first apply median filter, then light GPU blur
          setProgressMsg(`パス ${pass + 1}/${passes}... メディアン処理中`);
          await new Promise(r => setTimeout(r, 20));
          // Run median multiple times based on strength
          const medianPasses = Math.max(1, Math.round(passStrength / 3));
          let medData = currentData.data;
          for (let mp = 0; mp < medianPasses; mp++) {
            medData = medianFilter3x3(medData, w, h);
          }
          // Light gaussian on top
          // @ts-ignore
          const medImg = new ImageData(new Uint8ClampedArray((medData as any).buffer || medData), w, h);
          if (passStrength > 3) {
            const lightBlur = gpuBlur(medImg, Math.max(1, passStrength * 0.3));
            const edgeMap = computeEdgeMap(medImg.data, w, h);
            const blended = edgeAwareBlend(
              medImg.data, lightBlur.data, edgeMap, w, h, 40, 0.7
            );
          // @ts-ignore
            currentData = new ImageData(blended, w, h);
          } else {
            currentData = medImg;
          }
          break;
        }
      }
    }

    // Optional sharpening
    if (sharpen > 0) {
      setProgressMsg("ディテール復元...");
      setMascotMessage("ディテール復元中...");
      await new Promise(r => setTimeout(r, 20));
      currentData = unsharpMask(currentData, Math.max(1, Math.round(strength * 0.3)), sharpen / 100);
    }

    processedDataRef.current = currentData;
    setProgressMsg("");
    setProcessing(false);
    setCompareMode(true);
    setMascotState("success");
    setMascotMessage("ノイズ除去完了！⇔スライダーで比較してね！");
  }, [strength, filterMode, passes, sharpen]);

  // ---- File handling ----
  const loadImage = (f: File) => {
    setFile(f); setIsComplete(false); processedDataRef.current = null; setCompareMode(false);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const oc = document.createElement("canvas");
        oc.width = img.width; oc.height = img.height;
        oc.getContext("2d")!.drawImage(img, 0, 0);
        originalDataRef.current = oc.getContext("2d")!.getImageData(0, 0, img.width, img.height);
        setImgW(img.width); setImgH(img.height); setImgEl(img);
        setMascotState("success");
        setMascotMessage("画像を読み込みました！設定して「実行」を押してね！");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("image/")) loadImage(f);
  };

  const download = () => {
    if (!file || !processedDataRef.current) return;
    const ec = document.createElement("canvas");
    ec.width = imgW; ec.height = imgH;
    ec.getContext("2d")!.putImageData(processedDataRef.current, 0, 0);
    const a = document.createElement("a");
    a.href = ec.toDataURL("image/png");
    a.download = file.name.replace(/\.[^/.]+$/, "") + "_denoised_yamada-tools.png";
    a.click();
    setIsComplete(true); setMascotState("success");
    setMascotMessage("ダウンロード完了！友達にもシェアしてね♪");
  };

  const clearAll = () => {
    setFile(null); setImgEl(null); setImgW(0); setImgH(0);
    setStrength(4); setFilterMode("smart"); setPasses(2); setSharpen(30);
    setProcessing(false); setProgressMsg(""); setShowOriginal(false);
    setCompareMode(false); setComparePos(50); setIsComplete(false);
    originalDataRef.current = null; processedDataRef.current = null;
    setMascotState("idle"); setMascotMessage("画像をアップロードしてノイズを除去しよう！");
  };

  if (!mounted) return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center"><p>読み込み中...</p></div></div>;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔇</div>
          <h1 className="text-3xl font-bold text-kon mb-2">ノイズ除去</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">写真のザラつき・ノイズを滑らかに補正</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">📱 スマホ対応</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          <div className="mb-6"><Mascot state={mascotState} message={mascotMessage} /></div>

          {!imgEl ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? "border-kon bg-sakura/20" : "border-gray-300 dark:border-gray-600 hover:border-kon"}`}
            >
              <div className="text-4xl mb-3">🖼️</div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">画像をドラッグ＆ドロップ</p>
              <label className="inline-block px-6 py-2 bg-kon text-white rounded-lg cursor-pointer hover:bg-ai transition-colors">
                ファイルを選択
                <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) loadImage(e.target.files[0]); }} className="hidden" />
              </label>
              <p className="text-sm text-gray-400 mt-3">対応形式: JPG, PNG, WebP, BMP</p>
            </div>
          ) : (
            <div>
              {/* Preview */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-2 mb-4 overflow-auto">
                <canvas ref={canvasRef} className="max-w-full mx-auto rounded-lg" style={{ display: "block" }} />
                <div className="flex justify-between items-center mt-2 px-1">
                  <p className="text-xs text-gray-400">{imgW}×{imgH}px</p>
                  <div className="flex gap-2">
                    {processedDataRef.current && (
                      <button onClick={() => { setCompareMode(!compareMode); setShowOriginal(false); }}
                        className={`text-xs px-3 py-1 rounded-lg transition-colors ${compareMode ? "bg-kon text-white" : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300"}`}>
                        ⇔ 比較モード
                      </button>
                    )}
                    <button
                      onMouseDown={() => setShowOriginal(true)}
                      onMouseUp={() => setShowOriginal(false)}
                      onMouseLeave={() => setShowOriginal(false)}
                      onTouchStart={() => setShowOriginal(true)}
                      onTouchEnd={() => setShowOriginal(false)}
                      className="text-xs px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 transition-colors select-none">
                      👁️ 長押しで元画像
                    </button>
                  </div>
                </div>
                {compareMode && processedDataRef.current && (
                  <div className="mt-2">
                    <input type="range" min="5" max="95" value={comparePos}
                      onChange={(e) => setComparePos(+e.target.value)} className="w-full accent-kon" />
                  </div>
                )}
              </div>

              {/* Filter mode */}
              <div className="mb-4">
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-2">🔧 フィルターモード</h3>
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: "smart" as FilterMode, label: "スマート", desc: "推奨", detail: "エッジを保ちながら滑らかに（推奨）" },
                    { key: "strong" as FilterMode, label: "強力", desc: "最大効果", detail: "最大限にノイズを除去（ぼけやすい）" },
                    { key: "median" as FilterMode, label: "メディアン", desc: "点ノイズ", detail: "白黒の点々ノイズに特化" },
                  ]).map((f) => (
                    <button key={f.key} onClick={() => setFilterMode(f.key)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterMode === f.key ? "bg-kon text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200"}`}>
                      {f.label} <span className="opacity-70">({f.desc})</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {filterMode === "smart" && "エッジ検出でディテールを保ちながら、平坦な部分のノイズを強力に除去"}
                  {filterMode === "strong" && "画像全体を強力に滑らかに。ノイズがひどい場合に効果的"}
                  {filterMode === "median" && "ごま塩ノイズ（白黒の点々）に特化したフィルター"}
                </p>
              </div>

              {/* Settings */}
              <div className="mb-5 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-4">
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200">⚙️ 設定</h3>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">強度: {strength}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {STRENGTH_PRESETS.map((p) => (
                      <button key={p.label} onClick={() => setStrength(p.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${strength === p.value ? "bg-kon text-white" : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200"}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <input type="range" min="1" max="20" value={strength}
                    onChange={(e) => setStrength(+e.target.value)} className="w-full accent-kon" />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">パス回数: {passes}回</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((p) => (
                      <button key={p} onClick={() => setPasses(p)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${passes === p ? "bg-kon text-white" : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200"}`}>
                        {p}回
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">繰り返すほど滑らかに（2回が推奨）</p>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">ディテール復元: {sharpen}%</label>
                  <input type="range" min="0" max="100" value={sharpen}
                    onChange={(e) => setSharpen(+e.target.value)} className="w-full accent-kon" />
                  <p className="text-xs text-gray-400">ノイズ除去後のぼやけを補正（0で無効）</p>
                </div>
              </div>

              {/* Process button */}
              <button onClick={processImage} disabled={processing}
                className={`w-full py-3 rounded-xl font-bold transition-all mb-3 ${processing ? "bg-gray-400 text-white cursor-wait" : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg"}`}>
                {processing ? `⏳ ${progressMsg || "処理中..."}` : "🔇 ノイズ除去を実行"}
              </button>

              {/* Download */}
              <div className="flex gap-2">
                <button onClick={download} disabled={!processedDataRef.current}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${!processedDataRef.current ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg"}`}>
                  💾 ダウンロード
                </button>
                <button onClick={clearAll} className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  クリア
                </button>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500 mb-3">このツールが役に立ったら、友達にもシェアしてね！</p>
              <ShareButtons title="ノイズ除去 - 山田ツール" description="写真のノイズを除去するツール。高品質フィルター搭載。無料・ブラウザ処理で安全。" />
            </div>
          )}
        </section>

        {seoContent && (
          <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-kon mb-4 text-lg">ノイズ除去について</h2>
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

        <section className="mt-8 bg-sakura/20 dark:bg-sakura/10 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3">使い方</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>・画像をアップロード</p>
            <p>・フィルターモードを選択（スマートが推奨）</p>
            <p>・強度・パス回数・ディテール復元を調整</p>
            <p>・「ノイズ除去を実行」をクリック</p>
            <p>・⇔比較スライダーで元画像と比較</p>
            <p>・満足したらダウンロード</p>
          </div>
        </section>

        <section className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
          <h2 className="font-bold text-kon mb-6 text-lg text-center">📖 かんたん3ステップ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ icon: "📁", step: "Step 1", text: "画像をアップロード" }, { icon: "🔇", step: "Step 2", text: "設定して実行" }, { icon: "💾", step: "Step 3", text: "補正後の画像をダウンロード" }].map((s, i) => (
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
          {[{ icon: "🆓", title: "完全無料", desc: "登録不要、制限なし" }, { icon: "🔒", title: "ブラウザ内処理", desc: "画像はサーバーに送信されません" }, { icon: "📱", title: "スマホ対応", desc: "タップ操作でノイズ除去" }].map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </section>

        <div className="mt-8 text-center">
          <Link href="/image" className="text-kon hover:text-ai transition-colors">← 画像ツール一覧に戻る</Link>
        </div>
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 すべての処理はブラウザ内で行われます。画像がサーバーに送信されることはありません。</p>
        </footer>
      </div>
    </div>
  );
}
