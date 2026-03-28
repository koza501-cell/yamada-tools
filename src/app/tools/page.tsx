import { Metadata } from "next";
import Link from "next/link";
import { allTools, pdfTools, documentTools, convertTools, imageTools, generatorTools, seoTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "全ツール一覧｜山田ツール",
  description: "山田ツールの全ツールを一覧で表示。PDF編集、画像圧縮、書類作成、変換ツールなど。完全無料・登録不要。",
  alternates: {
    canonical: 'https://yamada-tools.jp/tools',
  },
};

const categories = [
  { id: "seo", name: "SEO・AIツール", tools: seoTools, icon: "🔍" },
  { id: "pdf", name: "PDFツール", tools: pdfTools, icon: "📄" },
  { id: "document", name: "書類作成", tools: documentTools, icon: "📝" },
  { id: "convert", name: "変換ツール", tools: convertTools, icon: "🔄" },
  { id: "image", name: "画像ツール", tools: imageTools, icon: "🖼️" },
  { id: "generator", name: "計算・生成", tools: generatorTools, icon: "🧮" },
];

export default function ToolsPage() {
  const availableTools = allTools.filter(t => t.available);
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-kon mb-4">全ツール一覧</h1>
          <p className="text-gray-600">{availableTools.length}種類の無料ツール</p>
        </header>
        <nav className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <a key={cat.id} href={`#${cat.id}`} className="px-4 py-2 bg-white rounded-full border hover:border-kon text-sm">{cat.icon} {cat.name}</a>
          ))}
        </nav>
        {categories.map(cat => (
          <section key={cat.id} id={cat.id} className="mb-12">
            <h2 className="text-2xl font-bold text-kon mb-6">{cat.icon} {cat.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cat.tools.filter(t => t.available).map(tool => (
                <Link key={tool.id} href={tool.path} className="bg-white rounded-xl p-4 border hover:shadow-lg">
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-gray-800">{tool.nameJa}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
