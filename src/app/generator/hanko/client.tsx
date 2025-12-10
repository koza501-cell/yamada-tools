"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

type HankoShape = "circle" | "square" | "oval";
type HankoStyle = "single" | "double";

export default function HankoClient() {
  const [name, setName] = useState("山田");
  const [shape, setShape] = useState<HankoShape>("circle");
  const [style, setStyle] = useState<HankoStyle>("single");
  const [color, setColor] = useState("#d32f2f");
  const [size, setSize] = useState(120);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("名前を入力して印鑑を作ろう！");
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && name) {
      generateHanko();
    }
  }, [name, shape, style, color, size, mounted]);

  const generateHanko = () => {
    const canvas = canvasRef.current;
    if (!canvas || !name) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = shape === "oval" ? size * 1.3 : size;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = size / 2 - 4;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = style === "double" ? 2 : 3;

    // Draw shape
    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      if (style === "double") {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (shape === "square") {
      const margin = 4;
      ctx.strokeRect(margin, margin, size - margin * 2, size - margin * 2);
      if (style === "double") {
        ctx.strokeRect(margin + 6, margin + 6, size - margin * 2 - 12, size - margin * 2 - 12);
      }
    } else if (shape === "oval") {
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 0.7, radius, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (style === "double") {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * 0.7 - 6, radius - 6, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Draw text
    const chars = name.slice(0, 4).split("");
    const isVertical = chars.length > 1;
    
    if (isVertical) {
      const fontSize = Math.floor(size / (chars.length + 1));
      ctx.font = `bold ${fontSize}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      const totalHeight = chars.length * fontSize;
      const startY = centerY - totalHeight / 2 + fontSize / 2;
      
      chars.forEach((char, i) => {
        ctx.fillText(char, centerX, startY + i * fontSize);
      });
    } else {
      const fontSize = Math.floor(size * 0.5);
      ctx.font = `bold ${fontSize}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(chars[0], centerX, centerY);
    }

    setResultUrl(canvas.toDataURL("image/png"));
    setMascotState("success");
    setMascotMessage("印鑑ができたよ！");
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `hanko_${name}_yamada-tools.png`;
    a.click();
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
            <li className="text-kon font-medium">電子印鑑作成</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔴</div>
          <h1 className="text-3xl font-bold text-kon mb-2">電子印鑑作成</h1>
          <p className="text-gray-600 text-lg">デジタルハンコを簡単作成</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">名前（1〜4文字）</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 4))}
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon text-xl"
                  placeholder="山田"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">形状</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "circle", label: "丸印" },
                    { value: "square", label: "角印" },
                    { value: "oval", label: "小判型" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setShape(opt.value as HankoShape)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        shape === opt.value ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">枠線</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStyle("single")}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      style === "single" ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    一重
                  </button>
                  <button
                    onClick={() => setStyle("double")}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      style === "double" ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    二重
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">色</label>
                <div className="flex gap-2">
                  {["#d32f2f", "#1976d2", "#388e3c", "#7b1fa2", "#000000"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        color === c ? "border-kon scale-110" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">サイズ: {size}px</label>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-kon"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray-50 p-8 rounded-xl mb-4">
                <canvas ref={canvasRef} className="mx-auto" style={{ imageRendering: "pixelated" }} />
              </div>
              <button
                onClick={download}
                disabled={!resultUrl}
                className="w-full py-3 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg disabled:bg-gray-300"
              >
                ダウンロード（PNG透過）
              </button>
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
