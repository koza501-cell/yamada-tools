interface UseCase {
  icon: string;
  persona: string;
  title: string;
  benefit: string;
}

export function UseCasesSection({
  cases,
  heading = "こんな方に使われています",
}: {
  cases: UseCase[];
  heading?: string;
}) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-100 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {heading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cases.map((c, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
          >
            <div className="text-2xl mb-2">{c.icon}</div>
            <p className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">
              {c.persona}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {c.title}
            </p>
            <p className="text-xs text-kon dark:text-gray-300 font-medium">
              → {c.benefit}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
