"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

interface ProcessedImage {
  name: string;
  url: string;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

export default function ImageRotateClient({ faq }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("画像をアップロードしてね！");
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, []);

  const addFiles = (newFiles: File[]) => {
    const combined = [...files, ...newFiles].slice(0, 20);
    setFiles(combined);
    
    const newPreviews = newFiles.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews].slice(0, 20));
    setProcessedImages([]);
    setMascotMessage(`${newFiles.length}枚の画像を追加したよ！`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files).filter(f => f.type.startsWith("image/")));
    }
  };

  const clearAll = () => {
    previews.forEach(p => URL.revokeObjectURL(p));
    processedImages.forEach(p => URL.revokeObjectURL(p.url));
    setFiles([]);
    setPreviews([]);
    setProcessedImages([]);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setMascotState("idle");
    setMascotMessage("画像をアップロードしてね！");
  };

  const rotateImage = (file: File): Promise<ProcessedImage> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      img.onload = () => {
        const rad = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        
        canvas.width = img.width * cos + img.height * sin;
        canvas.height = img.width * sin + img.height * cos;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob((blob) => {
          if (blob) {
            const ext = file.name.split(".").pop() || "png";
            const newName = file.name.replace(/\.[^/.]+$/, "") + "_rotated." + ext;
            resolve({
              name: newName,
              url: URL.createObjectURL(blob),
              rotation,
              flipH,
              flipV,
            });
          }
        }, file.type || "image/png", 0.95);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const processImages = async () => {
    if (files.length === 0) {
      setMascotState("error");
      setMascotMessage("画像を追加してね！");
      return;
    }

    setIsProcessing(true);
    setMascotState("working");
    setMascotMessage("回転中...");

    try {
      const results: ProcessedImage[] = [];
      for (const file of files) {
        const result = await rotateImage(file);
        results.push(result);
      }
      setProcessedImages(results);
      setMascotState("success");
      setMascotMessage(`${results.length}枚の画像を回転したよ！`);
    } catch {
      setMascotState("error");
      setMascotMessage("エラーが発生したよ...");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = (image: ProcessedImage) => {
    const a = document.createElement("a");
    a.href = image.url;
    const baseName = image.name.replace(/\.[^/.]+$/, "");
    const ext = image.name.split(".").pop() || "png";
    a.download = `${baseName}_rotated_yamada-tools.${ext}`;
    a.click();
  };

  const downloadAll = async () => {
    for (const img of processedImages) {
      downloadSingle(img);
      await new Promise(r => setTimeout(r, 300));
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/image" className="hover:text-kon">画像ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">画像回転</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔄</div>
          <h1 className="text-3xl font-bold text-kon mb-2">画像回転</h1>
          <p className="text-gray-600 text-lg">画像を回転・反転</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">複数ファイル対応</span>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging ? "border-kon bg-sakura/20" : "border-gray-300 hover:border-kon"
            }`}
          >
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-gray-600 mb-3">画像をドラッグ＆ドロップ</p>
            <label className="inline-block px-6 py-2 bg-kon text-white rounded-lg cursor-pointer hover:bg-ai transition-colors">
              ファイルを選択
              <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
            </label>
          </div>

          {previews.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{files.length}枚選択中</span>
                <button onClick={clearAll} className="text-xs text-red-500">すべて削除</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {previews.slice(0, 8).map((p, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={p} alt="" className="w-full h-full object-cover" style={{
                      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`
                    }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">回転角度</label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 90, 180, 270].map(deg => (
                  <button
                    key={deg}
                    onClick={() => setRotation(deg)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      rotation === deg ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">反転</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFlipH(!flipH)}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    flipH ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  左右反転
                </button>
                <button
                  onClick={() => setFlipV(!flipV)}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    flipV ? "bg-kon text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  上下反転
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={processImages}
            disabled={isProcessing || files.length === 0}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
              isProcessing || files.length === 0
                ? "bg-gray-300 text-gray-500"
                : "bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg"
            }`}
          >
            {isProcessing ? "処理中..." : "回転する"}
          </button>

          {processedImages.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-kon">処理結果</h3>
                <button onClick={downloadAll} className="text-sm text-kon hover:text-ai">すべてダウンロード</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {processedImages.map((img, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-2">
                    <img src={img.url} alt="" className="w-full aspect-square object-contain rounded-lg mb-2" />
                    <button
                      onClick={() => downloadSingle(img)}
                      className="w-full py-2 bg-kon text-white rounded-lg text-sm"
                    >
                      保存
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {faq && faq.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    <span>Q. {item.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">A. {item.answer}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <Link href="/image" className="text-kon hover:text-ai">← 画像ツール一覧に戻る</Link>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
