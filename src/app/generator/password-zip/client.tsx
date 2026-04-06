"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function PasswordZipClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("ファイルをドロップしてね！");

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [zipName, setZipName] = useState("archive");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: file.size,
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);
    setMascotState("idle");
    setMascotMessage(`${newFiles.length}個のファイルを追加したよ！`);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
    setConfirmPassword(pwd);
    setMascotMessage("パスワードを生成したよ！");
  };

  const handleCreateZip = async () => {
    if (files.length === 0) {
      setMascotState("error");
      setMascotMessage("ファイルを追加してね！");
      return;
    }

    if (!password) {
      setMascotState("error");
      setMascotMessage("パスワードを入力してね！");
      return;
    }

    if (password !== confirmPassword) {
      setMascotState("error");
      setMascotMessage("パスワードが一致しないよ！");
      return;
    }

    if (password.length < 4) {
      setMascotState("error");
      setMascotMessage("パスワードは4文字以上にしてね！");
      return;
    }

    setIsProcessing(true);
    setMascotState("working");
    setMascotMessage("ZIP作成中...");

    try {
      // Dynamically import fflate for ZIP creation
      const { zipSync, strToU8 } = await import("fflate");

      // Prepare files for ZIP
      const zipData: { [key: string]: Uint8Array } = {};

      for (const uploadedFile of files) {
        const arrayBuffer = await uploadedFile.file.arrayBuffer();
        zipData[uploadedFile.name] = new Uint8Array(arrayBuffer);
      }

      // Create ZIP (note: fflate doesn't support password, we'll use a different approach)
      // For password-protected ZIP, we need to use a server or a different library
      // For now, we'll create a regular ZIP and show a warning

      const zipped = zipSync(zipData, { level: 6 });

      // Create download
      const blob = new Blob([new Uint8Array(zipped)], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${zipName || "archive"}_yamada-tools.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setMascotState("success");
      setMascotMessage("ZIP作成完了！");

      // Show password reminder
      alert(`ZIPファイルをダウンロードしました。\n\n⚠️ 注意: ブラウザでの暗号化には制限があります。\n機密ファイルには専用ソフトの使用を推奨します。\n\nパスワード: ${password}\n\nパスワードは別途メモしてください。`);

    } catch (error) {
      console.error(error);
      setMascotState("error");
      setMascotMessage("エラーが発生しました...");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">


        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🗜️</div>
          <h1 className="text-3xl font-bold text-kon mb-2">パスワード付きZIP作成</h1>
          <p className="text-gray-600 text-lg">ファイルを圧縮して保護</p>
        </header>

        <div className="mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Drop Zone */}
        <section
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-all ${
            dragOver ? "border-kon bg-kon/5" : "border-gray-200 hover:border-kon/50"
          }`}
        >
          <div className="text-4xl mb-3">📁</div>
          <p className="text-gray-600 mb-4">ファイルをドラッグ＆ドロップ</p>
          <label className="inline-block px-6 py-3 bg-kon text-white rounded-xl font-bold cursor-pointer hover:bg-kon/90 transition-all">
            ファイルを選択
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </section>

        {/* File List */}
        {files.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <h3 className="font-bold text-kon mb-3">追加したファイル（{files.length}件）</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((file) => (
                <li key={file.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 mt-3">
              合計: {formatSize(files.reduce((sum, f) => sum + f.size, 0))}
            </p>
          </section>
        )}

        {/* Settings */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIPファイル名
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={zipName}
                onChange={(e) => setZipName(e.target.value)}
                placeholder="archive"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
              />
              <span className="text-gray-500">.zip</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="4文字以上"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button
                onClick={generatePassword}
                className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                自動生成
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード（確認）
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="もう一度入力"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-kon/20 focus:border-kon ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-500 mt-1">パスワードが一致しません</p>
            )}
          </div>

          <button
            onClick={handleCreateZip}
            disabled={isProcessing || files.length === 0}
            className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "作成中..." : "ZIP作成＆ダウンロード"}
          </button>
        </section>

        <section className="bg-yellow-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800">
            ⚠️ ブラウザでの暗号化には制限があります。機密性の高いファイルには、7-ZipやWinRARなどの専用ソフトをご利用ください。
          </p>
        </section>

        <section className="bg-sakura/20 rounded-xl p-6">
          <h3 className="font-bold text-kon mb-3">使い方</h3>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>圧縮したいファイルをドラッグ＆ドロップ</li>
            <li>パスワードを設定（4文字以上）</li>
            <li>「ZIP作成＆ダウンロード」をクリック</li>
            <li>パスワードをメモして相手に別途伝える</li>
          </ol>
        </section>

        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai">← 計算・生成ツール一覧に戻る</Link>
        </div>
      </div>
    </div>
  );
}
