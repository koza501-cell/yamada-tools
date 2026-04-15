"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

const STAMP_TAX_INFO = [
  { min: 0, max: 50000, tax: 0, label: "非課税" },
  { min: 50001, max: 1000000, tax: 200, label: "200円" },
  { min: 1000001, max: 2000000, tax: 400, label: "400円" },
  { min: 2000001, max: 3000000, tax: 600, label: "600円" },
  { min: 3000001, max: 5000000, tax: 1000, label: "1,000円" },
  { min: 5000001, max: 10000000, tax: 2000, label: "2,000円" },
  { min: 10000001, max: Infinity, tax: 0, label: "要確認" },
];

export default function ReceiptClient() {
  const { triggerSuccess } = usePricingContext();


  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("領収書を作成しよう！");

  const [receiptNumber, setReceiptNumber] = useState("RCP-001");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState<number>(0);
  const [taxIncluded, setTaxIncluded] = useState(true);
  const [taxRate, setTaxRate] = useState(10);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("現金");

  const [receiverName, setReceiverName] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverTel, setReceiverTel] = useState("");

  const [payerName, setPayerName] = useState("");
  const [showStamp, setShowStamp] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStampTax = (amt: number) => {
    const info = STAMP_TAX_INFO.find(s => amt >= s.min && amt <= s.max);
    return info || STAMP_TAX_INFO[0];
  };

  const stampTax = getStampTax(amount);

  const handlePrint = () => {
    if (!receiverName || !payerName || amount <= 0) {
      setMascotState("error");
      setMascotMessage("必須項目を入力してね！");
      return;
    }
    setMascotState("success")
      triggerSuccess('receipt');;
    setMascotMessage("印刷画面を開くよ！");
    window.print();
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 print:py-0 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 print:max-w-none print:px-0">


        <header className="text-center mb-8 print:hidden">
          <div className="text-5xl mb-4">🧾</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">領収書作成</h1>
          <p className="text-gray-600">印紙税の案内付き・登録不要</p>
        </header>

        <div className="print:hidden mb-6 flex justify-center">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 print:hidden">
          <h2 className="font-bold text-gray-900 mb-4">基本情報</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">領収書番号</label>
              <input type="text" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">発行日</label>
              <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">支払方法</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="現金">現金</option>
                <option value="銀行振込">銀行振込</option>
                <option value="クレジットカード">クレジットカード</option>
                <option value="小切手">小切手</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">発行者（自社）</h3>
              <div className="space-y-3">
                <input type="text" placeholder="会社名・氏名 *" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="住所" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="電話番号" value={receiverTel} onChange={(e) => setReceiverTel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">宛先</h3>
              <div className="space-y-3">
                <input type="text" placeholder="会社名・氏名 *" value={payerName} onChange={(e) => setPayerName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 mb-3">金額</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">金額（円）*</label>
              <input type="number" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right text-lg" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">税区分</label>
              <select value={taxIncluded ? "included" : "excluded"} onChange={(e) => setTaxIncluded(e.target.value === "included")} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="included">税込</option>
                <option value="excluded">税抜</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">消費税率</label>
              <select value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value={10}>10%</option>
                <option value={8}>8%（軽減税率）</option>
                <option value={0}>非課税</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">但し書き</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="品代として" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="showStamp" checked={showStamp} onChange={(e) => setShowStamp(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="showStamp" className="text-sm text-gray-700">印鑑欄を表示</label>
          </div>

          {/* Stamp Tax Warning */}
          {amount > 50000 && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 font-medium">⚠️ 収入印紙が必要です</p>
              <p className="text-amber-700 text-sm mt-1">
                金額 {amount.toLocaleString()}円 → 印紙税: <strong>{stampTax.label}</strong>
              </p>
              <p className="text-amber-600 text-xs mt-1">※ 電子発行の場合は印紙税不要です</p>
            </div>
          )}
        </div>

        {/* Preview / Print Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 print:shadow-none print:border-0 print:rounded-none">
          <div className="border-2 border-gray-800 p-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold tracking-widest">領 収 書</h2>
            </div>

            <div className="flex justify-between mb-6">
              <div>
                <p className="text-xl font-bold border-b-2 border-gray-800 pb-1 inline-block">
                  {payerName || "宛名"} 様
                </p>
              </div>
              <div className="text-right text-sm">
                <p>No. {receiptNumber}</p>
                <p>{issueDate}</p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 mb-6 text-center">
              <p className="text-sm text-gray-600 mb-1">金額</p>
              <p className="text-4xl font-bold">¥{amount.toLocaleString()}-</p>
              <p className="text-sm text-gray-600 mt-1">
                {taxIncluded ? `（税込・消費税${taxRate}%）` : `（税抜・消費税${taxRate}%別途）`}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">但し</p>
              <p className="border-b border-gray-400 py-2">{description || "品代として"}</p>
            </div>

            <div className="mb-6 text-sm">
              <p>上記正に領収いたしました。</p>
              <p className="mt-2">支払方法: {paymentMethod}</p>
            </div>

            <div className="flex justify-between items-end">
              <div className="text-sm">
                <p className="font-bold">{receiverName || "発行者名"}</p>
                {receiverAddress && <p>{receiverAddress}</p>}
                {receiverTel && <p>TEL: {receiverTel}</p>}
              </div>
              {showStamp && (
                <div className="w-24 h-24 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-sm">
                  印
                </div>
              )}
            </div>

            {amount > 50000 && (
              <div className="mt-4 pt-4 border-t border-dashed text-xs text-gray-500">
                ※ 収入印紙貼付欄（{stampTax.label}）
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 print:hidden">
          <button onClick={handlePrint} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg">
            印刷 / PDF保存
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">※ 印刷画面でPDFとして保存できます</p>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200 print:hidden">
          <h2 className="text-xl font-bold mb-4 text-gray-900">よくある質問</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold text-blue-600">Q: 印紙税はいつ必要？</h3>
              <p className="text-gray-600">5万円以上の領収書には収入印紙が必要です。ただし、電子発行（PDF）の場合は不要です。</p>
            </div>
            <div>
              <h3 className="font-bold text-blue-600">Q: クレジットカード払いの場合は？</h3>
              <p className="text-gray-600">クレジットカード払いと明記すれば、印紙税は不要です。</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center print:hidden">
          <Link href="/document" className="text-blue-600 hover:text-blue-800">← 書類作成一覧に戻る</Link>
        </div>
        <AdUnit position="mid" format="horizontal" />
      </div>
    </div>
  );
}
