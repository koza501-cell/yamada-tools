"use client";
import { useState } from "react";

interface FAQItem { question: string; answer: string; }

export function LazyFAQ({ faq }: { faq: FAQItem[] }) {
  const [opened, setOpened] = useState<Set<number>>(new Set());

  return (
    <div className="space-y-4">
      {faq.map((item, index) => (
        <details
          key={index}
          className="bg-gray-50 rounded-xl overflow-hidden group dark:bg-gray-700"
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) {
              setOpened((prev) => new Set([...prev, index]));
            }
          }}
        >
          <summary
            className="p-4 font-medium cursor-pointer hover:bg-gray-100 list-none flex items-center justify-between"
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
                const d = e.currentTarget.parentElement as HTMLDetailsElement;
                d.open = !d.open;
              }
            }}
          >
            <span className="flex items-center gap-2">
              <span className="text-kon">Q.</span>{item.question}
            </span>
            <span className="text-gray-400 group-open:rotate-180 transition-transform" aria-hidden="true">▼</span>
          </summary>
          {opened.has(index) && (
            <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600">
              <span className="text-kon font-medium">A.</span> {item.answer}
            </div>
          )}
        </details>
      ))}
    </div>
  );
}
