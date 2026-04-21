// @ts-nocheck
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Mascot from "@/components/common/Mascot";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ { question: string; answer: string; }
interface Props { faq: FAQ[]; seoContent?: { intro: string }; }

const FONTS = [
  { value: "sans-serif", label: "ゴシック体" },
  { value: "serif", label: "明朝体" },
  { value: "monospace", label: "等幅" },
  { value: "cursive", label: "手書き風" },
];
const COLORS = ["#FFFFFF","#000000","#FF0000","#FF6600","#FFCC00","#00CC00","#0066FF","#9933FF","#FF3399","#333333","#666666","#CCCCCC"];

export default function TextOverlayClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [image, setImage] = useState(null);
  const [mascotState, setMascotState] = useState("idle");
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("テキストを入力");
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [color, setColor] = useState("#FFFFFF");
  const [bold, setBold] = useState(true);
  const [shadow, setShadow] = useState(true);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);
  const originalRef = useRef(null);

  const loadImage = (file) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setMascotState("working");
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { originalRef.current = img; setImage(e.target.result); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const render = useCallback(() => {
    if (!originalRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = originalRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    if (!text.trim()) return;
    const scaledSize = fontSize * (canvas.width / 800);
    const weight = bold ? "bold" : "normal";
    ctx.font = `${weight} ${scaledSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const x = (posX / 100) * canvas.width;
    const y = (posY / 100) * canvas.height;
    if (shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = scaledSize * 0.15;
      ctx.shadowOffsetX = scaledSize * 0.05;
      ctx.shadowOffsetY = scaledSize * 0.05;
    }
    ctx.fillStyle = color;
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + (i - (lines.length - 1) / 2) * scaledSize * 1.3);
    });
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }, [text, fontSize, fontFamily, color, bold, shadow, posX, posY]);

  useEffect(() => { if (image) render(); }, [image, render]);

  const download = () => {
    if (!canvasRef.current) return;
    setMascotState("success")
      triggerSuccess('text-overlay');;
    const a = document.createElement("a");
    a.download = fileName.replace(/\.[^.]+$/, "") + "_text_yamada-tools.png";
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  const reset = () => { setImage(null); setFileName(""); setText("テキストを入力"); setFontSize(48); setPosX(50); setPosY(50); };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">✍️</div>
          <h1 className="text-3xl font-bold text-kon mb-2">画像に文字入れ</h1>
          <p className="text-gray-600 text-lg">写真にテキストを追加・カスタマイズ</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <Mascot state={mascotState} />
          {!image ? (
            <div onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) loadImage(f); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${isDragging ? "border-kon bg-sakura/20" : "border-gray-300 hover:border-kon"}`}
              onClick={() => document.getElementById("img-upload")?.click()}>
              <div className="text-5xl mb-3">🖼️</div>
              <p className="text-gray-600 mb-2 text-lg font-bold">画像をドラッグ＆ドロップ</p>
              <button className="px-8 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors text-lg">📁 画像を選択</button>
              <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
              <p className="text-sm text-gray-400 mt-4">JPG, PNG, WebP, BMP, GIF対応</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4">
                <p className="font-bold text-sm truncate">{fileName}</p>
                <button onClick={reset} className="text-sm text-red-500 font-bold py-2 px-3 rounded hover:bg-red-50">✕ 閉じる</button>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-4 space-y-3">
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-y" placeholder="テキストを入力..." />
                <div className="flex flex-wrap gap-2 items-center">
                  <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="border rounded-lg px-2 py-1.5 text-sm">
                    {[12,16,20,24,32,40,48,64,80,96,120].map(s => <option key={s} value={s}>{s}px</option>)}
                  </select>
                  <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="border rounded-lg px-2 py-1.5 text-sm">
                    {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                  <button onClick={() => setBold(!bold)} className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${bold ? "bg-kon text-white border-kon" : "bg-white border-gray-300"}`}>B</button>
                  <button onClick={() => setShadow(!shadow)} className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${shadow ? "bg-kon text-white border-kon" : "bg-white border-gray-300"}`}>影</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 ${color === c ? "border-kon scale-110" : "border-gray-300"}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">横位置: {posX}%</label>
                    <input type="range" min={0} max={100} value={posX} onChange={(e) => setPosX(Number(e.target.value))} className="w-full accent-kon" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">縦位置: {posY}%</label>
                    <input type="range" min={0} max={100} value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="w-full accent-kon" />
                  </div>
                </div>
              </div>

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
            <h2 className="font-bold text-kon mb-4 text-lg">画像に文字入れとは？</h2>
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
