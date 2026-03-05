import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "銀行コード一覧（金融機関コード）｜山田ツール",
  description: "日本の主要銀行・金融機関コード一覧。都市銀行、地方銀行、ネット銀行のコードを検索できます。全銀フォーマット作成時に便利。",
  keywords: ["銀行コード", "金融機関コード", "全銀コード", "銀行番号"],
};

const banks = {
  mega: [
    { code: "0001", name: "みずほ銀行" },
    { code: "0005", name: "三菱UFJ銀行" },
    { code: "0009", name: "三井住友銀行" },
    { code: "0010", name: "りそな銀行" },
    { code: "0017", name: "埼玉りそな銀行" },
  ],
  net: [
    { code: "0033", name: "PayPay銀行" },
    { code: "0034", name: "セブン銀行" },
    { code: "0035", name: "ソニー銀行" },
    { code: "0036", name: "楽天銀行" },
    { code: "0038", name: "住信SBIネット銀行" },
    { code: "0039", name: "auじぶん銀行" },
    { code: "0040", name: "イオン銀行" },
    { code: "0042", name: "ローソン銀行" },
  ],
  trust: [
    { code: "0288", name: "三菱UFJ信託銀行" },
    { code: "0289", name: "みずほ信託銀行" },
    { code: "0294", name: "三井住友信託銀行" },
  ],
  regional: [
    { code: "0116", name: "北海道銀行" },
    { code: "0128", name: "七十七銀行" },
    { code: "0138", name: "千葉銀行" },
    { code: "0143", name: "横浜銀行" },
    { code: "0149", name: "静岡銀行" },
    { code: "0158", name: "京都銀行" },
    { code: "0169", name: "広島銀行" },
    { code: "0177", name: "福岡銀行" },
  ],
  other: [
    { code: "9900", name: "ゆうちょ銀行" },
    { code: "0397", name: "新生銀行" },
    { code: "0398", name: "あおぞら銀行" },
  ],
};

function BankTable({ title, icon, data }: { title: string; icon: string; data: { code: string; name: string }[] }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-kon mb-4">{icon} {title}</h2>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">コード</th>
              <th className="px-4 py-3 text-left">銀行名</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map(b => (
              <tr key={b.code} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-bold text-kon">{b.code}</td>
                <td className="px-4 py-3">{b.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function BankCodesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-kon mb-4">銀行コード一覧</h1>
          <p className="text-gray-600">日本の主要金融機関コード（全銀コード）</p>
        </header>
        <div className="bg-blue-50 rounded-xl p-4 mb-8">
          <p className="text-blue-800 text-sm">
            銀行コードは全銀フォーマットや振込手続きで使用する4桁のコードです。
            <Link href="/document/bank-format" className="underline ml-1">全銀フォーマット作成ツール</Link>
          </p>
        </div>
        <BankTable title="都市銀行" icon="🏦" data={banks.mega} />
        <BankTable title="ネット銀行" icon="💻" data={banks.net} />
        <BankTable title="信託銀行" icon="🏛️" data={banks.trust} />
        <BankTable title="地方銀行（主要）" icon="🗾" data={banks.regional} />
        <BankTable title="その他" icon="📮" data={banks.other} />
        <section className="bg-white rounded-2xl p-6 border mt-8">
          <h2 className="font-bold text-kon mb-4">関連ツール</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/document/bank-format" className="p-4 border rounded-xl hover:shadow">
              <span className="text-2xl">🏦</span>
              <h3 className="font-bold">全銀フォーマット作成</h3>
            </Link>
            <Link href="/convert/bank-format" className="p-4 border rounded-xl hover:shadow">
              <span className="text-2xl">🔄</span>
              <h3 className="font-bold">全銀フォーマット変換</h3>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
