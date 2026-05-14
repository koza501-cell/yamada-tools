"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

type OutputFormat = "jpeg" | "png" | "webp";

interface Preset {
  name: string;
  width: number;
  height: number;
  icon: string;
}

const presets: Preset[] = [
  { name: "Instagram投稿", width: 1080, height: 1080, icon: "📸" },
  { name: "Instagramストーリー", width: 1080, height: 1920, icon: "📱" },
  { name: "Twitter投稿", width: 1200, height: 675, icon: "🐦" },
  { name: "YouTubeサムネイル", width: 1280, height: 720, icon: "▶️" },
  { name: "OGP画像", width: 1200, height: 630, icon: "🔗" },
  { name: "名刺サイズ", width: 1050, height: 600, icon: "💼" },
];

export default function ImageResizeClient({
 faq }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [newWidth, setNewWidth] = useState<string>("");
  const [newHeight, setNewHeight] = useState<string>("");
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg");
  const [quality, setQuality] = useState<number>(90);
  const [resizedDataUrl, setResizedDataUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("画像をアップロードしてね！");
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setMascotState("error");
      setMascotMessage("画像ファイルを選んでね！");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setOriginalFileName(file.name);
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setNewWidth(img.width.toString());
        setNewHeight(img.height.toString());
        setResizedDataUrl(null);
        setMascotState("success");
        setMascotMessage(`${img.width}×${img.height}の画像だね！`);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleWidthChange = (value: string) => {
    const width = parseInt(value) || 0;
    setNewWidth(value);
    
    if (keepAspectRatio && originalWidth > 0 && width > 0) {
      const ratio = originalHeight / originalWidth;
      setNewHeight(Math.round(width * ratio).toString());
    }
  };

  const handleHeightChange = (value: string) => {
    const height = parseInt(value) || 0;
    setNewHeight(value);
    
    if (keepAspectRatio && originalHeight > 0 && height > 0) {
      const ratio = originalWidth / originalHeight;
      setNewWidth(Math.round(height * ratio).toString());
    }
  };

  const applyPreset = (preset: Preset) => {
    setNewWidth(preset.width.toString());
    setNewHeight(preset.height.toString());
    setKeepAspectRatio(false);
    setMascotMessage(`${preset.name}サイズに設定したよ！`);
  };

  const resizeImage = () => {
    if (!originalImage || !canvasRef.current) return;

    const width = parseInt(newWidth) || originalWidth;
    const height = parseInt(newHeight) || originalHeight;

    if (width <= 0 || height <= 0 || width > 10000 || height > 10000) {
      setMascotState("error");
      setMascotMessage("サイズは1〜10000の範囲で指定してね！");
      return;
    }

    setMascotState("working");
    setMascotMessage("リサイズ中...");

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use better quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(originalImage, 0, 0, width, height);

    const mimeType = `image/${outputFormat}`;
    const qualityValue = outputFormat === "png" ? undefined : quality / 100;
    const dataUrl = canvas.toDataURL(mimeType, qualityValue);
    
    setResizedDataUrl(dataUrl);
    
    // Calculate file size
    const base64Length = dataUrl.length - dataUrl.indexOf(",") - 1;
    const fileSize = Math.round((base64Length * 3) / 4);
    setResizedSize(fileSize);

    setMascotState("success");
    triggerSuccess('resize');
    setMascotMessage(`${width}×${height}にリサイズ完了！`);
  };

  const downloadImage = () => {
    if (!resizedDataUrl) return;

    const extension = outputFormat;
    const baseName = originalFileName.replace(/\.[^/.]+$/, "");
    const fileName = `${baseName}_resized_yamada-tools.${extension}`;

    const link = document.createElement("a");
    link.download = fileName;
    link.href = resizedDataUrl;
    link.click();
    
    setMascotMessage("ダウンロードしたよ！");
  };

  const handleClear = () => {
    setOriginalImage(null);
    setOriginalFileName("");
    setOriginalWidth(0);
    setOriginalHeight(0);
    setNewWidth("");
    setNewHeight("");
    setResizedDataUrl(null);
    setResizedSize(0);
    setMascotState("idle");
    setMascotMessage("画像をアップロードしてね！");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🖼️</div>
          <h1 className="text-3xl font-bold text-kon mb-2">画像をリサイズする無料ツール — 縮小・拡大・サイズ指定でJPG/PNG/WebP対応</h1>
          <p className="text-gray-600 text-lg">画像サイズを簡単に変更</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">📐 SNSプリセット</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* File Upload Area */}
          {!originalImage ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-kon bg-kon/5"
                  : "border-gray-300 hover:border-kon hover:bg-gray-50"
              }`}
            >
              <div className="text-4xl mb-4">📁</div>
              <p className="text-gray-600 mb-2">画像をドラッグ＆ドロップ</p>
              <p className="text-gray-400 text-sm">または クリックしてファイルを選択</p>
              <p className="text-gray-400 text-xs mt-2">JPEG, PNG, WebP, GIF対応</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            <>
              {/* Original Image Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-500">元画像</p>
                    <p className="font-medium truncate max-w-xs">{originalFileName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">サイズ</p>
                    <p className="font-bold text-kon">{originalWidth} × {originalHeight} px</p>
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">SNSプリセット</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-kon/10 transition-colors text-left"
                    >
                      <span className="text-lg mr-2">{preset.icon}</span>
                      <span className="text-sm font-medium">{preset.name}</span>
                      <span className="block text-xs text-gray-400">{preset.width}×{preset.height}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">新しいサイズ</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">幅 (px)</label>
                    <input
                      type="number"
                      value={newWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      min="1"
                      max="10000"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                    />
                  </div>
                  <div className="pt-6">
                    <span className="text-gray-400 text-xl">×</span>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">高さ (px)</label>
                    <input
                      type="number"
                      value={newHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      min="1"
                      max="10000"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Aspect Ratio Toggle */}
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepAspectRatio}
                    onChange={(e) => setKeepAspectRatio(e.target.checked)}
                    className="w-4 h-4 text-kon rounded focus:ring-kon"
                  />
                  <span className="text-sm text-gray-600">縦横比を維持</span>
                </label>
              </div>

              {/* Output Options */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">出力形式</label>
                  <div className="flex gap-2">
                    {(["jpeg", "png", "webp"] as OutputFormat[]).map((format) => (
                      <button
                        key={format}
                        onClick={() => setOutputFormat(format)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          outputFormat === format
                            ? "bg-kon text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                {outputFormat !== "png" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      品質: {quality}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-kon"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>低品質・小サイズ</span>
                      <span>高品質・大サイズ</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={resizeImage}
                  className="flex-1 py-4 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
                >
                  🖼️ リサイズする
                </button>
                <button
                  onClick={handleClear}
                  className="py-4 px-6 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  別の画像
                </button>
              </div>

              {/* Result Preview */}
              {resizedDataUrl && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-700 mb-4 text-center">リサイズ結果</h3>
                  <div className="flex justify-center mb-4">
                    <img
                      src={resizedDataUrl}
                      alt="Resized"
                      className="max-w-full max-h-64 rounded-lg shadow-md"
                    />
                  </div>
                  <div className="text-center text-sm text-gray-500 mb-4">
                    {newWidth} × {newHeight} px • {formatFileSize(resizedSize)} • {outputFormat.toUpperCase()}
                  </div>
                  <button
                    onClick={downloadImage}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                  >
                    📥 ダウンロード
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>画像をアップロード（ドラッグ＆ドロップまたはクリック）</li>
            <li>新しいサイズを入力（またはSNSプリセットを選択）</li>
            <li>出力形式と品質を設定</li>
            <li>「リサイズする」をクリック</li>
            <li>結果をダウンロード</li>
          </ol>
        </section>

        {/* FAQ */}
        {faq && faq.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問（FAQ）</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details 
                  key={index} 
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden group"
                >
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-kon">Q.</span>
                      {item.question}
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                    <span className="text-kon font-medium">A.</span> {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        <section className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🆓</div>
            <h3 className="font-bold text-sm mb-1">完全無料</h3>
            <p className="text-xs text-gray-500">登録不要、制限なし</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-bold text-sm mb-1">プライバシー保護</h3>
            <p className="text-xs text-gray-500">画像はサーバーに送信されません</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">📐</div>
            <h3 className="font-bold text-sm mb-1">SNSプリセット</h3>
            <p className="text-xs text-gray-500">主要SNSサイズに対応</p>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/image" className="text-kon hover:text-ai transition-colors">
            ← 画像ツール一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
