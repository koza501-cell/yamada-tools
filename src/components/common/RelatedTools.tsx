"use client";

import Link from "next/link";

interface RelatedTool {
  name: string;
  path: string;
  icon: string;
  description: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
  title?: string;
}

export default function RelatedTools({ tools, title = "関連ツール" }: RelatedToolsProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="mt-8 bg-gradient-to-r from-kon/5 to-ai/5 rounded-xl p-6 border border-kon/10">
      <h2 className="font-bold text-kon mb-4 text-lg flex items-center gap-2">
        <span>🔧</span>
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((tool, index) => (
          <Link
            key={index}
            href={tool.path}
            className="bg-white rounded-lg p-4 border border-gray-100 hover:border-kon/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <p className="font-medium text-gray-800 group-hover:text-kon transition-colors">
                  {tool.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Pre-defined related tool sets for common pages
export const relatedToolSets = {
  // For 年末調整計算
  nenmatsuCalc: [
    { name: "給与手取り計算", path: "/generator/salary-calc", icon: "💰", description: "額面から手取り額を計算" },
    { name: "消費税計算", path: "/generator/tax-calculator", icon: "🧮", description: "税込・税抜価格を計算" },
    { name: "請求書作成", path: "/document/invoice", icon: "📑", description: "インボイス対応請求書" },
  ],
  
  // For 全銀フォーマット
  bankFormat: [
    { name: "請求書作成", path: "/document/invoice", icon: "📑", description: "インボイス対応請求書" },
    { name: "見積書作成", path: "/document/quotation", icon: "📋", description: "見積書を簡単作成" },
    { name: "PDF結合", path: "/pdf/merge", icon: "📄", description: "複数PDFを1つに" },
  ],
  
  // For ふりがな変換
  furigana: [
    { name: "縦書き変換", path: "/document/vertical-text", icon: "📜", description: "縦書き文書を作成" },
    { name: "全角・半角変換", path: "/convert/zenkaku-hankaku", icon: "🔄", description: "全角↔半角を変換" },
    { name: "文字数カウント", path: "/generator/character-count", icon: "📝", description: "文字数をカウント" },
  ],
  
  // For 画像圧縮
  imageCompress: [
    { name: "画像リサイズ", path: "/image/resize", icon: "🖼️", description: "画像サイズを変更" },
    { name: "画像形式変換", path: "/image/format-convert", icon: "🔄", description: "JPG・PNG・WebP変換" },
    { name: "PDF→画像", path: "/pdf/pdf-to-image", icon: "📄", description: "PDFを画像に変換" },
  ],
  
  // For PDF tools
  pdfMerge: [
    { name: "PDF分割", path: "/pdf/split", icon: "✂️", description: "PDFを複数に分割" },
    { name: "PDF圧縮", path: "/pdf/compress", icon: "📦", description: "PDFを軽量化" },
    { name: "ページ削除", path: "/pdf/delete-pages", icon: "🗑️", description: "不要ページを削除" },
  ],
  
  // For 電子印鑑
  hanko: [
    { name: "請求書作成", path: "/document/invoice", icon: "📑", description: "インボイス対応請求書" },
    { name: "見積書作成", path: "/document/quotation", icon: "📋", description: "見積書を簡単作成" },
    { name: "領収書作成", path: "/document/receipt", icon: "🧾", description: "領収書を作成" },
  ],
  
  // For 封筒印刷
  envelope: [
    { name: "送付状作成", path: "/document/cover-letter", icon: "📨", description: "ビジネス送付状" },
    { name: "FAX送付状", path: "/document/fax-cover", icon: "📠", description: "FAX送付状を作成" },
    { name: "郵便番号検索", path: "/convert/postcode", icon: "〒", description: "住所から郵便番号検索" },
  ],
};
