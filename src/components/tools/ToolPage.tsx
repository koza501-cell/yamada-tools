"use client";
import { AdUnit } from "@/components/common/AdUnit";
import { useUsageLimit } from "@/hooks/useUsageLimit";

import { useState, useEffect } from "react";
import { trackToolUsage } from "@/components/common/RecentTools";
import Link from "next/link";
import { Tool, getToolsByCategory } from "@/config/tools";
import Mascot, { MascotState } from "@/components/common/Mascot";
import ShareButtons from "@/components/common/ShareButtons";
import UsageLimitBanner from "@/components/common/UsageLimitBanner";
import { usePricingContext } from "@/components/common/PricingTriggerProvider";

// GA4 event tracking helper
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const trackToolEvent = (tool: Tool, eventType: 'started' | 'completed' | 'error') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', `tool_${eventType}`, {
      tool_id: tool.id,
      tool_name: tool.nameJa,
      tool_category: tool.category,
    });
  }
};

interface FAQ {
  question: string;
  answer: string;
}

interface ToolPageProps {
  tool: Tool;
  extraFields?: React.ReactNode;
  extraFormData?: Record<string, string>;
  faq?: FAQ[];
  seoContent?: string | {
    intro: string;
    useCases?: { title: string; desc: string }[];
    tips?: string;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

export default function ToolPage({ tool, extraFields, extraFormData, faq, seoContent }: ToolPageProps) {
  const { triggerSuccess } = usePricingContext();

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [dynamicContent, setDynamicContent] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string | undefined>(undefined);
  const { usage, recordUsage } = useUsageLimit(tool.id);

  // Update mascot based on usage
  useEffect(() => {
    if (usage?.is_limited) {
      setMascotState("error");
      setMascotMessage("本日の無料利用枠が上限に達しました。PROプランで無制限にご利用いただけます。");
    } else if (usage?.remaining === 1) {
      setMascotMessage("本日の残り利用回数は1回です。PROプランで無制限にご利用いただけます。");
    } else if (usage?.remaining === 2) {
      setMascotMessage("本日の残り利用回数は2回です。");
    }
  }, [usage]);

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

  // Track tool usage for "Recently Used" feature
  useEffect(() => {
    trackToolUsage(tool.path, tool.nameJa, tool.icon);
  }, [tool.path, tool.nameJa, tool.icon]);
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
    // Check usage limit first
    if (usage?.is_limited) {
      setError("本日の無料枠を使い切りました。PROプランで無制限に利用できます。");
      setMascotState("error");
      setMascotMessage("今日の分は終わりだよ...");
      return;
    }
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

    // Track tool started event
    trackToolEvent(tool, 'started');

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
      await recordUsage();
      setIsComplete(true);
      setMascotState("success");
      setMascotMessage("完了しました！ダウンロードしてね！");
      triggerSuccess(tool.id || 'pdf-tool');

      // Track tool completed event (THIS IS THE KEY METRIC)
      trackToolEvent(tool, 'completed');

      // Open in new tab
      window.open(url, '_blank');

    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setMascotState("error");
      setMascotMessage("ごめんなさい...エラーが発生しました。");

      // Track tool error event
      trackToolEvent(tool, 'error');
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
        {/* Header with H1 */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4" role="img" aria-label={tool.nameJa}>{tool.icon}</div>
          <h1 className="text-3xl font-bold text-kon dark:text-gray-300 mb-2">{tool.nameJa}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">{tool.description}</p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-gray-50 dark:bg-kon/30 text-kon dark:text-gray-300 px-3 py-1 rounded-full">🇯🇵 日本国内サーバー</span>
            <span className="bg-gray-50 dark:bg-kon/30 text-kon dark:text-gray-300 px-3 py-1 rounded-full">🔒 安全・安心</span>
            {tool.maxFiles > 1 && (
              <span className="bg-gray-50 dark:bg-kon/30 text-kon dark:text-gray-300 px-3 py-1 rounded-full">📦 一括処理対応（最大{tool.maxFiles}ファイル）</span>
            )}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">📅 最終更新: 2025年1月1日</p>
        </header>

        {/* Upload Area */}
        {!isComplete && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8" aria-label="ファイルアップロード">
            {/* Ai-chan Mascot */}
            {/* Fixed height to prevent CLS */}
            <div className="mb-6 min-h-[88px]">
              <Mascot state={mascotState} message={mascotMessage} />
            </div>
            {/* Usage Limit Banner - Fixed min-height to prevent CLS */}
            <div className="mb-6 min-h-[60px]">
              <UsageLimitBanner usage={usage} />
            </div>

            {/* Dropzone - Fixed min-height to prevent CLS */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-kon/30 dark:border-kon/40 bg-gray-50/50 dark:bg-kon/20 rounded-xl p-10 text-center hover:border-kon dark:hover:border-ai hover:bg-gray-50 dark:hover:bg-ai/30 hover:shadow-lg transition-all duration-200 cursor-pointer min-h-[240px] flex flex-col items-center justify-center"
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
              <label htmlFor="file-input" className="cursor-pointer block w-full">
                <div className="w-16 h-16 mx-auto mb-4 bg-kon dark:bg-kon rounded-2xl flex items-center justify-center text-3xl shadow-lg">📁</div>
                <p className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-lg">
                  ファイルをドラッグ＆ドロップ
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  または <span className="text-kon dark:text-gray-300 font-medium">クリックして選択</span>
                </p>
                <span className="inline-block bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600">
                  対応形式: {tool.acceptedTypes} • 最大: {tool.category === 'pdf' ? '50MB' : '20MB'} • {tool.maxFiles}ファイルまで
                </span>
              </label>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mt-6">
                <h2 className="font-medium text-gray-700 dark:text-gray-200 mb-3">
                  選択されたファイル ({files.length})
                </h2>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{file.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-danger hover:text-danger dark:text-danger dark:hover:text-gin p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
              <div className="mt-4 p-4 bg-gray-50 dark:bg-danger/30 border border-gray-200 dark:border-danger rounded-lg text-danger dark:text-gin" role="alert">
                {error}
              </div>
            )}

            {/* Submit Button */}
            {files.length > 0 && (
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-white transition-all duration-200 ${isProcessing ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed" : "bg-kon hover:bg-ai dark:bg-kon dark:hover:bg-ai"}`}
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
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center" aria-label="処理完了">
            {/* Ai-chan Mascot - Success */}
            <div className="flex justify-center mb-4 min-h-[88px]">
              <Mascot state="success" message="処理が完了しました。ダウンロードしてご利用ください。" />
            </div>
            <h2 className="text-2xl font-bold text-kon dark:text-gray-300 mb-2">完了しました！</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">ファイルのダウンロードが開始されました！</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-kon hover:bg-ai dark:bg-kon dark:hover:bg-ai text-white rounded-xl font-bold transition-colors"
              >
                ファイルを開く
              </a>
              <button onClick={reset} className="px-8 py-4 border-2 border-kon dark:border-kon text-kon dark:text-gray-300 rounded-xl font-bold hover:bg-kon/5 dark:hover:bg-ai/20 transition-colors" aria-label="別のファイルを処理">
                別のファイルを処理
              </button>
            </div>

            {/* Share Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">このツールが役に立ちましたら、ぜひシェアしてください。</p>
              <ShareButtons
                title={`${tool.nameJa} - 山田ツール`}
                description={tool.description}
              />
            </div>
          </section>
        )}

{/* Ad: after tool section */}
        <AdUnit slot="5612038947" format="rectangle" />
        {/* How-to Section */}
        <section className="mt-8 bg-sakura/20 dark:bg-kon/20 rounded-xl p-6" aria-labelledby="howto-heading">
          <h2 id="howto-heading" className="font-bold text-kon dark:text-gray-300 mb-3 text-lg">
            {tool.nameJa}の使い方
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>上のエリアにファイルをドラッグ＆ドロップ、またはクリックして選択</li>
            <li>必要に応じてオプションを設定</li>
            <li>「{tool.nameJa}を実行」ボタンをクリック</li>
            <li>処理完了後、自動でダウンロードが開始されます</li>
          </ol>
        </section>

        {/* Dynamic SEO Content from Admin */}
        {(dynamicContent || seoContent) && (
          <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700" aria-labelledby="about-heading">
            <h2 id="about-heading" className="font-bold text-kon dark:text-gray-300 mb-4 text-lg">
              {tool.nameJa}について
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
              {typeof seoContent === 'string' ? (
                (dynamicContent || seoContent)?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))
              ) : seoContent ? (
                <>
                  <p className="mb-4 text-base">{seoContent.intro}</p>
                  {seoContent.useCases && (
                    <div className="grid sm:grid-cols-2 gap-3 my-4">
                      {seoContent.useCases.map((uc, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <p className="font-medium text-gray-800 dark:text-gray-100">{uc.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{uc.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {seoContent.tips && (
                    <div className="bg-gray-50 dark:bg-kon/30 rounded-lg p-4 mt-4">
                      <p className="text-sm text-kon dark:text-gray-300">💡 <strong>ヒント:</strong> {seoContent.tips}</p>
                    </div>
                  )}
                </>
              ) : dynamicContent?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {/* Visual How-To Demo */}
        <section className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-6 border border-gray-200 dark:border-kon/50" aria-labelledby="demo-heading">
          <h2 id="demo-heading" className="font-bold text-kon dark:text-gray-300 mb-6 text-lg text-center">
            📖 かんたん3ステップ
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-3xl">
                📁
              </div>
              <h3 className="font-bold text-kon dark:text-gray-300 mb-1">Step 1</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">ファイルを選択</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-3xl">
                ⚡
              </div>
              <h3 className="font-bold text-kon dark:text-gray-300 mb-1">Step 2</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">ボタンをクリック</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-3xl">
                ✅
              </div>
              <h3 className="font-bold text-kon dark:text-gray-300 mb-1">Step 3</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">ダウンロード完了</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {faq && faq.length > 0 && (
          <section className="mt-8" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-bold text-kon dark:text-gray-300 mb-4 text-lg">
              よくある質問（FAQ）
            </h2>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <details
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden group"
                >
                  <summary className="p-4 font-medium cursor-pointer text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 list-none flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-kon dark:text-gray-300">Q.</span>
                      {item.question}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-kon dark:text-gray-300 font-medium">A.</span> {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="mt-8 grid md:grid-cols-3 gap-4" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">特徴</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">🆓</div>
            <h3 className="font-bold text-sm mb-1 text-gray-800 dark:text-gray-100">完全無料</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">登録不要、制限なし</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">🇯🇵</div>
            <h3 className="font-bold text-sm mb-1 text-gray-800 dark:text-gray-100">日本国内サーバー</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">データを海外に送信しません</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
            <div className="text-2xl mb-2">🗑️</div>
            <h3 className="font-bold text-sm mb-1 text-gray-800 dark:text-gray-100">60分で自動削除</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">プライバシーを保護</p>
          </div>
        </section>

        {/* Ad: before footer */}
        <AdUnit slot="5612038947" format="horizontal" />

        {/* Security Note */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>🔒 ファイルはSSL暗号化通信で送信され、処理後60分で自動削除されます</p>
        </footer>
      </div>
    </div>
  );
}
