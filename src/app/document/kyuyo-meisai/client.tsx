
"use client";
import RelatedTools from "@/components/common/RelatedTools";
import { getToolById } from "@/config/tools";
import { useState, useCallback, useEffect } from "react";

const PREF_HEALTH_RATE: Record<string, number> = {
  "北海道":10.29,"青森県":9.49,"岩手県":9.77,"宮城県":10.02,"秋田県":10.04,
  "山形県":10.04,"福島県":9.65,"茨城県":9.74,"栃木県":9.96,"群馬県":9.93,
  "埼玉県":9.88,"千葉県":9.91,"東京都":9.98,"神奈川県":9.98,"新潟県":9.53,
  "富山県":9.83,"石川県":10.07,"福井県":9.97,"山梨県":9.93,"長野県":9.67,
  "岐阜県":9.87,"静岡県":9.79,"愛知県":10.01,"三重県":9.99,"滋賀県":9.96,
  "京都府":10.32,"大阪府":10.34,"兵庫県":10.32,"奈良県":10.22,"和歌山県":9.97,
  "鳥取県":9.87,"島根県":10.23,"岡山県":10.17,"広島県":9.96,"山口県":10.29,
  "徳島県":10.10,"香川県":10.46,"愛媛県":10.02,"高知県":10.31,"福岡県":10.36,
  "佐賀県":10.84,"長崎県":10.21,"熊本県":10.32,"大分県":10.29,"宮崎県":10.08,
  "鹿児島県":10.31,"沖縄県":9.87,
};
const PREFS = Object.keys(PREF_HEALTH_RATE);

const HYOJUN = [
  {min:0,max:63000,amount:58000,grade:1},{min:63000,max:73000,amount:68000,grade:2},
  {min:73000,max:83000,amount:78000,grade:3},{min:83000,max:93000,amount:88000,grade:4},
  {min:93000,max:101000,amount:98000,grade:5},{min:101000,max:107000,amount:104000,grade:6},
  {min:107000,max:114000,amount:110000,grade:7},{min:114000,max:122000,amount:118000,grade:8},
  {min:122000,max:130000,amount:126000,grade:9},{min:130000,max:138000,amount:134000,grade:10},
  {min:138000,max:146000,amount:142000,grade:11},{min:146000,max:155000,amount:150000,grade:12},
  {min:155000,max:165000,amount:160000,grade:13},{min:165000,max:175000,amount:170000,grade:14},
  {min:175000,max:185000,amount:180000,grade:15},{min:185000,max:195000,amount:190000,grade:16},
  {min:195000,max:210000,amount:200000,grade:17},{min:210000,max:230000,amount:220000,grade:18},
  {min:230000,max:250000,amount:240000,grade:19},{min:250000,max:270000,amount:260000,grade:20},
  {min:270000,max:290000,amount:280000,grade:21},{min:290000,max:310000,amount:300000,grade:22},
  {min:310000,max:330000,amount:320000,grade:23},{min:330000,max:350000,amount:340000,grade:24},
  {min:350000,max:370000,amount:360000,grade:25},{min:370000,max:395000,amount:380000,grade:26},
  {min:395000,max:425000,amount:410000,grade:27},{min:425000,max:455000,amount:440000,grade:28},
  {min:455000,max:485000,amount:470000,grade:29},{min:485000,max:515000,amount:500000,grade:30},
  {min:515000,max:545000,amount:530000,grade:31},{min:545000,max:575000,amount:560000,grade:32},
  {min:575000,max:605000,amount:590000,grade:33},{min:605000,max:635000,amount:620000,grade:34},
  {min:635000,max:Infinity,amount:650000,grade:35},
];

function getHyojun(salary: number) {
  return HYOJUN.find(h => salary >= h.min && salary < h.max) ?? HYOJUN[HYOJUN.length - 1];
}

function calcIncomeTax(annualTaxable: number, dependents: number): number {
  const depDeduction = dependents * 380000;
  const taxable = Math.max(0, annualTaxable - 480000 - depDeduction);
  const brackets = [
    {limit:1950000,rate:0.05,deduct:0},
    {limit:3300000,rate:0.10,deduct:97500},
    {limit:6950000,rate:0.20,deduct:427500},
    {limit:9000000,rate:0.23,deduct:636000},
    {limit:18000000,rate:0.33,deduct:1536000},
    {limit:40000000,rate:0.40,deduct:2796000},
    {limit:Infinity,rate:0.45,deduct:4796000},
  ];
  const b = brackets.find(br => taxable <= br.limit) ?? brackets[brackets.length - 1];
  const annual = Math.max(0, Math.floor(taxable * b.rate - b.deduct));
  return Math.floor(annual / 12);
}

function fmt(n: number) { return Math.round(n).toLocaleString("ja-JP") + "円"; }
function fmtN(n: number) { return Math.round(n).toLocaleString("ja-JP"); }

export default function KyuyoClient() {
  const tool = getToolById("kyuyo-meisai");

  const [companyName, setCompanyName] = useState("株式会社サンプル");
  const [empName, setEmpName] = useState("山田 太郎");
  const [yearMonth, setYearMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [koyoKatachi, setKoyoKatachi] = useState("正社員");
  const [pref, setPref] = useState("東京都");
  const [korei, setKorei] = useState(false);
  const [dependents, setDependents] = useState("0");
  const [fuyo, setFuyo] = useState(false);

  const [kihonkyu, setKihonkyu] = useState("280000");
  const [yakushokuTE, setYakushokuTE] = useState("0");
  const [kazokuTE, setKazokuTE] = useState("0");
  const [jutakuTE, setJutakuTE] = useState("0");
  const [tsukinkTE, setTsukinkTE] = useState("15000");
  const [otherTE1Name, setOtherTE1Name] = useState("その他手当1");
  const [otherTE1, setOtherTE1] = useState("0");
  const [otherTE2Name, setOtherTE2Name] = useState("その他手当2");
  const [otherTE2, setOtherTE2] = useState("0");

  const [kinteiHours, setKinteiHours] = useState("8");
  const [shukkinDays, setShukkinDays] = useState("20");
  const [zangyoH, setZangyoH] = useState("0");
  const [shingyaH, setShingyaH] = useState("0");
  const [kyujitsuH, setKyujitsuH] = useState("0");

  const [juminzei, setJuminzei] = useState("15000");
  const [otherKojo, setOtherKojo] = useState("0");
  const [otherKojoName, setOtherKojoName] = useState("その他控除");

  const [shahoMinus, setShahoMinus] = useState(false);

  const calc = useCallback(() => {
    const base = parseFloat(kihonkyu) || 0;
    const dailyHours = parseFloat(kinteiHours) || 8;
    const days = parseFloat(shukkinDays) || 20;
    const zan = parseFloat(zangyoH) || 0;
    const shin = parseFloat(shingyaH) || 0;
    const kyujitsu = parseFloat(kyujitsuH) || 0;

    const monthlyHours = dailyHours * days;
    const hourly = monthlyHours > 0 ? base / monthlyHours : 0;
    const zangyoPay = Math.round(hourly * zan * 1.25);
    const shingyaPay = Math.round(hourly * shin * 0.25);
    const kyujitsuPay = Math.round(hourly * kyujitsu * 1.35);

    const tsukinkTaxFree = Math.min(parseFloat(tsukinkTE) || 0, 150000);
    const tsukinkTaxable = Math.max(0, (parseFloat(tsukinkTE) || 0) - 150000);

    const grossPay = base
      + (parseFloat(yakushokuTE) || 0)
      + (parseFloat(kazokuTE) || 0)
      + (parseFloat(jutakuTE) || 0)
      + (parseFloat(tsukinkTE) || 0)
      + zangyoPay + shingyaPay + kyujitsuPay
      + (parseFloat(otherTE1) || 0)
      + (parseFloat(otherTE2) || 0);

    const taxableGross = grossPay - tsukinkTaxFree + tsukinkTaxable;
    const hyojun = getHyojun(taxableGross);

    let kenpo = 0, kaigo = 0, nenkin = 0, koyoIns = 0;
    if (!shahoMinus) {
      const healthRate = (PREF_HEALTH_RATE[pref] ?? 9.98) / 100;
      kenpo = Math.round(hyojun.amount * healthRate / 2);
      kaigo = korei ? Math.round(hyojun.amount * 0.0182 / 2) : 0;
      nenkin = Math.round(hyojun.amount * 0.0915);
      koyoIns = Math.round(taxableGross * 0.006);
    }

    const socialInsTotal = kenpo + kaigo + nenkin + koyoIns;
    const annualTaxableBase = (taxableGross - socialInsTotal) * 12;
    const annualGwk = annualTaxableBase <= 1625000 ? annualTaxableBase - 550000
      : annualTaxableBase <= 1800000 ? annualTaxableBase * 0.6 - 100000
      : annualTaxableBase <= 3600000 ? annualTaxableBase * 0.7 + 80000
      : annualTaxableBase <= 6600000 ? annualTaxableBase * 0.8 + 440000
      : annualTaxableBase <= 8500000 ? annualTaxableBase * 0.9 + 1100000 : annualTaxableBase - 1950000;
    const dep = parseInt(dependents) || 0;
    const incomeTax = Math.max(0, calcIncomeTax(annualGwk, dep));
    const juminzeiAmt = parseInt(juminzei) || 0;
    const otherKojoAmt = parseInt(otherKojo) || 0;
    const totalDeductions = socialInsTotal + incomeTax + juminzeiAmt + otherKojoAmt;
    const netPay = grossPay - totalDeductions;

    return {
      hourly, zangyoPay, shingyaPay, kyujitsuPay, grossPay, taxableGross,
      hyojun, kenpo, kaigo, nenkin, koyoIns, socialInsTotal,
      incomeTax, juminzeiAmt, otherKojoAmt, totalDeductions, netPay,
      tsukinkTaxFree, base,
    };
  }, [kihonkyu, kinteiHours, shukkinDays, zangyoH, shingyaH, kyujitsuH,
      yakushokuTE, kazokuTE, jutakuTE, tsukinkTE, otherTE1, otherTE2,
      pref, korei, dependents, juminzei, otherKojo, shahoMinus]);

  const r = calc();

  const loadPrev = useCallback(() => {
    try {
      const saved = localStorage.getItem("kyuyo-meisai-data");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.companyName) setCompanyName(d.companyName);
        if (d.empName) setEmpName(d.empName);
        if (d.kihonkyu) setKihonkyu(d.kihonkyu);
        if (d.pref) setPref(d.pref);
        if (d.yakushokuTE) setYakushokuTE(d.yakushokuTE);
        if (d.kazokuTE) setKazokuTE(d.kazokuTE);
        if (d.jutakuTE) setJutakuTE(d.jutakuTE);
        if (d.tsukinkTE) setTsukinkTE(d.tsukinkTE);
        if (d.juminzei) setJuminzei(d.juminzei);
      }
    } catch {}
  }, []);

  const saveCurrent = useCallback(() => {
    try {
      localStorage.setItem("kyuyo-meisai-data", JSON.stringify({
        companyName, empName, kihonkyu, pref, yakushokuTE, kazokuTE, jutakuTE, tsukinkTE, juminzei
      }));
    } catch {}
  }, [companyName, empName, kihonkyu, pref, yakushokuTE, kazokuTE, jutakuTE, tsukinkTE, juminzei]);

  useEffect(() => { saveCurrent(); }, [saveCurrent]);

  const ic = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const lc = "block text-sm font-medium text-gray-700 mb-1";

  const payItems = [
    { label: "基本給", value: r.base },
    { label: "役職手当", value: parseFloat(yakushokuTE) || 0 },
    { label: "家族手当", value: parseFloat(kazokuTE) || 0 },
    { label: "住宅手当", value: parseFloat(jutakuTE) || 0 },
    { label: `通勤手当（非課税${fmt(r.tsukinkTaxFree)}）`, value: parseFloat(tsukinkTE) || 0 },
    { label: "残業代", value: r.zangyoPay },
    { label: "深夜手当", value: r.shingyaPay },
    { label: "休日出勤手当", value: r.kyujitsuPay },
    { label: otherTE1Name, value: parseFloat(otherTE1) || 0 },
    { label: otherTE2Name, value: parseFloat(otherTE2) || 0 },
  ].filter(i => i.value > 0);

  const deductItems = [
    { label: "健康保険料", value: r.kenpo },
    { label: "介護保険料", value: r.kaigo },
    { label: "厚生年金保険料", value: r.nenkin },
    { label: "雇用保険料", value: r.koyoIns },
    { label: "所得税", value: r.incomeTax },
    { label: "住民税", value: r.juminzeiAmt },
    { label: otherKojoName, value: r.otherKojoAmt },
  ].filter(i => i.value > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">給与明細作成ツール</h1>
      <p className="text-sm text-gray-500 mb-6">社会保険料・所得税を自動計算。A4給与明細をPDF出力。</p>
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div className="space-y-4 mb-6 lg:mb-0">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <p className="font-semibold text-gray-700 text-sm">会社・従業員情報</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc}>会社名</label><input className={ic} value={companyName} onChange={e => setCompanyName(e.target.value)} /></div>
              <div><label className={lc}>従業員名</label><input className={ic} value={empName} onChange={e => setEmpName(e.target.value)} /></div>
              <div><label className={lc}>支給年月</label><input type="month" className={ic} value={yearMonth} onChange={e => setYearMonth(e.target.value)} /></div>
              <div><label className={lc}>雇用形態</label>
                <select className={ic} value={koyoKatachi} onChange={e => setKoyoKatachi(e.target.value)}>
                  {["正社員","パート/アルバイト","役員"].map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc}>都道府県</label>
                <select className={ic} value={pref} onChange={e => setPref(e.target.value)}>
                  {PREFS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div><label className={lc}>扶養親族数</label><input type="number" min="0" className={ic} value={dependents} onChange={e => setDependents(e.target.value)} /></div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={korei} onChange={e => setKorei(e.target.checked)} className="accent-blue-600 w-4 h-4" />40歳以上（介護保険）</label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={shahoMinus} onChange={e => setShahoMinus(e.target.checked)} className="accent-blue-600 w-4 h-4" />社会保険未加入</label>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <p className="font-semibold text-gray-700 text-sm">勤怠・残業</p>
            <div className="grid grid-cols-3 gap-3">
              <div><label className={lc}>所定時間/日</label><input type="number" className={ic} value={kinteiHours} onChange={e => setKinteiHours(e.target.value)} /></div>
              <div><label className={lc}>出勤日数</label><input type="number" className={ic} value={shukkinDays} onChange={e => setShukkinDays(e.target.value)} /></div>
              <div><label className={lc}>残業時間</label><input type="number" className={ic} value={zangyoH} onChange={e => setZangyoH(e.target.value)} /></div>
              <div><label className={lc}>深夜残業</label><input type="number" className={ic} value={shingyaH} onChange={e => setShingyaH(e.target.value)} /></div>
              <div><label className={lc}>休日出勤</label><input type="number" className={ic} value={kyujitsuH} onChange={e => setKyujitsuH(e.target.value)} /></div>
            </div>
            {(parseFloat(zangyoH)>0||parseFloat(shingyaH)>0||parseFloat(kyujitsuH)>0) && (
              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                時給 {fmtN(r.hourly)}円 / 残業代 {fmt(r.zangyoPay)} / 深夜手当 {fmt(r.shingyaPay)} / 休日手当 {fmt(r.kyujitsuPay)}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <p className="font-semibold text-gray-700 text-sm">支給項目</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc}>基本給</label><input type="number" className={ic} value={kihonkyu} onChange={e => setKihonkyu(e.target.value)} /></div>
              <div><label className={lc}>役職手当</label><input type="number" className={ic} value={yakushokuTE} onChange={e => setYakushokuTE(e.target.value)} /></div>
              <div><label className={lc}>家族手当</label><input type="number" className={ic} value={kazokuTE} onChange={e => setKazokuTE(e.target.value)} /></div>
              <div><label className={lc}>住宅手当</label><input type="number" className={ic} value={jutakuTE} onChange={e => setJutakuTE(e.target.value)} /></div>
              <div><label className={lc}>通勤手当（月15万まで非課税）</label><input type="number" className={ic} value={tsukinkTE} onChange={e => setTsukinkTE(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input className="border-b border-gray-300 w-full text-sm px-1 mb-1 focus:outline-none" value={otherTE1Name} onChange={e => setOtherTE1Name(e.target.value)} />
                <input type="number" className={ic} value={otherTE1} onChange={e => setOtherTE1(e.target.value)} />
              </div>
              <div>
                <input className="border-b border-gray-300 w-full text-sm px-1 mb-1 focus:outline-none" value={otherTE2Name} onChange={e => setOtherTE2Name(e.target.value)} />
                <input type="number" className={ic} value={otherTE2} onChange={e => setOtherTE2(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <p className="font-semibold text-gray-700 text-sm">追加控除</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lc}>住民税（前年課税）</label><input type="number" className={ic} value={juminzei} onChange={e => setJuminzei(e.target.value)} /></div>
              <div>
                <input className="border-b border-gray-300 w-full text-sm px-1 mb-1 focus:outline-none" value={otherKojoName} onChange={e => setOtherKojoName(e.target.value)} />
                <input type="number" className={ic} value={otherKojo} onChange={e => setOtherKojo(e.target.value)} />
              </div>
            </div>
          </div>
          <button onClick={loadPrev} className="w-full border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition print:hidden">前月のデータを読み込む</button>
        </div>

        <div>
          <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-800 text-white px-6 py-4">
              <div className="flex justify-between items-start">
                <div><p className="text-lg font-bold">給与明細書</p><p className="text-sm opacity-70">{yearMonth.replace("-", "年")}月分</p></div>
                <div className="text-right text-sm opacity-80"><p>{companyName}</p><p>{empName} 様</p></div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-2">標準報酬月額: {fmt(r.hyojun.amount)}（第{r.hyojun.grade}等級）・{pref}健保料率 {(PREF_HEALTH_RATE[pref]??9.98).toFixed(2)}%</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded mb-2">支給項目</p>
                  <div className="space-y-1.5">
                    {payItems.map(i => (
                      <div key={i.label} className="flex justify-between text-xs">
                        <span className="text-gray-600">{i.label}</span><span>{fmtN(i.value)}円</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold border-t pt-1 mt-1">
                      <span>支給合計</span><span className="text-green-700">{fmt(r.grossPay)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-1 rounded mb-2">控除項目</p>
                  <div className="space-y-1.5">
                    {deductItems.map(i => (
                      <div key={i.label} className="flex justify-between text-xs">
                        <span className="text-gray-600">{i.label}</span><span>{fmtN(i.value)}円</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold border-t pt-1 mt-1">
                      <span>控除合計</span><span className="text-red-700">{fmt(r.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-700 text-white rounded-xl px-5 py-4 text-center">
                <p className="text-xs opacity-80">差引支給額（振込額）</p>
                <p className="text-3xl font-bold mt-1">{fmt(r.netPay)}</p>
              </div>
              <div className="hidden print:block mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-gray-400 text-xs">山田ツール | yamada-tools.jp で無料作成</p>
                <p className="text-gray-300 text-xs mt-1">透かしなし・高品質 PDFはPROプランで → yamada-tools.jp/pricing</p>
              </div>
            </div>
          </div>
          <button onClick={() => window.print()} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition print:hidden">
            PDF出力・印刷
          </button>
          <p className="text-xs text-center text-gray-400 mt-2 print:hidden">ブラウザの印刷で「PDFに保存」を選択してください</p>
        </div>
      </div>

      {tool && <div className="mt-8"><RelatedTools currentTool={tool} maxItems={4} /></div>}
    </div>
  );
}
