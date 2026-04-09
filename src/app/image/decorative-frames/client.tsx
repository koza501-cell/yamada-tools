"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import ShareButtons from "@/components/common/ShareButtons";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; useCases?: { title: string; desc: string }[]; tips?: string; }
interface Props { faq: FAQ[]; seoContent?: SeoContent; }

type FrameStyle =
  | "simple" | "rounded" | "polaroid" | "film" | "stamp"
  | "shadow" | "gradient" | "double" | "torn" | "vintage"
  | "circle" | "heart";

interface FrameDef {
  id: FrameStyle;
  label: string;
  icon: string;
  desc: string;
}

const FRAMES: FrameDef[] = [
  { id: "simple", label: "シンプル", icon: "🖼️", desc: "基本の枠線" },
  { id: "rounded", label: "丸角", icon: "⬜", desc: "角を丸くした枠" },
  { id: "polaroid", label: "ポラロイド", icon: "📸", desc: "インスタント写真風" },
  { id: "film", label: "フィルム", icon: "🎞️", desc: "映画フィルム風" },
  { id: "stamp", label: "切手", icon: "📮", desc: "切手の縁取り" },
  { id: "shadow", label: "影付き", icon: "🔲", desc: "ドロップシャドウ" },
  { id: "gradient", label: "グラデ枠", icon: "🌈", desc: "グラデーションの枠" },
  { id: "double", label: "二重枠", icon: "⊞", desc: "内枠+外枠" },
  { id: "torn", label: "手ちぎり", icon: "📃", desc: "手でちぎった風" },
  { id: "vintage", label: "ヴィンテージ", icon: "📜", desc: "アンティーク風" },
  { id: "circle", label: "円形", icon: "⭕", desc: "丸くくり抜き" },
  { id: "heart", label: "ハート", icon: "❤️", desc: "ハート型くり抜き" },
];

// ---- Frame rendering functions ----

function drawFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  style: FrameStyle,
  frameColor: string,
  frameSize: number,
  canvasW: number,
  canvasH: number
) {
  const iw = img.width, ih = img.height;

  switch (style) {
    case "simple": {
      const cw = iw + frameSize * 2;
      const ch = ih + frameSize * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, frameSize, frameSize);
      break;
    }
    case "rounded": {
      const r = frameSize * 1.5;
      const cw = iw + frameSize * 2;
      const ch = ih + frameSize * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, cw, ch);
      // Rounded clip for image
      ctx.save();
      roundedRect(ctx, frameSize, frameSize, iw, ih, r);
      ctx.clip();
      ctx.drawImage(img, frameSize, frameSize);
      ctx.restore();
      break;
    }
    case "polaroid": {
      const topPad = frameSize;
      const sidePad = frameSize;
      const bottomPad = frameSize * 4;
      const cw = iw + sidePad * 2;
      const ch = ih + topPad + bottomPad;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      // White background with subtle shadow
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, cw, ch);
      // Subtle inner shadow
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = frameSize * 0.5;
      ctx.shadowOffsetX = 0; ctx.shadowOffsetY = frameSize * 0.2;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, cw, ch);
      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
      ctx.drawImage(img, sidePad, topPad);
      // Bottom text area line
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1;
      const lineY = ih + topPad + bottomPad * 0.5;
      ctx.beginPath(); ctx.moveTo(sidePad, lineY); ctx.lineTo(cw - sidePad, lineY); ctx.stroke();
      break;
    }
    case "film": {
      const perfSize = Math.max(8, frameSize * 0.4);
      const perfGap = perfSize * 2;
      const stripH = frameSize;
      const cw = iw + frameSize * 2;
      const ch = ih + stripH * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, frameSize, stripH);
      // Film perforations (top & bottom)
      ctx.fillStyle = "#333";
      for (let x = frameSize; x < cw - frameSize; x += perfGap) {
        // Top
        roundedRect(ctx, x, stripH * 0.2, perfSize, stripH * 0.6, 2);
        ctx.fill();
        // Bottom
        ctx.beginPath();
        roundedRect(ctx, x, ch - stripH * 0.8, perfSize, stripH * 0.6, 2);
        ctx.fill();
      }
      break;
    }
    case "stamp": {
      const dotR = Math.max(4, frameSize * 0.25);
      const dotGap = dotR * 3;
      const cw = iw + frameSize * 2;
      const ch = ih + frameSize * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, frameSize, frameSize);
      // Stamp perforations (semicircles along edges)
      ctx.fillStyle = "#f5f5f0";
      ctx.globalCompositeOperation = "destination-out";
      // Top & bottom
      for (let x = dotGap; x < cw; x += dotGap) {
        ctx.beginPath(); ctx.arc(x, 0, dotR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x, ch, dotR, 0, Math.PI * 2); ctx.fill();
      }
      // Left & right
      for (let y = dotGap; y < ch; y += dotGap) {
        ctx.beginPath(); ctx.arc(0, y, dotR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cw, y, dotR, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      break;
    }
    case "shadow": {
      const shadowOff = frameSize * 0.6;
      const shadowBlur = frameSize;
      const pad = frameSize + shadowBlur;
      const cw = iw + pad * 2;
      const ch = ih + pad * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, cw, ch);
      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowOff;
      ctx.shadowOffsetY = shadowOff;
      ctx.fillStyle = frameColor;
      ctx.fillRect(pad - frameSize * 0.3, pad - frameSize * 0.3, iw + frameSize * 0.6, ih + frameSize * 0.6);
      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
      ctx.drawImage(img, pad, pad);
      break;
    }
    case "gradient": {
      const cw = iw + frameSize * 2;
      const ch = ih + frameSize * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      // Gradient frame
      const grad = ctx.createLinearGradient(0, 0, cw, ch);
      grad.addColorStop(0, frameColor);
      grad.addColorStop(0.5, shiftHue(frameColor, 60));
      grad.addColorStop(1, shiftHue(frameColor, 120));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, frameSize, frameSize);
      break;
    }
    case "double": {
      const outerPad = frameSize;
      const gap = Math.max(4, frameSize * 0.3);
      const innerPad = Math.max(3, frameSize * 0.2);
      const totalPad = outerPad + gap + innerPad;
      const cw = iw + totalPad * 2;
      const ch = ih + totalPad * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, cw, ch);
      // Gap (lighter)
      ctx.fillStyle = lighten(frameColor, 40);
      ctx.fillRect(outerPad, outerPad, cw - outerPad * 2, ch - outerPad * 2);
      // Inner frame
      ctx.fillStyle = frameColor;
      ctx.fillRect(outerPad + gap, outerPad + gap, cw - (outerPad + gap) * 2, ch - (outerPad + gap) * 2);
      ctx.drawImage(img, totalPad, totalPad);
      break;
    }
    case "torn": {
      const cw = iw + frameSize * 2;
      const ch = ih + frameSize * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, frameSize, frameSize);
      // Torn edge effect (rough border)
      ctx.globalCompositeOperation = "destination-out";
      const step = 3;
      for (let x = 0; x < cw; x += step) {
        const t = Math.random() * frameSize * 0.6;
        const b = Math.random() * frameSize * 0.6;
        ctx.fillStyle = "black";
        ctx.fillRect(x, 0, step, t);
        ctx.fillRect(x, ch - b, step, b);
      }
      for (let y = 0; y < ch; y += step) {
        const l = Math.random() * frameSize * 0.6;
        const r = Math.random() * frameSize * 0.6;
        ctx.fillRect(0, y, l, step);
        ctx.fillRect(cw - r, y, r, step);
      }
      ctx.globalCompositeOperation = "source-over";
      break;
    }
    case "vintage": {
      const cw = iw + frameSize * 2;
      const ch = ih + frameSize * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      // Vintage paper bg
      ctx.fillStyle = "#f4e8c1";
      ctx.fillRect(0, 0, cw, ch);
      // Outer ornamental border
      ctx.strokeStyle = "#8b7355";
      ctx.lineWidth = Math.max(2, frameSize * 0.15);
      ctx.strokeRect(frameSize * 0.2, frameSize * 0.2, cw - frameSize * 0.4, ch - frameSize * 0.4);
      ctx.strokeRect(frameSize * 0.4, frameSize * 0.4, cw - frameSize * 0.8, ch - frameSize * 0.8);
      // Inner border
      ctx.strokeStyle = "#a0845c";
      ctx.lineWidth = Math.max(1, frameSize * 0.08);
      ctx.strokeRect(frameSize * 0.7, frameSize * 0.7, cw - frameSize * 1.4, ch - frameSize * 1.4);
      ctx.drawImage(img, frameSize, frameSize);
      // Vignette overlay
      const vignette = ctx.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.3, cw / 2, ch / 2, Math.max(cw, ch) * 0.7);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.15)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, cw, ch);
      break;
    }
    case "circle": {
      const size = Math.max(iw, ih);
      const cw = size + frameSize * 2;
      const ch = size + frameSize * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, cw, ch);
      // Clip to circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cw / 2, ch / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      // Center the image
      const ox = (size - iw) / 2 + frameSize;
      const oy = (size - ih) / 2 + frameSize;
      ctx.drawImage(img, ox, oy);
      ctx.restore();
      // Circle border
      ctx.strokeStyle = darken(frameColor, 20);
      ctx.lineWidth = Math.max(2, frameSize * 0.1);
      ctx.beginPath();
      ctx.arc(cw / 2, ch / 2, size / 2, 0, Math.PI * 2);
      ctx.stroke();
      // Make corners transparent
      ctx.globalCompositeOperation = "destination-in";
      ctx.beginPath();
      ctx.arc(cw / 2, ch / 2, size / 2 + frameSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      break;
    }
    case "heart": {
      const size = Math.max(iw, ih) * 1.1;
      const cw = size + frameSize * 2;
      const ch = size + frameSize * 2;
      ctx.canvas.width = cw; ctx.canvas.height = ch;
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, cw, ch);
      // Heart clip
      ctx.save();
      drawHeartPath(ctx, cw / 2, ch / 2, size * 0.45);
      ctx.clip();
      const ox = (size - iw) / 2 + frameSize;
      const oy = (size - ih) / 2 + frameSize;
      ctx.drawImage(img, ox, oy);
      ctx.restore();
      // Heart border
      ctx.strokeStyle = darken(frameColor, 20);
      ctx.lineWidth = Math.max(2, frameSize * 0.1);
      drawHeartPath(ctx, cw / 2, ch / 2, size * 0.45);
      ctx.stroke();
      // Make outside transparent
      ctx.globalCompositeOperation = "destination-in";
      drawHeartPath(ctx, cw / 2, ch / 2, size * 0.45 + frameSize);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      break;
    }
  }
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawHeartPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.beginPath();
  const topY = cy - size * 0.4;
  ctx.moveTo(cx, cy + size * 0.7);
  // Left curve
  ctx.bezierCurveTo(cx - size * 1.2, cy, cx - size * 0.7, topY - size * 0.5, cx, topY + size * 0.2);
  // Right curve
  ctx.bezierCurveTo(cx + size * 0.7, topY - size * 0.5, cx + size * 1.2, cy, cx, cy + size * 0.7);
  ctx.closePath();
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("");
}

function shiftHue(hex: string, degrees: number): string {
  const [r, g, b] = hexToRgb(hex);
  // Simple hue rotation approximation
  const cos = Math.cos((degrees * Math.PI) / 180);
  const sin = Math.sin((degrees * Math.PI) / 180);
  const nr = r * (0.213 + 0.787 * cos - 0.213 * sin) + g * (0.715 - 0.715 * cos - 0.715 * sin) + b * (0.072 - 0.072 * cos + 0.928 * sin);
  const ng = r * (0.213 - 0.213 * cos + 0.143 * sin) + g * (0.715 + 0.285 * cos + 0.14 * sin) + b * (0.072 - 0.072 * cos - 0.283 * sin);
  const nb = r * (0.213 - 0.213 * cos - 0.787 * sin) + g * (0.715 - 0.715 * cos + 0.715 * sin) + b * (0.072 + 0.928 * cos + 0.072 * sin);
  return rgbToHex(nr, ng, nb);
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + amount, g + amount, b + amount);
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r - amount, g - amount, b - amount);
}

// ===================== Component =====================

export default function DecorativeFramesClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("simple");
  const [frameColor, setFrameColor] = useState("#ffffff");
  const [frameSize, setFrameSize] = useState(40);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("画像をアップロードしてフレームを追加しよう！");
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgEl) return;
    const ctx = canvas.getContext("2d")!;
    drawFrame(ctx, imgEl, frameStyle, frameColor, frameSize, 0, 0);
  }, [imgEl, frameStyle, frameColor, frameSize]);

  useEffect(() => { drawPreview(); }, [drawPreview]);

  const download = () => {
    if (!imgEl || !file) return;
    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d")!;
    drawFrame(ctx, imgEl, frameStyle, frameColor, frameSize, 0, 0);
    const a = document.createElement("a");
    a.href = exportCanvas.toDataURL("image/png");
    a.download = file.name.replace(/\.[^/.]+$/, "") + `_${frameStyle}_yamada-tools.png`;
    a.click();
    setIsComplete(true);
    setMascotState("success")
      triggerSuccess('decorative-frames');;
    setMascotMessage("ダウンロード完了！友達にもシェアしてね♪");
  };

  const loadImage = (f: File) => {
    setFile(f); setIsComplete(false);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        setImgW(img.width); setImgH(img.height); setImgEl(img);
        setMascotState("success")
      triggerSuccess('decorative-frames');;
        setMascotMessage("画像を読み込みました！フレームを選んでね！");
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

  const clearAll = () => {
    setFile(null); setImgEl(null); setImgW(0); setImgH(0);
    setFrameStyle("simple"); setFrameColor("#ffffff"); setFrameSize(40);
    setIsComplete(false);
    setMascotState("idle"); setMascotMessage("画像をアップロードしてフレームを追加しよう！");
  };

  if (!mounted) return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center"><p>読み込み中...</p></div></div>;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🖼️</div>
          <h1 className="text-3xl font-bold text-kon mb-2">フレーム加工</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">写真にオシャレなフレーム・額縁を追加</p>
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
              <div className="bg-gray-200 dark:bg-gray-900 rounded-xl p-4 mb-4 overflow-auto flex justify-center"
                style={{ backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\"><rect width=\"10\" height=\"10\" fill=\"%23ccc\"/><rect x=\"10\" y=\"10\" width=\"10\" height=\"10\" fill=\"%23ccc\"/></svg>')", backgroundSize: "20px 20px" }}>
                <canvas ref={canvasRef} className="max-w-full rounded shadow-lg" style={{ display: "block" }} />
              </div>
              <p className="text-xs text-gray-400 mb-4 text-center">元画像: {imgW}×{imgH}px</p>

              {/* Frame selection */}
              <div className="mb-4">
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-2">🖼️ フレームスタイル</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {FRAMES.map((f) => (
                    <button key={f.id} onClick={() => setFrameStyle(f.id)}
                      className={`px-2 py-2 rounded-lg text-xs font-medium text-center transition-all border ${frameStyle === f.id ? "bg-kon text-white border-kon shadow-md scale-105" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-kon"}`}>
                      <span className="block text-lg">{f.icon}</span>
                      <span className="block font-bold">{f.label}</span>
                      <span className="block text-[10px] opacity-70">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="mb-5 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200">⚙️ 設定</h3>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                    <span>枠の太さ: {frameSize}px</span>
                  </label>
                  <input type="range" min="10" max="150" value={frameSize}
                    onChange={(e) => setFrameSize(+e.target.value)} className="w-full accent-kon" />
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-600 dark:text-gray-300">枠の色:</label>
                  <input type="color" value={frameColor}
                    onChange={(e) => setFrameColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0" />
                  <div className="flex gap-1">
                    {["#ffffff", "#000000", "#f4e8c1", "#1a1a2e", "#e74c3c", "#2ecc71", "#3498db", "#f39c12"].map((c) => (
                      <button key={c} onClick={() => setFrameColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${frameColor === c ? "border-kon scale-110" : "border-gray-300"}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Download */}
              <div className="flex gap-2">
                <button onClick={download}
                  className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg transition-all">
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
              <ShareButtons title="フレーム加工 - 山田ツール" description="写真にオシャレなフレームを追加するツール。無料・ブラウザ処理で安全。" />
            </div>
          )}
        </section>

        {seoContent && (
          <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-kon mb-4 text-lg">フレーム加工について</h2>
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
            <p>・12種類のフレームから選択</p>
            <p>・枠の太さ・色を調整</p>
            <p>・リアルタイムプレビューで確認</p>
            <p>・ダウンロード</p>
          </div>
        </section>

        <section className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
          <h2 className="font-bold text-kon mb-6 text-lg text-center">📖 かんたん3ステップ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ icon: "📁", step: "Step 1", text: "画像をアップロード" }, { icon: "🖼️", step: "Step 2", text: "フレームを選んで調整" }, { icon: "💾", step: "Step 3", text: "ダウンロード" }].map((s, i) => (
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
          {[{ icon: "🆓", title: "完全無料", desc: "登録不要、制限なし" }, { icon: "🔒", title: "ブラウザ内処理", desc: "画像はサーバーに送信されません" }, { icon: "📱", title: "スマホ対応", desc: "タップ操作でフレーム加工" }].map((f, i) => (
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
