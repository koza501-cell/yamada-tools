"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import RelatedTools, { relatedToolSets } from "@/components/common/RelatedTools";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ {
  question: string;
  answer: string;
}

interface SeoContent {
  intro: string;
  useCases?: { title: string; desc: string }[];
  tips?: string;
}

interface Props {
  faq: FAQ[];
  seoContent?: SeoContent;
}

interface CompressedImage {
  originalFile: File;
  originalSize: number;
  compressedDataUrl: string;
  compressedSize: number;
  reduction: number;
}

type OutputFormat = "jpeg" | "png" | "webp";

export default function ImageCompressClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("画像をアップロードしてね！");
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const compressImage = useCallback(async (file: File): Promise<CompressedImage | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }

          ctx.drawImage(img, 0, 0);

          const mimeType = `image/${outputFormat}`;
          const qualityValue = outputFormat === "png" ? undefined : quality / 100;
          const dataUrl = canvas.toDataURL(mimeType, qualityValue);
          
          // Calculate compressed size
          const base64Length = dataUrl.length - dataUrl.indexOf(",") - 1;
          const compressedSize = Math.round((base64Length * 3) / 4);
          
          const reduction = Math.round((1 - compressedSize / file.size) * 100);

          resolve({
            originalFile: file,
            originalSize: file.size,
            compressedDataUrl: dataUrl,
            compressedSize,
            reduction,
          });
        };
        img.onerror = () => resolve(null);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }, [quality, outputFormat]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
    
    if (imageFiles.length === 0) {
      setMascotState("error");
      setMascotMessage("画像ファイルを選んでね！");
      return;
    }

    setIsProcessing(true);
    setMascotState("working");
    setMascotMessage(`${imageFiles.length}枚の画像を圧縮中...`);

    const results: CompressedImage[] = [];
    
    for (const file of imageFiles) {
      const result = await compressImage(file);
      if (result) {
        results.push(result);
      }
    }

    setImages(prev => [...prev, ...results]);
    setIsProcessing(false);
    
    const totalReduction = results.reduce((sum, r) => sum + r.reduction, 0) / results.length;
    setMascotState("success")
      triggerSuccess('compress');;
    setMascotMessage(`${results.length}枚完了！平均${Math.round(totalReduction)}%削減！`);
  }, [compressImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const recompressAll = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setMascotState("working");
    setMascotMessage("再圧縮中...");

    const results: CompressedImage[] = [];
    
    for (const img of images) {
      const result = await compressImage(img.originalFile);
      if (result) {
        results.push(result);
      }
    }

    setImages(results);
    setIsProcessing(false);
    
    const totalReduction = results.reduce((sum, r) => sum + r.reduction, 0) / results.length;
    setMascotState("success")
      triggerSuccess('compress');;
    setMascotMessage(`再圧縮完了！平均${Math.round(totalReduction)}%削減！`);
  };

  const downloadImage = (image: CompressedImage) => {
    const extension = outputFormat;
    const baseName = image.originalFile.name.replace(/\.[^/.]+$/, "");
    const fileName = `${baseName}_compressed_yamada-tools.${extension}`;

    const link = document.createElement("a");
    link.download = fileName;
    link.href = image.compressedDataUrl;
    link.click();
  };

  const downloadAll = () => {
    images.forEach(image => {
      downloadImage(image);
    });
    setMascotMessage("すべてダウンロードしたよ！");
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setImages([]);
    setMascotState("idle");
    setMascotMessage("画像をアップロードしてね！");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = images.reduce((sum, img) => sum + img.compressedSize, 0);
  const totalReduction = totalOriginalSize > 0 
    ? Math.round((1 - totalCompressedSize / totalOriginalSize) * 100) 
    : 0;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-3xl font-bold text-kon mb-2">画像圧縮</h1>
          <p className="text-gray-600 text-lg">ファイルサイズを削減して軽量化</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">📁 複数ファイル対応</span>
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

          {/* Settings */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Quality */}
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
                <span>小さい（低品質）</span>
                <span>大きい（高品質）</span>
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">出力形式</label>
              <div className="flex gap-2">
                {(["jpeg", "png", "webp"] as OutputFormat[]).map((format) => (
                  <button type="button"
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
          </div>

          {/* File Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 mb-6 ${
              isDragging
                ? "border-kon bg-kon/10 scale-[1.02]"
                : "border-kon/30 bg-gray-50/50 hover:border-kon hover:bg-gray-50 hover:shadow-lg"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-kon rounded-2xl flex items-center justify-center text-3xl shadow-lg">📁</div>
            <p className="text-gray-800 font-medium mb-2 text-lg">画像をドラッグ＆ドロップ</p>
            <p className="text-gray-500 text-sm mb-3">または クリックしてファイルを選択</p>
            <span className="inline-block bg-white text-gray-600 text-xs px-3 py-1.5 rounded-full border border-gray-200">
              JPEG, PNG, WebP対応 • 複数選択可
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-kon border-t-transparent rounded-full"></div>
              <p className="text-gray-500 mt-2">処理中...</p>
            </div>
          )}

          {/* Results */}
          {images.length > 0 && (
            <>
              {/* Summary */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-500">元サイズ</div>
                    <div className="font-bold text-gray-700">{formatFileSize(totalOriginalSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">圧縮後</div>
                    <div className="font-bold text-green-600">{formatFileSize(totalCompressedSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">削減率</div>
                    <div className="font-bold text-kon text-xl">{totalReduction}%</div>
                  </div>
                </div>
              </div>

              {/* Image List */}
              <div className="space-y-3 mb-6">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={image.compressedDataUrl}
                      alt={image.originalFile.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{image.originalFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(image.originalSize)} → {formatFileSize(image.compressedSize)}
                        <span className={`ml-2 font-medium ${image.reduction > 0 ? "text-green-600" : "text-danger"}`}>
                          {image.reduction > 0 ? `−${image.reduction}%` : `+${Math.abs(image.reduction)}%`}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button"
                        onClick={() => downloadImage(image)}
                        className="px-3 py-1 bg-kon text-white rounded text-sm hover:bg-ai transition-colors"
                      >
                        保存
                      </button>
                      <button type="button"
                        onClick={() => removeImage(index)}
                        className="px-2 py-1 text-gray-400 hover:text-danger transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button type="button"
                  onClick={downloadAll}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                >
                  📥 すべてダウンロード
                </button>
                <button type="button"
                  onClick={recompressAll}
                  disabled={isProcessing}
                  className="py-3 px-6 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors disabled:bg-gray-300"
                >
                  🔄 再圧縮
                </button>
                <button type="button"
                  onClick={handleClear}
                  className="py-3 px-6 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  クリア
                </button>
              </div>
            </>
          )}
        </section>

        {/* Related Tools */}
        <RelatedTools tools={relatedToolSets.imageCompress} title="あわせて使えるツール" />
        {/* SEO Content - Intro */}
        {seoContent && (
          <section className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{seoContent.intro}</p>
          </section>
        )}
        {/* Use Cases */}
        {seoContent?.useCases && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">こんな場面で活躍</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seoContent.useCases.map((uc, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                  <h3 className="font-bold text-kon mb-2">{uc.title}</h3>
                  <p className="text-sm text-gray-600">{uc.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tips */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">💡 圧縮のコツ</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• <strong>JPEG</strong>: 写真に最適。品質70-85%で十分な画質を維持</li>
            <li>• <strong>PNG</strong>: イラスト・ロゴに最適。透過を維持</li>
            <li>• <strong>WebP</strong>: 最も効率的。JPEGより30%小さく、透過も対応</li>
          </ul>
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>品質と出力形式を設定</li>
            <li>画像をアップロード（複数可）</li>
            <li>自動で圧縮が開始されます</li>
            <li>結果を確認してダウンロード</li>
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
            <div className="text-2xl mb-2">📁</div>
            <h3 className="font-bold text-sm mb-1">一括処理</h3>
            <p className="text-xs text-gray-500">複数ファイルをまとめて圧縮</p>
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
