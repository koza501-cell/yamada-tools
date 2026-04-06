// @ts-nocheck
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

interface FAQ { question: string; answer: string; }
interface Props { faq: FAQ[]; seoContent?: { intro: string }; }

export default function ImageOverlayClient({ faq, seoContent }: Props) {
  const [baseImage, setBaseImage] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [opacity, setOpacity] = useState(100);
  const [scale, setScale] = useState(30);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const canvasRef = useRef(null);
  const baseRef = useRef(null);
  const overlayRef = useRef(null);

  const loadBase = (file) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { baseRef.current = img; setBaseImage(e.target.result); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const loadOverlay = (file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { overlayRef.current = img; setOverlayImage(e.target.result); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const render = useCallback(() => {
    if (!baseRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const base = baseRef.current;
    canvas.width = base.naturalWidth;
    canvas.height = base.naturalHeight;
    ctx.drawImage(base, 0, 0);
    if (overlayRef.current) {
      ctx.globalAlpha = opacity / 100;
      const ow = base.naturalWidth * (scale / 100);
      const oh = (overlayRef.current.naturalHeight / overlayRef.current.naturalWidth) * ow;
      const ox = (posX / 100) * base.naturalWidth - ow / 2;
      const oy = (posY / 100) * base.naturalHeight - oh / 2;
      ctx.drawImage(overlayRef.current, ox, oy, ow, oh);
      ctx.globalAlpha = 1;
    }
  }, [opacity, scale, posX, posY]);

  useEffect(() => { if (baseImage) render(); }, [baseImage, overlayImage, render]);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = fileName.replace(/\.[^.]+$/, "") + "_overlay_yamada-tools.png";
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  const reset = () => { setBaseImage(null); setOverlayImage(null); setFileName(""); setOpacity(100); setScale(30); setPosX(50); setPosY(50); baseRef.current = null; overlayRef.current = null; };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔲</div>
          <h1 className="text-3xl font-bold text-kon mb-2">画像重ね合わせ</h1>
          <p className="text-gray-600 text-lg">ロゴ追加・ウォーターマーク・画像合成</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          {!baseImage ? (
            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer border-gray-300 hover:border-kon"
              onClick={() => document.getElementById("base-upload")?.click()}>
              <div className="text-5xl mb-3">🖼️</div>
              <p className="text-gray-600 mb-2 text-lg font-bold">ベース画像を選択</p>
              <button className="px-8 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors text-lg">📁 画像を選択</button>
              <input id="base-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadBase(f); }} />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4">
                <p className="font-bold text-sm truncate">{fileName}</p>
                <button onClick={reset} className="text-sm text-red-500 font-bold">✕ リセット</button>
              </div>

              {!overlayImage && (
                <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer border-orange-300 hover:border-orange-500 bg-orange-50 mb-4"
                  onClick={() => document.getElementById("overlay-upload")?.click()}>
                  <p className="font-bold text-orange-700 mb-2">重ねる画像（ロゴ等）を選択</p>
                  <button className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm">📁 選択</button>
                  <input id="overlay-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadOverlay(f); }} />
                  <p className="text-xs text-orange-400 mt-2">PNG透過画像がおすすめ</p>
                </div>
              )}

              {overlayImage && (
                <div className="bg-blue-50 rounded-xl p-4 mb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">透明度: {opacity}%</label>
                      <input type="range" min={0} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-kon" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">サイズ: {scale}%</label>
                      <input type="range" min={5} max={100} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-kon" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">横位置: {posX}%</label>
                      <input type="range" min={0} max={100} value={posX} onChange={(e) => setPosX(Number(e.target.value))} className="w-full accent-kon" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">縦位置: {posY}%</label>
                      <input type="range" min={0} max={100} value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="w-full accent-kon" />
                    </div>
                  </div>
                  <button onClick={() => { setOverlayImage(null); overlayRef.current = null; }} className="text-xs text-red-500">オーバーレイ画像を変更</button>
                </div>
              )}

              <div className="bg-gray-100 rounded-xl p-3 mb-4">
                <canvas ref={canvasRef} className="block mx-auto rounded-lg shadow-md max-w-full" style={{ maxHeight: "500px" }} />
              </div>
              <button onClick={download} className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all">
                💾 ダウンロード
              </button>
            </div>
          )}
        </section>

        {seoContent && (
          <section className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-bold text-kon mb-4 text-lg">画像重ね合わせとは？</h2>
            <p className="text-gray-600 leading-relaxed">{seoContent.intro}</p>
          </section>
        )}
        {faq?.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問（FAQ）</h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <details key={i} className="bg-white rounded-xl border border-gray-100 group">
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    <span><span className="text-kon">Q.</span> {item.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 border-t"><span className="text-kon font-medium">A.</span> {item.answer}</div>
                </details>
              ))}
            </div>
          </section>
        )}
        <div className="mt-8 text-center">
          <Link href="/image" className="text-kon hover:text-ai">← 画像ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
