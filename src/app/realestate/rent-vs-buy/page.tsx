"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

// ---- Constants ----
const MAN = 10000;

// ---- Types ----
interface RentalInputs {
  monthlyRent: number;
  shikikin: number;
  reikin: number;
  chukaiTesuryo: number;
  koshinryo: number;
  rentRiseRate: number;
  years: number;
}

interface PurchaseInputs {
  propertyPrice: number;
  propertyType: string;
  downPayment: number;
  loanRate: number;
  loanYears: number;
  loanType: string;
  kanrihi: number;
  fixedAssetTax: number;
  fixedAssetTaxAuto: boolean;
  shoryohiRate: number;
  repairCost: number;
  saleValueRate: number;
}

interface PersonalInputs {
  annualIncome: number;
  useLoanDeduction: boolean;
  investmentReturn: number;
  familyType: string;
}

interface YearData {
  year: number;
  rentalCumulative: number;
  purchaseCumulative: number;
  diff: number;
}

interface Results {
  monthlyRent: number;
  monthlyLoan: number;
  monthlyPurchaseTotal: number;
  monthlyPurchaseAfterDeduction: number;
  rentalInitial: number;
  rentalRentTotal: number;
  rentalKoshinTotal: number;
  rentalTotal: number;
  purchaseInitial: number;
  purchaseLoanTotal: number;
  purchaseKanrihiTotal: number;
  purchaseTaxTotal: number;
  purchaseRepairTotal: number;
  purchaseDeductionTotal: number;
  purchaseSaleValue: number;
  purchaseTotal: number;
  by10: YearData;
  by20: YearData;
  by35: YearData;
  byResidence: YearData;
  breakEvenYear: number | null;
  opportunityCost: number;
  verdictType: "buy-short" | "buy-long" | "rent";
  verdictText: string;
}

// ---- Calculation helpers ----
function calcPMT(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function calcYearEndBalance(
  principal: number,
  annualRate: number,
  totalMonths: number,
  year: number
): number {
  if (annualRate === 0) {
    return Math.max(0, principal - (principal / totalMonths) * year * 12);
  }
  const r = annualRate / 100 / 12;
  const n = year * 12;
  const pmt = calcPMT(principal, annualRate, totalMonths);
  const balance = principal * Math.pow(1 + r, n) - pmt * ((Math.pow(1 + r, n) - 1) / r);
  return Math.max(0, balance);
}

function calcIncomeTaxLimit(annualIncomeMan: number): number {
  const income = annualIncomeMan * MAN;
  if (income <= 1_950_000) return income * 0.05 + 97500;
  if (income <= 3_300_000) return income * 0.1 + 97500;
  if (income <= 6_950_000) return income * 0.2 - 427500 + 97500;
  if (income <= 9_000_000) return income * 0.23 - 636000 + 97500;
  return income * 0.33 - 1_536_000 + 97500;
}

function isNewConstruction(propertyType: string): boolean {
  return propertyType === "マンション（新築）" || propertyType === "一戸建て（新築）";
}

function isApartment(propertyType: string): boolean {
  return propertyType.startsWith("マンション");
}

function calcLoanDeductionForYear(
  loanBalance: number,
  propertyType: string,
  year: number,
  incomeTaxLimit: number
): number {
  const isNew = isNewConstruction(propertyType);
  const maxYears = isNew ? 13 : 10;
  const cap = isNew ? 350_000 : 210_000;
  if (year > maxYears || loanBalance <= 0) return 0;
  const deduction = Math.min(loanBalance * 0.007, cap);
  return Math.min(deduction, incomeTaxLimit);
}

function runCalculation(
  rental: RentalInputs,
  purchase: PurchaseInputs,
  personal: PersonalInputs
): Results {
  const years = rental.years;
  const propertyPriceYen = purchase.propertyPrice * MAN;
  const autoFAT = Math.round(propertyPriceYen * 0.007 * 0.014 / 6);
  const fixedAssetTaxYen = purchase.fixedAssetTaxAuto
    ? autoFAT
    : purchase.fixedAssetTax * MAN;

  const loanPrincipal = Math.max(0, (purchase.propertyPrice - purchase.downPayment) * MAN);
  const loanMonths = purchase.loanYears * 12;
  const monthlyLoanPayment =
    loanPrincipal > 0 ? Math.round(calcPMT(loanPrincipal, purchase.loanRate, loanMonths)) : 0;

  const isApt = isApartment(purchase.propertyType);
  const isNew = isNewConstruction(purchase.propertyType);
  const isHouse = !isApt;
  const incomeTaxLimit = personal.useLoanDeduction
    ? calcIncomeTaxLimit(personal.annualIncome)
    : 0;

  // Rental cumulative
  const rentalByYear: number[] = [];
  const rentInitialMonths = rental.shikikin + rental.reikin + rental.chukaiTesuryo;
  const rentalInitial = Math.round(rental.monthlyRent * MAN * (rentInitialMonths - rental.shikikin));
  let cumulativeRental = rentalInitial;
  let currentRent = rental.monthlyRent * MAN;
  let rentalRentTotal = 0;
  let rentalKoshinTotal = 0;

  for (let y = 1; y <= 50; y++) {
    const annualRent = Math.round(currentRent * 12);
    const koshin = y % 2 === 0 ? Math.round(currentRent * rental.koshinryo) : 0;
    cumulativeRental += annualRent + koshin;
    rentalByYear.push(cumulativeRental);
    if (y <= years) {
      rentalRentTotal += annualRent;
      rentalKoshinTotal += koshin;
    }
    currentRent = Math.round(currentRent * (1 + rental.rentRiseRate));
  }

  // Purchase cumulative
  const purchaseShoryohi = Math.round(propertyPriceYen * purchase.shoryohiRate);
  const purchaseInitial = purchase.downPayment * MAN + purchaseShoryohi;
  const annualRepair = isHouse ? Math.round((purchase.repairCost * MAN) / 10) : 0;

  let purchaseLoanTotal = 0;
  let purchaseKanrihiTotal = 0;
  let purchaseTaxTotal = 0;
  let purchaseRepairTotal = 0;
  let purchaseDeductionTotal = 0;

  // Build purchase with sale by year (for break-even and display)
  const purchaseWithSaleByYear: number[] = [];
  let cumPurch = purchaseInitial;

  for (let y = 1; y <= 50; y++) {
    const annualLoan = y <= purchase.loanYears ? monthlyLoanPayment * 12 : 0;
    const annualKanrihi = isApt ? purchase.kanrihi * 12 : 0;
    const fatThisYear =
      isNew && y <= 5 ? Math.round(fixedAssetTaxYen * 0.5) : fixedAssetTaxYen;
    const yearEndBalance =
      y <= purchase.loanYears
        ? calcYearEndBalance(loanPrincipal, purchase.loanRate, loanMonths, y)
        : 0;
    const deduction = calcLoanDeductionForYear(
      yearEndBalance,
      purchase.propertyType,
      y,
      incomeTaxLimit
    );
    cumPurch += annualLoan + annualKanrihi + fatThisYear + annualRepair - deduction;
    const saleV = Math.round(propertyPriceYen * purchase.saleValueRate);
    purchaseWithSaleByYear.push(cumPurch - saleV);

    if (y <= years) {
      purchaseLoanTotal += annualLoan;
      purchaseKanrihiTotal += annualKanrihi;
      purchaseTaxTotal += fatThisYear;
      purchaseRepairTotal += annualRepair;
      purchaseDeductionTotal += deduction;
    }
  }

  const saleValue = Math.round(propertyPriceYen * purchase.saleValueRate);
  const purchaseTotal =
    purchaseInitial +
    purchaseLoanTotal +
    purchaseKanrihiTotal +
    purchaseTaxTotal +
    purchaseRepairTotal -
    purchaseDeductionTotal -
    saleValue;
  const rentalTotal = rentalInitial + rentalRentTotal + rentalKoshinTotal;

  // Break-even
  let breakEvenYear: number | null = null;
  for (let y = 1; y <= 50; y++) {
    if (purchaseWithSaleByYear[y - 1] < rentalByYear[y - 1]) {
      breakEvenYear = y;
      break;
    }
  }

  // Opportunity cost
  const opportunityCost = Math.round(
    purchase.downPayment * MAN * (Math.pow(1 + personal.investmentReturn, years) - 1)
  );

  // Monthly comparison
  const monthlyRent = Math.round(rental.monthlyRent * MAN);
  const monthlyKanrihi = isApt ? purchase.kanrihi : 0;
  const monthlyFAT = Math.round(fixedAssetTaxYen / 12);
  const monthlyPurchaseTotal = monthlyLoanPayment + monthlyKanrihi + monthlyFAT;
  const firstYearBalance =
    loanPrincipal > 0
      ? calcYearEndBalance(loanPrincipal, purchase.loanRate, loanMonths, 1)
      : 0;
  const firstYearDeduction = calcLoanDeductionForYear(
    firstYearBalance,
    purchase.propertyType,
    1,
    incomeTaxLimit
  );
  const monthlyPurchaseAfterDeduction = Math.round(
    monthlyPurchaseTotal - firstYearDeduction / 12
  );

  // Verdict
  let verdictType: Results["verdictType"];
  let verdictText: string;
  if (breakEvenYear !== null && breakEvenYear <= years) {
    if (breakEvenYear <= 10) {
      verdictType = "buy-short";
      verdictText = `購入が経済的に有利です。${breakEvenYear}年以内に購入コストが回収できます。`;
    } else {
      verdictType = "buy-long";
      verdictText = `購入は長期的には有利ですが、${breakEvenYear}年後まで賃貸の方が費用を抑えられます。`;
    }
  } else {
    verdictType = "rent";
    verdictText = `居住期間（${years}年）内は賃貸の方がコストを抑えられます。ただし資産形成の観点では購入も検討の余地があります。`;
  }

  const getByYear = (y: number): YearData => {
    const idx = Math.min(y, 50) - 1;
    const rc = rentalByYear[idx] ?? 0;
    const pc = purchaseWithSaleByYear[idx] ?? 0;
    return { year: y, rentalCumulative: rc, purchaseCumulative: pc, diff: rc - pc };
  };

  return {
    monthlyRent,
    monthlyLoan: monthlyLoanPayment,
    monthlyPurchaseTotal,
    monthlyPurchaseAfterDeduction,
    rentalInitial,
    rentalRentTotal,
    rentalKoshinTotal,
    rentalTotal,
    purchaseInitial,
    purchaseLoanTotal,
    purchaseKanrihiTotal,
    purchaseTaxTotal,
    purchaseRepairTotal,
    purchaseDeductionTotal,
    purchaseSaleValue: saleValue,
    purchaseTotal,
    by10: getByYear(10),
    by20: getByYear(20),
    by35: getByYear(35),
    byResidence: getByYear(years),
    breakEvenYear,
    opportunityCost,
    verdictType,
    verdictText,
  };
}

// ---- Format helpers ----
function fmt(yen: number): string {
  const man = Math.round(yen / MAN);
  return man.toLocaleString() + "万円";
}

function fmtMan(man: number): string {
  return Math.round(man).toLocaleString() + "万円";
}

// ---- Component ----
export default function RentVsBuyPage() {
  const [monthlyRent, setMonthlyRent] = useState(10);
  const [mascotState, setMascotState] = useState<MascotState>("welcome");
  const [shikikin, setShikikin] = useState(1);
  const [reikin, setReikin] = useState(1);
  const [chukaiTesuryo, setChukaiTesuryo] = useState(1);
  const [koshinryo, setKoshinryo] = useState(1);
  const [rentRiseRate, setRentRiseRate] = useState(0);
  const [residenceYears, setResidenceYears] = useState(30);

  const [propertyPrice, setPropertyPrice] = useState(3000);
  const [propertyType, setPropertyType] = useState("マンション（新築）");
  const [downPayment, setDownPayment] = useState(300);
  const [loanRate, setLoanRate] = useState(0.5);
  const [loanYears, setLoanYears] = useState(35);
  const [loanType, setLoanType] = useState("変動金利");
  const [kanrihi, setKanrihi] = useState(30000);
  const [fixedAssetTaxManual, setFixedAssetTaxManual] = useState(0);
  const [fixedAssetTaxAuto, setFixedAssetTaxAuto] = useState(true);
  const [shoryohiRate, setShoryohiRate] = useState(0.05);
  const [repairCost, setRepairCost] = useState(100);
  const [saleValueRate, setSaleValueRate] = useState(0.7);

  const [annualIncome, setAnnualIncome] = useState(500);
  const [useLoanDeduction, setUseLoanDeduction] = useState(true);
  const [investmentReturn, setInvestmentReturn] = useState(0.03);
  const [familyType, setFamilyType] = useState("夫婦");

  const [results, setResults] = useState<Results | null>(null);

  const isApt = propertyType.startsWith("マンション");
  const isHouse = !isApt;
  const autoFATMan = Math.round(propertyPrice * 0.7 * 0.014 / 6 * 10) / 10;

  const handleCalculate = () => {
    const rental: RentalInputs = {
      monthlyRent,
      shikikin,
      reikin,
      chukaiTesuryo,
      koshinryo,
      rentRiseRate,
      years: residenceYears,
    };
    const purchase: PurchaseInputs = {
      propertyPrice,
      propertyType,
      downPayment,
      loanRate,
      loanYears,
      loanType,
      kanrihi,
      fixedAssetTax: fixedAssetTaxAuto ? autoFATMan : fixedAssetTaxManual,
      fixedAssetTaxAuto,
      shoryohiRate,
      repairCost,
      saleValueRate,
    };
    const personal: PersonalInputs = {
      annualIncome,
      useLoanDeduction,
      investmentReturn,
      familyType,
    };
    setResults(runCalculation(rental, purchase, personal));
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const selectClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50">
        <Mascot state={mascotState} className="mb-6" />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span className="mx-1">/</span>
            <Link href="/realestate" className="hover:text-blue-600">不動産・住まい</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-600">家賃 vs 購入 比較計算機</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            家賃 vs 購入 比較計算機
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            賃貸と購入の生涯コストを中立的に比較。住宅ローン控除・固定資産税・頭金運用益まで考慮した本格シミュレーター。
            <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded ml-1">
              2026年税制対応
            </span>
          </p>
        </div>

        <AdUnit slot="7823491056" format="horizontal" className="mb-6" />

        {/* Section 1: 賃貸の条件 */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-4">
          <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
              1
            </span>
            賃貸の条件
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>月額家賃（万円）</label>
              <input
                type="number"
                className={inputClass}
                value={monthlyRent}
                min={1}
                max={100}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>敷金</label>
              <select
                className={selectClass}
                value={shikikin}
                onChange={(e) => setShikikin(Number(e.target.value))}
              >
                <option value={0}>なし（0ヶ月）</option>
                <option value={1}>1ヶ月</option>
                <option value={2}>2ヶ月</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>礼金</label>
              <select
                className={selectClass}
                value={reikin}
                onChange={(e) => setReikin(Number(e.target.value))}
              >
                <option value={0}>なし（0ヶ月）</option>
                <option value={1}>1ヶ月</option>
                <option value={2}>2ヶ月</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>仲介手数料</label>
              <select
                className={selectClass}
                value={chukaiTesuryo}
                onChange={(e) => setChukaiTesuryo(Number(e.target.value))}
              >
                <option value={0.5}>0.5ヶ月</option>
                <option value={1}>1ヶ月</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>更新料（2年ごと）</label>
              <select
                className={selectClass}
                value={koshinryo}
                onChange={(e) => setKoshinryo(Number(e.target.value))}
              >
                <option value={0}>なし</option>
                <option value={0.5}>0.5ヶ月</option>
                <option value={1}>1ヶ月</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>年間家賃上昇率</label>
              <select
                className={selectClass}
                value={rentRiseRate}
                onChange={(e) => setRentRiseRate(Number(e.target.value))}
              >
                <option value={0}>0%（変動なし）</option>
                <option value={0.005}>0.5%</option>
                <option value={0.01}>1%</option>
                <option value={0.02}>2%</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>想定居住年数（年）</label>
              <input
                type="number"
                className={inputClass}
                value={residenceYears}
                min={5}
                max={50}
                onChange={(e) =>
                  setResidenceYears(Math.min(50, Math.max(5, Number(e.target.value))))
                }
              />
              <p className="text-xs text-gray-400 mt-1">5〜50年で入力してください</p>
            </div>
          </div>
        </div>

        {/* Section 2: 購入の条件 */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-4">
          <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
              2
            </span>
            購入の条件
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>物件価格（万円）</label>
              <input
                type="number"
                className={inputClass}
                value={propertyPrice}
                min={100}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>物件タイプ</label>
              <select
                className={selectClass}
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option>マンション（新築）</option>
                <option>マンション（中古）</option>
                <option>一戸建て（新築）</option>
                <option>一戸建て（中古）</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>頭金（万円）</label>
              <input
                type="number"
                className={inputClass}
                value={downPayment}
                min={0}
                onChange={(e) => setDownPayment(Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>住宅ローン金利（%）</label>
              <input
                type="number"
                className={inputClass}
                value={loanRate}
                min={0.1}
                max={10}
                step={0.1}
                onChange={(e) => setLoanRate(Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>返済期間</label>
              <select
                className={selectClass}
                value={loanYears}
                onChange={(e) => setLoanYears(Number(e.target.value))}
              >
                <option value={20}>20年</option>
                <option value={25}>25年</option>
                <option value={30}>30年</option>
                <option value={35}>35年</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>ローンタイプ</label>
              <select
                className={selectClass}
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
              >
                <option>変動金利</option>
                <option>固定金利（フラット35）</option>
                <option>固定10年後変動</option>
              </select>
            </div>
            {isApt && (
              <div>
                <label className={labelClass}>管理費・修繕積立金（円/月）</label>
                <input
                  type="number"
                  className={inputClass}
                  value={kanrihi}
                  min={0}
                  step={1000}
                  onChange={(e) => setKanrihi(Number(e.target.value))}
                />
              </div>
            )}
            <div>
              <label className={labelClass}>
                固定資産税（万円/年）
                <button
                  type="button"
                  className="ml-2 text-xs text-blue-500 underline"
                  onClick={() => setFixedAssetTaxAuto(!fixedAssetTaxAuto)}
                >
                  {fixedAssetTaxAuto ? "手動入力する" : "自動計算に戻す"}
                </button>
              </label>
              {fixedAssetTaxAuto ? (
                <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600">
                  自動計算: 約 {autoFATMan.toFixed(1)} 万円/年
                </div>
              ) : (
                <input
                  type="number"
                  className={inputClass}
                  value={fixedAssetTaxManual}
                  min={0}
                  step={0.1}
                  onChange={(e) => setFixedAssetTaxManual(Number(e.target.value))}
                />
              )}
            </div>
            <div>
              <label className={labelClass}>購入諸費用</label>
              <select
                className={selectClass}
                value={shoryohiRate}
                onChange={(e) => setShoryohiRate(Number(e.target.value))}
              >
                <option value={0.03}>3%（中古・ローン手数料定額型）</option>
                <option value={0.05}>5%（標準）</option>
                <option value={0.07}>7%（新築・フルローン諸費用込み）</option>
              </select>
            </div>
            {isHouse && (
              <div>
                <label className={labelClass}>大規模修繕費（万円/10年）</label>
                <input
                  type="number"
                  className={inputClass}
                  value={repairCost}
                  min={0}
                  step={10}
                  onChange={(e) => setRepairCost(Number(e.target.value))}
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className={labelClass}>売却時の資産価値（居住年数後）</label>
              <select
                className={selectClass}
                value={saleValueRate}
                onChange={(e) => setSaleValueRate(Number(e.target.value))}
              >
                <option value={0.3}>物件価格の30%（大幅下落）</option>
                <option value={0.5}>物件価格の50%</option>
                <option value={0.7}>物件価格の70%（標準）</option>
                <option value={0.9}>物件価格の90%</option>
                <option value={1.1}>物件価格の110%（値上がり）</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: 個人条件 */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
              3
            </span>
            個人条件
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>年収（万円）</label>
              <input
                type="number"
                className={inputClass}
                value={annualIncome}
                min={100}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
              />
              <p className="text-xs text-gray-400 mt-1">住宅ローン控除の上限計算に使用</p>
            </div>
            <div>
              <label className={labelClass}>住宅ローン控除を利用</label>
              <div className="flex gap-3 mt-2">
                {([true, false] as const).map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      useLoanDeduction === v
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-purple-400"
                    }`}
                    onClick={() => setUseLoanDeduction(v)}
                  >
                    {v ? "はい" : "いいえ"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>頭金の想定運用利回り（賃貸の場合）</label>
              <select
                className={selectClass}
                value={investmentReturn}
                onChange={(e) => setInvestmentReturn(Number(e.target.value))}
              >
                <option value={0}>0%（運用しない）</option>
                <option value={0.01}>1%（預貯金・債券）</option>
                <option value={0.03}>3%（投資信託・NISA）</option>
                <option value={0.05}>5%（積極運用）</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>家族構成</label>
              <select
                className={selectClass}
                value={familyType}
                onChange={(e) => setFamilyType(e.target.value)}
              >
                <option>単身</option>
                <option>夫婦</option>
                <option>夫婦+子1人</option>
                <option>夫婦+子2人以上</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          type="button"
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 rounded-xl text-lg shadow-md transition-all mb-8"
        >
          計算する
        </button>

        {/* Results */}
        {results && (
          <div id="results-section" className="space-y-5">

            {/* Monthly cost */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">月額コスト比較</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-600 font-medium mb-1">賃貸 月額</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {fmtMan(results.monthlyRent / MAN)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-600 font-medium mb-1">
                    購入 月額（ローン+維持費）
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {fmtMan(results.monthlyPurchaseTotal / MAN)}
                  </p>
                  {useLoanDeduction && (
                    <p className="text-xs text-gray-500 mt-1">
                      控除後: {fmtMan(results.monthlyPurchaseAfterDeduction / MAN)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Lifetime cost table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">生涯コスト比較（累計）</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-3 text-left font-semibold text-gray-600">期間</th>
                      <th className="px-3 py-3 text-right font-semibold text-blue-600">
                        賃貸 累計
                      </th>
                      <th className="px-3 py-3 text-right font-semibold text-green-600">
                        購入 累計
                      </th>
                      <th className="px-3 py-3 text-right font-semibold text-gray-600">差額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[results.by10, results.by20, results.by35, results.byResidence].map(
                      (row, i) => {
                        const label =
                          i < 3 ? `${row.year}年後` : `${row.year}年後（居住年数）`;
                        const diff = row.diff;
                        return (
                          <tr
                            key={i}
                            className={i === 3 ? "bg-yellow-50 font-semibold" : ""}
                          >
                            <td className="px-3 py-3">{label}</td>
                            <td className="px-3 py-3 text-right text-blue-600">
                              {fmt(row.rentalCumulative)}
                            </td>
                            <td className="px-3 py-3 text-right text-green-600">
                              {fmt(row.purchaseCumulative)}
                            </td>
                            <td
                              className={`px-3 py-3 text-right font-medium ${
                                diff > 0
                                  ? "text-green-600"
                                  : diff < 0
                                  ? "text-blue-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {diff > 0
                                ? `購入が${fmt(diff)}安い`
                                : diff < 0
                                ? `賃貸が${fmt(Math.abs(diff))}安い`
                                : "同額"}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                ※購入の累計コストは売却資産価値を差し引いた実質コスト
              </p>
            </div>

            {/* Break-even */}
            <div
              className={`rounded-2xl shadow-sm border p-6 text-center ${
                results.breakEvenYear !== null && results.breakEvenYear <= residenceYears
                  ? "bg-amber-50 border-amber-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <h2 className="text-lg font-bold text-gray-800 mb-3">損益分岐点</h2>
              {results.breakEvenYear !== null ? (
                <>
                  <p className="text-4xl font-bold text-amber-600 mb-2">
                    {results.breakEvenYear}年後
                  </p>
                  <p className="text-gray-600">
                    購入が賃貸より有利になるのは{" "}
                    <strong>{results.breakEvenYear}年後</strong> からです
                  </p>
                  {results.breakEvenYear > residenceYears && (
                    <p className="text-sm text-orange-600 mt-2">
                      ※居住年数（{residenceYears}年）内に損益分岐点に達しません
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    50年以内に達成せず
                  </p>
                  <p className="text-gray-600">
                    居住期間内では賃貸の方がコストを抑えられます
                  </p>
                </>
              )}
            </div>

            {/* Detailed breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5">
                <h3 className="font-bold text-green-700 mb-3">購入コストの内訳</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">頭金・諸費用</span>
                    <span className="font-medium">{fmt(results.purchaseInitial)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ローン総返済額</span>
                    <span className="font-medium">{fmt(results.purchaseLoanTotal)}</span>
                  </div>
                  {isApt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">管理費等（総額）</span>
                      <span className="font-medium">{fmt(results.purchaseKanrihiTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">固定資産税（総額）</span>
                    <span className="font-medium">{fmt(results.purchaseTaxTotal)}</span>
                  </div>
                  {isHouse && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">修繕費（総額）</span>
                      <span className="font-medium">{fmt(results.purchaseRepairTotal)}</span>
                    </div>
                  )}
                  {useLoanDeduction && (
                    <div className="flex justify-between text-green-600">
                      <span>住宅ローン控除（総額）</span>
                      <span className="font-medium">
                        -{fmt(results.purchaseDeductionTotal)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-green-600">
                    <span>売却資産価値</span>
                    <span className="font-medium">-{fmt(results.purchaseSaleValue)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-green-700">
                    <span>購入実質コスト</span>
                    <span>{fmt(results.purchaseTotal)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
                <h3 className="font-bold text-blue-700 mb-3">賃貸コストの内訳</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">初期費用（礼金・仲介等）</span>
                    <span className="font-medium">{fmt(results.rentalInitial)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">家賃総額</span>
                    <span className="font-medium">{fmt(results.rentalRentTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">更新料（総額）</span>
                    <span className="font-medium">{fmt(results.rentalKoshinTotal)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-blue-700">
                    <span>賃貸実質コスト</span>
                    <span>{fmt(results.rentalTotal)}</span>
                  </div>
                  {investmentReturn > 0 && results.opportunityCost > 0 && (
                    <div className="mt-3 bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-medium">
                        頭金運用益（機会費用）
                      </p>
                      <p className="text-sm font-bold text-blue-700">
                        +{fmt(results.opportunityCost)}
                      </p>
                      <p className="text-xs text-gray-500">
                        頭金を{Math.round(investmentReturn * 100)}%で{residenceYears}
                        年運用した場合の追加資産
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div
              className={`rounded-2xl border p-5 ${
                results.verdictType === "buy-short"
                  ? "bg-green-50 border-green-200"
                  : results.verdictType === "buy-long"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <h3
                className={`font-bold text-lg mb-2 ${
                  results.verdictType === "buy-short"
                    ? "text-green-700"
                    : results.verdictType === "buy-long"
                    ? "text-amber-700"
                    : "text-blue-700"
                }`}
              >
                中立な判定
              </h3>
              <p className="text-gray-700 font-medium">{results.verdictText}</p>
              <p className="text-xs text-gray-500 mt-3">
                ※本計算は金銭的な比較のみです。生活の柔軟性・ライフプランも含めてご検討ください。
              </p>
            </div>

            <AdUnit slot="3948572016" format="rectangle" className="my-4" />
          </div>
        )}

        {/* SEO Content */}
        <section className="mt-12 space-y-8 text-sm text-gray-700">

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              よくある比較パターンの計算例
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-3 py-2 text-left">家賃</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">物件価格</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">居住年数</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">損益分岐</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">結論</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["10万円/月", "3,000万円", "35年", "約22年後", "長期なら購入有利", true],
                    ["12万円/月", "4,000万円", "20年", "達成せず", "20年なら賃貸有利", false],
                    ["15万円/月", "5,000万円", "35年", "約18年後", "長期なら購入有利", true],
                    ["8万円/月", "2,500万円", "30年", "約15年後", "購入有利", true],
                  ].map(([rent, price, yr, be, verdict, isBuy], i) => (
                    <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                      <td className="border border-gray-200 px-3 py-2">{rent}</td>
                      <td className="border border-gray-200 px-3 py-2">{price}</td>
                      <td className="border border-gray-200 px-3 py-2">{yr}</td>
                      <td className="border border-gray-200 px-3 py-2">{be}</td>
                      <td
                        className={`border border-gray-200 px-3 py-2 font-medium ${
                          isBuy ? "text-green-600" : "text-blue-600"
                        }`}
                      >
                        {verdict}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-800">賃貸vs購入の基礎知識</h2>
            <p>
              賃貸と購入どちらがお得かは「居住年数」と「資産価値の変化」が決め手です。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-bold text-green-700 mb-2">購入が有利になる条件</h3>
                <ul className="space-y-1 text-sm">
                  <li>✅ 同じ場所に長期間（15年以上）住む予定がある</li>
                  <li>✅ 物件の資産価値が維持または上昇する地域</li>
                  <li>✅ 低金利でローンを組める（変動金利0.5%前後）</li>
                  <li>✅ 住宅ローン控除をフル活用できる年収がある</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-bold text-blue-700 mb-2">賃貸が有利になる条件</h3>
                <ul className="space-y-1 text-sm">
                  <li>✅ 転勤・転職などで5〜10年以内に引越す可能性がある</li>
                  <li>✅ 頭金を高利回りで運用できる</li>
                  <li>✅ 家族構成が変わる可能性が高い</li>
                  <li>✅ 購入物件の資産価値が下がりやすいエリア</li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">住宅ローン控除（2026年）</h3>
              <p>
                住宅ローン控除は年末残高の0.7%が最長13年間（新築）所得税・住民税から控除される制度です。
                年収500万円の方なら最大で年間約20〜35万円が戻ります。2024年以降の新築については省エネ基準への適合が必要です。
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">見落としがちなコスト</h3>
              <p>
                購入には仲介手数料（物件価格の3%+6万円+税）、登記費用、ローン手数料、
                火災保険、地震保険など購入諸費用が物件価格の3〜7%かかります。
                マンションは管理費・修繕積立金が月2〜5万円かかることも忘れずに。
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">よくある質問</h2>
            {[
              {
                q: "賃貸と購入、どちらが総合的にお得ですか？",
                a: "一概には言えません。一般的に同じ場所に15〜20年以上住む場合は購入が有利になることが多いです。一方、転勤が多い方や10年以内に住み替える可能性がある方は賃貸の方が柔軟でコストも抑えられます。本ツールで実際の条件を入力して比較することをお勧めします。",
              },
              {
                q: "住宅ローン控除はいくら戻りますか？",
                a: "2026年現在、新築住宅は年末ローン残高の0.7%が最大35万円/年、13年間控除されます。例えば3,000万円のローンを組んだ場合、1年目の控除額は約21万円です。ただし所得税+住民税の範囲内の控除のため、年収によって実際の控除額は異なります。",
              },
              {
                q: "マンションと一戸建てではどちらが維持費が安いですか？",
                a: "一般的に一戸建ては管理費・修繕積立金がない分、毎月の費用は安くなります。ただし外壁・屋根の修繕（10年ごとに100〜200万円）は自己負担です。マンションは修繕積立金として毎月1〜3万円かかりますが、大規模修繕を計画的に積み立てるため急な出費は少なめです。",
              },
              {
                q: "頭金はいくら用意すべきですか？",
                a: "一般的に物件価格の10〜20%が目安です。頭金が多いほど借入額が減り、金利負担も軽くなります。ただし頭金を多く入れすぎると手元資金が減り、緊急時の対応が難しくなるため、生活費6ヶ月分は残すことをお勧めします。なお、頭金ゼロでの購入も可能ですが総利息が増えます。",
              },
              {
                q: "老後を考えると賃貸と購入どちらが安心ですか？",
                a: "老後の安心感という点では購入に優位性があります。住宅ローンを完済すれば毎月の住居費が大幅に減り、年金生活での家計が楽になります。賃貸の場合、高齢になると入居審査が厳しくなる可能性もあります。一方、購入物件が老朽化した場合のリフォーム費用も考慮が必要です。",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-800 mb-2">Q: {item.q}</h3>
                <p className="text-gray-600">A: {item.a}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">あわせて使えるツール</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  name: "賃貸 敷金礼金 トータルコスト計算機",
                  url: "/realestate/rental-cost-calculator",
                  icon: "🏠",
                },
                {
                  name: "不動産取得税 計算機",
                  url: "/realestate/acquisition-tax",
                  icon: "📋",
                },
                {
                  name: "固定資産税 計算機",
                  url: "/realestate/property-tax-calculator",
                  icon: "🏛️",
                },
                {
                  name: "住宅ローン計算機 Pro",
                  url: "/finance/jutaku-loan",
                  icon: "💰",
                },
              ].map((tool) => (
                <Link
                  key={tool.url}
                  href={tool.url}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all group"
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-sm">
                    {tool.name}
                  </span>
                  <span className="ml-auto text-gray-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
          {/* 関連ブログ記事 */}
          <div className="mt-8 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 関連ブログ記事</h2>
            <Link
              href="/blog/chintai-vs-koubai-simulation-2026"
              className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all p-5 group"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center shrink-0 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-700 group-hover:text-purple-800">【2026年最新】賃貸と購入どっちが得？50年シミュレーションで徹底比較</p>
                <p className="text-xs text-gray-500 mt-1">詳しい解説・計算例・注意点はこちら →</p>
              </div>
            </Link>
          </div>


          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-xs text-yellow-800">
            <p>
              <strong>免責事項：</strong>
              本ツールの計算結果は参考情報であり、実際のコストや税額と異なる場合があります。
              住宅ローン控除の適用には所定の要件があります。最終的な判断はファイナンシャルプランナーや税理士にご相談の上、ご自身でお決めください。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
