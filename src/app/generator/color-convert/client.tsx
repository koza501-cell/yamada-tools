"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot from "@/components/common/Mascot";

export default function ColorConvertClient() {
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, x)).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase();
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    const rgbVal = hexToRgb(newHex);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  };

  const updateFromRgb = (newRgb: { r: number; g: number; b: number }) => {
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const updateFromHsl = (newHsl: { h: number; s: number; l: number }) => {
    setHsl(newHsl);
    const rgbVal = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(rgbVal);
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  if (!mounted) {
    return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div></div>;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">カラーコード変換</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🎨</div>
          <h1 className="text-3xl font-bold text-kon mb-2">カラーコード変換</h1>
          <p className="text-gray-600 text-lg">HEX / RGB / HSL 相互変換</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state="idle" message="色を選んでね！" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="w-full h-48 rounded-xl mb-4 border-4 border-gray-200" style={{ backgroundColor: hex }} />
              <input
                type="color"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                className="w-full h-12 cursor-pointer rounded-xl"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">HEX</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hex}
                    onChange={(e) => updateFromHex(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-mono"
                  />
                  <button onClick={() => copyText(hex)} className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200">
                    コピー
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RGB</label>
                <div className="flex gap-2">
                  {["r", "g", "b"].map((c) => (
                    <input
                      key={c}
                      type="number"
                      min="0"
                      max="255"
                      value={rgb[c as keyof typeof rgb]}
                      onChange={(e) => updateFromRgb({ ...rgb, [c]: Number(e.target.value) })}
                      className="w-20 px-2 py-2 border border-gray-200 rounded-xl text-center"
                      placeholder={c.toUpperCase()}
                    />
                  ))}
                  <button onClick={() => copyText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200">
                    コピー
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">HSL</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => updateFromHsl({ ...hsl, h: Number(e.target.value) })}
                    className="w-20 px-2 py-2 border border-gray-200 rounded-xl text-center"
                    placeholder="H"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => updateFromHsl({ ...hsl, s: Number(e.target.value) })}
                    className="w-20 px-2 py-2 border border-gray-200 rounded-xl text-center"
                    placeholder="S"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => updateFromHsl({ ...hsl, l: Number(e.target.value) })}
                    className="w-20 px-2 py-2 border border-gray-200 rounded-xl text-center"
                    placeholder="L"
                  />
                  <button onClick={() => copyText(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200">
                    コピー
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
