import Image from "next/image";

interface Badge {
  name: string;
  src: string;
  // width/height are the actual rendered pixel size (not the source file's
  // native size) — this repo's globals.css forces img[width][height] to
  // "height: auto" + aspect-ratio from those attributes, which beats
  // Tailwind height utilities, so intrinsic file dimensions must be
  // pre-scaled here rather than resized via className.
  width: number;
  height: number;
  comingSoon?: boolean;
}

const BADGES: Badge[] = [
  { name: "Visa", src: "/images/payments/visa.svg", width: 73, height: 24 },
  { name: "Mastercard", src: "/images/payments/mastercard.svg", width: 38, height: 24 },
  { name: "PayPay", src: "/images/payments/paypay.png", width: 24, height: 24 },
  { name: "Merpay", src: "/images/payments/merpay.svg", width: 15, height: 24 },
  { name: "銀行振込", src: "/images/payments/bank-transfer.svg", width: 23, height: 24 },
  { name: "Pay-easy", src: "/images/payments/pay-easy.png", width: 33, height: 24 },
  { name: "Rakuten Pay", src: "/images/payments/rakuten-pay.svg", width: 43, height: 16, comingSoon: true },
];

export default function PaymentMethodsHomeSection() {
  return (
    <section className="py-section bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-h2 font-bold text-gray-900 dark:text-white mb-2">
          新しいお支払い方法が使えるようになりました
        </h2>
        <p className="text-lead text-neutral-600 dark:text-gray-400 mb-10">
          コンビニ払いも対応
        </p>

        {/* Konbini — highlighted anchor card */}
        <div className="rounded-card border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-6 text-left">
          <div className="shrink-0 w-20 h-20 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <Image
              src="/images/payments/familymart.svg"
              alt="コンビニ払い対応"
              width={44}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
              コンビニ払い
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              全国のコンビニでレジ払いOK。現金で安心、初めての方にも人気です。
            </p>
          </div>
        </div>

        {/* Other methods — small badge row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {BADGES.map((b) => (
            <div
              key={b.name}
              className="relative flex items-center gap-2 rounded-pill border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 h-11"
            >
              <div className={b.comingSoon ? "bg-white rounded px-1 py-0.5 opacity-60 grayscale" : ""}>
                <Image
                  src={b.src}
                  alt={b.name}
                  width={b.width}
                  height={b.height}
                  className="object-contain"
                />
              </div>
              {b.comingSoon && (
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  近日対応予定
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
