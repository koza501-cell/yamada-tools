"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import ShareButtons from "@/components/common/ShareButtons";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; useCases?: { title: string; desc: string }[]; tips?: string; }
interface Props { faq: FAQ[]; seoContent?: SeoContent; }

interface LineSettings {
  lineCount: number;
  thickness: number;
  innerRadius: number; // % of image diagonal where lines stop (clear area)
  color: string;
  opacity: number;
  style: "straight" | "tapered";
}

const PRESETS: { label: string; icon: string; settings: Partial<LineSettings> }[] = [
  { label: "漫画風", icon: "💥", settings: { lineCount: 80, thickness: 3, innerRadius: 25, color: "#000000", opacity: 85, style: "tapered" } },
  { label: "少年漫画", icon: "⚡", settings: { lineCount: 120, thickness: 2, innerRadius: 20, color: "#000000", opacity: 90, style: "tapered" } },
  { label: "インパクト", icon: "💢", settings: { lineCount: 60, thickness: 5, innerRadius: 15, color: "#000000", opacity: 95, style: "straight" } },
  { label: "やわらか", icon: "", settings: { lineCount: 40, thickness: 2, innerRadius: 35, color: "#000000", opacity: 50, style: "tapered" } },
  { label: "赤集中線", icon: "🔴", settings: { lineCount: 80, thickness: 3, innerRadius: 25, color: "#cc0000", opacity: 80, style: "tapered" } },
  { label: "白集中線", icon: "⚪", settings: { lineCount: 80, thickness: 3, innerRadius: 25, color: "#ffffff", opacity: 85, style: "tapered" } },
];

export default function ConcentrationLinesClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);

  // Center point (percentage 0-100)
  const [centerX, setCenterX] = useState(50);
  const [centerY, setCenterY] = useState(50);

  // Line settings
  const [settings, setSettings] = useState<LineSettings>({
    lineCount: 80,
    thickness: 3,
    innerRadius: 25,
    color: "#000000",
    opacity: 85,
    style: "tapered",
  });

  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("画像をアップロードして集中線を追加しよう！");
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Draw image + concentration lines
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgEl) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = imgEl.width;
    canvas.height = imgEl.height;

    // Draw original image
    ctx.drawImage(imgEl, 0, 0);

    // Calculate center in pixels
    const cx = (centerX / 100) * imgEl.width;
    const cy = (centerY / 100) * imgEl.height;

    // Diagonal length (max distance from center to any corner)
    const diagonal = Math.sqrt(imgEl.width * imgEl.width + imgEl.height * imgEl.height);
    const innerR = (settings.innerRadius / 100) * diagonal * 0.5;

    // Draw concentration lines
    ctx.save();
    ctx.globalAlpha = settings.opacity / 100;

    const angleStep = (Math.PI * 2) / settings.lineCount;
    // Add slight randomness for natural look
    const seed = 42;

    for (let i = 0; i < settings.lineCount; i++) {
      // Base angle with slight random offset for natural look
      const baseAngle = i * angleStep;
      const randomOffset = (Math.sin(i * 127.1 + seed) * 0.5) * angleStep * 0.4;
      const angle = baseAngle + randomOffset;

      // Random thickness variation
      const thickVar = 0.6 + Math.abs(Math.sin(i * 311.7 + seed)) * 0.8;
      const lineThick = settings.thickness * thickVar;

      // Calculate start point (edge of image + margin)
      const outerR = diagonal; // extend beyond image edge
      const startX = cx + Math.cos(angle) * outerR;
      const startY = cy + Math.sin(angle) * outerR;

      // End point (inner radius with variation)
      const innerVar = 0.8 + Math.abs(Math.sin(i * 73.3 + seed)) * 0.4;
      const endR = innerR * innerVar;
      const endX = cx + Math.cos(angle) * endR;
      const endY = cy + Math.sin(angle) * endR;

      ctx.strokeStyle = settings.color;

      if (settings.style === "tapered") {
        // Tapered lines: thick at outer, thin at inner
        // Draw as a triangle/wedge shape
        const perpAngle = angle + Math.PI / 2;
        const outerHalfW = lineThick * 1.5;
        const innerHalfW = lineThick * 0.15;

        ctx.fillStyle = settings.color;
        ctx.beginPath();
        ctx.moveTo(
          startX + Math.cos(perpAngle) * outerHalfW,
          startY + Math.sin(perpAngle) * outerHalfW
        );
        ctx.lineTo(
          startX - Math.cos(perpAngle) * outerHalfW,
          startY - Math.sin(perpAngle) * outerHalfW
        );
        ctx.lineTo(
          endX - Math.cos(perpAngle) * innerHalfW,
          endY - Math.sin(perpAngle) * innerHalfW
        );
        ctx.lineTo(
          endX + Math.cos(perpAngle) * innerHalfW,
          endY + Math.sin(perpAngle) * innerHalfW
        );
        ctx.closePath();
        ctx.fill();
      } else {
        // Straight uniform lines
        ctx.lineWidth = lineThick;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }

    ctx.restore();

    // Draw center point indicator (preview only, excluded from download)
    const indicatorR = Math.max(6, diagonal * 0.008);
    ctx.strokeStyle = "rgba(255, 0, 0, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, indicatorR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - indicatorR * 1.5, cy);
    ctx.lineTo(cx + indicatorR * 1.5, cy);
    ctx.moveTo(cx, cy - indicatorR * 1.5);
    ctx.lineTo(cx, cy + indicatorR * 1.5);
    ctx.stroke();
  }, [imgEl, centerX, centerY, settings]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  // Handle click on canvas to set center
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setCenterX((x / canvas.width) * 100);
    setCenterY((y / canvas.height) * 100);
  };

  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.touches[0].clientX - rect.left) * scaleX;
    const y = (e.touches[0].clientY - rect.top) * scaleY;
    setCenterX((x / canvas.width) * 100);
    setCenterY((y / canvas.height) * 100);
  };

  const download = () => {
    if (!imgEl || !file) return;

    // Redraw without center indicator
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = imgEl.width;
    exportCanvas.height = imgEl.height;
    const ctx = exportCanvas.getContext("2d")!;

    ctx.drawImage(imgEl, 0, 0);

    const cx = (centerX / 100) * imgEl.width;
    const cy = (centerY / 100) * imgEl.height;
    const diagonal = Math.sqrt(imgEl.width * imgEl.width + imgEl.height * imgEl.height);
    const innerR = (settings.innerRadius / 100) * diagonal * 0.5;

    ctx.save();
    ctx.globalAlpha = settings.opacity / 100;

    const angleStep = (Math.PI * 2) / settings.lineCount;
    const seed = 42;

    for (let i = 0; i < settings.lineCount; i++) {
      const baseAngle = i * angleStep;
      const randomOffset = (Math.sin(i * 127.1 + seed) * 0.5) * angleStep * 0.4;
      const angle = baseAngle + randomOffset;
      const thickVar = 0.6 + Math.abs(Math.sin(i * 311.7 + seed)) * 0.8;
      const lineThick = settings.thickness * thickVar;
      const outerR = diagonal;
      const startX = cx + Math.cos(angle) * outerR;
      const startY = cy + Math.sin(angle) * outerR;
      const innerVar = 0.8 + Math.abs(Math.sin(i * 73.3 + seed)) * 0.4;
      const endR = innerR * innerVar;
      const endX = cx + Math.cos(angle) * endR;
      const endY = cy + Math.sin(angle) * endR;

      if (settings.style === "tapered") {
        const perpAngle = angle + Math.PI / 2;
        const outerHalfW = lineThick * 1.5;
        const innerHalfW = lineThick * 0.15;
        ctx.fillStyle = settings.color;
        ctx.beginPath();
        ctx.moveTo(startX + Math.cos(perpAngle) * outerHalfW, startY + Math.sin(perpAngle) * outerHalfW);
        ctx.lineTo(startX - Math.cos(perpAngle) * outerHalfW, startY - Math.sin(perpAngle) * outerHalfW);
        ctx.lineTo(endX - Math.cos(perpAngle) * innerHalfW, endY - Math.sin(perpAngle) * innerHalfW);
        ctx.lineTo(endX + Math.cos(perpAngle) * innerHalfW, endY + Math.sin(perpAngle) * innerHalfW);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.strokeStyle = settings.color;
        ctx.lineWidth = lineThick;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
    ctx.restore();

    const a = document.createElement("a");
    a.href = exportCanvas.toDataURL("image/png");
    a.download = file.name.replace(/\.[^/.]+$/, "") + "_concentration_yamada-tools.png";
    a.click();
    setIsComplete(true);
    setMascotState("success")
      triggerSuccess('concentration-lines');;
    setMascotMessage("ダウンロード完了！友達にもシェアしてね♪");
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setSettings((prev) => ({ ...prev, ...preset.settings }));
  };

  const updateSetting = <K extends keyof LineSettings>(key: K, value: LineSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const loadImage = (f: File) => {
    setFile(f); setIsComplete(false);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        setImgW(img.width); setImgH(img.height); setImgEl(img);
        setCenterX(50); setCenterY(50);
        setMascotState("success")
      triggerSuccess('concentration-lines');;
        setMascotMessage("画像をクリックして集中線の中心を指定してね！");
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
    setCenterX(50); setCenterY(50); setIsComplete(false);
    setSettings({ lineCount: 80, thickness: 3, innerRadius: 25, color: "#000000", opacity: 85, style: "tapered" });
    setMascotState("idle"); setMascotMessage("画像をアップロードして集中線を追加しよう！");
  };

  if (!mounted) return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center"><p>読み込み中...</p></div></div>;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">💥</div>
          <h1 className="text-3xl font-bold text-kon mb-2">集中線加工</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">漫画風の集中線エフェクトを画像に追加</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">📱 スマホ対応</span>
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
                <p className="text-xs text-center text-gray-500 mb-1">👆 クリック（タップ）で中心を移動</p>
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  onTouchStart={handleCanvasTouch}
                  className="max-w-full mx-auto rounded-lg cursor-crosshair"
                  style={{ display: "block" }}
                />
                <p className="text-xs text-gray-400 mt-2 px-1">{imgW}×{imgH}px ｜ 中心: ({Math.round(centerX)}%, {Math.round(centerY)}%)</p>
              </div>

              {/* Presets */}
              <div className="mb-4">
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-2">🎨 プリセット</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESETS.map((p) => (
                    <button key={p.label} onClick={() => applyPreset(p)}
                      className="px-2 py-2 rounded-lg text-xs font-medium text-center transition-colors bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-kon">
                      <span className="block text-lg">{p.icon}</span>
                      <span className="block">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="mb-5 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200">⚙️ 設定</h3>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                    <span>本数: {settings.lineCount}</span>
                  </label>
                  <input type="range" min="20" max="200" value={settings.lineCount}
                    onChange={(e) => updateSetting("lineCount", +e.target.value)} className="w-full accent-kon" />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                    <span>太さ: {settings.thickness}</span>
                  </label>
                  <input type="range" min="1" max="10" step="0.5" value={settings.thickness}
                    onChange={(e) => updateSetting("thickness", +e.target.value)} className="w-full accent-kon" />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                    <span>中心の抜き: {settings.innerRadius}%</span>
                  </label>
                  <input type="range" min="5" max="50" value={settings.innerRadius}
                    onChange={(e) => updateSetting("innerRadius", +e.target.value)} className="w-full accent-kon" />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                    <span>不透明度: {settings.opacity}%</span>
                  </label>
                  <input type="range" min="10" max="100" value={settings.opacity}
                    onChange={(e) => updateSetting("opacity", +e.target.value)} className="w-full accent-kon" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-300">色:</label>
                    <input type="color" value={settings.color}
                      onChange={(e) => updateSetting("color", e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-300">スタイル:</label>
                    <button onClick={() => updateSetting("style", "tapered")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${settings.style === "tapered" ? "bg-kon text-white" : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200"}`}>
                      先細り
                    </button>
                    <button onClick={() => updateSetting("style", "straight")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${settings.style === "straight" ? "bg-kon text-white" : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200"}`}>
                      均一
                    </button>
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
              <ShareButtons title="集中線加工 - 山田ツール" description="漫画風の集中線を画像に追加するツール。無料・ブラウザ処理で安全。" />
            </div>
          )}
        </section>

        {seoContent && (
          <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-kon mb-4 text-lg">集中線加工について</h2>
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
            <p>・画像をアップロード</p>
            <p>・画像をクリックして集中線の中心を指定</p>
            <p>・プリセットを選ぶ or 各設定を調整</p>
            <p>・リアルタイムで結果を確認</p>
            <p>・ダウンロード</p>
          </div>
        </section>

        <section className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-gray-200 dark:border-kon">
          <h2 className="font-bold text-kon mb-6 text-lg text-center">📖 かんたん3ステップ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ icon: "📁", step: "Step 1", text: "画像をアップロード" }, { icon: "👆", step: "Step 2", text: "中心をクリックして調整" }, { icon: "💾", step: "Step 3", text: "ダウンロード" }].map((s, i) => (
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
          {[{ icon: "🆓", title: "完全無料", desc: "登録不要、制限なし" }, { icon: "🔒", title: "ブラウザ内処理", desc: "画像はサーバーに送信されません" }, { icon: "📱", title: "スマホ対応", desc: "タップ操作で集中線追加" }].map((f, i) => (
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
