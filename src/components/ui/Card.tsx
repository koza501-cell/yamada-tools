import { type HTMLAttributes } from 'react';

export type CardVariant = 'default' | 'featured';

const variantCls: Record<CardVariant, string> = {
  default:  'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  featured: 'bg-primary-100 dark:bg-primary-900/20 border border-primary-700/20 dark:border-primary-700/30',
};

const BASE = 'rounded-card shadow-sm transition-all duration-200';

export function cardCls(variant: CardVariant = 'default'): string {
  return `${BASE} hover:shadow-md hover:-translate-y-0.5 ${variantCls[variant]}`;
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  noHover?: boolean;
}

export default function Card({ variant = 'default', noHover = false, className = '', children, ...props }: CardProps) {
  const hoverCls = noHover ? '' : 'hover:shadow-md hover:-translate-y-0.5';
  return (
    <div className={`${BASE} ${hoverCls} ${variantCls[variant]} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
