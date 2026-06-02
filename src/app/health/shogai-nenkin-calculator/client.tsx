"use client";

import { useState, useMemo } from "react";

type NenkinType = "kiso" | "kosai";
type Grade = "1" | "2" | "3" | "teate";

const fmt = (n: number) => n.toLocaleString("ja-JP");

export default function ShogaiNenkinClient() {
  const [nenkinType, setNenkinType] = useState<NenkinType>("kiso");
  const [grade, setGrade] = useState<Grade>("1");
  const [heikin, setHeikin] = useState("250000");
  const [months, setMonths] = useState("180");
  const [children, setChildren] = useState(0);
  const [hasSpouse, setHasSpouse] = useState(false);

  const handleNenkinTypeChange = (val: NenkinType) => {
    setNenkinType(val);
    if (val === "kiso" && (grade === "3" || grade === "teate")) {
      setGrade("1");
    }
  };

  const result = useMemo(() => {
    const h = parseInt(heikin) || 0;
    const m = parseInt(months) || 0;

    const kiso = grade === "1" ? 1020000 : grade === "2" ? 816000 : 0;

    const kokazan =
      kiso > 0
        ? Math.min(children, 2) * 234800 + Math.max(children - 2, 0) * 78300
        : 0;

    const actualMonths = m > 0 ? Math.max(m, 300) : 0;
    const hoshu = Math.round(h * 5.481 / 1000 * actualMonths);

    let kosaiNenkin = 0;
    let teatekin = 0;
    if (nenkinType === "kosai") {
      if (grade === "1") kosaiNenkin = Math.round(hoshu * 1.25);
      else if (grade === "2") kosaiNenkin = hoshu;
      else if (grade === "3") kosaiNenkin = Math.max(hoshu, 612000);
      else if (grade === "teate") teatekin = Math.max(hoshu * 2, 1224000);
    }

    const haigushaKakyu =
      nenkinType === "kosai" && hasSpouse && (grade === "1" || grade === "2")
        ? 234800
        : 0;

    const totalNenkin = kiso + kosaiNenkin + kokazan + haigushaKakyu;
    const monthlyNenkin = Math.round(totalNenkin / 12);

    return { kiso, kosaiNenkin, kokazan, haigushaKakyu, totalNenkin, monthlyNenkin, teatekin };
  }, [nenkinType, grade, heikin, months, children, hasSpouse]);

  const gradeOptions: { value: Grade; label: string }[] = [
    { value: "1", label: "1級（日常生活に著しい支障）" },
    { value: "2", label: "2級（日常生活に相当の支障）" },
    ...(nenkinType === "kosai"
      ? [
          { value: "3" as Grade, label: "3級（労働に制限がある）" },
          { value: "teate" as Grade, label: "障害手当金（治癒した一時金）" },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <nav className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>ホーム</span> &gt; <span>健康・医療</span> &gt;{" "}
            <span className="text-gray-700 dark:text-gray-200">障害年金受給額計算機</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            障害年金 受給額 簡易計算機
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            障害基礎年金・障害厚生年金の受給額を障害等級・加入状況から計算。申請前の目安確認に。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-5">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              入力内容
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                年金の種類
              </label>
              <select
                value={nenkinType}
                onChange={(e) => handleNenkinTypeChange(e.target.value as NenkinType)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="kiso">障害基礎年金のみ（国民年金加入）</option>
                <option value="kosai">障害厚生年金（厚生年金加入あり）</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                障害等級
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as Grade)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white"
              >
                {gradeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {nenkinType === "kosai" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    平均標準報酬月額 <span className="text-gray-400 font-normal">（円）</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={heikin}
                    onChange={(e) => setHeikin(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="例: 250000"
                  />
                  <p className="text-xs text-gray-400 mt-1">年収÷12の目安。給与明細の標準報酬月額を参照</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    厚生年金 加入月数 <span className="text-gray-400 font-normal">（月）</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="例: 180"
                  />
                  <p className="text-xs text-gray-400 mt-1">300月未満の場合は300月とみなして計算します</p>
                </div>
              </>
            )}

            {(grade === "1" || grade === "2") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  子の人数（18歳未満または障害のある子）
                </label>
                <select
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value={0}>0人</option>
                  <option value={1}>1人</option>
                  <option value={2}>2人</option>
                  <option value={3}>3人以上</option>
                </select>
              </div>
            )}

            {nenkinType === "kosai" && (grade === "1" || grade === "2") && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="spouse"
                  checked={hasSpouse}
                  onChange={(e) => setHasSpouse(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <label htmlFor="spouse" className="text-sm text-gray-700 dark:text-gray-300">
                  65歳未満の配偶者を扶養している
                </label>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                受給額の内訳
              </h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr>
                    <td className="py-2 text-gray-600 dark:text-gray-400">障害基礎年金額</td>
                    <td className="py-2 text-right font-mono text-gray-800 dark:text-white">
                      {fmt(result.kiso)} 円/年
                    </td>
                  </tr>
                  {nenkinType === "kosai" && grade !== "teate" && (
                    <tr>
                      <td className="py-2 text-gray-600 dark:text-gray-400">障害厚生年金額</td>
                      <td className="py-2 text-right font-mono text-gray-800 dark:text-white">
                        {fmt(result.kosaiNenkin)} 円/年
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 text-gray-600 dark:text-gray-400">子の加算額</td>
                    <td className="py-2 text-right font-mono text-gray-800 dark:text-white">
                      {fmt(result.kokazan)} 円/年
                    </td>
                  </tr>
                  {nenkinType === "kosai" && (grade === "1" || grade === "2") && (
                    <tr>
                      <td className="py-2 text-gray-600 dark:text-gray-400">配偶者加給年金</td>
                      <td className="py-2 text-right font-mono text-gray-800 dark:text-white">
                        {fmt(result.haigushaKakyu)} 円/年
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {grade !== "teate" && (
              <div className="bg-kon rounded-xl shadow p-6 text-white text-center">
                <p className="text-sm opacity-80 mb-1">年間受給額合計</p>
                <p className="text-4xl font-bold">{fmt(result.totalNenkin)} 円</p>
                <p className="text-sm opacity-80 mt-3 mb-1">月額の目安</p>
                <p className="text-2xl font-semibold">{fmt(result.monthlyNenkin)} 円/月</p>
              </div>
            )}

            {grade === "teate" && result.teatekin > 0 && (
              <div className="bg-kon rounded-xl shadow p-6 text-white text-center">
                <p className="text-sm opacity-80 mb-1">障害手当金（一時金）</p>
                <p className="text-4xl font-bold">{fmt(result.teatekin)} 円</p>
                <p className="text-xs opacity-70 mt-2">年金ではなく一回限りの一時金です</p>
              </div>
            )}

            <div className="text-center">
              <button type="button"
                onClick={() => window.print()}
                className="mt-1 text-xs text-kon hover:underline print:hidden"
              >
                🖨️ 印刷 / PDFとして保存
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-kon/30 border border-gray-200 dark:border-gray-200 rounded-lg p-4">
            <p className="text-xs text-kon dark:text-amber-200">
              ⚠️ この計算は概算です。実際の受給額は年金事務所にご確認ください。
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-kon/30 border border-gray-200 dark:border-kon rounded-lg p-4">
            <p className="text-xs text-kon dark:text-gray-300">
              📋 障害年金の申請には初診日の証明・診断書が必要です。
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <p className="text-xs text-green-800 dark:text-green-200">
              ✅ 障害年金は非課税所得です（所得税・住民税ともに課税されません）。
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-kon/30 border border-kon dark:border-kon rounded-lg p-4">
            <p className="text-xs text-kon dark:text-gray-300">
              📅 申請は初診日から1年6ヶ月後（障害認定日）から可能です。
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
            2024年度 障害年金額 早見表
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="text-left px-3 py-2 text-gray-600 dark:text-gray-300">種別</th>
                <th className="text-left px-3 py-2 text-gray-600 dark:text-gray-300">等級</th>
                <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-300">年額（基本）</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300" rowSpan={2}>障害基礎年金</td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">1級</td>
                <td className="px-3 py-2 text-right font-mono text-gray-800 dark:text-white">1,020,000円</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">2級</td>
                <td className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 text-right font-mono text-gray-800 dark:text-white">816,000円</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300" rowSpan={3}>障害厚生年金</td>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">1級</td>
                <td className="px-3 py-2 text-right font-mono text-gray-800 dark:text-white">報酬比例×1.25</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">2級</td>
                <td className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 text-right font-mono text-gray-800 dark:text-white">報酬比例部分</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">3級</td>
                <td className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 text-right font-mono text-gray-800 dark:text-white">報酬比例（最低612,000円）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-gray-400 text-xs">山田ツール | yamada-tools.jp で無料作成</p>
          <p className="text-gray-300 text-xs mt-1">透かしなし・高品質 PDFはPROプランで → yamada-tools.jp/pricing</p>
        </div>
      </div>
    </div>
  );
}
