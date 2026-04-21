"use client";
import { useRouter } from "next/navigation";

const WORKFLOWS = [
  {
    title: "結合 → 圧縮 → ダウンロード",
    desc: "複数PDFを1つにまとめてからサイズを小さくする",
    steps: ["🗂️", "📦", "⬇️"],
    href: "/pdf/merge",
    color: "indigo",
  },
  {
    title: "文字入力 → 圧縮 → メール添付",
    desc: "申請書や契約書に記入してから送りやすいサイズに",
    steps: ["✏️", "📦", "📧"],
    href: "/pdf/text-input",
    color: "orange",
  },
  {
    title: "分割 → 必要ページだけ結合",
    desc: "大きなPDFから必要なページを抽出して再結合",
    steps: ["✂️", "📄", "🗂️"],
    href: "/pdf/split",
    color: "green",
  },
];

const BTN_COLORS: Record<string, string> = {
  indigo: "bg-indigo-600 hover:bg-indigo-700",
  orange: "bg-orange-500 hover:bg-orange-600",
  green:  "bg-green-600 hover:bg-green-700",
};

export default function PdfWorkflows() {
  const router = useRouter();
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-kon dark:text-white mb-4 flex items-center gap-2">
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">ワークフロー</span>
        よく使われる作業フロー
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {WORKFLOWS.map((wf) => (
          <div
            key={wf.title}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-center mb-3 text-2xl">
              {wf.steps.map((s, i) => (
                <span key={i} className="flex items-center">
                  {s}
                  {i < wf.steps.length - 1 && (
                    <span className="text-gray-400 text-base mx-1">→</span>
                  )}
                </span>
              ))}
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">{wf.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{wf.desc}</p>
            <button
              onClick={() => router.push(wf.href)}
              className={`w-full ${BTN_COLORS[wf.color]} text-white font-bold py-2 rounded-xl text-sm transition-colors`}
            >
              このワークフローを開始
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
