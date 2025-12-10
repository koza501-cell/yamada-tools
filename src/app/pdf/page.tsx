import Link from "next/link";
import { pdfTools } from "@/config/tools";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDFツール | 山田ツール - 無料オンラインPDF編集・変換",
  description: "PDF結合・圧縮・分割・変換など20以上の無料PDFツール。日本国内サーバーで安心・安全。登録不要、10分で自動削除。",
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
    ["page-numbers", "watermark", "reorder", "sign", "ocr"].includes(t.id)
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

        {/* Core Tools */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-kon mb-6 flex items-center gap-2">
            <span className="bg-kon text-white px-3 py-1 rounded-full text-sm">基本</span>
            基本ツール
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {coreTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center border border-gray-100"
              >
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h3 className="font-bold text-kon">{tool.nameJa}</h3>
                <p className="text-xs text-gray-500 mt-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

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
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center border border-gray-100"
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
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center border border-gray-100"
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
              <Link
                key={tool.id}
                href={tool.path}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center border border-gray-100"
              >
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h3 className="font-bold text-kon">{tool.nameJa}</h3>
                <p className="text-xs text-gray-500 mt-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-sakura/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-kon mb-4">安心・安全のPDF処理</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <span>🇯🇵 日本国内サーバー</span>
            <span>🔒 SSL暗号化通信</span>
            <span>🗑️ 10分で自動削除</span>
            <span>✨ 完全無料</span>
          </div>
        </section>
      </div>
    </div>
  );
}
