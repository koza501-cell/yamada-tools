import Link from "next/link";
import { Tool, allTools } from "@/config/tools";

// Cross-category related tools mapping
const relatedToolsMap: Record<string, string[]> = {
  // PDF tools
  "merge": ["compress", "split", "pdf-to-jpg", "invoice"],
  "compress": ["merge", "split", "image-compress", "pdf-to-jpg"],
  "split": ["merge", "extract", "rotate", "reorder"],
  "rotate": ["split", "reorder", "compress", "merge"],
  "pdf-to-jpg": ["jpg-to-pdf", "image-compress", "compress", "split"],
  "jpg-to-pdf": ["pdf-to-jpg", "image-to-pdf", "merge", "compress"],
  "pdf-to-word": ["word-to-pdf", "pdf-to-excel", "compress", "merge"],
  "word-to-pdf": ["pdf-to-word", "excel-to-pdf", "merge", "compress"],
  "pdf-to-excel": ["excel-to-pdf", "pdf-to-word", "csv-to-excel", "compress"],
  "excel-to-pdf": ["pdf-to-excel", "word-to-pdf", "merge", "compress"],
  "pdf-text-input": ["merge", "compress", "invoice", "quotation"],
  "combini-print": ["compress", "merge", "pdf-text-input", "rotate"],
  
  // Document tools
  "invoice": ["quotation", "receipt", "bank-format", "merge"],
  "quotation": ["invoice", "receipt", "bank-format", "compress"],
  "receipt": ["invoice", "quotation", "compress", "merge"],
  "bank-format": ["invoice", "quotation", "receipt", "csv-to-excel"],
  "resume": ["invoice", "quotation", "pdf-text-input", "compress"],
  
  // Convert tools
  "furigana": ["tategaki", "zenkaku", "kana-convert", "pdf-to-word"],
  "tategaki": ["furigana", "zenkaku", "kana-convert", "pdf-text-input"],
  "zenkaku": ["furigana", "kana-convert", "tategaki", "csv-to-excel"],
  "kana-convert": ["furigana", "zenkaku", "tategaki", "pdf-to-word"],
  "csv-to-excel": ["excel-to-pdf", "pdf-to-excel", "bank-format", "invoice"],
  
  // Image tools
  "image-compress": ["image-resize", "image-to-pdf", "compress", "jpg-to-png"],
  "image-resize": ["image-compress", "image-to-pdf", "jpg-to-png", "png-to-jpg"],
  "image-to-pdf": ["pdf-to-jpg", "image-compress", "merge", "compress"],
  "jpg-to-png": ["png-to-jpg", "image-compress", "image-resize", "image-to-pdf"],
  "png-to-jpg": ["jpg-to-png", "image-compress", "image-resize", "image-to-pdf"],
  
  // Generator tools
  "password": ["qrcode", "hash", "invoice", "quotation"],
  "qrcode": ["password", "barcode", "image-compress", "pdf-text-input"],
  "tax-calc": ["invoice", "quotation", "receipt", "nenmatsu-calc"],
  "nenmatsu-calc": ["tax-calc", "invoice", "bank-format", "receipt"],
  "hash": ["password", "qrcode", "compress", "image-compress"],
};

// Simple tool type for legacy usage
interface SimpleTool {
  id: string;
  nameJa: string;
  icon: string;
  path: string;
}

// Props - supports both new (currentTool) and legacy (tools array) usage
interface RelatedToolsProps {
  currentTool?: Tool;
  maxItems?: number;
  tools?: SimpleTool[];
  title?: string;
}

export default function RelatedTools({ currentTool, maxItems = 6, tools, title }: RelatedToolsProps) {
  // Legacy mode: tools array passed directly
  if (tools && tools.length > 0) {
    return (
      <section className="mt-8" aria-labelledby="related-heading">
        <h2 id="related-heading" className="font-bold text-kon mb-4 text-lg">
          {title || "🔗 あわせて使えるツール"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tools.map(tool => (
            <Link
              key={tool.id}
              href={tool.path}
              className="bg-white rounded-xl p-4 border border-gray-100 hover:border-kon/30 hover:shadow-md transition-all text-center group"
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-kon">{tool.nameJa}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  // New mode: currentTool passed
  if (!currentTool) return null;

  // Get related tool IDs from mapping, or fall back to same category
  const relatedIds = relatedToolsMap[currentTool.id] || [];
  
  // Get tools from IDs
  let relatedTools = relatedIds
    .map(id => allTools.find(t => t.id === id))
    .filter((t): t is Tool => t !== undefined && t.available);
  
  // If not enough, fill with same category tools
  if (relatedTools.length < maxItems) {
    const sameCategoryTools = allTools
      .filter(t => t.category === currentTool.category && t.id !== currentTool.id && t.available)
      .filter(t => !relatedIds.includes(t.id));
    relatedTools = [...relatedTools, ...sameCategoryTools].slice(0, maxItems);
  }
  
  if (relatedTools.length === 0) return null;

  return (
    <section className="mt-8" aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-bold text-kon mb-4 text-lg">
        🔗 あわせて使えるツール
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {relatedTools.slice(0, maxItems).map(tool => (
          <Link
            key={tool.id}
            href={tool.path}
            className="bg-white rounded-xl p-4 border border-gray-100 hover:border-kon/30 hover:shadow-md transition-all text-center group"
          >
            <div className="text-2xl mb-2">{tool.icon}</div>
            <p className="text-sm font-medium text-gray-700 group-hover:text-kon">{tool.nameJa}</p>
            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{tool.description.slice(0, 25)}...</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Legacy export for backward compatibility with existing pages
export const relatedToolSets = {
  bankFormat: [
    { id: "invoice", nameJa: "請求書作成", icon: "📋", path: "/document/invoice" },
    { id: "quotation", nameJa: "見積書作成", icon: "📝", path: "/document/quotation" },
    { id: "receipt", nameJa: "領収書作成", icon: "🧾", path: "/document/receipt" },
    { id: "csv-to-excel", nameJa: "CSV→Excel変換", icon: "📊", path: "/convert/csv-to-excel" },
  ],
  furigana: [
    { id: "tategaki", nameJa: "縦書き変換", icon: "📜", path: "/convert/tategaki" },
    { id: "zenkaku", nameJa: "全角半角変換", icon: "🔄", path: "/convert/zenkaku" },
    { id: "kana-convert", nameJa: "カナ変換", icon: "あ", path: "/convert/kana-convert" },
    { id: "pdf-to-word", nameJa: "PDF→Word", icon: "📄", path: "/pdf/pdf-to-word" },
  ],
  imageCompress: [
    { id: "image-resize", nameJa: "画像リサイズ", icon: "📐", path: "/image/resize" },
    { id: "image-to-pdf", nameJa: "画像→PDF", icon: "📄", path: "/pdf/image-to-pdf" },
    { id: "jpg-to-png", nameJa: "JPG→PNG", icon: "🖼️", path: "/image/jpg-to-png" },
    { id: "compress", nameJa: "PDF圧縮", icon: "📦", path: "/pdf/compress" },
  ],
  hanko: [
    { id: "invoice", nameJa: "請求書作成", icon: "📋", path: "/document/invoice" },
    { id: "quotation", nameJa: "見積書作成", icon: "📝", path: "/document/quotation" },
    { id: "pdf-text-input", nameJa: "PDF文字入力", icon: "✏️", path: "/pdf/text-input" },
    { id: "receipt", nameJa: "領収書作成", icon: "🧾", path: "/document/receipt" },
  ],
  envelope: [
    { id: "invoice", nameJa: "請求書作成", icon: "📋", path: "/document/invoice" },
    { id: "quotation", nameJa: "見積書作成", icon: "📝", path: "/document/quotation" },
    { id: "bank-format", nameJa: "全銀フォーマット", icon: "🏦", path: "/convert/bank-format" },
    { id: "compress", nameJa: "PDF圧縮", icon: "📦", path: "/pdf/compress" },
  ],
  nenmatsuCalc: [
    { id: "tax-calc", nameJa: "消費税計算", icon: "🧮", path: "/generator/tax-calc" },
    { id: "invoice", nameJa: "請求書作成", icon: "📋", path: "/document/invoice" },
    { id: "bank-format", nameJa: "全銀フォーマット", icon: "🏦", path: "/convert/bank-format" },
    { id: "receipt", nameJa: "領収書作成", icon: "🧾", path: "/document/receipt" },
  ],
};
