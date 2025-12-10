"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

interface ConvertedImage {
  name: string;
  originalSize: number;
  newSize: number;
  url: string;
  format: string;
}

const formats = [
  { value: "image/png", label: "PNG", ext: "png", desc: "可逆圧縮・透過対応" },
  { value: "image/jpeg", label: "JPG", ext: "jpg", desc: "写真向け・高圧縮" },
  { value: "image/webp", label: "WebP", ext: "webp", desc: "最新形式・最小サイズ" },
  { value: "image/gif", label: "GIF", ext: "gif", desc: "アニメーション対応" },
  { value: "image/bmp", label: "BMP", ext: "bmp", desc: "無圧縮・大容量" },
];

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export default function ImageFormatClient({ faq }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState("image/webp");
  const [quality, setQuality] = useState(90);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("画像をアップロードしてね！");
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith("image/")
    );
    
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles].slice(0, 20));
      setMascotMessage(`${droppedFiles.length}枚の画像を追加したよ！`);
      setConvertedImages([]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith("image/")
      );
      setFiles(prev => [...prev, ...selectedFiles].slice(0, 20));
      setMascotMessage(`${selectedFiles.length}枚の画像を追加したよ！`);
      setConvertedImages([]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setConvertedImages([]);
    setMascotState("idle");
    setMascotMessage("画像をアップロードしてね！");
  };

  const convertImage = (file: File): Promise<ConvertedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          // Fill with white background for JPG (no transparency)
          if (targetFormat === "image/jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const ext = formats.find(f => f.value === targetFormat)?.ext || "png";
                const newName = file.name.replace(/\.[^/.]+$/, "") + "." + ext;
                
                resolve({
                  name: newName,
                  originalSize: file.size,
                  newSize: blob.size,
                  url: URL.createObjectURL(blob),
                  format: ext.toUpperCase(),
                });
              } else {
                reject(new Error("変換に失敗しました"));
              }
            },
            targetFormat,
            quality / 100
          );
        }
      };

      img.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setMascotState("error");
      setMascotMessage("画像を追加してね！");
      return;
    }

    setIsConverting(true);
    setMascotState("working");
    setMascotMessage("変換中...");
    setConvertedImages([]);

    try {
      const results: ConvertedImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const result = await convertImage(files[i]);
        results.push(result);
        setMascotMessage(`${i + 1}/${files.length} 変換中...`);
      }

      setConvertedImages(results);
      setMascotState("success");
      
      const totalSaved = results.reduce((acc, r) => acc + (r.originalSize - r.newSize), 0);
      if (totalSaved > 0) {
        setMascotMessage(`完了！${formatBytes(totalSaved)}削減したよ！🎉`);
      } else {
        setMascotMessage("変換完了！🎉");
      }
    } catch (error) {
      setMascotState("error");
      setMascotMessage("変換エラーが発生したよ...");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadSingle = (image: ConvertedImage) => {
    const a = document.createElement("a");
    a.href = image.url;
    const baseName = image.name.replace(/\.[^/.]+$/, "");
    const ext = image.name.split(".").pop() || "png";
    a.download = `${baseName}_yamada-tools.${ext}`;
    a.click();
  };

  const downloadAll = async () => {
    for (const image of convertedImages) {
      downloadSingle(image);
      await new Promise(r => setTimeout(r, 300));
    }
  };

  const showQualitySlider = targetFormat === "image/jpeg" || targetFormat === "image/webp";

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" aria-label="パンくずリスト">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/image" className="hover:text-kon">画像ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">画像形式変換</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔄</div>
          <h1 className="text-3xl font-bold text-kon mb-2">画像形式変換</h1>
          <p className="text-gray-600 text-lg">PNG・JPG・WebPを相互変換</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">📁 複数ファイル対応</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? "border-kon bg-sakura/20"
                : "border-gray-300 hover:border-kon"
            }`}
          >
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-gray-600 mb-3">画像をドラッグ＆ドロップ</p>
            <label className="inline-block px-6 py-2 bg-kon text-white rounded-lg cursor-pointer hover:bg-ai transition-colors">
              ファイルを選択
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-400 mt-3">PNG, JPG, WebP, GIF, BMP（最大20ファイル）</p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  選択中（{files.length}ファイル）
                </label>
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700">
                  すべて削除
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-lg">🖼️</span>
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-400">{formatBytes(file.size)}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Format */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              変換先の形式
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {formats.map(format => (
                <button
                  key={format.value}
                  onClick={() => setTargetFormat(format.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    targetFormat === format.value
                      ? "border-kon bg-kon/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-bold text-sm">{format.label}</div>
                  <div className="text-xs text-gray-500">{format.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider */}
          {showQualitySlider && (
            <div className="mt-6">
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

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={isConverting || files.length === 0}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
              isConverting
                ? "bg-gray-300 text-gray-500 cursor-wait"
                : files.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            {isConverting ? "🔄 変換中..." : "🔄 変換する"}
          </button>

          {/* Results */}
          {convertedImages.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-kon">変換結果</h3>
                {convertedImages.length > 1 && (
                  <button
                    onClick={downloadAll}
                    className="text-sm text-kon hover:text-ai"
                  >
                    📥 すべてダウンロード
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {convertedImages.map((image, index) => {
                  const saved = image.originalSize - image.newSize;
                  const savedPercent = Math.round((saved / image.originalSize) * 100);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="font-medium text-sm">{image.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{formatBytes(image.originalSize)}</span>
                            <span>→</span>
                            <span className={saved > 0 ? "text-green-600 font-medium" : ""}>
                              {formatBytes(image.newSize)}
                            </span>
                            {saved > 0 && (
                              <span className="text-green-600">(-{savedPercent}%)</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadSingle(image)}
                        className="px-4 py-2 bg-kon text-white rounded-lg text-sm hover:bg-ai transition-colors"
                      >
                        📥 保存
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Format Comparison */}
        <section className="mt-8 bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-kon mb-4 text-lg">形式比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left">形式</th>
                  <th className="py-2 text-left">透過</th>
                  <th className="py-2 text-left">圧縮</th>
                  <th className="py-2 text-left">おすすめ用途</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">PNG</td>
                  <td className="py-2 text-green-600">対応</td>
                  <td className="py-2">可逆</td>
                  <td className="py-2">ロゴ、イラスト、スクリーンショット</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">JPG</td>
                  <td className="py-2 text-gray-400">非対応</td>
                  <td className="py-2">非可逆</td>
                  <td className="py-2">写真、グラデーション画像</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">WebP</td>
                  <td className="py-2 text-green-600">対応</td>
                  <td className="py-2">両方</td>
                  <td className="py-2">Web用画像（最小サイズ）</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">GIF</td>
                  <td className="py-2 text-green-600">対応</td>
                  <td className="py-2">可逆</td>
                  <td className="py-2">アニメーション、シンプルな画像</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">BMP</td>
                  <td className="py-2 text-gray-400">非対応</td>
                  <td className="py-2">無圧縮</td>
                  <td className="py-2">印刷用、高品質保存</td>
                </tr>
              </tbody>
            </table>
          </div>
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
            <p className="text-xs text-gray-500">ブラウザ内で処理</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold text-sm mb-1">高速変換</h3>
            <p className="text-xs text-gray-500">アップロード不要</p>
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
