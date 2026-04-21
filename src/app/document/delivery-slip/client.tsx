"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

interface DeliveryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  note: string;
}

export default function DeliverySlipClient() {
  const { triggerSuccess } = usePricingContext();


  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("納品書を作成しよう！");

  const [slipNumber, setSlipNumber] = useState("DLV-001");
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split("T")[0]);
  const [orderNumber, setOrderNumber] = useState("");

  const [sellerName, setSellerName] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [sellerTel, setSellerTel] = useState("");

  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");

  const [items, setItems] = useState<DeliveryItem[]>([
    { id: 1, name: "", quantity: 1, unit: "個", price: 0, note: "" },
  ]);

  const [taxRate, setTaxRate] = useState(10);
  const [notes, setNotes] = useState("");
  const [showPrice, setShowPrice] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", quantity: 1, unit: "個", price: 0, note: "" }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: keyof DeliveryItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = Math.floor(subtotal * taxRate / 100);
  const total = subtotal + tax;

  const handlePrint = () => {
    if (!sellerName || !buyerName || items.every(i => !i.name)) {
      setMascotState("error");
      setMascotMessage("必須項目を入力してね！");
      return;
    }
    setMascotState("success")
      triggerSuccess('delivery-slip');;
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
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">納品書作成</h1>
          <p className="text-gray-600">登録不要・無料で納品書を作成</p>
        </header>

        <div className="print:hidden mb-6 flex justify-center">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 print:hidden">
          <h2 className="font-bold text-gray-900 mb-4">基本情報</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">納品書番号</label>
              <input type="text" value={slipNumber} onChange={(e) => setSlipNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">納品日</label>
              <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">注文番号（任意）</label>
              <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="ORD-001" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">納品元（自社）</h3>
              <div className="space-y-3">
                <input type="text" placeholder="会社名・氏名 *" value={sellerName} onChange={(e) => setSellerName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="住所" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="電話番号" value={sellerTel} onChange={(e) => setSellerTel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">納品先</h3>
              <div className="space-y-3">
                <input type="text" placeholder="会社名・氏名 *" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="住所" value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 mb-3">納品明細</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left">品名</th>
                  <th className="px-2 py-2 w-20">数量</th>
                  <th className="px-2 py-2 w-16">単位</th>
                  {showPrice && <th className="px-2 py-2 w-24">単価</th>}
                  {showPrice && <th className="px-2 py-2 w-28">金額</th>}
                  <th className="px-2 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-2 py-2">
                      <input type="text" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded" placeholder="品名" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded text-center" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="text" value={item.unit} onChange={(e) => updateItem(item.id, "unit", e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-center" />
                    </td>
                    {showPrice && (
                      <td className="px-2 py-2">
                        <input type="number" value={item.price} onChange={(e) => updateItem(item.id, "price", Number(e.target.value))} className="w-full px-2 py-1 border border-gray-200 rounded text-right" />
                      </td>
                    )}
                    {showPrice && <td className="px-2 py-2 text-right font-medium">{(item.quantity * item.price).toLocaleString()}円</td>}
                    <td className="px-2 py-2">
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addItem} className="text-sm text-blue-600 hover:text-blue-800">+ 行を追加</button>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">金額を表示</span>
            </label>
            {showPrice && (
              <>
                <span className="text-sm">消費税率:</span>
                <select value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="px-3 py-1 border border-gray-300 rounded-lg">
                  <option value={10}>10%</option>
                  <option value={8}>8%（軽減税率）</option>
                </select>
              </>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="ご確認の上、受領印をお願いいたします" />
          </div>
        </div>

        {/* Preview / Print Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 print:shadow-none print:border-0 print:rounded-none">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">納 品 書</h2>
          </div>

          <div className="flex justify-between mb-6">
            <div>
              <p className="font-bold text-lg">{buyerName || "納品先名"} 御中</p>
              {buyerAddress && <p className="text-sm text-gray-600">{buyerAddress}</p>}
            </div>
            <div className="text-right text-sm">
              <p>納品書番号: {slipNumber}</p>
              <p>納品日: {deliveryDate}</p>
              {orderNumber && <p>注文番号: {orderNumber}</p>}
            </div>
          </div>

          <p className="mb-4 text-sm">下記の通り納品いたします。</p>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="py-2 text-left">品名</th>
                <th className="py-2 text-center w-20">数量</th>
                <th className="py-2 text-center w-16">単位</th>
                {showPrice && <th className="py-2 text-right w-24">単価</th>}
                {showPrice && <th className="py-2 text-right w-28">金額</th>}
              </tr>
            </thead>
            <tbody>
              {items.filter(i => i.name).map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-center">{item.unit}</td>
                  {showPrice && <td className="py-2 text-right">{item.price.toLocaleString()}</td>}
                  {showPrice && <td className="py-2 text-right">{(item.quantity * item.price).toLocaleString()}</td>}
                </tr>
              ))}
            </tbody>
          </table>

          {showPrice && (
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-1 border-b"><span>小計</span><span>{subtotal.toLocaleString()}円</span></div>
                <div className="flex justify-between py-1 border-b"><span>消費税（{taxRate}%）</span><span>{tax.toLocaleString()}円</span></div>
                <div className="flex justify-between py-2 font-bold text-lg"><span>合計</span><span>{total.toLocaleString()}円</span></div>
              </div>
            </div>
          )}

          {notes && (
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-1">備考</p>
              <p className="text-sm whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          <div className="mt-8 flex justify-between items-end">
            <div className="text-sm">
              <p className="font-bold">{sellerName || "納品元名"}</p>
              {sellerAddress && <p>{sellerAddress}</p>}
              {sellerTel && <p>TEL: {sellerTel}</p>}
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">受領印</p>
              <div className="w-20 h-20 border border-gray-400"></div>
            </div>
          </div>
        </div>

        <div className="mt-6 print:hidden">
          <button onClick={handlePrint} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg">
            印刷 / PDF保存
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">※ 印刷画面でPDFとして保存できます</p>
        </div>

        <div className="mt-8 text-center print:hidden">
          <Link href="/document" className="text-blue-600 hover:text-blue-800">← 書類作成一覧に戻る</Link>
        </div>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
