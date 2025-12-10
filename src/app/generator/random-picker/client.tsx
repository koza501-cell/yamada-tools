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

export default function RandomPickerClient({ faq }: Props) {
  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [pickCount, setPickCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("抽選する項目を追加してね！");
  const [history, setHistory] = useState<string[][]>([]);

  const addItem = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems(prev => [...prev, trimmed]);
      setInputValue("");
      setMascotMessage(`「${trimmed}」を追加したよ！`);
    }
  }, [inputValue, items]);

  const addMultipleItems = useCallback((text: string) => {
    // Split by newline, comma, or space
    const newItems = text
      .split(/[\n,、\s]+/)
      .map(item => item.trim())
      .filter(item => item && !items.includes(item));
    
    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems]);
      setMascotMessage(`${newItems.length}件追加したよ！`);
    }
  }, [items]);

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.includes("\n") || pastedText.includes(",") || pastedText.includes("、")) {
      e.preventDefault();
      addMultipleItems(pastedText);
    }
  };

  const shuffle = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const pickRandom = async () => {
    if (items.length === 0) {
      setMascotState("error");
      setMascotMessage("項目を追加してね！");
      return;
    }

    if (pickCount > items.length) {
      setMascotState("error");
      setMascotMessage(`項目が${items.length}個しかないよ！`);
      return;
    }

    setIsSpinning(true);
    setMascotState("working");
    setMascotMessage("抽選中...");
    setResults([]);

    // Dramatic spinning effect
    const spinDuration = 2000;
    const spinInterval = 100;
    let elapsed = 0;

    const spinEffect = setInterval(() => {
      elapsed += spinInterval;
      
      // Show random items during spinning
      const randomIndex = Math.floor(Math.random() * items.length);
      setResults([items[randomIndex]]);

      if (elapsed >= spinDuration) {
        clearInterval(spinEffect);
        
        // Final selection
        const shuffled = shuffle(items);
        const selected = shuffled.slice(0, pickCount);
        setResults(selected);
        setHistory(prev => [selected, ...prev.slice(0, 9)]);
        setIsSpinning(false);
        setMascotState("success");
        
        if (pickCount === 1) {
          setMascotMessage(`「${selected[0]}」に決定！🎉`);
        } else {
          setMascotMessage(`${pickCount}人選ばれたよ！🎉`);
        }
      }
    }, spinInterval);
  };

  const clearAll = () => {
    setItems([]);
    setResults([]);
    setMascotState("idle");
    setMascotMessage("抽選する項目を追加してね！");
  };

  const clearResults = () => {
    setResults([]);
    setMascotState("idle");
    setMascotMessage("もう一度抽選してみよう！");
  };

  // Preset templates
  const presets = [
    { name: "じゃんけん", items: ["グー", "チョキ", "パー"] },
    { name: "曜日", items: ["月曜", "火曜", "水曜", "木曜", "金曜"] },
    { name: "数字1-10", items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
  ];

  const applyPreset = (preset: { name: string; items: string[] }) => {
    setItems(preset.items);
    setMascotMessage(`「${preset.name}」を読み込んだよ！`);
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
            <li className="text-kon font-medium">ランダム抽選</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🎲</div>
          <h1 className="text-3xl font-bold text-kon mb-2">ランダム抽選</h1>
          <p className="text-gray-600 text-lg">公平にランダムで選ぼう</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🎯 公平な抽選</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">📝 履歴機能</span>
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
              項目を追加（名前、アイテムなど）
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onPaste={handlePaste}
                placeholder="入力してEnter（複数ペースト可）"
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
              />
              <button
                onClick={addItem}
                className="px-6 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
              >
                追加
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              💡 カンマ区切りや改行でまとめて追加できます
            </p>
          </div>

          {/* Presets */}
          <div className="mb-6">
            <label className="block text-xs text-gray-500 mb-2">クイック追加</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1 bg-sakura/30 text-kon rounded-full text-sm hover:bg-sakura/50 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  登録済み（{items.length}件）
                </label>
                <button
                  onClick={clearAll}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  すべて削除
                </button>
              </div>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl max-h-48 overflow-y-auto">
                {items.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm group"
                  >
                    {item}
                    <button
                      onClick={() => removeItem(index)}
                      className="text-gray-400 hover:text-red-500 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pick Count */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              抽選人数
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPickCount(Math.max(1, pickCount - 1))}
                className="w-10 h-10 bg-gray-100 rounded-full text-xl font-bold hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <span className="text-2xl font-bold text-kon w-16 text-center">
                {pickCount}
              </span>
              <button
                onClick={() => setPickCount(Math.min(items.length || 10, pickCount + 1))}
                className="w-10 h-10 bg-gray-100 rounded-full text-xl font-bold hover:bg-gray-200 transition-colors"
              >
                +
              </button>
              <span className="text-gray-500 text-sm">人を選ぶ</span>
            </div>
          </div>

          {/* Pick Button */}
          <button
            onClick={pickRandom}
            disabled={isSpinning || items.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              isSpinning
                ? "bg-gradient-to-r from-kon via-ai to-kon bg-[length:200%_100%] animate-pulse text-white cursor-wait"
                : items.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            {isSpinning ? "🎲 抽選中..." : "🎲 抽選する！"}
          </button>

          {/* Results */}
          {results.length > 0 && !isSpinning && (
            <div className="mt-6">
              <div className="bg-gradient-to-br from-sakura/30 to-kon/10 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">🎉 結果発表！</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="px-6 py-3 bg-white rounded-xl shadow-md border-2 border-kon text-xl font-bold text-kon animate-bounce"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {result}
                    </div>
                  ))}
                </div>
                <button
                  onClick={clearResults}
                  className="mt-4 text-sm text-kon hover:text-ai underline"
                >
                  もう一度抽選する
                </button>
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                履歴（最新10件）
              </label>
              <div className="space-y-2">
                {history.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <span className="text-gray-400">#{history.length - index}</span>
                    <span>{result.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Use Cases */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">💡 こんな時に使えます</h2>
          <div className="grid md:grid-cols-2 gap-3 text-gray-600">
            <div className="flex items-center gap-2">
              <span>👔</span>
              <span>会議の発表順を決める</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🧹</span>
              <span>掃除当番を決める</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎁</span>
              <span>プレゼント交換の相手を決める</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>チーム分けをする</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🍽️</span>
              <span>今日のランチを決める</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span>ビンゴの数字を決める</span>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>抽選する項目（名前など）を追加</li>
            <li>抽選人数を設定</li>
            <li>「抽選する！」をクリック</li>
            <li>結果が表示されます</li>
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
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-bold text-sm mb-1">公平な抽選</h3>
            <p className="text-xs text-gray-500">完全ランダムで選出</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-bold text-sm mb-1">履歴機能</h3>
            <p className="text-xs text-gray-500">過去の結果を確認</p>
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
