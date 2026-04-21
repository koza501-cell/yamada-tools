// @ts-nocheck
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Mascot from "@/components/common/Mascot";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; }
interface Props { faq: FAQ[]; seoContent?: SeoContent; }

export default function MosaicClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [image, setImage] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState("idle");
  const [fileName, setFileName] = useState("");
  const [intensity, setIntensity] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<HTMLImageElement | null>(null);

  const loadImage = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setMascotState("working");
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalRef.current = img;
        setImage(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const applyFilter = useCallback(() => {
    if (!originalRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const img = originalRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    
    const blockSize = Math.max(2, Math.floor(intensity));
    const w = canvas.width;
    const h = canvas.height;
    for (let y = 0; y < h; y += blockSize) {
      for (let x = 0; x < w; x += blockSize) {
        const bw = Math.min(blockSize, w - x);
        const bh = Math.min(blockSize, h - y);
        const data = ctx.getImageData(x, y, bw, bh).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]; g += data[i+1]; b += data[i+2]; count++;
        }
        ctx.fillStyle = `rgb(${Math.round(r/count)},${Math.round(g/count)},${Math.round(b/count)})`;
        ctx.fillRect(x, y, bw, bh);
      }
    }
  }, [intensity]);

  useEffect(() => {
    if (image) applyFilter();
  }, [image, applyFilter]);

  const download = () => {
    if (!canvasRef.current) return;
    setMascotState("success")
      triggerSuccess('mosaic');;
    const a = document.createElement("a");
    a.download = fileName.replace(/\.[^.]+$/, "") + "_mosaic_yamada-tools.png";
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  const reset = () => {
    setImage(null);
    setFileName("");
    setIntensity(15);
    originalRef.current = null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadImage(f);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔲</div>
          <h1 className="text-3xl font-bold text-kon mb-2">モザイク加工</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">画像の顔・個人情報をモザイクで隠す</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">📱 スマホ対応</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          <Mascot state={mascotState} />
          {!image ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                isDragging ? "border-kon bg-sakura/20" : "border-gray-300 hover:border-kon"
              }`}
              onClick={() => document.getElementById("img-upload")?.click()}
            >
              <div className="text-5xl mb-3">🖼️</div>
              <p className="text-gray-600 mb-2 text-lg font-bold">画像をドラッグ＆ドロップ</p>
              <p className="text-gray-400 mb-4">または下のボタンで選択</p>
              <button className="px-8 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors text-lg">
                📁 画像を選択する
              </button>
              <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
              <p className="text-sm text-gray-400 mt-4">JPG, PNG, WebP, BMP, GIF対応 ・ ブラウザ内処理で安全</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🖼️</span>
                  <p className="font-bold text-sm truncate max-w-[200px] sm:max-w-none">{fileName}</p>
                </div>
                <button onClick={reset} className="text-sm text-red-500 hover:text-red-700 font-bold py-2 px-3 rounded hover:bg-red-50">✕ 閉じる</button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-sm text-gray-700 dark:text-gray-200">モザイクの強さ</label>
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-300">{intensity}</span>
                </div>
                <input type="range" min={2} max={50} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full accent-kon" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>弱い（細かい）</span><span>強い（粗い）</span>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-3 mb-4">
                <canvas ref={canvasRef} className="block mx-auto rounded-lg shadow-md max-w-full" style={{ maxHeight: "500px", objectFit: "contain" }} />
              </div>

              <button onClick={download} className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all">
                💾 加工した画像をダウンロード
              </button>
            </div>
          )}
        </section>

        {seoContent && (
          <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-kon mb-4 text-lg">モザイク加工とは？</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{seoContent.intro}</p>
          </section>
        )}

        {faq && faq.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問（FAQ）</h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <details key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden group">
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="text-kon">Q.</span>{item.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                    <span className="text-kon font-medium">A.</span> {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { icon: "🆓", title: "完全無料", desc: "登録不要、制限なし" },
            { icon: "🔒", title: "ブラウザ内処理", desc: "サーバーに送信されません" },
            { icon: "📱", title: "スマホ対応", desc: "外出先でも画像加工" },
          ].map((f, i) => (
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
          <p>🔒 すべての処理はブラウザ内で行われます。ファイルがサーバーに送信されることはありません。</p>
        </footer>
      </div>
    </div>
  );
}
