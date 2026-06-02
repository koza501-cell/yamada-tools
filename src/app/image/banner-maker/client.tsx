// @ts-nocheck
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";
import { ValueReminderInline } from "@/components/common/ValueReminder";
import Link from "next/link";
import Mascot from "@/components/common/Mascot";

interface FAQ { question: string; answer: string; }
interface Props { faq: FAQ[]; seoContent?: { intro: string }; }

const PRESETS = [
  { label: "SNS (OGP)", w: 1200, h: 628 },
  { label: "YouTube", w: 1280, h: 720 },
  { label: "ブログヘッダー", w: 1200, h: 400 },
  { label: "Instagram", w: 1080, h: 1080 },
  { label: "Twitter", w: 1500, h: 500 },
  { label: "Facebook", w: 820, h: 312 },
];

const BG_COLORS = [
  { value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", label: "パープル" },
  { value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", label: "ピンク" },
  { value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", label: "ブルー" },
  { value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", label: "グリーン" },
  { value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", label: "サンセット" },
  { value: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", label: "ラベンダー" },
  { value: "#1a1a2e", label: "ダーク" },
  { value: "#ffffff", label: "ホワイト" },
];

export default function BannerMakerClient({ faq, seoContent }: Props) {
  const [preset, setPreset] = useState(0);
  const [mascotState, setMascotState] = useState("idle");
  const [title, setTitle] = useState("タイトルテキスト");
  const [subtitle, setSubtitle] = useState("サブタイトル");
  const [bgIndex, setBgIndex] = useState(0);
  const [titleSize, setTitleSize] = useState(64);
  const [titleColor, setTitleColor] = useState("#FFFFFF");
  const canvasRef = useRef(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const p = PRESETS[preset];
    canvas.width = p.w; canvas.height = p.h;
    const ctx = canvas.getContext("2d");
    const bg = BG_COLORS[bgIndex].value;
    if (bg.startsWith("linear-gradient")) {
      const match = bg.match(/#[a-f0-9]{6}/gi);
      if (match) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, match[0]);
        gradient.addColorStop(1, match[1]);
        ctx.fillStyle = gradient;
      }
    } else {
      ctx.fillStyle = bg;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Title
    ctx.font = `bold ${titleSize}px sans-serif`;
    ctx.fillStyle = titleColor;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 10;
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - (subtitle ? 20 : 0));
    // Subtitle
    if (subtitle) {
      ctx.font = `${Math.round(titleSize * 0.45)}px sans-serif`;
      ctx.shadowBlur = 5;
      ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + titleSize * 0.6);
    }
    ctx.shadowBlur = 0;
  }, [preset, title, subtitle, bgIndex, titleSize, titleColor]);

  useEffect(() => { render(); }, [render]);

  const { triggerSuccess } = usePricingContext();

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = `banner_${PRESETS[preset].w}x${PRESETS[preset].h}_yamada-tools.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
    triggerSuccess('banner-maker');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🎨</div>
          <h1 className="text-3xl font-bold text-kon mb-2">バナー作成</h1>
          <p className="text-gray-600 text-lg">SNS・YouTube・ブログ用バナーを簡単作成</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <Mascot state={mascotState} />
          <div className="space-y-4">
            <div>
              <label className="font-bold text-sm text-gray-700 mb-2 block">📐 サイズ</label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p, i) => (
                  <button type="button" key={i} onClick={() => setPreset(i)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition ${preset === i ? "bg-kon text-white border-kon" : "bg-white text-gray-600 border-gray-200 hover:border-kon"}`}>
                    {p.label}<br /><span className="text-[10px] opacity-70">{p.w}×{p.h}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-bold text-sm text-gray-700 mb-2 block">🎨 背景</label>
              <div className="flex flex-wrap gap-2">
                {BG_COLORS.map((bg, i) => (
                  <button type="button" key={i} onClick={() => setBgIndex(i)}
                    className={`w-10 h-10 rounded-lg border-2 transition ${bgIndex === i ? "border-kon scale-110" : "border-gray-200"}`}
                    style={{ background: bg.value }} title={bg.label} />
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">タイトル</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500">サブタイトル</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <label className="text-xs text-gray-500">文字サイズ: {titleSize}px</label>
                <input type="range" min={24} max={120} value={titleSize} onChange={(e) => setTitleSize(Number(e.target.value))} className="w-full accent-kon" />
              </div>
              <div>
                <label className="text-xs text-gray-500">文字色</label>
                <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-10 h-10 rounded border cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-3 mt-4 mb-4">
            <canvas ref={canvasRef} className="block mx-auto rounded-lg shadow-md max-w-full" style={{ maxHeight: "400px" }} />
          </div>
          <button type="button" onClick={download} className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all">
            💾 バナーをダウンロード
          </button>
          <ValueReminderInline />
        </section>

        {seoContent && (
          <section className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-bold text-kon mb-4 text-lg">バナー作成とは？</h2>
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
