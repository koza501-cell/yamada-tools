"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tool, getToolsByCategory } from "@/config/tools";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface ToolPageProps {
  tool: Tool;
  extraFields?: React.ReactNode;
  extraFormData?: Record<string, string>;
  faq?: FAQ[];
  seoContent?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

export default function ToolPage({ tool, extraFields, extraFormData, faq, seoContent }: ToolPageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [dynamicContent, setDynamicContent] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string | undefined>(undefined);

  // Fetch dynamic SEO content from admin API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/public/content/${tool.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.how_to_content) {
            setDynamicContent(data.how_to_content);
          }
        }
      } catch (err) {
        // Silently fail - use static content if API fails
      }
    };
    fetchContent();
  }, [tool.id]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles].slice(0, tool.maxFiles));
    setError(null);
    setIsComplete(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles].slice(0, tool.maxFiles));
    setError(null);
    setIsComplete(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("ファイルを選択してください");
      setMascotState("error");
      setMascotMessage("ファイルを選択してね！");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setMascotState("working");
    setMascotMessage("頑張って処理しています...！");

    try {
      const formData = new FormData();
      
      if (tool.maxFiles === 1) {
        formData.append("file", files[0]);
      } else {
        files.forEach((file) => formData.append("files", file));
      }

      // Add extra form data
      if (extraFormData) {
        Object.entries(extraFormData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response = await fetch(`${API_BASE}${tool.apiEndpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "処理に失敗しました");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setIsComplete(true);
      setMascotState("success");
      setMascotMessage("完了しました！ダウンロードしてね！");
      
      // Open in new tab
      window.open(url, '_blank');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setMascotState("error");
      setMascotMessage("ごめんなさい...エラーが発生しました。");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFiles([]);
    setIsComplete(false);
    setPdfUrl(null);
    setError(null);
    setMascotState("idle");
    setMascotMessage(undefined);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb for SEO */}
        <nav className="mb-6 text-sm" aria-label="パンくずリスト">
          <ol className="flex items-center gap-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-kon">ホーム</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/pdf" className="hover:text-kon">PDFツール</Link>
            </li>
            <li>/</li>
            <li className="text-kon font-medium">{tool.nameJa}</li>
          </ol>
        </nav>

        {/* Header with H1 */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4" role="img" aria-label={tool.nameJa}>{tool.icon}</div>
          <h1 className="text-3xl font-bold text-kon mb-2">{tool.nameJa}</h1>
          <p className="text-gray-600 text-lg">{tool.description}</p>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🇯🇵 日本国内サーバー</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">🔒 安全・安心</span>
            {tool.maxFiles > 1 && (
              <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">📦 一括処理対応（最大{tool.maxFiles}ファイル）</span>
            )}
          </div>
        </header>

        {/* Upload Area */}
        {!isComplete && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8" aria-label="ファイルアップロード">
            {/* Ai-chan Mascot */}
            <div className="mb-6">
              <Mascot state={mascotState} message={mascotMessage} />
            </div>

            {/* Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-kon transition-colors cursor-pointer"
            >
              <input
                type="file"
                accept={tool.acceptedTypes}
                multiple={tool.maxFiles > 1}
                onChange={handleFilesSelected}
                className="hidden"
                id="file-input"
                aria-label="ファイルを選択"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="text-5xl mb-4">📁</div>
                <p className="font-bold text-gray-700 mb-2">
                  ファイルをドラッグ＆ドロップ
                </p>
                <p className="text-sm text-gray-500">
                  または <span className="text-kon underline">クリックして選択</span>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  対応形式: {tool.acceptedTypes} | 最大サイズ: 20MB | 最大ファイル数: {tool.maxFiles}
                </p>
              </label>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mt-6">
                <h2 className="font-medium text-gray-700 mb-3">
                  選択されたファイル ({files.length})
                </h2>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)} 
                        className="text-red-500 hover:text-red-700 p-1"
                        aria-label={`${file.name}を削除`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Extra Fields */}
            {extraFields && <div className="mt-6">{extraFields}</div>}

            {/* Error */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600" role="alert">
                {error}
              </div>
            )}

            {/* Submit Button */}
            {files.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-white transition-all duration-200 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-kon hover:bg-ai"}`}
                aria-busy={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    処理中...
                  </span>
                ) : (
                  `${tool.nameJa}を実行`
                )}
              </button>
            )}
          </section>
        )}

        {/* Success Area */}
        {isComplete && pdfUrl && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center" aria-label="処理完了">
            {/* Ai-chan Mascot - Success */}
            <div className="flex justify-center mb-4">
              <Mascot state="success" message="やったー！完了しました！" />
            </div>
            <h2 className="text-2xl font-bold text-kon mb-2">完了しました！</h2>
            <p className="text-gray-600 mb-6">ファイルのダウンロードが開始されました！</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={pdfUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
              >
                ファイルを開く
              </a>
              <button onClick={reset} className="px-8 py-4 border-2 border-kon text-kon rounded-xl font-bold hover:bg-kon/5 transition-colors" aria-label="別のファイルを処理">
                別のファイルを処理
              </button>
            </div>
          </section>
        )}

        {/* How-to Section */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6" aria-labelledby="howto-heading">
          <h2 id="howto-heading" className="font-bold text-kon mb-3 text-lg">
            {tool.nameJa}の使い方
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>上のエリアにファイルをドラッグ＆ドロップ、またはクリックして選択</li>
            <li>必要に応じてオプションを設定</li>
            <li>「{tool.nameJa}を実行」ボタンをクリック</li>
            <li>処理完了後、自動でダウンロードが開始されます</li>
          </ol>
        </section>

        {/* Dynamic SEO Content from Admin */}
        {(dynamicContent || seoContent) && (
          <section className="mt-8 bg-white rounded-xl p-6 border border-gray-100" aria-labelledby="about-heading">
            <h2 id="about-heading" className="font-bold text-kon mb-4 text-lg">
              {tool.nameJa}について
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
              {(dynamicContent || seoContent)?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {/* Visual How-To Demo */}
        <section className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100" aria-labelledby="demo-heading">
          <h2 id="demo-heading" className="font-bold text-kon mb-6 text-lg text-center">
            📖 かんたん3ステップ
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-3xl">
                📁
              </div>
              <h3 className="font-bold text-kon mb-1">Step 1</h3>
              <p className="text-sm text-gray-600">ファイルを選択</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-3xl">
                ⚡
              </div>
              <h3 className="font-bold text-kon mb-1">Step 2</h3>
              <p className="text-sm text-gray-600">ボタンをクリック</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-3xl">
                ✅
              </div>
              <h3 className="font-bold text-kon mb-1">Step 3</h3>
              <p className="text-sm text-gray-600">ダウンロード完了</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {faq && faq.length > 0 && (
          <section className="mt-8" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-bold text-kon mb-4 text-lg">
              よくある質問（FAQ）
            </h2>
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

        {/* Features Section */}
        <section className="mt-8 grid md:grid-cols-3 gap-4" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">特徴</h2>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🆓</div>
            <h3 className="font-bold text-sm mb-1">完全無料</h3>
            <p className="text-sm text-gray-500">登録不要、制限なし</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🇯🇵</div>
            <h3 className="font-bold text-sm mb-1">日本国内サーバー</h3>
            <p className="text-sm text-gray-500">データを海外に送信しません</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🗑️</div>
            <h3 className="font-bold text-sm mb-1">60分で自動削除</h3>
            <p className="text-sm text-gray-500">プライバシーを保護</p>
          </div>
        </section>

        {/* Related Tools */}
        <section className="mt-8" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-bold text-kon mb-4 text-lg">
            関連ツール
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getToolsByCategory(tool.category)
              .filter(t => t.id !== tool.id && t.available)
              .slice(0, 4)
              .map(relatedTool => (
                <Link
                  key={relatedTool.id}
                  href={relatedTool.path}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:border-kon/30 hover:shadow-sm transition-all text-center group"
                >
                  <div className="text-2xl mb-2">{relatedTool.icon}</div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-kon">{relatedTool.nameJa}</p>
                </Link>
              ))}
          </div>
        </section>

        {/* Security Note */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 ファイルはSSL暗号化通信で送信され、処理後60分で自動削除されます</p>
        </footer>
      </div>
    </div>
  );
}
