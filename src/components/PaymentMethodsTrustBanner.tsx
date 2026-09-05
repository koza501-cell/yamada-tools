import { Store } from "lucide-react";

const FEE_FREE_METHODS = [
  "クレジットカード",
  "PayPay",
  "銀行振込",
  "Merpay",
  "LINE Pay",
  "Rakuten Pay",
  "au PAY",
  "Pay Easy",
];

export default function PaymentMethodsTrustBanner() {
  return (
    <div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-sm bg-gray-50 dark:bg-gray-800">
        <div className="p-3">
          <div className="flex flex-wrap gap-1.5">
            {FEE_FREE_METHODS.map((m) => (
              <span
                key={m}
                className="inline-flex items-center text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/40 dark:text-green-400 px-2.5 py-1 rounded-full"
              >
                {m}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center text-xs font-bold text-green-700 dark:text-green-400 mt-2">
            手数料無料
          </span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-1.5">
            <Store size={14} className="text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-300">コンビニ払い</span>
          </div>
          <span className="text-xs font-medium text-gray-400">手数料220円</span>
        </div>
      </div>
      <p className="text-xs text-center text-gray-400 mt-2">
        ※コンビニ払いのみ、決済手数料220円（税込）がかかります。その他のお支払い方法は手数料無料です。
      </p>
    </div>
  );
}
