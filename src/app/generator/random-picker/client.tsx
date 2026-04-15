"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faq: FAQ[];
}

export default function RandomPickerClient({
 faq }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [items, setItems] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [pickCount, setPickCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("抽選する項目を追加してね！");
  const [history, setHistory] = useState<string[][]>([]);
  const [shareVisible, setShareVisible] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [sharedResult, setSharedResult] = useState<{ w: string[]; c: number } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultParam = params.get("result");
    if (resultParam) {
      try {
        const data = JSON.parse(decodeURIComponent(atob(resultParam)));
        setSharedResult(data);
      } catch {
        // invalid param, ignore
      }
    }
  }, []);

  const addItem = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems(prev => [...prev, trimmed]);
      setInputValue("");
      setMascotMessage(`「${trimmed}」を追加したよ！`);
    }
  }, [inputValue, items]);

  const addMultipleItems = useCallback((text: string) => {
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
    if (e.key === "Enter") addItem();
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

  const showShareSection = (winners: string[], allItems: string[]) => {
    const resultData = { w: winners, t: Date.now(), c: allItems.length };
    const encoded = btoa(encodeURIComponent(JSON.stringify(resultData)));
    const url = `${window.location.origin}${window.location.pathname}?result=${encoded}`;
    window.history.pushState({ result: encoded }, "", `?result=${encoded}`);
    setShareUrl(url);
    setShareVisible(true);
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
    setShareVisible(false);

    const spinDuration = 2000;
    const spinInterval = 100;
    let elapsed = 0;

    const spinEffect = setInterval(() => {
      elapsed += spinInterval;
      const randomIndex = Math.floor(Math.random() * items.length);
      setResults([items[randomIndex]]);
      if (elapsed >= spinDuration) {
        clearInterval(spinEffect);
        const shuffled = shuffle(items);
        const selected = shuffled.slice(0, pickCount);
        setResults(selected);
        setHistory(prev => [selected, ...prev.slice(0, 9)]);
        setIsSpinning(false);
        setMascotState("success")
      triggerSuccess('random-picker');;
        if (pickCount === 1) {
          setMascotMessage(`「${selected[0]}」に決定！🎉`);
        } else {
          setMascotMessage(`${pickCount}人選ばれたよ！🎉`);
        }
        showShareSection(selected, items);
      }
    }, spinInterval);
  };

  const clearAll = () => {
    setItems([]);
    setResults([]);
    setShareVisible(false);
    setMascotState("idle");
    setMascotMessage("抽選する項目を追加してね！");
  };

  const clearResults = () => {
    setResults([]);
    setShareVisible(false);
    setMascotState("idle");
    setMascotMessage("もう一度抽選してみよう！");
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const presets = [
    { name: "じゃんけん", items: ["グー", "チョキ", "パー"] },
    { name: "曜日", items: ["月曜", "火曜", "水曜", "木曜", "金曜"] },
    { name: "数字1-10", items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
  ];

  const applyPreset = (preset: { name: string; items: string[] }) => {
    setItems(preset.items);
    setMascotMessage(`「${preset.name}」を読み込んだよ！`);
  };

  const getShareText = () => {
    if (results.length === 0) return "";
    return `抽選結果：${results.join("、")} が当選しました！ #ランダム抽選 #山田ツール`;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Shared result banner */}
        {sharedResult && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold text-kon mb-2">🎉 共有された抽選結果</h2>
            <p className="text-gray-700 mb-1">当選者：<strong className="text-2xl text-kon">{sharedResult.w.join("、")}</strong></p>
            <p className="text-sm text-gray-500 mb-4">（{sharedResult.c}人から抽選）</p>
            <Link href="/generator/random-picker" className="text-kon underline text-sm">自分でも抽選してみる →</Link>
          </div>
        )}

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🎲</div>
          <h1 className="text-3xl font-bold text-kon mb-2">ランダム抽選ツール</h1>
          <p className="text-gray-600 text-lg">公平にランダムで選ぼう</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🎯 公平な抽選</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">📝 履歴機能</span>
            <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">🔒 登録不要</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
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
                <label className="text-sm font-medium text-gray-700">登録済み（{items.length}件）</label>
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700">すべて削除</button>
              </div>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl max-h-48 overflow-y-auto">
                {items.map((item, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm group">
                    {item}
                    <button onClick={() => removeItem(index)} className="text-gray-400 hover:text-red-500 ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pick Count */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">抽選人数</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPickCount(Math.max(1, pickCount - 1))}
                className="w-10 h-10 bg-gray-100 rounded-full text-xl font-bold hover:bg-gray-200 transition-colors"
              >-</button>
              <span className="text-2xl font-bold text-kon w-16 text-center">{pickCount}</span>
              <button
                onClick={() => setPickCount(Math.min(items.length || 10, pickCount + 1))}
                className="w-10 h-10 bg-gray-100 rounded-full text-xl font-bold hover:bg-gray-200 transition-colors"
              >+</button>
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
                <button onClick={clearResults} className="mt-4 text-sm text-kon hover:text-ai underline">
                  もう一度抽選する
                </button>
              </div>

              {/* Share Section */}
              {shareVisible && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 mb-3 font-medium text-center">この結果をシェア</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={handleCopyUrl}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                    >
                      🔗 {copyFeedback ? "コピーしました！" : "URLをコピー"}
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      𝕏 ポスト
                    </a>
                    <a
                      href={`https://line.me/R/msg/text/?${encodeURIComponent(getShareText() + " " + shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      💬 LINE
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">履歴（最新10件）</label>
              <div className="space-y-2">
                {history.map((result, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-gray-400">#{history.length - index}</span>
                    <span>{result.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Section A: Tool Description */}
        <section className="mt-8 bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-kon mb-3 text-xl">ランダム抽選ツールとは</h2>
          <p className="text-gray-600 mb-3">
            このランダム抽選ツールは、名前・アイテムのリストから公平にランダムで1人または複数名を選ぶ
            無料のWebツールです。インストール不要・会員登録不要で、ブラウザからすぐに使えます。
            忘年会の幹事決め、プレゼント交換の相手決め、クラスの席替え、会議の発表順番決め、
            チーム分け・グループ分けなど、あらゆる「公平に決めたい」場面でご活用いただけます。
          </p>
          <p className="text-gray-600">
            すべての処理は日本国内サーバーで行われ、入力した名前データが外部に送信されることは
            ありません。SSL暗号化通信により、安心してお使いいただけます。
          </p>
        </section>

        {/* Section B: Use Cases */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-4 text-xl">こんな時に使えます</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">🎉 忘年会・新年会・飲み会の幹事決め</h3>
              <p className="text-gray-600 text-sm">飲み会の幹事や仕切り役をランダムに決めるのに最適です。参加者の名前を入力してボタンを押すだけで、その場で公平に幹事を選べます。スマホからもすぐに使えるので、集まりの席でそのまま実施できます。</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">🎁 プレゼント交換・シークレットサンタ</h3>
              <p className="text-gray-600 text-sm">クリスマスパーティーや忘年会でのプレゼント交換（シークレットサンタ）の相手決めに。全員の名前を入力して複数人を同時抽選することで、誰が誰にプレゼントを渡すかをスムーズかつ公平に決めることができます。</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">📋 会議・授業の発表順番決め</h3>
              <p className="text-gray-600 text-sm">会議での発表順、授業での当てる順番、朝礼スピーチの順番などをランダムに決めるのに使えます。名前リストを入力して全員分を一度に抽選することで、公平な順番を瞬時に決定できます。</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">🧹 掃除当番・当直の割り当て</h3>
              <p className="text-gray-600 text-sm">会社や学校での掃除当番、日直・週番などの割り当てをランダムに決めるのに活用できます。毎回同じ人に偏らないよう、公平にローテーションを決めることができます。</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">👥 チーム分け・グループ分け</h3>
              <p className="text-gray-600 text-sm">スポーツやゲームのチーム分け、ワークショップのグループ分け、席替えなどに使えます。参加者名を入力して当選人数を設定し、複数回抽選することで公平なチーム分けが可能です。</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">🍽️ ランチのお店・メニュー選び</h3>
              <p className="text-gray-600 text-sm">「今日のランチどこにする？」という悩みも解決。候補のお店やメニューを入力してランダムに1つを選ぶことができます。全員が候補を出し合って公平に選べるので、誰も不満が出ません。</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">🎮 ゲーム・罰ゲームの順番決め</h3>
              <p className="text-gray-600 text-sm">パーティーゲームやボードゲームの先攻・後攻決め、罰ゲームを受ける人の決定などにも使えます。楽しいイベントをより盛り上げるためのツールとして活躍します。</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">🏫 クラスの席替え</h3>
              <p className="text-gray-600 text-sm">小学校・中学校・高校のクラス席替えをランダムに決めるのに便利です。生徒全員の名前を入力して抽選することで、先生も生徒も納得できる公平な席替えが実現します。</p>
            </div>
          </div>
        </section>

        {/* Section C: How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-4 text-xl">使い方</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">ステップ1：抽選する項目を入力する</h3>
              <p className="text-gray-600 text-sm">テキストボックスに抽選したい名前やアイテムを入力します。カンマ（,）区切りまたは改行で複数の項目を一度に入力できます。「じゃんけん」「曜日」「数字1-10」などのクイック追加ボタンも利用できます。人数に制限はなく、何名でも入力可能です。</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">ステップ2：抽選人数を設定する</h3>
              <p className="text-gray-600 text-sm">「抽選人数」の「+」「-」ボタンで、一度に選ぶ人数を設定します。1人だけ選ぶ場合は1のまま、複数人を同時に選ぶ場合は人数を増やしてください。重複なしで複数名を選ぶことができます。</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">ステップ3：「抽選する！」ボタンを押す</h3>
              <p className="text-gray-600 text-sm">準備ができたら「抽選する！」ボタンをクリックまたはタップします。完全ランダムなアルゴリズムにより、瞬時に公平な結果が表示されます。結果は履歴にも自動的に保存されます。</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h3 className="font-bold text-kon mb-1">ステップ4：結果を確認・共有する</h3>
              <p className="text-gray-600 text-sm">抽選結果が大きく表示されます。URLコピーボタンでこの結果を他の人にシェアすることができます。もう一度抽選したい場合は「もう一度抽選する」ボタンを押すだけです。過去の結果は画面下部の履歴から確認できます。</p>
            </div>
          </div>
        </section>

        {/* Section D: FAQ - always visible */}
        <section className="mt-8">
          <h2 className="font-bold text-kon mb-4 text-xl">よくある質問（FAQ）</h2>
          <div className="space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-medium text-kon mb-2 flex items-start gap-2">
                  <span className="text-kon font-bold flex-shrink-0">Q.</span>
                  {item.question}
                </h3>
                <p className="text-gray-600 text-sm flex items-start gap-2">
                  <span className="text-kon font-bold flex-shrink-0">A.</span>
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🆓</div>
            <h3 className="font-bold text-sm mb-1">完全無料・登録不要</h3>
            <p className="text-xs text-gray-500">制限なし、すぐ使える</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-bold text-sm mb-1">公平な抽選</h3>
            <p className="text-xs text-gray-500">暗号論的乱数で偏りなし</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-bold text-sm mb-1">安心・安全</h3>
            <p className="text-xs text-gray-500">日本国内サーバー処理</p>
          </div>
        </section>

{/* Sub-pages — scene-specific variants */}        <section className="mt-8">          <h2 className="font-bold text-kon mb-4 text-xl">用途別の専用ページ</h2>          <div className="grid md:grid-cols-3 gap-4">            <a href="/generator/random-picker/nenkai" className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow no-underline"><div className="text-3xl mb-2">🎊</div><p className="font-bold text-kon text-sm mb-1">忘年会・新年会 抽選ツール</p><p className="text-xs text-gray-500">幹事決め・景品抽選・プレゼント交換に対応</p></a>            <a href="/generator/random-picker/christmas" className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow no-underline"><div className="text-3xl mb-2">🎄</div><p className="font-bold text-kon text-sm mb-1">クリスマス プレゼント交換</p><p className="text-xs text-gray-500">シークレットサンタの相手決めに特化</p></a>            <a href="/generator/random-picker/seat" className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow no-underline"><div className="text-3xl mb-2">🏫</div><p className="font-bold text-kon text-sm mb-1">席替えランダム決めツール</p><p className="text-xs text-gray-500">クラス・職場の座席をシャッフル。印刷対応</p></a>          </div>        </section>
        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/generator" className="text-kon hover:text-ai transition-colors">
            ← 計算・生成ツール一覧に戻る
          </Link>
        </div>
        <AdUnit position="mid" format="horizontal" />
      </div>
    </div>
  );
}
