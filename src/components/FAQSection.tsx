import { LazyFAQ } from "./common/LazyFAQ";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection({
  faq,
  title = "よくある質問",
}: {
  faq: FAQItem[];
  title?: string;
}) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-100 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {title}
      </h2>
      <LazyFAQ faq={faq} />
    </section>
  );
}
