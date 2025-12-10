"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import jsQR from "jsqr";
import Mascot, { MascotState } from "@/components/common/Mascot";

export default function QrReaderClient() {
  const [result, setResult] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("QRコード画像をアップロードしてね！");
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const processImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setResult(code.data);
          setMascotState("success");
          setMascotMessage("QRコードを読み取ったよ！");
        } else {
          setResult("");
          setMascotState("error");
          setMascotMessage("QRコードが見つからなかったよ...");
        }
      };
      img.src = e.target?.result as string;
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    }
  }, [processImage]);

  const copyResult = async () => {
    await navigator.clipboard.writeText(result);
    setMascotMessage("コピーしたよ！");
  };

  const clearAll = () => {
    setResult("");
    setPreview("");
    setMascotState("idle");
    setMascotMessage("QRコード画像をアップロードしてね！");
  };

  const isUrl = result.startsWith("http://") || result.startsWith("https://");

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
            <li className="text-kon font-medium">QRコード読み取り</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📷</div>
          <h1 className="text-3xl font-bold text-kon mb-2">QRコード読み取り</h1>
          <p className="text-gray-600 text-lg">画像からQRコードをスキャン</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all mb-6 ${
              isDragging ? "border-kon bg-sakura/20" : "border-gray-300 hover:border-kon"
            }`}
          >
            {preview ? (
              <div>
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4" />
                <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700">
                  別の画像を選択
                </button>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-3">📷</div>
                <p className="text-gray-600 mb-3">QRコード画像をドラッグ＆ドロップ</p>
                <label className="inline-block px-6 py-2 bg-kon text-white rounded-lg cursor-pointer hover:bg-ai">
                  ファイルを選択
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              </>
            )}
          </div>

          {result && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-kon mb-3">読み取り結果</h3>
              <div className="bg-white p-4 rounded-lg mb-4 break-all font-mono text-sm">
                {result}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyResult}
                  className="flex-1 py-2 bg-kon text-white rounded-lg hover:bg-ai"
                >
                  コピー
                </button>
                {isUrl && (
                  <a
                    href={result}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-center"
                  >
                    URLを開く
                  </a>
                )}
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
