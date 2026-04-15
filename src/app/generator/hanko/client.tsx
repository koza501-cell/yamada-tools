"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import ShareButtons from "@/components/common/ShareButtons";
import RelatedTools, { relatedToolSets } from "@/components/common/RelatedTools";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

type HankoShape = "circle" | "square" | "oval";
type HankoStyle = "single" | "double";
type HankoType = "name" | "date" | "approved";
type TextDirection = "vertical" | "horizontal";

const POPULAR_NAMES = ["佐藤", "鈴木", "高橋", "田中", "伊藤", "渡辺", "山本", "中村", "小林", "加藤", "山田", "吉田"];

const FONT_OPTIONS = [
  { value: "serif", label: "明朝体" },
  { value: "'Noto Serif JP', serif", label: "楷書風" },
  { value: "sans-serif", label: "ゴシック" },
];

export default function HankoClient() {
  const { triggerSuccess } = usePricingContext();


  const [name, setName] = useState("山田");
  const [shape, setShape] = useState<HankoShape>("circle");
  const [style, setStyle] = useState<HankoStyle>("single");
  const [color, setColor] = useState("#d32f2f");
  const [size, setSize] = useState(120);
  const [font, setFont] = useState("serif");
  const [hankoType, setHankoType] = useState<HankoType>("name");
  const [textDirection, setTextDirection] = useState<TextDirection>("vertical");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("名前を入力して印鑑を作ろう！");
  const [mounted, setMounted] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && name) generateHanko();
  }, [name, shape, style, color, size, font, hankoType, textDirection, mounted]);

  const getTodayDate = () => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  };

  const generateHanko = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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

    if (hankoType === "date") {
      const { year, month, day } = getTodayDate();
      const fontSize = Math.floor(size / 6);
      ctx.font = "bold " + fontSize + "px " + font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.beginPath();
      ctx.moveTo(centerX - radius + 10, centerY - fontSize);
      ctx.lineTo(centerX + radius - 10, centerY - fontSize);
      ctx.moveTo(centerX - radius + 10, centerY + fontSize);
      ctx.lineTo(centerX + radius - 10, centerY + fontSize);
      ctx.stroke();
      ctx.fillText(name || "承認", centerX, centerY - fontSize * 1.8);
      ctx.fillText(year + "." + month + "." + day, centerX, centerY);
      ctx.fillText("済", centerX, centerY + fontSize * 1.8);
    } else if (hankoType === "approved") {
      const fontSize = Math.floor(size / 3);
      ctx.font = "bold " + fontSize + "px " + font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("済", centerX, centerY);
    } else {
      const chars = name.slice(0, 4).split("");
      if (textDirection === "vertical" && chars.length > 1) {
        const fontSize = Math.floor(size / (chars.length + 1));
        ctx.font = "bold " + fontSize + "px " + font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const totalHeight = chars.length * fontSize;
        const startY = centerY - totalHeight / 2 + fontSize / 2;
        chars.forEach((char, i) => {
          ctx.fillText(char, centerX, startY + i * fontSize); });
      } else {
        const fontSize = chars.length === 1 ? Math.floor(size * 0.5) : Math.floor(size / (chars.length + 0.5));
        ctx.font = "bold " + fontSize + "px " + font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name, centerX, centerY);
      }
    }

    setResultUrl(canvas.toDataURL("image/png"));
    setMascotState("success")
      triggerSuccess('hanko');;
    setMascotMessage("電子印鑑が作成されました。下のボタンよりダウンロードください。");
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "hanko_" + name + "_yamada-tools.png";
    a.click();
    setDownloaded(true);
    setMascotState("success")
      triggerSuccess('hanko');;
    setMascotMessage("ダウンロードが完了しました。ご利用ありがとうございます。");
  };

  if (!mounted) {
    return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div></div>;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔴</div>
          <h1 className="text-3xl font-bold text-kon mb-2">電子印鑑作成【無料】｜認印・角印・日付印を10秒で作成</h1>
          <p className="text-gray-600 text-lg">デジタルハンコを簡単作成・無料ダウンロード</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">印鑑タイプ</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: "name", label: "認印" }, { value: "date", label: "日付印" }, { value: "approved", label: "済印" }].map((opt) => (
                    <button key={opt.value} onClick={() => setHankoType(opt.value as HankoType)}
                      className={"py-2 rounded-lg text-sm font-medium transition-all " + (hankoType === opt.value ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200")}>{opt.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{hankoType === "date" ? "上段テキスト" : "名前"}（1〜4文字）</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value.slice(0, 4))} maxLength={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon text-xl" placeholder="山田" />
              </div>

              {hankoType === "name" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">よく使われる名字</label>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_NAMES.map((n) => (
                      <button key={n} onClick={() => setName(n)}
                        className={"px-3 py-1 rounded-full text-sm transition-all " + (name === n ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200")}>{n}</button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">フォント</label>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setFont(opt.value)}
                      className={"py-2 rounded-lg text-sm font-medium transition-all " + (font === opt.value ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200")}>{opt.label}</button>
                  ))}
                </div>
              </div>

              {hankoType === "name" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">文字方向</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setTextDirection("vertical")}
                      className={"py-2 rounded-lg text-sm font-medium transition-all " + (textDirection === "vertical" ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200")}>縦書き</button>
                    <button onClick={() => setTextDirection("horizontal")}
                      className={"py-2 rounded-lg text-sm font-medium transition-all " + (textDirection === "horizontal" ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200")}>横書き</button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">形状</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ value: "circle", label: "丸印" }, { value: "square", label: "角印" }, { value: "oval", label: "小判型" }].map((opt) => (
                    <button key={opt.value} onClick={() => setShape(opt.value as HankoShape)}
                      className={"py-2 rounded-lg text-sm font-medium transition-all " + (shape === opt.value ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200")}>{opt.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">枠線</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setStyle("single")}
                    className={"py-2 rounded-lg text-sm font-medium transition-all " + (style === "single" ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200")}>一重</button>
                  <button onClick={() => setStyle("double")}
                    className={"py-2 rounded-lg text-sm font-medium transition-all " + (style === "double" ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200")}>二重</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">色</label>
                <div className="flex gap-2">
                  {["#d32f2f", "#c62828", "#b71c1c", "#1976d2", "#388e3c", "#7b1fa2", "#000000"].map((c) => (
                    <button key={c} onClick={() => setColor(c)}
                      className={"w-10 h-10 rounded-full border-2 transition-all " + (color === c ? "border-kon scale-110" : "border-gray-200")}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">サイズ: {size}px</label>
                <input type="range" min="60" max="200" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-kon" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray-50 p-8 rounded-xl mb-4 min-h-[200px] flex items-center justify-center">
                <canvas ref={canvasRef} className="mx-auto" style={{ imageRendering: "crisp-edges" }} />
              </div>
              <button onClick={download} disabled={!resultUrl}
                className="w-full py-3 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg disabled:bg-gray-300 transition-all">
                📥 ダウンロード（PNG透過）
              </button>
              {downloaded && (
                <div className="mt-4 w-full">
                  <ShareButtons url="https://yamada-tools.jp/generator/hanko" title="電子印鑑作成ツール - 山田ツール" />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-kon mb-4">💼 電子印鑑の活用シーン</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-kon mb-2">📄 ビジネス文書</h3>
              <p className="text-sm text-gray-600">請求書、見積書、契約書などのPDF文書に押印。ペーパーレス化を推進できます。</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-kon mb-2">🏢 社内承認</h3>
              <p className="text-sm text-gray-600">稟議書、申請書、報告書などの社内文書に。リモートワークでも承認フローがスムーズに。</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-kon mb-2">✅ 確認印</h3>
              <p className="text-sm text-gray-600">「済」印や日付印で、書類の確認・承認状況を明確に。作業完了の証明にも。</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-kon mb-2">💻 フリーランス</h3>
              <p className="text-sm text-gray-600">納品物や請求書に電子印鑑を添えることで、プロフェッショナルな印象を与えます。</p>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <RelatedTools tools={relatedToolSets.hanko} title="あわせて使えるツール" />

        <section className="mt-8 bg-yellow-50 rounded-2xl border border-yellow-200 p-6">
          <h2 className="text-lg font-bold text-yellow-800 mb-2">⚠️ ご注意</h2>
          <p className="text-sm text-yellow-700">
            この電子印鑑は画像データです。法的拘束力のある電子署名が必要な場合は、電子証明書付きの電子契約サービスをご利用ください。
            社内文書や簡易的な確認印としてご活用ください。
          </p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
        <AdUnit position="mid" format="horizontal" />
      </div>
    </div>
  );
}
