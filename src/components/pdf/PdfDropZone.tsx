"use client";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const ACTIONS = [
  { label: "文字を入力", icon: "✏️", href: "/pdf/text-input" },
  { label: "結合",       icon: "🗂️", href: "/pdf/merge" },
  { label: "分割",       icon: "✂️", href: "/pdf/split" },
  { label: "圧縮",       icon: "📦", href: "/pdf/compress" },
  { label: "回転",       icon: "🔄", href: "/pdf/rotate" },
  { label: "変換",       icon: "🔁", href: "/pdf/pdf-to-image" },
];

export default function PdfDropZone() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") return;
    setFile({ name: f.name, size: f.size });
    try { sessionStorage.setItem("yamada-pdf-drop", JSON.stringify({ name: f.name, size: f.size })); } catch {}
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const isLarge = file && file.size > 5 * 1024 * 1024;

  return (
    <section className="mb-10">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-copy"
            : file
            ? "border-green-400 bg-green-50 dark:bg-green-900/10"
            : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {!file ? (
          <>
            <div className="text-5xl mb-3">📄</div>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-200">PDFファイルをドロップ</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">または クリックしてファイルを選択</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-2">✅</div>
            <p className="font-bold text-gray-800 dark:text-white">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
          </>
        )}
      </div>

      {file && (
        <div className="mt-4">
          {isLarge && (
            <div className="mb-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                ファイルが大きめです（{(file.size / 1024 / 1024).toFixed(1)} MB）。<strong>圧縮</strong>をおすすめします。
              </p>
            </div>
          )}
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">このPDFで何をしますか？</p>
          <div className="flex flex-wrap gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.href}
                onClick={() => router.push(a.href)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  isLarge && a.href === "/pdf/compress"
                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md scale-105"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-400"
                }`}
              >
                {a.icon} {a.label}
                {isLarge && a.href === "/pdf/compress" && (
                  <span className="bg-white text-amber-600 text-xs px-1 rounded font-bold">おすすめ</span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setFile(null)}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline"
          >
            別のファイルを選択
          </button>
        </div>
      )}
    </section>
  );
}
