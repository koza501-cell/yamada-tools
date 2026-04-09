export function CitationsSection({
  sources,
  title = "参考文献・出典",
}: {
  sources: { name: string; url: string; description: string }[];
  title?: string;
}) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8 border-t border-gray-100 dark:border-gray-800">
      <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
        {title}
      </h2>
      <ul className="space-y-2">
        {sources.map((s, i) => (
          <li key={i} className="text-sm">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {s.name}
            </a>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              — {s.description}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
