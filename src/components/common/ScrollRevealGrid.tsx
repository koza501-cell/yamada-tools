"use client";
import { useEffect, useRef } from "react";
interface Props {
  children: React.ReactNode;
  className?: string;
}
export function ScrollRevealGrid({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const cards = Array.from(ref.current.children) as HTMLElement[];
    
    // Fallback: ensure all cards are visible after 2 seconds
    const fallbackTimer = setTimeout(() => {
      cards.forEach((card) => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      });
    }, 2000);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((card, i) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(16px)";
      card.style.transition = `opacity 0.5s ease ${i * 50}ms, transform 0.5s ease ${i * 50}ms`;
      observer.observe(card);
    });
    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
