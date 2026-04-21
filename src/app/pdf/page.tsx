import Link from "next/link";
import { pdfTools } from "@/config/tools";
import type { Metadata } from "next";
import PdfDropZone from "@/components/pdf/PdfDropZone";
import PdfWorkflows from "@/components/pdf/PdfWorkflows";

export const metadata: Metadata = {
  title: "PDFツール - 無料オンラインPDF編集・変換",
  description: "PDF結合・圧縮・分割・変換など20以上の無料PDFツール。日本国内サーバーで安心・安全。登録不要、60分で自動削除。",
  alternates: {
    canonical: 'https://yamada-tools.jp/pdf',
  },
};

export default function PDFToolsPage() {
  // Group tools by type
  const coreTools = pdfTools.filter(t => 
    ["merge", "compress", "split", "rotate", "delete-pages"].includes(t.id)
  );
  const conversionTools = pdfTools.filter(t => 
    ["image-to-pdf", "pdf-to-image", "pdf-to-word", "word-to-pdf", 
     "excel-to-pdf", "pdf-to-excel", "ppt-to-pdf", "pdf-to-ppt"].includes(t.id)
  );
  const securityTools = pdfTools.filter(t => 
    ["protect", "unlock"].includes(t.id)
  );
  const editingTools = pdfTools.filter(t => 
    ["page-numbers", "watermark", "reorder", "sign", "ocr", "pdf-text-input", "combini-print"].includes(t.id)
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-kon mb-4">
            📄 PDFツール
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            PDF結合・圧縮・分割・変換など、すべて無料でご利用いただけます。
            日本国内サーバー運用、登録不要。
          </p>
        </div>

        {/* Universal Drop Zone */}
        <PdfDropZone />

        {/* 注目ツール - Featured Tool */}
        <section className="mb-10 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-750 rounded-2xl p-6 border border-orange-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">注目</span>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">今週のおすすめツール</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                <Link href="/pdf/text-input" className="hover:text-orange-600 transition-colors">
                  ✏️ PDFに文字入力・電子ハンコ 無料ツール
                </Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                <strong className="text-gray-800 dark:text-white">登録不要・インストール不要・ゼロアップロード</strong>でPDFに直接テキストや電子ハンコを書き込めます。
                申請書・契約書・履歴書など全PDF対応。令和日付自動入力機能搭載。ファイルはブラウザ内で処理されサーバーに送信されません。
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["PDF文字入力","電子ハンコ","令和日付対応","登録不要","無料","サーバー送信なし"].map(tag => (
                  <span key={tag} className="bg-orange-100 dark:bg-gray-700 text-orange-700 dark:text-orange-400 text-xs px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <Link
                href="/pdf/text-input"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors"
              >
                PDFに文字入力・書き込みを試す（無料）→
              </Link>
            </div>
          </div>
        </section>


        {/* Core Tools */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-6 flex items-center gap-2">
            <span className="bg-kon text-white px-3 py-1 rounded-full text-sm">基本</span>
            基本ツール
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {coreTools.map((tool) => (
              <div key={tool.id} className="relative">
                {(tool.id === "compress" || tool.id === "merge") && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold z-10">人気</span>
                )}
                <Link
                  href={tool.path}
                  className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-4xl mb-3">{tool.icon}</div>
                  <h3 className="font-bold text-kon">{tool.nameJa}</h3>
                  <p className="text-xs text-gray-500 mt-2">{tool.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Builder */}
        <PdfWorkflows />

        {/* Conversion Tools */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-6 flex items-center gap-2">
            <span className="bg-ai text-white px-3 py-1 rounded-full text-sm">変換</span>
            変換ツール
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {conversionTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h3 className="font-bold text-kon">{tool.nameJa}</h3>
                <p className="text-xs text-gray-500 mt-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Security Tools */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-6 flex items-center gap-2">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">保護</span>
            セキュリティツール
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {securityTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h3 className="font-bold text-kon">{tool.nameJa}</h3>
                <p className="text-xs text-gray-500 mt-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Editing Tools */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-6 flex items-center gap-2">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">編集</span>
            編集ツール
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {editingTools.map((tool) => (
              <div key={tool.id} className="relative">
                {tool.id === "pdf-text-input" && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold z-10">NEW</span>
                )}
                <Link
                  href={tool.path}
                  className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-4xl mb-3">{tool.icon}</div>
                  <h3 className="font-bold text-kon">{tool.nameJa}</h3>
                  <p className="text-xs text-gray-500 mt-2">{tool.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-sakura/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-kon mb-4">安心・安全のPDF処理</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            <span>🇯🇵 日本国内サーバー</span>
            <span>🔒 SSL暗号化通信</span>
            <span>🗑️ 60分で自動削除</span>
            <span>✨ 完全無料</span>
          </div>
        </section>
      </div>
    </div>
  );
}
