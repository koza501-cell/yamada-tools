import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "日本の祝日API｜無料・JSON形式",
  description: "日本の祝日データをJSON形式で取得できる無料API。2024年〜2026年対応。振替休日も含む。開発者向けドキュメント。",
  keywords: ["祝日API", "日本 祝日 API", "祝日 JSON", "holiday API Japan", "祝日データ"],
  alternates: {
    canonical: 'https://yamada-tools.jp/docs/holiday-api',
  },
};

const holidays2026 = [
  { date: "2026-01-01", name: "元日", name_en: "New Year's Day" },
  { date: "2026-01-12", name: "成人の日", name_en: "Coming of Age Day" },
  { date: "2026-02-11", name: "建国記念の日", name_en: "National Foundation Day" },
  { date: "2026-02-23", name: "天皇誕生日", name_en: "Emperor's Birthday" },
  { date: "2026-03-20", name: "春分の日", name_en: "Vernal Equinox Day" },
  { date: "2026-04-29", name: "昭和の日", name_en: "Showa Day" },
  { date: "2026-05-03", name: "憲法記念日", name_en: "Constitution Day" },
  { date: "2026-05-04", name: "みどりの日", name_en: "Greenery Day" },
  { date: "2026-05-05", name: "こどもの日", name_en: "Children's Day" },
  { date: "2026-05-06", name: "振替休日", name_en: "Substitute Holiday" },
  { date: "2026-07-20", name: "海の日", name_en: "Marine Day" },
  { date: "2026-08-11", name: "山の日", name_en: "Mountain Day" },
  { date: "2026-09-21", name: "敬老の日", name_en: "Respect for the Aged Day" },
  { date: "2026-09-22", name: "国民の休日", name_en: "Citizens' Holiday" },
  { date: "2026-09-23", name: "秋分の日", name_en: "Autumnal Equinox Day" },
  { date: "2026-10-12", name: "スポーツの日", name_en: "Sports Day" },
  { date: "2026-11-03", name: "文化の日", name_en: "Culture Day" },
  { date: "2026-11-23", name: "勤労感謝の日", name_en: "Labor Thanksgiving Day" },
];

export default function HolidayApiPage() {
  const sampleResponse = JSON.stringify({ year: 2026, holidays: holidays2026.slice(0, 5) }, null, 2);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-10">
          <p className="text-kon text-sm mb-2">📚 API ドキュメント</p>
          <h1 className="text-3xl font-bold text-kon mb-4">日本の祝日API</h1>
          <p className="text-gray-600">日本の祝日データをJSON形式で取得</p>
        </header>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
          <p className="text-green-800 text-sm">✅ 無料・登録不要・CORS対応・商用利用可</p>
        </div>

        <section className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-4">🔗 エンドポイント</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            GET https://yamada-tools.jp/api/holidays/{"{year}"}
          </div>
          <p className="text-sm text-gray-600 mt-3">年を指定して祝日データを取得します。対応年: 2024〜2026</p>
        </section>

        <section className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-4">📥 リクエスト例</h2>
          <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <span className="text-yellow-400">curl</span> https://yamada-tools.jp/api/holidays/2026
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-4">📤 レスポンス例</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
{sampleResponse}
          </pre>
        </section>

        <section className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-4">📋 レスポンスフィールド</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">フィールド</th>
                <th className="px-3 py-2 text-left">型</th>
                <th className="px-3 py-2 text-left">説明</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="px-3 py-2 font-mono">year</td><td className="px-3 py-2">number</td><td className="px-3 py-2">対象年</td></tr>
              <tr><td className="px-3 py-2 font-mono">holidays</td><td className="px-3 py-2">array</td><td className="px-3 py-2">祝日の配列</td></tr>
              <tr><td className="px-3 py-2 font-mono">holidays[].date</td><td className="px-3 py-2">string</td><td className="px-3 py-2">日付（YYYY-MM-DD形式）</td></tr>
              <tr><td className="px-3 py-2 font-mono">holidays[].name</td><td className="px-3 py-2">string</td><td className="px-3 py-2">祝日名（日本語）</td></tr>
              <tr><td className="px-3 py-2 font-mono">holidays[].name_en</td><td className="px-3 py-2">string</td><td className="px-3 py-2">祝日名（英語）</td></tr>
            </tbody>
          </table>
        </section>

        <section className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-4">💻 コード例</h2>
          <h3 className="font-bold text-sm mb-2">JavaScript (fetch)</h3>
          <pre className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">{`fetch('https://yamada-tools.jp/api/holidays/2026')
  .then(res => res.json())
  .then(data => console.log(data.holidays));`}</pre>
          <h3 className="font-bold text-sm mb-2">Python</h3>
          <pre className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">{`import requests
res = requests.get('https://yamada-tools.jp/api/holidays/2026')
holidays = res.json()['holidays']`}</pre>
        </section>

        <section className="bg-white rounded-2xl p-6 border mb-8">
          <h2 className="font-bold text-kon mb-4">❓ よくある質問</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold">Q: 利用制限はありますか？</h3>
              <p className="text-gray-600">A: 1分間に60リクエストまで。通常利用では問題ありません。</p>
            </div>
            <div>
              <h3 className="font-bold">Q: 商用利用は可能ですか？</h3>
              <p className="text-gray-600">A: はい、無料で商用利用可能です。クレジット表記も不要です。</p>
            </div>
            <div>
              <h3 className="font-bold">Q: 振替休日も含まれますか？</h3>
              <p className="text-gray-600">A: はい、振替休日・国民の休日も含まれます。</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 border">
          <h2 className="font-bold text-kon mb-4">関連リンク</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/reference/holidays" className="p-4 border rounded-xl hover:shadow">
              <h3 className="font-bold">祝日一覧ページ</h3>
              <p className="text-sm text-gray-500">2024〜2026年の祝日カレンダー</p>
            </Link>
            <Link href="/generator/holiday-checker" className="p-4 border rounded-xl hover:shadow">
              <h3 className="font-bold">祝日判定ツール</h3>
              <p className="text-sm text-gray-500">日付が祝日か判定</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
