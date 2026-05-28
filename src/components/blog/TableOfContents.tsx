'use client';
import { useEffect, useState } from 'react';

export interface TocItem {
  depth: number;
  text: string;
  id: string;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (!items.length) return;
    const headingEls = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const onScroll = () => {
      const scrollY = window.scrollY;
      let current = items[0]?.id ?? '';
      for (const el of headingEls) {
        if (el.offsetTop - 120 <= scrollY) current = el.id;
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  return (
    <nav className="sticky top-24" aria-label="目次">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
          目次
        </p>
        <ol className="space-y-1.5 list-none">
          {items.map(item => (
            <li key={item.id} className={item.depth === 3 ? 'ml-3' : ''}>
              <a
                href={`#${item.id}`}
                className={`block text-xs leading-snug transition-colors duration-150 ${
                  activeId === item.id
                    ? 'text-kon dark:text-blue-400 font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
