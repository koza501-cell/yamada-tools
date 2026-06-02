"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import QRCode from "qrcode";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

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

type ContentType = "url" | "text" | "email" | "phone" | "wifi";
type QRSize = "small" | "medium" | "large";

const sizeMap: Record<QRSize, number> = {
  small: 200,
  medium: 300,
  large: 400,
};

export default function QRCodeClient({
 faq, seoContent }: Props) {
  const { triggerSuccess } = usePricingContext();

  const [contentType, setContentType] = useState<ContentType>("url");
  const [inputValue, setInputValue] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [qrSize, setQrSize] = useState<QRSize>("medium");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState<string>("URLやテキストを入力してね！");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR content based on type
  const getQRContent = (): string => {
    switch (contentType) {
      case "url":
        return inputValue;
      case "text":
        return inputValue;
      case "email":
        let mailto = `mailto:${inputValue}`;
        const params: string[] = [];
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
        if (params.length > 0) mailto += `?${params.join("&")}`;
        return mailto;
      case "phone":
        return `tel:${inputValue.replace(/[^0-9+]/g, "")}`;
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`;
      default:
        return inputValue;
    }
  };

  // Generate QR Code
  const generateQR = async () => {
    const content = getQRContent();
    
    if (!content || (contentType === "wifi" && !wifiSSID)) {
      setMascotState("error");
      setMascotMessage("内容を入力してね！");
      setQrDataUrl(null);
      return;
    }

    setMascotState("working");
    setMascotMessage("QRコード生成中...");

    try {
      const size = sizeMap[qrSize];
      const dataUrl = await QRCode.toDataURL(content, {
        width: size,
        margin: 2,
        color: {
          dark: qrColor,
          light: bgColor,
        },
        errorCorrectionLevel: "M",
      });
      
      setQrDataUrl(dataUrl);
      setMascotState("success")
      triggerSuccess('qr-code');;
      setMascotMessage("QRコード完成！ダウンロードしてね。");
    } catch (error) {
      console.error("QR generation error:", error);
      setMascotState("error");
      setMascotMessage("生成に失敗しました...");
      setQrDataUrl(null);
    }
  };

  // Download QR Code as PNG
  const downloadPNG = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement("a");
    link.download = "qrcode_yamada-tools.png";
    link.href = qrDataUrl;
    link.click();
    setMascotMessage("ダウンロードしました！");
  };

  // Download QR Code as SVG
  const downloadSVG = async () => {
    const content = getQRContent();
    if (!content) return;

    try {
      const svgString = await QRCode.toString(content, {
        type: "svg",
        width: sizeMap[qrSize],
        margin: 2,
        color: {
          dark: qrColor,
          light: bgColor,
        },
      });
      
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "qrcode_yamada-tools.svg";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setMascotMessage("SVGをダウンロードしました！");
    } catch (error) {
      console.error("SVG download error:", error);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setEmailSubject("");
    setEmailBody("");
    setWifiSSID("");
    setWifiPassword("");
    setQrDataUrl(null);
    setMascotState("idle");
    setMascotMessage("URLやテキストを入力してね！");
  };

  const getPlaceholder = (): string => {
    switch (contentType) {
      case "url": return "https://example.com";
      case "text": return "QRコードに変換したいテキスト";
      case "email": return "example@email.com";
      case "phone": return "090-1234-5678";
      default: return "";
    }
  };

  const getInputLabel = (): string => {
    switch (contentType) {
      case "url": return "URL";
      case "text": return "テキスト";
      case "email": return "メールアドレス";
      case "phone": return "電話番号";
      case "wifi": return "WiFi設定";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="text-5xl mb-4">📱</div>
          <h1 className="text-3xl font-bold text-kon mb-2">QRコードを作成する無料ツール — URL・vCard・WiFi対応・商用利用OK</h1>
          <p className="text-gray-600 text-lg">URL・テキスト・WiFiなどからQRコードを生成</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">✓ 完全無料</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">🔒 ブラウザ内処理</span>
            <span className="bg-gray-50 text-kon px-3 py-1 rounded-full">📥 PNG/SVG</span>
          </div>
        </header>

        {/* Main Tool */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Mascot */}
          <div className="mb-6">
            <Mascot state={mascotState} message={mascotMessage} />
          </div>

          {/* Content Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">QRコードの種類</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "url", label: "URL", icon: "🔗" },
                { id: "text", label: "テキスト", icon: "📝" },
                { id: "email", label: "メール", icon: "✉️" },
                { id: "phone", label: "電話番号", icon: "📞" },
                { id: "wifi", label: "WiFi", icon: "📶" },
              ].map((item) => (
                <button type="button"
                  key={item.id}
                  onClick={() => { setContentType(item.id as ContentType); handleClear(); }}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    contentType === item.id
                      ? "bg-kon text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Area */}
            <div>
              {/* Dynamic Input Fields */}
              {contentType !== "wifi" ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getInputLabel()}
                  </label>
                  {contentType === "text" ? (
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={getPlaceholder()}
                      className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-kon focus:border-transparent"
                    />
                  ) : (
                    <input
                      type={contentType === "email" ? "email" : contentType === "phone" ? "tel" : "url"}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={getPlaceholder()}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SSID（ネットワーク名）</label>
                    <input
                      type="text"
                      value={wifiSSID}
                      onChange={(e) => setWifiSSID(e.target.value)}
                      placeholder="MyWiFi"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="password123"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">暗号化方式</label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value as "WPA" | "WEP" | "nopass")}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">なし（オープン）</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Email Additional Fields */}
              {contentType === "email" && (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">件名（任意）</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="お問い合わせ"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-kon focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">本文（任意）</label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="メール本文"
                      className="w-full h-20 p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-kon focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">サイズ</label>
                <div className="flex gap-2">
                  {[
                    { id: "small", label: "小 (200px)" },
                    { id: "medium", label: "中 (300px)" },
                    { id: "large", label: "大 (400px)" },
                  ].map((item) => (
                    <button type="button"
                      key={item.id}
                      onClick={() => setQrSize(item.id as QRSize)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        qrSize === item.id
                          ? "bg-ai text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">QRコードの色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">背景色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button type="button"
                onClick={generateQR}
                className="w-full py-4 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
              >
                QRコードを生成
              </button>
            </div>

            {/* Preview Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">プレビュー</label>
              <div 
                className="bg-gray-50 rounded-xl p-6 flex items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200"
                style={{ backgroundColor: qrDataUrl ? bgColor : undefined }}
              >
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Generated QR Code" className="max-w-full" />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <p>QRコードがここに表示されます</p>
                  </div>
                )}
              </div>

              {/* Download Buttons */}
              {qrDataUrl && (
                <div className="flex gap-3 mt-4">
                  <button type="button"
                    onClick={downloadPNG}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                  >
                    📥 PNG
                  </button>
                  <button type="button"
                    onClick={downloadSVG}
                    className="flex-1 py-3 bg-kon text-white rounded-xl font-bold hover:bg-ai transition-colors"
                  >
                    📥 SVG
                  </button>
                  <button type="button"
                    onClick={handleClear}
                    className="py-3 px-6 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    クリア
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-4 text-lg">活用シーン</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">📇</span>
              <div>
                <p className="font-medium text-gray-700">名刺・SNSプロフィール</p>
                <p className="text-gray-500">vCard対応。連絡先を一括取り込み</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">🍽️</span>
              <div>
                <p className="font-medium text-gray-700">メニュー・店舗POP</p>
                <p className="text-gray-500">色付き・ロゴ入りQRにも対応</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">📡</span>
              <div>
                <p className="font-medium text-gray-700">WiFi接続QR</p>
                <p className="text-gray-500">SSID・パスワードを自動設定</p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="mt-8 bg-sakura/20 rounded-xl p-6">
          <h2 className="font-bold text-kon mb-3 text-lg">使い方</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>QRコードの種類（URL、テキスト、WiFiなど）を選択</li>
            <li>必要な情報を入力</li>
            <li>サイズと色をカスタマイズ（任意）</li>
            <li>「QRコードを生成」をクリック</li>
            <li>PNG または SVG 形式でダウンロード</li>
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
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-bold text-sm mb-1">カスタマイズ</h3>
            <p className="text-xs text-gray-500">色・サイズを自由に設定</p>
          </div>
        </section>


        {/* Blog Callout */}
        <section className="mt-8 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl p-6">
          <p className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-1">📖 もっと深く知りたい方へ</p>
          <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            QRコードの作り方完全ガイド【2026年版】
          </h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            登録商標の正確な表記方法・可変QR vs 静的QRの使い分け・誤り訂正レベルL/M/Q/H・読取エラー5原因・UTMパラメータでGA分析・用途別ベストプラクティス(名刺・メニュー・看板)まで完全解説。
          </p>
          <a
            href="/blog/qrcode-tsukurikata-guide-2026"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            解説記事を読む →
          </a>
        </section>

        {/* 登録商標 Disclaimer */}
        <p className="mt-6 text-xs text-gray-400 text-center">
          ※QRコードは株式会社デンソーウェーブの登録商標です。
        </p>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/image" className="text-kon hover:text-ai transition-colors">
            ← 画像ツール一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
