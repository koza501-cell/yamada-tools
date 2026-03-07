import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "経理・財務ツール一覧｜無料の計算・書類作成｜山田ツール",
  description: "経理・財務に役立つ無料ツール集。消費税計算、年末調整、給与計算、請求書作成、全銀フォーマットなど。日本国内サーバーで安全に処理。",
  keywords: ["経理ツール", "財務ツール", "消費税計算", "年末調整", "給与計算", "請求書作成", "全銀フォーマット"],
};

const calculators = [
  { path: "/generator/tax-calculator", name: "消費税計算", icon: "🧮", desc: "税込・税抜価格を瞬時に計算" },
  { path: "/generator/nenmatsu-calc", name: "年末調整計算", icon: "📊", desc: "所得税・還付額をシミュレーション" },
  { path: "/generator/salary-calc", name: "給与手取り計算", icon: "💰", desc: "月給から手取り額を算出" },
  { path: "/generator/age-calc", name: "年齢計算", icon: "🎂", desc: "生年月日から年齢を計算" },
];

const documents = [
  { path: "/document/invoice", name: "請求書作成", icon: "📄", desc: "インボイス対応の請求書" },
  { path: "/document/quotation", name: "見積書作成", icon: "📋", desc: "見積書をPDFで作成" },
  { path: "/document/receipt", name: "領収書作成", icon: "🧾", desc: "領収書をPDFで作成" },
  { path: "/document/bank-format", name: "全銀フォーマット作成", icon: "🏦", desc: "振込データを全銀協形式で出力" },
];

const converters = [
  { path: "/convert/bank-format", name: "全銀フォーマット変換", icon: "🔄", desc: "CSVから全銀形式に変換" },
  { path: "/convert/wareki-seireki", name: "和暦西暦変換", icon: "📅", desc: "令和・平成・昭和を西暦に" },
];

const references = [
  { path: "/reference/bank-codes", name: "銀行コード一覧", icon: "🏛️", desc: "主要銀行の金融機関コード" },
  { path: "/reference/holidays", name: "祝日一覧", icon: "📆", desc: "日本の祝日カレンダー" },
];

function ToolGrid({ title, tools }: { title: string; tools: { path: string; name: string; icon: string; desc: string }[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-kon mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {tools.map(t => (
          <Link key={t.path} href={t.path} className="bg-white p-4 rounded-xl border hover:shadow-lg hover:border-kon transition-all">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{t.icon}</span>
              <div>
                <h3 className="font-bold text-kon">{t.name}</h3>
                <p className="text-sm text-gray-500">{t.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-kon mb-4">経理・財務ツール</h1>
          <p className="text-gray-600">ビジネスに役立つ計算・書類作成ツール</p>
        </header>
        <div className="bg-blue-50 rounded-xl p-4 mb-8">
          <p className="text-blue-800 text-sm">
            💡 すべて無料・登録不要。日本国内サーバーで処理されるので安心してご利用いただけます。
          </p>
        </div>
        <ToolGrid title="🧮 計算ツール" tools={calculators} />
        <ToolGrid title="📄 書類作成" tools={documents} />
        <ToolGrid title="🔄 変換ツール" tools={converters} />
        <ToolGrid title="📚 参照データ" tools={references} />
        <section className="bg-white rounded-2xl p-6 border mt-8">
          <h2 className="font-bold text-kon mb-3">よくある質問</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold">Q: 消費税10%と8%の計算方法は？</h3>
              <p className="text-gray-600">A: 税抜価格×1.10（10%）または×1.08（8%軽減税率）で税込価格を計算できます。</p>
            </div>
            <div>
              <h3 className="font-bold">Q: 全銀フォーマットとは？</h3>
              <p className="text-gray-600">A: 全国銀行協会が定めた振込データの標準形式です。法人の給与振込や取引先への支払いで使用します。</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
