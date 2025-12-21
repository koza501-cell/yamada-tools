"use client";

interface FinancialDisclaimerProps {
  type?: "tax" | "salary" | "invoice";
}

export default function FinancialDisclaimer({ type = "tax" }: FinancialDisclaimerProps) {
  const messages = {
    tax: "本ツールの計算結果は参考情報です。正確な税額は税理士または税務署にご確認ください。",
    salary: "本ツールの計算結果は概算です。実際の手取り額は勤務先の給与明細をご確認ください。社会保険料や税金は地域・条件により異なります。",
    invoice: "本ツールの検証結果は参考情報です。正式な登録確認は国税庁の公式サイトをご利用ください。"
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mx-4 mt-4 rounded-r-lg">
      <div className="flex items-start">
        <span className="text-blue-500 text-xl mr-3">ℹ️</span>
        <div>
          <h3 className="font-bold text-blue-800 mb-1">ご利用上の注意</h3>
          <p className="text-blue-700 text-sm">
            {messages[type]}
            計算結果に基づく判断は自己責任でお願いいたします。
          </p>
        </div>
      </div>
    </div>
  );
}
