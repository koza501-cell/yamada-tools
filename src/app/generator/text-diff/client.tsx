"use client";

import { useState } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

interface DiffLine {
  type: "unchanged" | "added" | "removed";
  content: string;
  lineNumber1?: number;
  lineNumber2?: number;
}

// Simple diff algorithm (LCS-based)
function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");
  
  // Build LCS table
  const m = lines1.length;
  const n = lines2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Backtrack to find diff
  const result: DiffLine[] = [];
  let i = m, j = n;
  const tempResult: DiffLine[] = [];
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      tempResult.push({
        type: "unchanged",
        content: lines1[i - 1],
        lineNumber1: i,
        lineNumber2: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tempResult.push({
        type: "added",
        content: lines2[j - 1],
        lineNumber2: j,
      });
      j--;
    } else {
      tempResult.push({
        type: "removed",
        content: lines1[i - 1],
        lineNumber1: i,
      });
      i--;
    }
  }
  
  return tempResult.reverse();
}

export default function TextDiffClient({ faq }: Props) {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);
  const [hasCompared, setHasCompared] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("2つのテキストを入力して比較してね！");
  const [stats, setStats] = useState({ added: 0, removed: 0, unchanged: 0 });

  const compare = () => {
    if (!text1.trim() && !text2.trim()) {
      setMascotState("error");
      setMascotMessage("テキストを入力してね！");
      return;
    }

    setMascotState("working");
    setMascotMessage("比較中...");

    setTimeout(() => {
      const result = computeDiff(text1, text2);
      setDiffResult(result);
      setHasCompared(true);

      const added = result.filter(r => r.type === "added").length;
      const removed = result.filter(r => r.type === "removed").length;
      const unchanged = result.filter(r => r.type === "unchanged").length;
      setStats({ added, removed, unchanged });

      setMascotState("success");
      if (added === 0 && removed === 0) {
        setMascotMessage("完全一致！差分はないよ！");
      } else {
        setMascotMessage(`比較完了！ +${added}行 -${removed}行`);
      }
    }, 100);
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
    setDiffResult([]);
    setHasCompared(false);
    setMascotMessage("テキストを入れ替えたよ！");
  };

  const clearAll = () => {
    setText1("");
    setText2("");
    setDiffResult([]);
    setHasCompared(false);
    setMascotState("idle");
    setMascotMessage("2つのテキストを入力して比較してね！");
  };

  const downloadDiff = () => {
    let output = "=== テキスト差分比較結果 ===\n\n";
    output += `追加: ${stats.added}行 | 削除: ${stats.removed}行 | 変更なし: ${stats.unchanged}行\n\n`;
    output += "--- 差分 ---\n";
    
    diffResult.forEach(line => {
      const prefix = line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ";
      output += prefix + line.content + "\n";
    });

    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diff-result_yamada-tools.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sampleTexts = () => {
    setText1("これは元のテキストです。\n二行目のテキスト。\n三行目は変わりません。\n四行目は削除されます。");
    setText2("これは新しいテキストです。\n二行目のテキスト。\n三行目は変わりません。\n五行目が追加されました。");
    setDiffResult([]);
    setHasCompared(false);
    setMascotMessage("サンプルをセットしたよ！");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" aria-label="パンくずリスト">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">テキスト差分比較</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-kon mb-2">テキスト差分比較</h1>
          <p className="text-gray-600 text-lg">2つのテキストの違いを見つける</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">追加: 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">色分け表示</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">日本語対応</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={sampleTexts}
              className="px-3 py-1 bg-sakura/30 text-kon rounded-full text-sm hover:bg-sakura/50 transition-colors"
            >
              サンプルを表示
            </button>
            <button
              onClick={swapTexts}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              入れ替え
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              クリア
            </button>
          </div>

          {/* Input Areas */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                元のテキスト（変更前）
              </label>
              <textarea
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="比較する元のテキストを入力..."
                className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                {text1.split("\n").length} 行 / {text1.length} 文字
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                新しいテキスト（変更後）
              </label>
              <textarea
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="比較する新しいテキストを入力..."
                className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                {text2.split("\n").length} 行 / {text2.length} 文字
              </p>
            </div>
          </div>

          {/* Compare Button */}
          <button
            onClick={compare}
            className="w-full py-4 bg-gradient-to-r from-kon to-ai text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            比較する
          </button>

          {/* Results */}
          {hasCompared && (
            <div className="mt-6">
              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4 text-sm">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    +{stats.added} 追加
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                    -{stats.removed} 削除
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {stats.unchanged} 変更なし
                  </span>
                </div>
                <button
                  onClick={downloadDiff}
                  className="text-sm text-kon hover:text-ai"
                >
                  結果をダウンロード
                </button>
              </div>

              {/* Diff View */}
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <div className="font-mono text-sm">
                  {diffResult.map((line, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        line.type === "added"
                          ? "bg-green-900/50 text-green-300"
                          : line.type === "removed"
                          ? "bg-red-900/50 text-red-300"
                          : "text-gray-300"
                      }`}
                    >
                      <span className="w-8 text-right text-gray-500 pr-2 select-none border-r border-gray-700 mr-2">
                        {line.lineNumber1 || ""}
                      </span>
                      <span className="w-8 text-right text-gray-500 pr-2 select-none border-r border-gray-700 mr-2">
                        {line.lineNumber2 || ""}
                      </span>
                      <span className="w-4 text-center select-none">
                        {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap break-all">
                        {line.content || " "}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 flex gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-900/50 rounded"></span>
                  <span>追加された行</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-red-900/50 rounded"></span>
                  <span>削除された行</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-gray-700 rounded"></span>
                  <span>変更なし</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Use Cases */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">こんな時に使えます</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-600">
            <div className="flex items-center gap-2">
              <span>コード</span>
              <span>プログラムの変更箇所を確認</span>
            </div>
            <div className="flex items-center gap-2">
              <span>文書</span>
              <span>契約書の修正点をチェック</span>
            </div>
            <div className="flex items-center gap-2">
              <span>翻訳</span>
              <span>翻訳前後の対比</span>
            </div>
            <div className="flex items-center gap-2">
              <span>校正</span>
              <span>原稿の修正履歴を確認</span>
            </div>
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
            <div className="text-2xl mb-2">無料</div>
            <h3 className="font-bold text-sm mb-1">完全無料</h3>
            <p className="text-xs text-gray-500">登録不要、制限なし</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">色分け</div>
            <h3 className="font-bold text-sm mb-1">見やすい表示</h3>
            <p className="text-xs text-gray-500">追加・削除を色分け</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">保存</div>
            <h3 className="font-bold text-sm mb-1">結果ダウンロード</h3>
            <p className="text-xs text-gray-500">テキストで保存可能</p>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai transition-colors">
            ← 計算・生成ツール一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
