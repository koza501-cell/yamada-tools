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

type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
}

// MD5 implementation (since Web Crypto doesn't support it)
function md5(string: string): string {
  function rotateLeft(value: number, shift: number): number {
    return (value << shift) | (value >>> (32 - shift));
  }

  function addUnsigned(x: number, y: number): number {
    const x4 = x & 0x80000000;
    const y4 = y & 0x80000000;
    const x8 = x & 0x40000000;
    const y8 = y & 0x40000000;
    const result = (x & 0x3fffffff) + (y & 0x3fffffff);
    if (x8 & y8) return result ^ 0x80000000 ^ x4 ^ y4;
    if (x8 | y8) {
      if (result & 0x40000000) return result ^ 0xc0000000 ^ x4 ^ y4;
      else return result ^ 0x40000000 ^ x4 ^ y4;
    } else return result ^ x4 ^ y4;
  }

  function f(x: number, y: number, z: number): number { return (x & y) | (~x & z); }
  function g(x: number, y: number, z: number): number { return (x & z) | (y & ~z); }
  function h(x: number, y: number, z: number): number { return x ^ y ^ z; }
  function i(x: number, y: number, z: number): number { return y ^ (x | ~z); }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function wordToHex(value: number): string {
    let hex = "";
    for (let i = 0; i <= 3; i++) {
      const byte = (value >>> (i * 8)) & 255;
      hex += ("0" + byte.toString(16)).slice(-2);
    }
    return hex;
  }

  const utf8Encode = (s: string) => unescape(encodeURIComponent(s));
  string = utf8Encode(string);

  const x: number[] = [];
  const strLen = string.length;
  for (let i = 0; i < strLen; i += 4) {
    x.push(
      (string.charCodeAt(i)) |
      (string.charCodeAt(i + 1) << 8) |
      (string.charCodeAt(i + 2) << 16) |
      (string.charCodeAt(i + 3) << 24)
    );
  }

  const bitLen = strLen * 8;
  x[bitLen >> 5] |= 0x80 << (bitLen % 32);
  x[(((bitLen + 64) >>> 9) << 4) + 14] = bitLen;

  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;

    a = ff(a, b, c, d, x[k + 0] || 0, 7, 0xd76aa478);
    d = ff(d, a, b, c, x[k + 1] || 0, 12, 0xe8c7b756);
    c = ff(c, d, a, b, x[k + 2] || 0, 17, 0x242070db);
    b = ff(b, c, d, a, x[k + 3] || 0, 22, 0xc1bdceee);
    a = ff(a, b, c, d, x[k + 4] || 0, 7, 0xf57c0faf);
    d = ff(d, a, b, c, x[k + 5] || 0, 12, 0x4787c62a);
    c = ff(c, d, a, b, x[k + 6] || 0, 17, 0xa8304613);
    b = ff(b, c, d, a, x[k + 7] || 0, 22, 0xfd469501);
    a = ff(a, b, c, d, x[k + 8] || 0, 7, 0x698098d8);
    d = ff(d, a, b, c, x[k + 9] || 0, 12, 0x8b44f7af);
    c = ff(c, d, a, b, x[k + 10] || 0, 17, 0xffff5bb1);
    b = ff(b, c, d, a, x[k + 11] || 0, 22, 0x895cd7be);
    a = ff(a, b, c, d, x[k + 12] || 0, 7, 0x6b901122);
    d = ff(d, a, b, c, x[k + 13] || 0, 12, 0xfd987193);
    c = ff(c, d, a, b, x[k + 14] || 0, 17, 0xa679438e);
    b = ff(b, c, d, a, x[k + 15] || 0, 22, 0x49b40821);

    a = gg(a, b, c, d, x[k + 1] || 0, 5, 0xf61e2562);
    d = gg(d, a, b, c, x[k + 6] || 0, 9, 0xc040b340);
    c = gg(c, d, a, b, x[k + 11] || 0, 14, 0x265e5a51);
    b = gg(b, c, d, a, x[k + 0] || 0, 20, 0xe9b6c7aa);
    a = gg(a, b, c, d, x[k + 5] || 0, 5, 0xd62f105d);
    d = gg(d, a, b, c, x[k + 10] || 0, 9, 0x02441453);
    c = gg(c, d, a, b, x[k + 15] || 0, 14, 0xd8a1e681);
    b = gg(b, c, d, a, x[k + 4] || 0, 20, 0xe7d3fbc8);
    a = gg(a, b, c, d, x[k + 9] || 0, 5, 0x21e1cde6);
    d = gg(d, a, b, c, x[k + 14] || 0, 9, 0xc33707d6);
    c = gg(c, d, a, b, x[k + 3] || 0, 14, 0xf4d50d87);
    b = gg(b, c, d, a, x[k + 8] || 0, 20, 0x455a14ed);
    a = gg(a, b, c, d, x[k + 13] || 0, 5, 0xa9e3e905);
    d = gg(d, a, b, c, x[k + 2] || 0, 9, 0xfcefa3f8);
    c = gg(c, d, a, b, x[k + 7] || 0, 14, 0x676f02d9);
    b = gg(b, c, d, a, x[k + 12] || 0, 20, 0x8d2a4c8a);

    a = hh(a, b, c, d, x[k + 5] || 0, 4, 0xfffa3942);
    d = hh(d, a, b, c, x[k + 8] || 0, 11, 0x8771f681);
    c = hh(c, d, a, b, x[k + 11] || 0, 16, 0x6d9d6122);
    b = hh(b, c, d, a, x[k + 14] || 0, 23, 0xfde5380c);
    a = hh(a, b, c, d, x[k + 1] || 0, 4, 0xa4beea44);
    d = hh(d, a, b, c, x[k + 4] || 0, 11, 0x4bdecfa9);
    c = hh(c, d, a, b, x[k + 7] || 0, 16, 0xf6bb4b60);
    b = hh(b, c, d, a, x[k + 10] || 0, 23, 0xbebfbc70);
    a = hh(a, b, c, d, x[k + 13] || 0, 4, 0x289b7ec6);
    d = hh(d, a, b, c, x[k + 0] || 0, 11, 0xeaa127fa);
    c = hh(c, d, a, b, x[k + 3] || 0, 16, 0xd4ef3085);
    b = hh(b, c, d, a, x[k + 6] || 0, 23, 0x04881d05);
    a = hh(a, b, c, d, x[k + 9] || 0, 4, 0xd9d4d039);
    d = hh(d, a, b, c, x[k + 12] || 0, 11, 0xe6db99e5);
    c = hh(c, d, a, b, x[k + 15] || 0, 16, 0x1fa27cf8);
    b = hh(b, c, d, a, x[k + 2] || 0, 23, 0xc4ac5665);

    a = ii(a, b, c, d, x[k + 0] || 0, 6, 0xf4292244);
    d = ii(d, a, b, c, x[k + 7] || 0, 10, 0x432aff97);
    c = ii(c, d, a, b, x[k + 14] || 0, 15, 0xab9423a7);
    b = ii(b, c, d, a, x[k + 5] || 0, 21, 0xfc93a039);
    a = ii(a, b, c, d, x[k + 12] || 0, 6, 0x655b59c3);
    d = ii(d, a, b, c, x[k + 3] || 0, 10, 0x8f0ccc92);
    c = ii(c, d, a, b, x[k + 10] || 0, 15, 0xffeff47d);
    b = ii(b, c, d, a, x[k + 1] || 0, 21, 0x85845dd1);
    a = ii(a, b, c, d, x[k + 8] || 0, 6, 0x6fa87e4f);
    d = ii(d, a, b, c, x[k + 15] || 0, 10, 0xfe2ce6e0);
    c = ii(c, d, a, b, x[k + 6] || 0, 15, 0xa3014314);
    b = ii(b, c, d, a, x[k + 13] || 0, 21, 0x4e0811a1);
    a = ii(a, b, c, d, x[k + 4] || 0, 6, 0xf7537e82);
    d = ii(d, a, b, c, x[k + 11] || 0, 10, 0xbd3af235);
    c = ii(c, d, a, b, x[k + 2] || 0, 15, 0x2ad7d2bb);
    b = ii(b, c, d, a, x[k + 9] || 0, 21, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

async function computeHash(data: ArrayBuffer | string, algorithm: HashAlgorithm): Promise<string> {
  let buffer: ArrayBuffer;
  
  if (typeof data === "string") {
    const encoder = new TextEncoder();
    buffer = encoder.encode(data).buffer;
  } else {
    buffer = data;
  }

  if (algorithm === "MD5") {
    const decoder = new TextDecoder();
    const text = typeof data === "string" ? data : decoder.decode(buffer);
    return md5(text);
  }

  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashClient({ faq }: Props) {
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<HashResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("テキストかファイルを入力してね！");

  const algorithms: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

  const generateHashes = async () => {
    if (inputType === "text" && !text.trim()) {
      setMascotState("error");
      setMascotMessage("テキストを入力してね！");
      return;
    }

    if (inputType === "file" && !file) {
      setMascotState("error");
      setMascotMessage("ファイルを選択してね！");
      return;
    }

    setIsProcessing(true);
    setMascotState("working");
    setMascotMessage("ハッシュ計算中...");

    try {
      const data = inputType === "text" ? text : await file!.arrayBuffer();
      const hashResults: HashResult[] = [];

      for (const algo of algorithms) {
        const hash = await computeHash(data, algo);
        hashResults.push({ algorithm: algo, hash });
      }

      setResults(hashResults);
      setMascotState("success");
      setMascotMessage("ハッシュ生成完了！");
    } catch (error) {
      setMascotState("error");
      setMascotMessage("エラーが発生したよ...");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setMascotMessage("コピーしたよ！");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResults([]);
      setMascotMessage(`${e.target.files[0].name} を選択したよ！`);
    }
  };

  const clearAll = () => {
    setText("");
    setFile(null);
    setResults([]);
    setMascotState("idle");
    setMascotMessage("テキストかファイルを入力してね！");
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
            <li className="text-kon font-medium">ハッシュ生成</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">#</div>
          <h1 className="text-3xl font-bold text-kon mb-2">ハッシュ生成</h1>
          <p className="text-gray-600 text-lg">MD5・SHA-256などのハッシュ値を計算</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">完全無料</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">4種類対応</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">ファイル対応</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Input Type Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setInputType("text"); setResults([]); }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                inputType === "text"
                  ? "bg-kon text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              テキスト入力
            </button>
            <button
              onClick={() => { setInputType("file"); setResults([]); }}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                inputType === "file"
                  ? "bg-kon text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ファイル入力
            </button>
          </div>

          {/* Input Area */}
          {inputType === "text" ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                テキスト
              </label>
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setResults([]); }}
                placeholder="ハッシュ化するテキストを入力..."
                className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{text.length} 文字</p>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ファイル
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-kon transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="text-4xl mb-3">📁</div>
                  {file ? (
                    <p className="text-kon font-medium">{file.name}</p>
                  ) : (
                    <p className="text-gray-500">クリックしてファイルを選択</p>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex gap-2">
            <button
              onClick={generateHashes}
              disabled={isProcessing}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                isProcessing
                  ? "bg-gray-300 text-gray-500 cursor-wait"
                  : "bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {isProcessing ? "計算中..." : "ハッシュを生成"}
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              クリア
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-bold text-kon">生成結果</h3>
              {results.map((result) => (
                <div
                  key={result.algorithm}
                  className="p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-kon">{result.algorithm}</span>
                    <button
                      onClick={() => copyToClipboard(result.hash)}
                      className="text-xs text-kon hover:text-ai px-2 py-1 bg-white rounded border border-gray-200"
                    >
                      コピー
                    </button>
                  </div>
                  <code className="block text-xs text-gray-600 font-mono break-all bg-white p-2 rounded border border-gray-200">
                    {result.hash}
                  </code>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Algorithm Info */}
        <section className="mt-8 bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-kon mb-4 text-lg">アルゴリズム比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 text-left">アルゴリズム</th>
                  <th className="py-2 text-left">長さ</th>
                  <th className="py-2 text-left">セキュリティ</th>
                  <th className="py-2 text-left">用途</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">MD5</td>
                  <td className="py-2">128bit</td>
                  <td className="py-2 text-red-500">非推奨</td>
                  <td className="py-2">チェックサム（非セキュリティ）</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">SHA-1</td>
                  <td className="py-2">160bit</td>
                  <td className="py-2 text-yellow-600">非推奨</td>
                  <td className="py-2">レガシーシステム</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">SHA-256</td>
                  <td className="py-2">256bit</td>
                  <td className="py-2 text-green-600">推奨</td>
                  <td className="py-2">一般的なセキュリティ用途</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">SHA-512</td>
                  <td className="py-2">512bit</td>
                  <td className="py-2 text-green-600">推奨</td>
                  <td className="py-2">高セキュリティ用途</td>
                </tr>
              </tbody>
            </table>
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
            <div className="text-2xl mb-2">安全</div>
            <h3 className="font-bold text-sm mb-1">ブラウザ処理</h3>
            <p className="text-xs text-gray-500">データ送信なし</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl mb-2">高速</div>
            <h3 className="font-bold text-sm mb-1">即時計算</h3>
            <p className="text-xs text-gray-500">Web Crypto API使用</p>
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
