// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import Link from "next/link";

interface FAQ { question: string; answer: string; }
interface Props { faq: FAQ[]; seoContent?: { intro: string }; }

export default function GifMakerClient({ faq, seoContent }: Props) {
  const [frames, setFrames] = useState([]);
  const [delay, setDelay] = useState(500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gifUrl, setGifUrl] = useState(null);
  const [error, setError] = useState("");

  const addFrames = (files) => {
    const newFrames = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        newFrames.push(e.target.result);
        if (newFrames.length === files.length || newFrames.length >= 20 - frames.length) {
          setFrames(prev => [...prev, ...newFrames].slice(0, 20));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFrame = (index) => {
    setFrames(prev => prev.filter((_, i) => i !== index));
  };

  const createGif = async () => {
    if (frames.length < 2) { setError("2枚以上の画像が必要です"); return; }
    setIsProcessing(true); setError("");
    try {
      // Load gif.js from CDN
      if (!window.GIF) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "/gif.js";
          s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const firstImg = await loadImg(frames[0]);
      const gif = new window.GIF({
        workers: 2, quality: 10,
        workerScript: "/gif.worker.js",
        width: firstImg.naturalWidth, height: firstImg.naturalHeight,
      });
      for (const src of frames) {
        const img = await loadImg(src);
        const canvas = document.createElement("canvas");
        canvas.width = firstImg.naturalWidth;
        canvas.height = firstImg.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
        const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        gif.addFrame(canvas, { delay, copy: true });
      }
      gif.on("finished", (blob) => {
        setGifUrl(URL.createObjectURL(blob));
        setIsProcessing(false);
      });
      gif.render();
    } catch (e) {
      setError("GIF作成に失敗しました: " + e.message);
      setIsProcessing(false);
    }
  };

  const loadImg = (src) => new Promise((resolve) => {
    const img = new Image(); img.onload = () => resolve(img); img.src = src;
  });

  const download = () => {
    if (!gifUrl) return;
    const a = document.createElement("a");
    a.download = "animation_yamada-tools.gif";
    a.href = gifUrl;
    a.click();
  };

  const reset = () => { setFrames([]); setGifUrl(null); setError(""); setDelay(500); };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🎞️</div>
          <h1 className="text-3xl font-bold text-kon mb-2">GIFアニメ作成</h1>
          <p className="text-gray-600 text-lg">複数の画像からGIFアニメーションを作成</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer border-gray-300 hover:border-kon mb-4"
            onClick={() => document.getElementById("gif-upload")?.click()}>
            <p className="text-gray-600 font-bold mb-2">📁 画像を追加（2〜20枚）</p>
            <p className="text-sm text-gray-400">クリックして画像を選択</p>
            <input id="gif-upload" type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => { if (e.target.files) addFrames(e.target.files); }} />
          </div>

          {frames.length > 0 && (
            <>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-4">
                {frames.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt={`Frame ${i+1}`} className="w-full aspect-square object-cover rounded-lg border" />
                    <button onClick={() => removeFrame(i)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition">×</button>
                    <span className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-1 rounded-br-lg">{i+1}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-sm">フレーム間隔</label>
                  <span className="font-bold">{delay}ms ({(delay/1000).toFixed(1)}秒)</span>
                </div>
                <input type="range" min={100} max={2000} step={100} value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))} className="w-full accent-kon" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>速い (0.1秒)</span><span>遅い (2秒)</span>
                </div>
              </div>

              <button onClick={createGif} disabled={isProcessing || frames.length < 2}
                className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 mb-4">
                {isProcessing ? "⏳ GIF作成中..." : `🎞️ ${frames.length}枚からGIFを作成`}
              </button>
            </>
          )}

          {gifUrl && (
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="font-bold text-green-700 mb-3">✅ GIF作成完了！</p>
              <img src={gifUrl} alt="Generated GIF" className="mx-auto rounded-lg shadow-md max-w-full mb-4" style={{ maxHeight: "400px" }} />
              <button onClick={download} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700">
                💾 GIFをダウンロード
              </button>
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mt-4 text-sm">⚠️ {error}</div>}

          <button onClick={reset} className="w-full mt-4 py-2 text-gray-500 hover:text-red-500 text-sm">🗑 リセット</button>
        </section>

        {seoContent && (
          <section className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-bold text-kon mb-4 text-lg">GIFアニメ作成とは？</h2>
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
