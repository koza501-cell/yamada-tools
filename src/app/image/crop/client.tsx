"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

// Helper function to create cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob | null> {
  const image = new Image();
  image.src = imageSrc;
  
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
  });
}

const aspectOptions = [
  { label: "自由", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
];

export default function ImageCropClient({ faq }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("画像をアップロードしてね！");
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setResultUrl("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setMascotMessage("ドラッグで位置調整、ホイールでズーム！");
      };
      reader.readAsDataURL(f);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setResultUrl("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setMascotMessage("ドラッグで位置調整、ホイールでズーム！");
      };
      reader.readAsDataURL(f);
    }
  };

  const cropImage = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setMascotState("error");
      setMascotMessage("画像を選択してね！");
      return;
    }

    setMascotState("working");
    setMascotMessage("切り抜き中...");

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedBlob) {
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(URL.createObjectURL(croppedBlob));
        setMascotState("success");
        setMascotMessage("切り抜き完了！");
      }
    } catch {
      setMascotState("error");
      setMascotMessage("エラーが発生したよ...");
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file.name.replace(/\.[^/.]+$/, "") + "_cropped_yamada-tools.png";
    a.click();
  };

  const clearAll = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setImageSrc("");
    setResultUrl("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAspect(undefined);
    setMascotState("idle");
    setMascotMessage("画像をアップロードしてね！");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/image" className="hover:text-kon">画像ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">画像切り抜き</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">✂️</div>
          <h1 className="text-3xl font-bold text-kon mb-2">画像切り抜き</h1>
          <p className="text-gray-600 text-lg">好きなサイズにトリミング</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">ドラッグ＆ズーム</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">アスペクト比固定</span>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {!imageSrc ? (
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
              <label className="inline-block px-6 py-2 bg-kon text-white rounded-lg cursor-pointer hover:bg-ai">
                ファイルを選択
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>
          ) : (
            <div>
              {/* Aspect Ratio Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">アスペクト比</label>
                <div className="flex flex-wrap gap-2">
                  {aspectOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setAspect(opt.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        aspect === opt.value
                          ? "bg-kon text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cropper */}
              <div className="relative h-80 md:h-96 bg-gray-900 rounded-xl overflow-hidden mb-4">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Zoom Slider */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ズーム: {zoom.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-kon"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={cropImage}
                  className="flex-1 py-3 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  切り抜く
                </button>
                <button 
                  onClick={clearAll} 
                  className="px-6 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  クリア
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {resultUrl && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <h3 className="font-bold text-kon mb-3">切り抜き結果</h3>
              <div className="bg-white p-2 rounded-lg mb-3">
                <img src={resultUrl} alt="Result" className="max-h-64 mx-auto rounded" />
              </div>
              <button
                onClick={download}
                className="w-full py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
              >
                ダウンロード
              </button>
            </div>
          )}
        </section>

        {/* Tips */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3">使い方</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>・ドラッグで切り抜き位置を調整</p>
            <p>・マウスホイールまたはスライダーでズーム</p>
            <p>・アスペクト比ボタンで比率を固定</p>
            <p>・ピンチ操作でモバイルでもズーム可能</p>
          </div>
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
    </div>
  );
}
