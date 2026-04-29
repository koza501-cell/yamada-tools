import Link from "next/link";
import Image from "next/image";
import customerLogos from "@/config/customer-logos";

const MAX_VISIBLE = 18;

export default function CompanyLogosWall() {
  if (customerLogos.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">🏢</div>
        <p className="font-bold text-gray-700 mb-1">掲載企業募集中</p>
        <p className="text-sm text-gray-500 mb-4">
          ご利用企業のロゴ掲載にご協力いただける法人様を募集しています
        </p>
        <Link
          href="/about/contact"
          className="text-sm text-kon underline hover:text-ai"
        >
          お問い合わせはこちら
        </Link>
      </div>
    );
  }

  const visible = customerLogos.slice(0, MAX_VISIBLE);
  const hasMore = customerLogos.length > MAX_VISIBLE;

  const containerClass =
    customerLogos.length <= 5
      ? "flex flex-wrap justify-center gap-6"
      : "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6";

  return (
    <div>
      <div className={containerClass}>
        {visible.map((logo) => {
          const img = (
            <Image
              key={logo.name}
              src={logo.logoSrc}
              alt={logo.name}
              width={120}
              height={60}
              className="object-contain grayscale hover:grayscale-0 transition-all duration-200"
              loading="lazy"
            />
          );
          if (logo.href) {
            return (
              <a
                key={logo.name}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                {img}
              </a>
            );
          }
          return (
            <div key={logo.name} className="flex items-center justify-center">
              {img}
            </div>
          );
        })}
      </div>
      {hasMore && (
        <p className="text-center text-sm text-gray-500 mt-4">
          他 {customerLogos.length - MAX_VISIBLE} 社
        </p>
      )}
    </div>
  );
}
