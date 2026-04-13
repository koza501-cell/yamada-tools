export function IntroSection({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <section className="max-w-4xl mx-auto px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h1>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm"
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
