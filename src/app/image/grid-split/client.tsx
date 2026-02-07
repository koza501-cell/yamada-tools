"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import ShareButtons from "@/components/common/ShareButtons";

interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; useCases?: { title: string; desc: string }[]; tips?: string; }
interface Props { faq: FAQ[]; seoContent?: SeoContent; }

interface GridPreset {
  label: string;
  cols: number;
  rows: number;
  icon: string;
  desc?: string;
}

const PRESETS: GridPreset[] = [
  { label: "2×1", cols: 2, rows: 1, icon: "▬", desc: "横2分割" },
  { label: "1×2", cols: 1, rows: 2, icon: "▮", desc: "縦2分割" },
  { label: "2×2", cols: 2, rows: 2, icon: "⊞", desc: "4分割" },
  { label: "3×1", cols: 3, rows: 1, icon: "☰", desc: "横3分割" },
  { label: "1×3", cols: 1, rows: 3, icon: "≡", desc: "縦3分割" },
  { label: "3×3", cols: 3, rows: 3, icon: "▦", desc: "9分割（Instagram）" },
  { label: "4×4", cols: 4, rows: 4, icon: "⊞⊞", desc: "16分割" },
  { label: "2×3", cols: 2, rows: 3, icon: "⊞+", desc: "6分割" },
  { label: "3×2", cols: 3, rows: 2, icon: "+⊞", desc: "6分割横" },
];

export default function GridSplitClient({ faq, seoContent }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [imgW, setImgW] = useState(0);
  const [imgH, setImgH] = useState(0);
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [customMode, setCustomMode] = useState(false);
  const [gap, setGap] = useState(0);
  const [splitPieces, setSplitPieces] = useState<{ dataUrl: string; col: number; row: number }[]>([]);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("画像をアップロードして分割しよう！");
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showInstaGuide, setShowInstaGuide] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Draw preview with grid lines
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgEl) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = imgEl.width;
    canvas.height = imgEl.height;
    ctx.drawImage(imgEl, 0, 0);

    // Draw grid lines
    const cellW = imgEl.width / cols;
    const cellH = imgEl.height / rows;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = Math.max(2, Math.round(imgEl.width / 400));
    ctx.setLineDash([8, 4]);

    // Vertical lines
    for (let c = 1; c < cols; c++) {
      const x = Math.round(c * cellW);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, imgEl.height);
      ctx.stroke();
    }
    // Horizontal lines
    for (let r = 1; r < rows; r++) {
      const y = Math.round(r * cellH);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(imgEl.width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw shadow lines for contrast
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = Math.max(1, Math.round(imgEl.width / 600));
    for (let c = 1; c < cols; c++) {
      const x = Math.round(c * cellW) + 1;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, imgEl.height); ctx.stroke();
    }
    for (let r = 1; r < rows; r++) {
      const y = Math.round(r * cellH) + 1;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(imgEl.width, y); ctx.stroke();
    }

    // Draw cell numbers
    const fontSize = Math.max(14, Math.round(Math.min(cellW, cellH) / 4));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let num = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * cellW + cellW / 2;
        const cy = r * cellH + cellH / 2;

        // Circle background
        const circleR = fontSize * 0.8;
        ctx.fillStyle = "rgba(30, 41, 82, 0.7)";
        ctx.beginPath();
        ctx.arc(cx, cy, circleR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.fillText(String(num), cx, cy);
        num++;
      }
    }
  }, [imgEl, cols, rows]);

  useEffect(() => { drawPreview(); }, [drawPreview]);

  // Split image into pieces
  const splitImage = useCallback(() => {
    if (!imgEl) return;
    const pieces: { dataUrl: string; col: number; row: number }[] = [];
    const cellW = Math.floor(imgEl.width / cols);
    const cellH = Math.floor(imgEl.height / rows);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pieceCanvas = document.createElement("canvas");
        pieceCanvas.width = cellW;
        pieceCanvas.height = cellH;
        const pCtx = pieceCanvas.getContext("2d")!;
        pCtx.drawImage(
          imgEl,
          c * cellW, r * cellH, cellW, cellH,
          0, 0, cellW, cellH
        );
        pieces.push({
          dataUrl: pieceCanvas.toDataURL("image/png"),
          col: c,
          row: r,
        });
      }
    }
    setSplitPieces(pieces);
    setMascotState("success");
    setMascotMessage(`${cols}×${rows}の${pieces.length}枚に分割完了！ダウンロードしてね！`);

    // Show Instagram guide for 3x3
    if (cols === 3 && rows === 3) setShowInstaGuide(true);
  }, [imgEl, cols, rows]);

  const downloadPiece = (piece: { dataUrl: string; col: number; row: number }, index: number) => {
    const a = document.createElement("a");
    a.href = piece.dataUrl;
    const baseName = file?.name.replace(/\.[^/.]+$/, "") || "image";
    a.download = `${baseName}_${piece.row + 1}-${piece.col + 1}_yamada-tools.png`;
    a.click();
  };

  const downloadAllZip = async () => {
    if (splitPieces.length === 0) return;

    setMascotState("working");
    setMascotMessage("ZIPファイルを作成中...");

    // Dynamic import JSZip-like functionality using manual ZIP creation
    // Simple ZIP file builder (no external dependency)
    const files: { name: string; data: Uint8Array }[] = [];
    const baseName = file?.name.replace(/\.[^/.]+$/, "") || "image";

    for (let i = 0; i < splitPieces.length; i++) {
      const piece = splitPieces[i];
      const resp = await fetch(piece.dataUrl);
      const blob = await resp.blob();
      const buf = await blob.arrayBuffer();
      files.push({
        name: `${baseName}_${piece.row + 1}-${piece.col + 1}.png`,
        data: new Uint8Array(buf),
      });
    }

    // Build ZIP manually
    const zipData = buildZip(files);
    const blob = new Blob([zipData as BlobPart], { type: "application/zip" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${baseName}_${cols}x${rows}_yamada-tools.zip`;
    a.click();
    URL.revokeObjectURL(a.href);

    setIsComplete(true);
    setMascotState("success");
    setMascotMessage("ZIPダウンロード完了！友達にもシェアしてね♪");
  };

  // Minimal ZIP builder (no external lib needed)
  function buildZip(files: { name: string; data: Uint8Array }[]): Uint8Array {
    const entries: { offset: number; header: Uint8Array; name: Uint8Array; data: Uint8Array }[] = [];
    let offset = 0;

    const encoder = new TextEncoder();

    for (const file of files) {
      const nameBytes = encoder.encode(file.name);
      const crc = crc32(file.data);

      // Local file header (30 bytes + name)
      const header = new Uint8Array(30);
      const hv = new DataView(header.buffer);
      hv.setUint32(0, 0x04034b50, true);   // Local file header signature
      hv.setUint16(4, 20, true);             // Version needed
      hv.setUint16(6, 0, true);              // Flags
      hv.setUint16(8, 0, true);              // Compression: none
      hv.setUint16(10, 0, true);             // Mod time
      hv.setUint16(12, 0, true);             // Mod date
      hv.setUint32(14, crc, true);           // CRC-32
      hv.setUint32(18, file.data.length, true); // Compressed size
      hv.setUint32(22, file.data.length, true); // Uncompressed size
      hv.setUint16(26, nameBytes.length, true); // File name length
      hv.setUint16(28, 0, true);             // Extra field length

      entries.push({ offset, header, name: nameBytes, data: file.data });
      offset += 30 + nameBytes.length + file.data.length;
    }

    // Central directory
    const cdEntries: Uint8Array[] = [];
    for (const entry of entries) {
      const cd = new Uint8Array(46);
      const cv = new DataView(cd.buffer);
      cv.setUint32(0, 0x02014b50, true);   // Central directory header
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, 0, true);
      cv.setUint16(14, 0, true);

      const hv = new DataView(entry.header.buffer);
      cv.setUint32(16, hv.getUint32(14, true), true); // CRC
      cv.setUint32(20, entry.data.length, true);
      cv.setUint32(24, entry.data.length, true);
      cv.setUint16(28, entry.name.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, entry.offset, true);

      cdEntries.push(cd);
      cdEntries.push(entry.name);
    }

    const cdSize = cdEntries.reduce((s, e) => s + e.length, 0);

    // End of central directory
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);

    // Combine all parts
    const totalSize = offset + cdSize + 22;
    const result = new Uint8Array(totalSize);
    let pos = 0;

    for (const entry of entries) {
      result.set(entry.header, pos); pos += entry.header.length;
      result.set(entry.name, pos); pos += entry.name.length;
      result.set(entry.data, pos); pos += entry.data.length;
    }
    for (const cd of cdEntries) {
      result.set(cd, pos); pos += cd.length;
    }
    result.set(eocd, pos);

    return result;
  }

  function crc32(data: Uint8Array): number {
    let crc = 0xFFFFFFFF;
    const table = getCRC32Table();
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  let crcTable: Uint32Array | null = null;
  function getCRC32Table(): Uint32Array {
    if (crcTable) return crcTable;
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      crcTable[n] = c >>> 0;
    }
    return crcTable;
  }

  const loadImage = (f: File) => {
    setFile(f);
    setIsComplete(false);
    setSplitPieces([]);
    setShowInstaGuide(false);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        setImgW(img.width);
        setImgH(img.height);
        setImgEl(img);
        setMascotState("success");
        setMascotMessage("画像を読み込みました！分割パターンを選んでね！");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("image/")) loadImage(f);
  };

  const selectPreset = (p: GridPreset) => {
    setCols(p.cols);
    setRows(p.rows);
    setCustomMode(false);
    setSplitPieces([]);
    setShowInstaGuide(false);
  };

  const clearAll = () => {
    setFile(null); setImgEl(null); setImgW(0); setImgH(0);
    setCols(3); setRows(3); setCustomMode(false); setGap(0);
    setSplitPieces([]); setShowInstaGuide(false); setIsComplete(false);
    setMascotState("idle"); setMascotMessage("画像をアップロードして分割しよう！");
  };

  if (!mounted) return <div className="min-h-screen py-12"><div className="max-w-4xl mx-auto px-4 text-center"><p>読み込み中...</p></div></div>;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/image" className="hover:text-kon">画像ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">コマ割り・分割</li>
          </ol>
        </nav>

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔲</div>
          <h1 className="text-3xl font-bold text-kon mb-2">コマ割り・分割</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">画像をグリッドに分割してダウンロード</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">📱 スマホ対応</span>
          </div>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          <div className="mb-6"><Mascot state={mascotState} message={mascotMessage} /></div>

          {!imgEl ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? "border-kon bg-sakura/20" : "border-gray-300 dark:border-gray-600 hover:border-kon"}`}
            >
              <div className="text-4xl mb-3">🖼️</div>
              <p className="text-gray-600 dark:text-gray-300 mb-3">画像をドラッグ＆ドロップ</p>
              <label className="inline-block px-6 py-2 bg-kon text-white rounded-lg cursor-pointer hover:bg-ai transition-colors">
                ファイルを選択
                <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) loadImage(e.target.files[0]); }} className="hidden" />
              </label>
              <p className="text-sm text-gray-400 mt-3">対応形式: JPG, PNG, WebP, BMP</p>
            </div>
          ) : (
            <div>
              {/* Preview */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-2 mb-4 overflow-auto">
                <canvas ref={canvasRef} className="max-w-full mx-auto rounded-lg" style={{ display: "block" }} />
                <p className="text-xs text-gray-400 mt-2 px-1">{imgW}×{imgH}px → {cols}×{rows} = {cols * rows}枚（各 {Math.floor(imgW / cols)}×{Math.floor(imgH / rows)}px）</p>
              </div>

              {/* Grid presets */}
              <div className="mb-4">
                <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200 mb-2">🔲 分割パターン</h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                  {PRESETS.map((p) => (
                    <button key={p.label} onClick={() => selectPreset(p)}
                      className={`px-2 py-2 rounded-lg text-xs font-medium text-center transition-colors border ${cols === p.cols && rows === p.rows && !customMode ? "bg-kon text-white border-kon" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-kon"}`}>
                      <span className="block text-lg">{p.icon}</span>
                      <span className="block font-bold">{p.label}</span>
                      <span className="block text-[10px] opacity-70">{p.desc}</span>
                    </button>
                  ))}
                  <button onClick={() => setCustomMode(true)}
                    className={`px-2 py-2 rounded-lg text-xs font-medium text-center transition-colors border ${customMode ? "bg-kon text-white border-kon" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-kon"}`}>
                    <span className="block text-lg">✏️</span>
                    <span className="block font-bold">カスタム</span>
                    <span className="block text-[10px] opacity-70">自由指定</span>
                  </button>
                </div>

                {/* Custom input */}
                {customMode && (
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <label className="text-sm text-gray-600 dark:text-gray-300">列:</label>
                    <input type="number" min="1" max="20" value={cols}
                      onChange={(e) => { setCols(Math.max(1, Math.min(20, +e.target.value))); setSplitPieces([]); }}
                      className="w-16 px-2 py-1 border rounded-lg text-center text-sm dark:bg-gray-600 dark:border-gray-500" />
                    <span className="text-gray-400">×</span>
                    <label className="text-sm text-gray-600 dark:text-gray-300">行:</label>
                    <input type="number" min="1" max="20" value={rows}
                      onChange={(e) => { setRows(Math.max(1, Math.min(20, +e.target.value))); setSplitPieces([]); }}
                      className="w-16 px-2 py-1 border rounded-lg text-center text-sm dark:bg-gray-600 dark:border-gray-500" />
                    <span className="text-sm text-gray-400">= {cols * rows}枚</span>
                  </div>
                )}
              </div>

              {/* Split button */}
              <button onClick={splitImage}
                className="w-full py-3 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 hover:shadow-lg transition-all mb-3">
                ✂️ 分割する（{cols}×{rows} = {cols * rows}枚）
              </button>

              {/* Split results */}
              {splitPieces.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200">📦 分割結果（{splitPieces.length}枚）</h3>
                    <button onClick={downloadAllZip}
                      className="px-4 py-2 bg-gradient-to-r from-kon to-ai text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all">
                      📥 ZIPで一括ダウンロード
                    </button>
                  </div>

                  <div className={`grid gap-2 ${cols <= 3 ? `grid-cols-${cols}` : cols <= 5 ? "grid-cols-4" : "grid-cols-5"}`}
                    style={{ gridTemplateColumns: `repeat(${Math.min(cols, 6)}, 1fr)` }}>
                    {splitPieces.map((piece, i) => (
                      <div key={i} className="relative group">
                        <img src={piece.dataUrl} alt={`Piece ${i + 1}`}
                          className="w-full rounded-lg border border-gray-200 dark:border-gray-600" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center">
                          <button onClick={() => downloadPiece(piece, i)}
                            className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-white rounded-lg text-xs font-bold text-gray-700 shadow transition-opacity">
                            💾 {i + 1}
                          </button>
                        </div>
                        <span className="absolute top-1 left-1 bg-kon/70 text-white text-[10px] px-1.5 py-0.5 rounded">{i + 1}</span>
                      </div>
                    ))}
                  </div>

                  {/* Instagram guide */}
                  {showInstaGuide && (
                    <div className="mt-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800">
                      <h4 className="font-bold text-sm text-pink-700 dark:text-pink-300 mb-2">📱 Instagram投稿順ガイド</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                        Instagramのグリッド表示を完成させるには、<strong>右下から左上の順番</strong>で投稿してください：
                      </p>
                      <div className="grid grid-cols-3 gap-1 max-w-[200px] mx-auto">
                        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((pieceNum, i) => {
                          const postOrder = 9 - i;
                          return (
                            <div key={i} className="bg-white dark:bg-gray-700 rounded p-1.5 text-center text-[10px]">
                              <span className="font-bold text-kon">{postOrder}番目</span>
                              <br />
                              <span className="text-gray-400">画像{pieceNum}</span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 text-center">※投稿順: 画像9→8→7→6→5→4→3→2→1</p>
                    </div>
                  )}
                </div>
              )}

              {/* Clear */}
              <button onClick={clearAll} className="w-full mt-3 px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                🗑️ クリア
              </button>
            </div>
          )}

          {isComplete && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-500 mb-3">このツールが役に立ったら、友達にもシェアしてね！</p>
              <ShareButtons title="コマ割り・分割 - 山田ツール" description="画像をグリッドに分割するツール。Instagram投稿にも対応。無料・ブラウザ処理で安全。" />
            </div>
          )}
        </section>

        {seoContent && (
          <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-kon mb-4 text-lg">コマ割り・分割について</h2>
            <div className="prose prose-gray max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="mb-4 text-base">{seoContent.intro}</p>
              {seoContent.useCases && (
                <div className="grid sm:grid-cols-2 gap-3 my-4">
                  {seoContent.useCases.map((uc, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{uc.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{uc.desc}</p>
                    </div>
                  ))}
                </div>
              )}
              {seoContent.tips && (
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">💡 <strong>ヒント:</strong> {seoContent.tips}</p>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-8 bg-sakura/20 dark:bg-sakura/10 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3">使い方</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>・画像をアップロード</p>
            <p>・分割パターンを選択（3×3ならInstagram対応）</p>
            <p>・プレビューで分割位置を確認</p>
            <p>・「分割する」をクリック</p>
            <p>・個別またはZIPで一括ダウンロード</p>
          </div>
        </section>

        <section className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
          <h2 className="font-bold text-kon mb-6 text-lg text-center">📖 かんたん3ステップ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[{ icon: "📁", step: "Step 1", text: "画像をアップロード" }, { icon: "🔲", step: "Step 2", text: "分割パターンを選択" }, { icon: "📥", step: "Step 3", text: "ZIPで一括ダウンロード" }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-3xl">{s.icon}</div>
                <h3 className="font-bold text-kon mb-1">{s.step}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {faq && faq.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-kon mb-4 text-lg">よくある質問（FAQ）</h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden group">
                  <summary className="p-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 list-none flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="text-kon">Q.</span>{item.question}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-kon font-medium">A.</span> {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 grid md:grid-cols-3 gap-4">
          {[{ icon: "🆓", title: "完全無料", desc: "登録不要、制限なし" }, { icon: "🔒", title: "ブラウザ内処理", desc: "画像はサーバーに送信されません" }, { icon: "📱", title: "スマホ対応", desc: "タップ操作で分割" }].map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </section>

        <div className="mt-8 text-center">
          <Link href="/image" className="text-kon hover:text-ai transition-colors">← 画像ツール一覧に戻る</Link>
        </div>
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 すべての処理はブラウザ内で行われます。画像がサーバーに送信されることはありません。</p>
        </footer>
      </div>
    </div>
  );
}
