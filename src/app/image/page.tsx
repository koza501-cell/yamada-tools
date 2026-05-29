import { Metadata } from "next";
import Link from "next/link";
import { imageTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "画像ツール【無料】圧縮・リサイズ・形式変換・QRコード作成",
  description: "画像圧縮、リサイズ、形式変換、背景削除、QRコード作成など15種類の画像編集ツールを完全無料で提供。登録不要・日本国内サーバーで安心処理。",
  keywords: "画像圧縮, 画像リサイズ, 背景削除, QRコード作成, 画像変換, PNG JPEG 変換, WebP変換, 無料 画像編集",
  alternates: {
    canonical: 'https://yamada-tools.jp/image',
  },
};

// Popular tools to highlight
const popularToolIds = ["compress-image", "resize", "format-convert", "qr-generator"];

// Use cases mapping
const useCases = [
  {
    title: "📧 メール・SNS用に軽くしたい",
    description: "画像が大きすぎて送れない？",
    tools: ["compress-image", "resize"],
    color: "from-slate-900 to-kon",
  },
  {
    title: "🔄 形式を変換したい",
    description: "PNG→JPEG、WebP変換など",
    tools: ["format-convert"],
    color: "from-green-500 to-green-600",
  },
  {
    title: "📱 QRコードを作りたい",
    description: "URL・テキストをQRコードに",
    tools: ["qr-generator"],
    color: "from-slate-900 to-kon",
  },
  {
    title: "✂️ 背景を消したい",
    description: "人物・商品の背景を削除",
    tools: ["remove-bg"],
    color: "from-slate-900 to-kon",
  },
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "画像変換・編集ツール",
  description: "画像圧縮・リサイズ・反転・WebP変換など、ブラウザ完結で使える画像処理ツール集",
  url: "https://yamada-tools.jp/image",
  isPartOf: { "@type": "WebSite", url: "https://yamada-tools.jp/", name: "山田ツール" },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: imageTools.filter((t: any) => t.available).length,
    itemListElement: imageTools.filter((t: any) => t.available).map((t: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "SoftwareApplication", name: t.nameJa, url: `https://yamada-tools.jp${t.path}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } },
    })),
  },
};

export default function ImageToolsPage() {
  const availableTools = imageTools.filter(t => t.available);
  const comingSoonTools = imageTools.filter(t => !t.available);
  
  const popularTools = availableTools.filter(t => popularToolIds.includes(t.id));
  const otherTools = availableTools.filter(t => !popularToolIds.includes(t.id));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([collectionJsonLd]) }} />
      <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🖼️</div>
          <h1 className="text-3xl font-bold text-kon mb-4">画像ツール</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            画像圧縮・リサイズ・形式変換・QRコード作成など、
            画像編集に必要なツールを<span className="font-bold text-kon">完全無料</span>で提供。
            <span className="text-sm block mt-1">登録不要・日本国内サーバー処理</span>
          </p>
        </div>

        {/* Quick Use Cases - What do you want to do? */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-4 text-center">🎯 やりたいことから選ぶ</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((useCase, index) => {
              const tools = useCase.tools
                .map(id => availableTools.find(t => t.id === id))
                .filter(Boolean);
              
              if (tools.length === 0) return null;
              
              return (
                <Link
                  key={index}
                  href={tools[0]!.path}
                  className={`bg-gradient-to-br ${useCase.color} text-white p-5 rounded-xl hover:scale-105 transition-transform shadow-lg`}
                >
                  <h3 className="font-bold text-lg mb-1">{useCase.title}</h3>
                  <p className="text-sm opacity-90 mb-3">{useCase.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {tools.map(tool => (
                      <span key={tool!.id} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {tool!.nameJa}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Popular Tools */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-4 flex items-center gap-2">
             人気ツール
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border-2 border-kon/10 hover:border-kon/30 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{tool.icon}</div>
                  <div>
                    <h3 className="font-bold text-kon group-hover:text-ai transition-colors">{tool.nameJa}</h3>
                    <span className="text-xs text-kon font-medium">人気</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{tool.description}</p>
                <div className="mt-3 text-right">
                  <span className="text-kon text-sm font-medium group-hover:text-ai">使う →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Available Tools */}
        {otherTools.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-kon mb-4">📦 その他のツール</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100 group"
                >
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-kon text-sm mb-1 group-hover:text-ai transition-colors">{tool.nameJa}</h3>
                  <p className="text-xs text-gray-500">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Feature Comparison Table */}
        <section className="mb-12 bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-kon mb-4">📊 ツール比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">ツール</th>
                  <th className="text-center py-2 px-3">用途</th>
                  <th className="text-center py-2 px-3">一括処理</th>
                  <th className="text-center py-2 px-3">おすすめ場面</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">画像圧縮</td>
                  <td className="text-center py-3 px-3">ファイルサイズ削減</td>
                  <td className="text-center py-3 px-3">✅ 20枚</td>
                  <td className="text-center py-3 px-3">メール添付、Web高速化</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">リサイズ</td>
                  <td className="text-center py-3 px-3">サイズ変更</td>
                  <td className="text-center py-3 px-3">✅ 複数</td>
                  <td className="text-center py-3 px-3">SNS投稿、サムネイル</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">形式変換</td>
                  <td className="text-center py-3 px-3">PNG↔JPEG↔WebP</td>
                  <td className="text-center py-3 px-3">✅ 複数</td>
                  <td className="text-center py-3 px-3">互換性確保、Web最適化</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">QRコード作成</td>
                  <td className="text-center py-3 px-3">URL→QRコード</td>
                  <td className="text-center py-3 px-3">−</td>
                  <td className="text-center py-3 px-3">名刺、チラシ、ポスター</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Security Note */}
        <section className="mb-12 bg-gradient-to-r from-kon/5 to-ai/5 rounded-xl p-6 border border-kon/10">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔒</div>
            <div>
              <h3 className="font-bold text-kon mb-2">安心・安全のセキュリティ</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ <strong>日本国内サーバー</strong>で処理（海外にデータ送信なし）</li>
                <li>✅ <strong>60分で自動削除</strong>（ファイルは保存されません）</li>
                <li>✅ <strong>SSL暗号化通信</strong>で安全に転送</li>
                <li>✅ <strong>登録不要</strong>で個人情報収集なし</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Coming Soon Tools */}
        {comingSoonTools.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-400 mb-4">
              🚧 準備中のツール
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {comingSoonTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-gray-50 p-4 rounded-xl text-center border border-gray-200 opacity-60"
                >
                  <div className="text-2xl mb-2 grayscale">{tool.icon}</div>
                  <h3 className="font-medium text-gray-500 text-sm">{tool.nameJa}</h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block text-kon hover:text-ai transition-colors"
          >
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
