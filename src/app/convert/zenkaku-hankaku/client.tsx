"use client";

import { useState } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

interface FAQ {
  question: string;
  answer: string;
}

interface SeoContent {
  intro: string;
  useCases?: { title: string; desc: string }[];
  tips?: string;
}

interface Props {
  faq: FAQ[];
  seoContent?: SeoContent;
}

type ConversionMode = "to-hankaku" | "to-zenkaku";
type TargetType = "all" | "alphanumeric" | "katakana" | "symbol";

// Conversion maps
const zenkakuToHankaku: Record<string, string> = {
  // Numbers
  "０": "0", "１": "1", "２": "2", "３": "3", "４": "4",
  "５": "5", "６": "6", "７": "7", "８": "8", "９": "9",
  // Uppercase
  "Ａ": "A", "Ｂ": "B", "Ｃ": "C", "Ｄ": "D", "Ｅ": "E",
  "Ｆ": "F", "Ｇ": "G", "Ｈ": "H", "Ｉ": "I", "Ｊ": "J",
  "Ｋ": "K", "Ｌ": "L", "Ｍ": "M", "Ｎ": "N", "Ｏ": "O",
  "Ｐ": "P", "Ｑ": "Q", "Ｒ": "R", "Ｓ": "S", "Ｔ": "T",
  "Ｕ": "U", "Ｖ": "V", "Ｗ": "W", "Ｘ": "X", "Ｙ": "Y", "Ｚ": "Z",
  // Lowercase
  "ａ": "a", "ｂ": "b", "ｃ": "c", "ｄ": "d", "ｅ": "e",
  "ｆ": "f", "ｇ": "g", "ｈ": "h", "ｉ": "i", "ｊ": "j",
  "ｋ": "k", "ｌ": "l", "ｍ": "m", "ｎ": "n", "ｏ": "o",
  "ｐ": "p", "ｑ": "q", "ｒ": "r", "ｓ": "s", "ｔ": "t",
  "ｕ": "u", "ｖ": "v", "ｗ": "w", "ｘ": "x", "ｙ": "y", "ｚ": "z",
  // Symbols
  "　": " ", "！": "!", "＂": '"', "＃": "#", "＄": "$",
  "％": "%", "＆": "&", "＇": "'", "（": "(", "）": ")",
  "＊": "*", "＋": "+", "，": ",", "－": "-", "．": ".",
  "／": "/", "：": ":", "；": ";", "＜": "<", "＝": "=",
  "＞": ">", "？": "?", "＠": "@", "［": "[", "＼": "\\",
  "］": "]", "＾": "^", "＿": "_", "｀": "`", "｛": "{",
  "｜": "|", "｝": "}", "～": "~",
};

// Katakana conversion (zenkaku to hankaku)
const katakanaZenToHan: Record<string, string> = {
  "ア": "ｱ", "イ": "ｲ", "ウ": "ｳ", "エ": "ｴ", "オ": "ｵ",
  "カ": "ｶ", "キ": "ｷ", "ク": "ｸ", "ケ": "ｹ", "コ": "ｺ",
  "サ": "ｻ", "シ": "ｼ", "ス": "ｽ", "セ": "ｾ", "ソ": "ｿ",
  "タ": "ﾀ", "チ": "ﾁ", "ツ": "ﾂ", "テ": "ﾃ", "ト": "ﾄ",
  "ナ": "ﾅ", "ニ": "ﾆ", "ヌ": "ﾇ", "ネ": "ﾈ", "ノ": "ﾉ",
  "ハ": "ﾊ", "ヒ": "ﾋ", "フ": "ﾌ", "ヘ": "ﾍ", "ホ": "ﾎ",
  "マ": "ﾏ", "ミ": "ﾐ", "ム": "ﾑ", "メ": "ﾒ", "モ": "ﾓ",
  "ヤ": "ﾔ", "ユ": "ﾕ", "ヨ": "ﾖ",
  "ラ": "ﾗ", "リ": "ﾘ", "ル": "ﾙ", "レ": "ﾚ", "ロ": "ﾛ",
  "ワ": "ﾜ", "ヲ": "ｦ", "ン": "ﾝ",
  "ァ": "ｧ", "ィ": "ｨ", "ゥ": "ｩ", "ェ": "ｪ", "ォ": "ｫ",
  "ッ": "ｯ", "ャ": "ｬ", "ュ": "ｭ", "ョ": "ｮ",
  "ガ": "ｶﾞ", "ギ": "ｷﾞ", "グ": "ｸﾞ", "ゲ": "ｹﾞ", "ゴ": "ｺﾞ",
  "ザ": "ｻﾞ", "ジ": "ｼﾞ", "ズ": "ｽﾞ", "ゼ": "ｾﾞ", "ゾ": "ｿﾞ",
  "ダ": "ﾀﾞ", "ヂ": "ﾁﾞ", "ヅ": "ﾂﾞ", "デ": "ﾃﾞ", "ド": "ﾄﾞ",
  "バ": "ﾊﾞ", "ビ": "ﾋﾞ", "ブ": "ﾌﾞ", "ベ": "ﾍﾞ", "ボ": "ﾎﾞ",
  "パ": "ﾊﾟ", "ピ": "ﾋﾟ", "プ": "ﾌﾟ", "ペ": "ﾍﾟ", "ポ": "ﾎﾟ",
  "ヴ": "ｳﾞ", "ー": "ｰ", "。": "｡", "「": "｢", "」": "｣", "、": "､", "・": "･",
};

// Create reverse maps
const hankakuToZenkaku: Record<string, string> = {};
Object.entries(zenkakuToHankaku).forEach(([zen, han]) => {
  hankakuToZenkaku[han] = zen;
});

const katakanaHanToZen: Record<string, string> = {};
Object.entries(katakanaZenToHan).forEach(([zen, han]) => {
  if (han.length === 1) {
    katakanaHanToZen[han] = zen;
  }
});
// Special handling for dakuten/handakuten combinations
const dakutenCombinations: Record<string, string> = {
  "ｶﾞ": "ガ", "ｷﾞ": "ギ", "ｸﾞ": "グ", "ｹﾞ": "ゲ", "ｺﾞ": "ゴ",
  "ｻﾞ": "ザ", "ｼﾞ": "ジ", "ｽﾞ": "ズ", "ｾﾞ": "ゼ", "ｿﾞ": "ゾ",
  "ﾀﾞ": "ダ", "ﾁﾞ": "ヂ", "ﾂﾞ": "ヅ", "ﾃﾞ": "デ", "ﾄﾞ": "ド",
  "ﾊﾞ": "バ", "ﾋﾞ": "ビ", "ﾌﾞ": "ブ", "ﾍﾞ": "ベ", "ﾎﾞ": "ボ",
  "ﾊﾟ": "パ", "ﾋﾟ": "ピ", "ﾌﾟ": "プ", "ﾍﾟ": "ペ", "ﾎﾟ": "ポ",
  "ｳﾞ": "ヴ",
};

export default function ZenkakuHankakuClient({ faq, seoContent }: Props) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<ConversionMode>("to-hankaku");
  const [targets, setTargets] = useState<TargetType[]>(["all"]);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("テキストを入力して変換してね！");
  const [copied, setCopied] = useState(false);

  const isAlphanumeric = (char: string): boolean => {
    return /[０-９Ａ-Ｚａ-ｚ0-9A-Za-z]/.test(char);
  };

  const isKatakana = (char: string): boolean => {
    return /[ァ-ヶｦ-ﾟー]/.test(char);
  };

  const isSymbol = (char: string): boolean => {
    return char in zenkakuToHankaku && !isAlphanumeric(char) && !isKatakana(char);
  };

  const shouldConvert = (char: string): boolean => {
    if (targets.includes("all")) return true;
    if (targets.includes("alphanumeric") && isAlphanumeric(char)) return true;
    if (targets.includes("katakana") && isKatakana(char)) return true;
    if (targets.includes("symbol") && isSymbol(char)) return true;
    return false;
  };

  const convertToHankaku = (text: string): string => {
    let result = "";
    for (const char of text) {
      if (!shouldConvert(char)) {
        result += char;
        continue;
      }
      if (zenkakuToHankaku[char]) {
        result += zenkakuToHankaku[char];
      } else if (katakanaZenToHan[char] && (targets.includes("all") || targets.includes("katakana"))) {
        result += katakanaZenToHan[char];
      } else {
        result += char;
      }
    }
    return result;
  };

  const convertToZenkaku = (text: string): string => {
    let result = "";
    let i = 0;
    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1];
      const twoChars = char + (nextChar || "");
      
      // Check for dakuten/handakuten combinations first
      if ((targets.includes("all") || targets.includes("katakana")) && dakutenCombinations[twoChars]) {
        result += dakutenCombinations[twoChars];
        i += 2;
        continue;
      }
      
      if (!shouldConvert(char)) {
        result += char;
        i++;
        continue;
      }
      
      if (hankakuToZenkaku[char]) {
        result += hankakuToZenkaku[char];
      } else if (katakanaHanToZen[char] && (targets.includes("all") || targets.includes("katakana"))) {
        result += katakanaHanToZen[char];
      } else {
        result += char;
      }
      i++;
    }
    return result;
  };

  const handleConvert = () => {
    if (!inputText.trim()) {
      setMascotState("error");
      setMascotMessage("テキストを入力してね！");
      return;
    }

    setMascotState("working");
    setMascotMessage("変換中...");

    setTimeout(() => {
      const result = mode === "to-hankaku" 
        ? convertToHankaku(inputText)
        : convertToZenkaku(inputText);
      
      setOutputText(result);
      setMascotState("success");
      setMascotMessage("変換完了！コピーして使ってね。");
    }, 300);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setMascotMessage("コピーしました！");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMascotState("error");
      setMascotMessage("コピーに失敗しました...");
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setMascotState("idle");
    setMascotMessage("テキストを入力して変換してね！");
  };

  const handleTargetChange = (target: TargetType) => {
    if (target === "all") {
      setTargets(["all"]);
    } else {
      const newTargets = targets.filter(t => t !== "all");
      if (newTargets.includes(target)) {
        const filtered = newTargets.filter(t => t !== target);
        setTargets(filtered.length > 0 ? filtered : ["all"]);
      } else {
        setTargets([...newTargets, target]);
      }
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
            <li><Link href="/convert" className="hover:text-kon">変換ツール</Link></li>
            <li>/</li>
            <li className="text-kon font-medium">全角・半角変換</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🔄</div>
          <h1 className="text-3xl font-bold text-kon mb-2">全角・半角変換</h1>
          <p className="text-gray-600 text-lg">全角↔半角を一括変換します</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">⚡ 即時変換</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">変換モード</label>
            <div className="flex gap-4">
              <button
                onClick={() => setMode("to-hankaku")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  mode === "to-hankaku"
                    ? "bg-kon text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                全角 → 半角
              </button>
              <button
                onClick={() => setMode("to-zenkaku")}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  mode === "to-zenkaku"
                    ? "bg-kon text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                半角 → 全角
              </button>
            </div>
          </div>

          {/* Target Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">変換対象</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "すべて" },
                { id: "alphanumeric", label: "英数字" },
                { id: "katakana", label: "カタカナ" },
                { id: "symbol", label: "記号" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTargetChange(item.id as TargetType)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    targets.includes(item.id as TargetType)
                      ? "bg-ai text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input/Output */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                入力テキスト
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="変換したいテキストを入力..."
                className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-kon focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{inputText.length} 文字</p>
            </div>

            {/* Output */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                変換結果
              </label>
              <textarea
                value={outputText}
                readOnly
                placeholder="変換結果がここに表示されます..."
                className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">{outputText.length} 文字</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleConvert}
              className="flex-1 py-4 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
            >
              変換する
            </button>
            <button
              onClick={handleCopy}
              disabled={!outputText}
              className={`flex-1 py-4 rounded-xl font-bold transition-colors ${
                outputText
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {copied ? "✓ コピーしました" : "コピー"}
            </button>
            <button
              onClick={handleClear}
              className="py-4 px-6 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              クリア
            </button>
          </div>
        </section>

        {/* Examples */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-4 text-lg">変換例</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-2">全角 → 半角</p>
              <p className="text-gray-600">
                <span className="text-kon">入力:</span> Ａｐｐｌｅ１２３<br/>
                <span className="text-green-600">出力:</span> Apple123
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-2">半角 → 全角</p>
              <p className="text-gray-600">
                <span className="text-kon">入力:</span> Apple123<br/>
                <span className="text-green-600">出力:</span> Ａｐｐｌｅ１２３
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-2">カタカナ変換</p>
              <p className="text-gray-600">
                <span className="text-kon">入力:</span> アイウエオ<br/>
                <span className="text-green-600">出力:</span> ｱｲｳｴｵ
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-medium text-gray-700 mb-2">記号変換</p>
              <p className="text-gray-600">
                <span className="text-kon">入力:</span> ！？＠＃<br/>
                <span className="text-green-600">出力:</span> !?@#
              </p>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>変換モード（全角→半角 または 半角→全角）を選択</li>
            <li>変換対象（英数字、カタカナ、記号）を選択</li>
            <li>変換したいテキストを入力欄に貼り付け</li>
            <li>「変換する」ボタンをクリック</li>
            <li>結果をコピーして使用</li>
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
            <h3 className="font-bold text-sm mb-1">即時変換</h3>
            <p className="text-xs text-gray-500">ブラウザ内で高速処理</p>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/convert" className="text-kon hover:text-ai transition-colors">
            ← 変換ツール一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
