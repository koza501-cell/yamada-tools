// @ts-nocheck
"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Mascot from "@/components/common/Mascot";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ { question: string; answer: string; }
interface Props { faq: FAQ[]; seoContent?: { intro: string }; }

interface ImageInfo {
  width: number; height: number; dpi: number;
  fileSize: string; format: string;
  printWidthCm: string; printHeightCm: string;
  quality: string; qualityColor: string;
}

export default function DpiCheckerClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [image, setImage] = useState(null);
  const [mascotState, setMascotState] = useState("idle");
  const [fileName, setFileName] = useState("");
  const [info, setInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [targetDpi, setTargetDpi] = useState(300);

  const loadImage = (file) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setMascotState("working");
    const fileSize = file.size < 1024 * 1024
      ? (file.size / 1024).toFixed(1) + " KB"
      : (file.size / (1024 * 1024)).toFixed(1) + " MB";
    const format = file.type.split("/")[1].toUpperCase();
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const dpi = 72; // Default for most images
        const printW = (img.naturalWidth / targetDpi * 2.54).toFixed(1);
        const printH = (img.naturalHeight / targetDpi * 2.54).toFixed(1);
        let quality = ""; let qualityColor = "";
        if (img.naturalWidth >= 3000 || img.naturalHeight >= 3000) { quality = "高品質（印刷に最適）"; qualityColor = "text-green-600"; }
        else if (img.naturalWidth >= 1500 || img.naturalHeight >= 1500) { quality = "中品質（一般印刷OK）"; qualityColor = "text-yellow-600"; }
        else { quality = "低解像度（Web向け）"; qualityColor = "text-danger"; }
        setInfo({ width: img.naturalWidth, height: img.naturalHeight, dpi, fileSize, format, printWidthCm: printW, printHeightCm: printH, quality, qualityColor });
        setImage(e.target.result);
        setMascotState("success")
      triggerSuccess('dpi-checker');;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const recalcPrint = (dpi) => {
    setTargetDpi(dpi);
    if (info) {
      setInfo({
        ...info,
        printWidthCm: (info.width / dpi * 2.54).toFixed(1),
        printHeightCm: (info.height / dpi * 2.54).toFixed(1),
      });
    }
  };

  const reset = () => { setImage(null); setFileName(""); setInfo(null); setTargetDpi(300); };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-kon mb-2">画像DPI確認・解像度チェック</h1>
          <p className="text-gray-600 text-lg">印刷前にDPIと推奨印刷サイズを確認</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <Mascot state={mascotState} />
          {!image ? (
            <div onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) loadImage(f); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer ${isDragging ? "border-kon bg-sakura/20" : "border-gray-300 hover:border-kon"}`}
              onClick={() => document.getElementById("img-upload")?.click()}>
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-gray-600 mb-2 text-lg font-bold">画像をドラッグ＆ドロップ</p>
              <button className="px-8 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors text-lg">📁 画像を選択</button>
              <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
              <p className="text-sm text-gray-400 mt-4">JPG, PNG, WebP, BMP, GIF対応</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4">
                <p className="font-bold text-sm truncate">{fileName}</p>
                <button onClick={reset} className="text-sm text-danger font-bold">✕ 閉じる</button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-100 rounded-xl p-3">
                  <img src={image} alt="preview" className="block mx-auto rounded-lg shadow-md max-w-full" style={{ maxHeight: "300px" }} />
                </div>
                {info && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-bold text-sm text-kon mb-3">📊 画像情報</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">ピクセルサイズ</span><span className="font-bold">{info.width} × {info.height} px</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">ファイルサイズ</span><span className="font-bold">{info.fileSize}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">形式</span><span className="font-bold">{info.format}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">品質判定</span><span className={`font-bold ${info.qualityColor}`}>{info.quality}</span></div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <h3 className="font-bold text-sm text-green-800 mb-3">🖨️ 印刷サイズ（{targetDpi}DPI）</h3>
                      <div className="text-2xl font-bold text-center text-green-700 mb-2">
                        {info.printWidthCm} × {info.printHeightCm} cm
                      </div>
                      <div className="flex gap-2 justify-center">
                        {[72, 150, 200, 300].map(d => (
                          <button key={d} onClick={() => recalcPrint(d)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${targetDpi === d ? "bg-green-600 text-white" : "bg-white text-gray-600 border"}`}>
                            {d}DPI
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-xs text-kon">
                      <p><strong>💡 目安:</strong> 300DPI=高品質印刷、150DPI=ポスター、72DPI=Web表示</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {seoContent && (
          <section className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-bold text-kon mb-4 text-lg">画像DPI確認とは？</h2>
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
