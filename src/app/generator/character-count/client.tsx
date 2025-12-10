"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

interface CountResult {
  totalChars: number;
  charsNoSpaces: number;
  charsNoLineBreaks: number;
  charsNoSpacesOrBreaks: number;
  words: number;
  lines: number;
  paragraphs: number;
  bytes: number;
  hiragana: number;
  katakana: number;
  kanji: number;
  alphanumeric: number;
  zenkaku: number;
  hankaku: number;
}

export default function CharacterCountClient({ faq }: Props) {
  const [inputText, setInputText] = useState("");
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("テキストを入力してね！");

  // Count everything in real-time
  const counts = useMemo((): CountResult => {
    const text = inputText;
    
    // Total characters
    const totalChars = text.length;
    
    // Without spaces (全角・半角スペース)
    const charsNoSpaces = text.replace(/[\s　]/g, "").length;
    
    // Without line breaks
    const charsNoLineBreaks = text.replace(/[\r\n]/g, "").length;
    
    // Without spaces or line breaks
    const charsNoSpacesOrBreaks = text.replace(/[\s　\r\n]/g, "").length;
    
    // Word count (split by whitespace, filter empty)
    const words = text.trim() === "" 
      ? 0 
      : text.trim().split(/[\s　]+/).filter(w => w.length > 0).length;
    
    // Line count
    const lines = text === "" ? 0 : text.split(/\r\n|\r|\n/).length;
    
    // Paragraph count (non-empty lines)
    const paragraphs = text === "" 
      ? 0 
      : text.split(/\r\n|\r|\n/).filter(p => p.trim().length > 0).length;
    
    // Byte count (UTF-8)
    const bytes = new TextEncoder().encode(text).length;
    
    // Hiragana count
    const hiragana = (text.match(/[\u3040-\u309F]/g) || []).length;
    
    // Katakana count (full-width)
    const katakana = (text.match(/[\u30A0-\u30FF]/g) || []).length;
    
    // Kanji count
    const kanji = (text.match(/[\u4E00-\u9FAF]/g) || []).length;
    
    // Alphanumeric (half-width)
    const alphanumeric = (text.match(/[A-Za-z0-9]/g) || []).length;
    
    // Full-width (zenkaku) - includes full-width alphanumeric, katakana, symbols
    const zenkaku = (text.match(/[Ａ-Ｚａ-ｚ０-９\u3000-\u303F\u30A0-\u30FF\u3040-\u309F\u4E00-\u9FAF\uFF01-\uFF5E]/g) || []).length;
    
    // Half-width (hankaku)
    const hankaku = (text.match(/[A-Za-z0-9\u0020-\u007E\uFF61-\uFF9F]/g) || []).length;

    return {
      totalChars,
      charsNoSpaces,
      charsNoLineBreaks,
      charsNoSpacesOrBreaks,
      words,
      lines,
      paragraphs,
      bytes,
      hiragana,
      katakana,
      kanji,
      alphanumeric,
      zenkaku,
      hankaku,
    };
  }, [inputText]);

  // Update mascot based on input
  useEffect(() => {
    if (inputText.length === 0) {
      setMascotState("idle");
      setMascotMessage("テキストを入力してね！");
    } else if (inputText.length > 0) {
      setMascotState("success");
      setMascotMessage(`${counts.totalChars}文字だよ！`);
    }
  }, [inputText, counts.totalChars]);

  const handleClear = () => {
    setInputText("");
    setMascotState("idle");
    setMascotMessage("テキストを入力してね！");
  };

  const handleCopy = async () => {
    const summary = `文字数: ${counts.totalChars}
文字数（スペース除く）: ${counts.charsNoSpaces}
単語数: ${counts.words}
行数: ${counts.lines}
段落数: ${counts.paragraphs}
バイト数: ${counts.bytes}`;
    
    try {
      await navigator.clipboard.writeText(summary);
      setMascotMessage("結果をコピーしました！");
    } catch {
      setMascotMessage("コピーに失敗しました...");
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" aria-label="パンくずリスト">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-kon">ホーム</Link></li>
            <li>/</li>
            <li><Link href="/generator" className="hover:text-kon">計算・生成ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">文字数カウント</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-kon mb-2">文字数カウント</h1>
          <p className="text-gray-600 text-lg">文字数・単語数・行数を瞬時にカウント</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">⚡ リアルタイム</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              テキストを入力
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ここにテキストを入力またはペーストしてください..."
              className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-kon focus:border-transparent text-base"
            />
          </div>

          {/* Main Counts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-kon text-white rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{counts.totalChars.toLocaleString()}</div>
              <div className="text-sm opacity-80">文字数</div>
            </div>
            <div className="bg-ai text-white rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{counts.charsNoSpaces.toLocaleString()}</div>
              <div className="text-sm opacity-80">スペース除く</div>
            </div>
            <div className="bg-gray-700 text-white rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{counts.words.toLocaleString()}</div>
              <div className="text-sm opacity-80">単語数</div>
            </div>
            <div className="bg-gray-500 text-white rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{counts.lines.toLocaleString()}</div>
              <div className="text-sm opacity-80">行数</div>
            </div>
          </div>

          {/* Detailed Counts */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-gray-700 mb-3">詳細カウント</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex justify-between bg-white rounded-lg p-3">
                <span className="text-gray-600">段落数</span>
                <span className="font-bold text-kon">{counts.paragraphs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-white rounded-lg p-3">
                <span className="text-gray-600">バイト数</span>
                <span className="font-bold text-kon">{counts.bytes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-white rounded-lg p-3">
                <span className="text-gray-600">改行除く</span>
                <span className="font-bold text-kon">{counts.charsNoLineBreaks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-white rounded-lg p-3">
                <span className="text-gray-600">ひらがな</span>
                <span className="font-bold text-kon">{counts.hiragana.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-white rounded-lg p-3">
                <span className="text-gray-600">カタカナ</span>
                <span className="font-bold text-kon">{counts.katakana.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-white rounded-lg p-3">
                <span className="text-gray-600">漢字</span>
                <span className="font-bold text-kon">{counts.kanji.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-white rounded-lg p-3">
                <span className="text-gray-600">英数字</span>
                <span className="font-bold text-kon">{counts.alphanumeric.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-white rounded-lg p-3">
                <span className="text-gray-600">全角</span>
                <span className="font-bold text-kon">{counts.zenkaku.toLocaleString()}</span>
              </div>
              <div className="flex justify-between bg-white rounded-lg p-3">
                <span className="text-gray-600">半角</span>
                <span className="font-bold text-kon">{counts.hankaku.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-4 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
            >
              結果をコピー
            </button>
            <button
              onClick={handleClear}
              className="py-4 px-6 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              クリア
            </button>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-4 text-lg">こんな時に便利</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-medium text-gray-700">レポート・論文</p>
                <p className="text-gray-500">文字数制限のある文書作成に</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">🐦</span>
              <div>
                <p className="font-medium text-gray-700">SNS投稿</p>
                <p className="text-gray-500">Twitter/Xの文字数確認に</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="font-medium text-gray-700">ビジネスメール</p>
                <p className="text-gray-500">適切な長さの確認に</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-medium text-gray-700">SMS・メッセージ</p>
                <p className="text-gray-500">文字数オーバー防止に</p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>テキスト入力欄にテキストを入力またはペースト</li>
            <li>リアルタイムで文字数がカウントされます</li>
            <li>詳細情報（単語数、行数、バイト数など）も自動表示</li>
            <li>「結果をコピー」で集計結果をコピー可能</li>
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
            <p className="text-xs text-gray-500">データはサーバーに送信されません</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold text-sm mb-1">リアルタイム</h3>
            <p className="text-xs text-gray-500">入力と同時にカウント</p>
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
