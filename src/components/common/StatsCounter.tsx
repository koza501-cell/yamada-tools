"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: 133, suffix: "", label: "ツール数" },
  { value: 100, suffix: "万+", label: "月間処理件数" },
  { value: 99.9, suffix: "%", label: "サーバー稼働率" },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(target);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const newCount = parseFloat((target * eased).toFixed(target % 1 === 0 ? 0 : 1));
      // Skip first zero-frame to avoid "0+" flash — preserve initial target value
      if (newCount > 0 || progress >= 1) {
        setCount(newCount);
      }
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

function StatCard({ item, active }: { item: StatItem; active: boolean }) {
  const count = useCountUp(item.value, 2000, active);
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold text-kon dark:text-gray-300">
        {item.value % 1 === 0 ? Math.round(count) : count.toFixed(1)}{item.suffix}
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.label}</span>
    </div>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-center gap-0">
          {STATS.map((stat, i) => (
            <div key={i} className="flex items-center">
              <StatCard item={stat} active={triggered} />
              {i < STATS.length - 1 && (
                <div className="h-10 w-px bg-gray-200 dark:bg-gray-700 mx-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
