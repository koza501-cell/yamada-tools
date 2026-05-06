import Link from "next/link";
import { AdUnit } from "@/components/common/AdUnit";
import { Tool, allTools } from "@/config/tools";

// Cross-category related tools mapping
// IMPORTANT: All keys and values MUST be valid tool IDs from src/config/tools.ts
// Last verified: 2026-05-03
const relatedToolsMap: Record<string, string[]> = {
  // ===== PDF tools =====
  "merge": ["compress", "split", "pdf-to-image", "invoice"],
  "compress": ["merge", "split", "compress-image", "pdf-to-image"],
  "split": ["merge", "delete-pages", "rotate", "reorder"],
  "rotate": ["split", "reorder", "compress", "merge"],
  "pdf-to-image": ["image-to-pdf", "compress-image", "compress", "split"],
  "image-to-pdf": ["pdf-to-image", "compress-image", "merge", "compress"],
  "pdf-to-word": ["word-to-pdf", "pdf-to-excel", "compress", "merge"],
  "word-to-pdf": ["pdf-to-word", "excel-to-pdf", "merge", "compress"],
  "pdf-to-excel": ["excel-to-pdf", "pdf-to-word", "compress", "merge"],
  "excel-to-pdf": ["pdf-to-excel", "word-to-pdf", "merge", "compress"],
  "pdf-to-ppt": ["ppt-to-pdf", "pdf-to-word", "compress", "merge"],
  "ppt-to-pdf": ["pdf-to-ppt", "pdf-to-word", "merge", "compress"],
  "pdf-text-input": ["pdf-stamp", "merge", "compress", "invoice", "sign", "hanko"],
  "pdf-stamp": ["pdf-text-input", "hanko", "sign", "invoice", "merge", "compress"],
  "sign": ["pdf-stamp", "pdf-text-input", "hanko", "invoice", "merge", "compress"],
  "combini-print": ["compress", "merge", "pdf-text-input", "rotate"],
  "ocr": ["pdf-to-word", "pdf-text-input", "compress", "merge"],
  "delete-pages": ["split", "merge", "reorder", "rotate"],
  "reorder": ["split", "merge", "rotate", "delete-pages"],
  "page-numbers": ["watermark", "merge", "split", "compress"],
  "watermark": ["page-numbers", "pdf-stamp", "compress", "merge"],
  "protect": ["unlock", "compress", "merge", "watermark"],
  "unlock": ["protect", "compress", "merge", "split"],

  // ===== Document tools =====
  "invoice": ["quotation", "receipt", "bank-format", "envelope-print", "pdf-stamp", "hanko"],
  "quotation": ["invoice", "receipt", "bank-format", "envelope-print", "pdf-stamp", "hanko"],
  "receipt": ["invoice", "quotation", "delivery-slip", "bank-format", "envelope-print"],
  "delivery-slip": ["invoice", "quotation", "receipt", "envelope-print"],
  "bank-format": ["invoice", "quotation", "receipt", "envelope-print", "zenkaku-hankaku", "furigana"],
  "envelope-print": ["invoice", "quotation", "receipt", "bank-format", "vertical-text", "compress"],
  "vertical-text": ["furigana", "zenkaku-hankaku", "envelope-print", "pdf-text-input", "id-photo", "resume"],
  "resume": ["cover-letter", "id-photo", "business-card-gen", "invoice", "pdf-text-input", "compress"],
  "cover-letter": ["resume", "id-photo", "business-card-gen", "envelope-print", "pdf-text-input"],
  "business-email": ["resume", "cover-letter", "invoice", "quotation"],
  "business-card": ["business-card-gen", "invoice", "quotation", "envelope-print"],
  "business-card-gen": ["business-card", "id-photo", "resume", "envelope-print"],
  "fax-cover": ["invoice", "quotation", "envelope-print", "pdf-text-input"],

  // ===== Convert tools =====
  "furigana": ["vertical-text", "zenkaku-hankaku", "wareki-seireki", "char-counter", "bank-format"],
  "zenkaku-hankaku": ["furigana", "vertical-text", "wareki-seireki", "bank-format", "char-counter"],
  "wareki-seireki": ["furigana", "zenkaku-hankaku", "age-calculator", "char-counter"],
  "postcode": ["envelope-print", "phone-formatter", "wareki-seireki"],
  "phone-formatter": ["postcode", "zenkaku-hankaku", "wareki-seireki"],
  "char-counter": ["furigana", "vertical-text", "zenkaku-hankaku", "text-case"],
  "base64": ["url-encode", "hash-generator", "json-format"],
  "url-encode": ["base64", "hash-generator", "json-format"],
  "tsubo-converter": ["unit-converter", "rental-cost-calculator", "rent-vs-buy"],
  "unit-converter": ["tsubo-converter", "wareki-seireki", "age-calculator"],
  "excel-a4-fit": ["excel-to-pdf", "pdf-to-excel", "compress", "merge"],

  // ===== Image tools =====
  "compress-image": ["resize-image", "convert-image", "image-to-pdf", "compress"],
  "resize-image": ["compress-image", "convert-image", "crop-image", "image-to-pdf"],
  "convert-image": ["compress-image", "resize-image", "crop-image", "image-to-pdf"],
  "crop-image": ["resize-image", "compress-image", "rotate-image", "flip"],
  "rotate-image": ["flip", "crop-image", "resize-image", "compress-image"],
  "flip": ["rotate-image", "crop-image", "resize-image", "compress-image", "convert-image", "image-to-pdf"],
  "remove-bg": ["compress-image", "resize-image", "id-photo", "convert-image"],
  "id-photo": ["remove-bg", "resume", "cover-letter", "compress-image", "resize-image", "business-card-gen"],
  "blur": ["mosaic", "compress-image", "resize-image", "convert-image"],
  "mosaic": ["blur", "compress-image", "resize-image", "convert-image"],
  "brightness": ["monochrome", "sepia", "compress-image", "convert-image"],
  "monochrome": ["brightness", "sepia", "compress-image", "convert-image"],
  "sepia": ["monochrome", "brightness", "compress-image", "convert-image"],
  "noise-reduction": ["compress-image", "resize-image", "convert-image", "blur"],
  "dpi-checker": ["resize-image", "compress-image", "convert-image", "id-photo"],
  "image-overlay": ["text-overlay", "compress-image", "resize-image", "convert-image"],
  "text-overlay": ["image-overlay", "compress-image", "resize-image", "convert-image"],
  "decorative-frames": ["text-overlay", "image-overlay", "compress-image", "convert-image"],
  "concentration-lines": ["text-overlay", "image-overlay", "decorative-frames", "compress-image"],
  "color-convert": ["convert-image", "compress-image", "monochrome", "brightness"],
  "grid-split": ["crop-image", "resize-image", "compress-image", "convert-image"],
  "gif-maker": ["compress-image", "convert-image", "resize-image"],
  "banner-maker": ["text-overlay", "image-overlay", "id-photo", "business-card-gen"],

  // ===== Generator tools =====
  "password-generator": ["password-zip", "qr-code", "hash-generator", "invoice"],
  "password-zip": ["password-generator", "protect", "qr-code", "compress"],
  "qr-code": ["qr-reader", "password-generator", "hash-generator"],
  "qr-reader": ["qr-code", "password-generator"],
  "hash-generator": ["password-generator", "base64", "url-encode"],
  "json-format": ["base64", "url-encode", "regex-test", "text-diff"],
  "regex-test": ["json-format", "text-diff", "text-case"],
  "text-diff": ["text-case", "char-counter", "regex-test"],
  "text-case": ["text-diff", "char-counter", "regex-test", "zenkaku-hankaku"],
  "lorem-ipsum": ["text-case", "char-counter", "text-diff"],
  "hanko": ["pdf-stamp", "pdf-text-input", "invoice", "quotation", "sign", "id-photo"],
  "random-picker": ["password-generator", "qr-code", "hash-generator"],
  "holiday-checker": ["wareki-seireki", "age-calculator", "date-calculator"],
  "age-calculator": ["wareki-seireki", "date-calculator", "holiday-checker"],
  "age-calc": ["wareki-seireki", "date-calculator", "holiday-checker"],
  "date-calculator": ["age-calculator", "wareki-seireki", "holiday-checker"],
  "deviation-score": ["bmi-calculator", "ideal-weight-calculator", "calorie-calculator"],
  "invoice-validator": ["invoice", "quotation", "receipt", "bank-format"],

  // ===== Finance / Tax tools =====
  "tax-calculator": ["consumption-tax", "invoice", "quotation", "nenmatsu-calc"],
  "consumption-tax": ["tax-calculator", "invoice", "quotation", "income-tax-calculator"],
  "nenmatsu-calc": ["tax-calculator", "income-tax-calculator", "invoice", "bank-format"],
  "income-tax-calculator": ["nenmatsu-calc", "tax-calculator", "social-insurance-calculator", "salary-calc"],
  "salary-calc": ["income-tax-calculator", "social-insurance-calculator", "overtime-calculator", "nenmatsu-calc"],
  "social-insurance-calculator": ["income-tax-calculator", "salary-calc", "nenmatsu-calc", "overtime-calculator"],
  "overtime-calculator": ["salary-calc", "social-insurance-calculator", "income-tax-calculator"],
  "unemployment-calculator": ["overtime-calculator", "retirement-bonus-calculator", "salary-calc"],
  "retirement-bonus-calculator": ["unemployment-calculator", "salary-calc", "income-tax-calculator"],
  "salary-negotiation": ["salary-calc", "salary-increase-simulator", "job-change-simulator"],
  "salary-increase-simulator": ["salary-calc", "salary-negotiation", "job-change-simulator"],
  "job-change-simulator": ["salary-calc", "salary-negotiation", "salary-increase-simulator"],
  "income-wall-checker": ["income-tax-calculator", "social-insurance-calculator", "salary-calc"],
  "side-income-tax-calculator": ["income-tax-calculator", "freelance-tax-calculator", "tax-calculator"],
  "freelance-tax-calculator": ["side-income-tax-calculator", "consumption-tax", "income-tax-calculator", "simplified-tax-calculator"],
  "simplified-tax-calculator": ["consumption-tax", "freelance-tax-calculator", "tax-calculator"],
  "corporate-tax-calculator": ["incorporation-simulator", "director-salary-optimizer", "consumption-tax"],
  "incorporation-simulator": ["corporate-tax-calculator", "director-salary-optimizer", "freelance-tax-calculator"],
  "director-salary-optimizer": ["corporate-tax-calculator", "incorporation-simulator", "salary-calc"],
  "furusato-nozei-calculator": ["income-tax-calculator", "nenmatsu-calc", "tax-calculator"],
  "inheritance-tax-calculator": ["gift-tax-calculator", "property-tax-calculator", "acquisition-tax"],
  "gift-tax-calculator": ["inheritance-tax-calculator", "property-tax-calculator", "income-tax-calculator"],
  "property-tax-calculator": ["acquisition-tax", "rent-vs-buy", "rental-cost-calculator"],
  "acquisition-tax": ["property-tax-calculator", "rent-vs-buy", "moving-cost-calculator"],
  "rent-vs-buy": ["rental-cost-calculator", "moving-cost-calculator", "property-tax-calculator", "tsubo-converter"],
  "rental-cost-calculator": ["rent-vs-buy", "moving-cost-calculator", "property-tax-calculator", "tsubo-converter"],
  "moving-cost-calculator": ["rental-cost-calculator", "rent-vs-buy", "property-tax-calculator"],
  "jutaku-loan": ["rent-vs-buy", "loan-interest-calculator", "repayment-simulator"],
  "loan-interest-calculator": ["jutaku-loan", "repayment-simulator", "revolving-calculator"],
  "repayment-simulator": ["loan-interest-calculator", "jutaku-loan", "revolving-calculator"],
  "revolving-calculator": ["loan-interest-calculator", "repayment-simulator", "debt-diagnosis"],
  "debt-diagnosis": ["debt-restructuring-checker", "revolving-calculator", "loan-interest-calculator"],
  "debt-restructuring-checker": ["debt-diagnosis", "revolving-calculator", "loan-interest-calculator"],
  "fx-calculator": ["fx-calculator-finance", "loan-interest-calculator", "nisa-simulator"],
  "fx-calculator-finance": ["fx-calculator", "nisa-simulator", "ideco-nisa-comparison"],
  "nisa-simulator": ["ideco-nisa-comparison", "retirement-simulator", "fx-calculator-finance"],
  "ideco-nisa-comparison": ["nisa-simulator", "retirement-simulator", "fx-calculator-finance"],
  "retirement-simulator": ["nisa-simulator", "ideco-nisa-comparison", "retirement-bonus-calculator"],
  "education-cost-simulator": ["cram-school-calculator", "salary-calc", "income-tax-calculator"],
  "cram-school-calculator": ["education-cost-simulator", "salary-calc"],
  "certification-roi": ["job-change-simulator", "salary-increase-simulator", "salary-negotiation"],
  "life-insurance-calculator": ["medical-insurance-sim", "retirement-simulator", "ideco-nisa-comparison"],
  "medical-insurance-sim": ["life-insurance-calculator", "retirement-simulator", "ideco-nisa-comparison"],

  // ===== Health tools =====
  "bmi-calculator": ["ideal-weight-calculator", "calorie-calculator", "alcohol-calculator"],
  "ideal-weight-calculator": ["bmi-calculator", "calorie-calculator", "alcohol-calculator"],
  "calorie-calculator": ["bmi-calculator", "ideal-weight-calculator", "alcohol-calculator"],
  "alcohol-calculator": ["bmi-calculator", "calorie-calculator", "sleep-calculator"],
  "sleep-calculator": ["alcohol-calculator", "bmi-calculator", "calorie-calculator"],
  "pregnancy-calculator": ["age-calculator", "bmi-calculator", "ideal-weight-calculator"],

  // ===== NEW Stats / Business tools (added 2026-05-04) =====
  // Stats tools (e-Stat data)
  "heikin-nenshu": ["jinko-suikei", "shitsugyo-ritsu", "heikin-jumyo", "salary-calc", "income-tax-calculator", "salary-negotiation"],
  "jinko-suikei": ["heikin-nenshu", "heikin-jumyo", "shitsugyo-ritsu", "rent-vs-buy", "education-cost-simulator"],
  "heikin-jumyo": ["heikin-nenshu", "jinko-suikei", "shitsugyo-ritsu", "retirement-simulator", "life-insurance-calculator"],
  "shitsugyo-ritsu": ["heikin-nenshu", "jinko-suikei", "unemployment-calculator", "job-change-simulator", "salary-negotiation"],

  // Government API business tools (gBizINFO + Jグランツ)
  "houjin-search": ["hojokin-active", "hojokin-history", "incorporation-simulator", "corporate-tax-calculator", "invoice", "invoice-validator"],
  "hojokin-active": ["houjin-search", "hojokin-history", "incorporation-simulator", "freelance-tax-calculator"],
  "hojokin-history": ["houjin-search", "hojokin-active", "incorporation-simulator", "corporate-tax-calculator"],

  // Utility duplicate
  "unit-converter-utility": ["unit-converter", "tsubo-converter", "wareki-seireki"],
  // ===== 不動産情報ツール =====
  "yoto-chiiki-checker": ["hazard-checker", "land-price", "transaction-price", "school-district"],
  "hazard-checker": ["yoto-chiiki-checker", "land-price", "transaction-price", "population"],
  "land-price": ["transaction-price", "yoto-chiiki-checker", "hazard-checker", "population"],
  "transaction-price": ["land-price", "yoto-chiiki-checker", "hazard-checker", "school-district"],
  "school-district": ["yoto-chiiki-checker", "hazard-checker", "transaction-price", "population"],
  "population": ["hazard-checker", "land-price", "school-district", "transaction-price"],
  // ===== 新finance tools =====
  "overtime-pay-calculator": ["net-salary-calculator", "depreciation-calculator", "social-insurance-calculator", "nenmatsu-calc"],
  "depreciation-calculator": ["overtime-pay-calculator", "net-salary-calculator", "income-tax-calculator", "houjinka-simulator"],
  "net-salary-calculator": ["overtime-pay-calculator", "depreciation-calculator", "social-insurance-calculator", "income-tax-calculator"],

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
        <h2 id="related-heading" className="font-bold text-kon dark:text-blue-300 mb-4 text-lg">
          {title || "🔗 あわせて使えるツール"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tools.map(tool => (
            <Link
              key={tool.id}
              href={tool.path}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-kon/30 dark:hover:border-blue-500/50 hover:shadow-md transition-all text-center group"
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-kon dark:group-hover:text-blue-300">{tool.nameJa}</p>
            </Link>
          ))}
        </div>

      {/* 広告 */}
      <div className="mt-6">
        <AdUnit slot="5612038947" format="horizontal" />
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
      <h2 id="related-heading" className="font-bold text-kon dark:text-blue-300 mb-4 text-lg">
        🔗 あわせて使えるツール
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {relatedTools.slice(0, maxItems).map(tool => (
          <Link
            key={tool.id}
            href={tool.path}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-kon/30 dark:hover:border-blue-500/50 hover:shadow-md transition-all text-center group"
          >
            <div className="text-2xl mb-2">{tool.icon}</div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-kon dark:group-hover:text-blue-300">{tool.nameJa}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">{tool.description.slice(0, 25)}...</p>
          </Link>
        ))}
      </div>

      {/* 広告 */}
      <div className="mt-6">
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </section>
  );
}

// Legacy export for backward compatibility with existing pages
export const relatedToolSets = {
  bankFormat: [
    { id: "invoice", nameJa: "請求書をPDFで無料作成する", icon: "📋", path: "/document/invoice" },
    { id: "quotation", nameJa: "見積書をテンプレートから作成する", icon: "📝", path: "/document/quotation" },
    { id: "receipt", nameJa: "領収書を即発行する", icon: "🧾", path: "/document/receipt" },
    { id: "envelope-print", nameJa: "封筒・宛名印刷で郵送準備", icon: "✉️", path: "/generator/envelope-print" },
  ],
  furigana: [
    { id: "vertical-text", nameJa: "横書きを縦書きに変換する", icon: "📜", path: "/document/vertical-text" },
    { id: "zenkaku-hankaku", nameJa: "全角と半角を一括変換する", icon: "あ", path: "/convert/zenkaku-hankaku" },
    { id: "bank-format", nameJa: "カタカナ変換で全銀データを作成する", icon: "🏦", path: "/convert/bank-format" },
    { id: "pdf-to-word", nameJa: "PDFをWordに変換して編集する", icon: "📄", path: "/pdf/pdf-to-word" },
  ],
  imageCompress: [
    { id: "resize-image", nameJa: "画像のサイズを変更する", icon: "📐", path: "/image/resize" },
    { id: "convert-image", nameJa: "JPG・PNG・WebPを相互変換する", icon: "🔄", path: "/image/convert" },
    { id: "compress", nameJa: "PDFファイルを圧縮して軽くする", icon: "📦", path: "/pdf/compress" },
    { id: "image-to-pdf", nameJa: "複数の画像をPDFにまとめる", icon: "📄", path: "/pdf/image-to-pdf" },
  ],
  hanko: [
    { id: "pdf-stamp", nameJa: "PDFに電子印鑑を押印する", icon: "📄", path: "/pdf/stamp" },
    { id: "invoice", nameJa: "請求書をPDFで無料作成する", icon: "📋", path: "/document/invoice" },
    { id: "pdf-text-input", nameJa: "PDFに文字を直接入力する", icon: "✏️", path: "/pdf/text-input" },
    { id: "quotation", nameJa: "見積書をテンプレートから作成する", icon: "📝", path: "/document/quotation" },
  ],
  envelope: [
    { id: "invoice", nameJa: "請求書をPDFで無料作成する", icon: "📋", path: "/document/invoice" },
    { id: "quotation", nameJa: "見積書をテンプレートから作成する", icon: "📝", path: "/document/quotation" },
    { id: "bank-format", nameJa: "全銀フォーマットのデータを作成する", icon: "🏦", path: "/convert/bank-format" },
    { id: "compress", nameJa: "PDFファイルを圧縮して軽くする", icon: "📦", path: "/pdf/compress" },
  ],
  nenmatsuCalc: [
    { id: "tax-calculator", nameJa: "消費税を自動計算する", icon: "🧮", path: "/generator/tax-calculator" },
    { id: "invoice", nameJa: "請求書をPDFで無料作成する", icon: "📋", path: "/document/invoice" },
    { id: "bank-format", nameJa: "全銀フォーマットのデータを作成する", icon: "🏦", path: "/convert/bank-format" },
    { id: "receipt", nameJa: "領収書を即発行する", icon: "🧾", path: "/document/receipt" },
  ],
};
