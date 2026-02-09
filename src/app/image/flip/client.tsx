// @ts-nocheck
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

interface FAQ { question: string; answer: string; }
interface Props { faq: FAQ[]; seoContent?: { intro: string }; }

export default function FlipClient({ faq, seoContent }: Props) {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);
  const originalRef = useRef(null);

  const loadImage = (file) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => { originalRef.current = img; setImage(e.target.result); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const applyFlip = useCallback(() => {
    if (!originalRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = originalRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.save();
    ctx.translate(flipH ? canvas.width : 0, flipV ? canvas.height : 0);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }, [flipH, flipV]);

  useEffect(() => { if (image) applyFlip(); }, [image, applyFlip]);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = fileName.replace(/\.[^.]+$/, "") + "_flip_yamada-tools.png";
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  const reset = () => { setImage(null); setFileName(""); setFlipH(false); setFlipV(false); };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li><li>/</li>
            <li><Link href="/image" className="hover:text-kon">画像ツール</Link></li><li>/</li>
            <li className="text-kon font-medium">画像反転</li>
          </ol>
        </nav>
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔄</div>
          <h1 className="text-3xl font-bold text-kon mb-2">画像反転（左右・上下）</h1>
          <p className="text-gray-600 text-lg">写真を水平反転・垂直反転</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
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
                <button onClick={reset} className="text-sm text-red-500 font-bold">✕ 閉じる</button>
              </div>
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setFlipH(!flipH)} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${flipH ? "bg-kon text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  ↔️ 水平反転 {flipH ? "ON" : "OFF"}
                </button>
                <button onClick={() => setFlipV(!flipV)} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${flipV ? "bg-kon text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  ↕️ 垂直反転 {flipV ? "ON" : "OFF"}
                </button>
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
            <h2 className="font-bold text-kon mb-4 text-lg">画像反転とは？</h2>
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
