import { type HTMLAttributes } from 'react';

export type BadgeVariant = 'neutral' | 'new' | 'popular';

const variantCls: Record<BadgeVariant, string> = {
  neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  new:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  popular: 'bg-gradient-to-r from-slate-900 to-primary-900 text-white',
};

const BASE = 'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-pill';

export function badgeCls(variant: BadgeVariant = 'neutral'): string {
  return `${BASE} ${variantCls[variant]}`;
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export default function Badge({ variant = 'neutral', className = '', children, ...props }: BadgeProps) {
  return (
    <span className={`${BASE} ${variantCls[variant]} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
