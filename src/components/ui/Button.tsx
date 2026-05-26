import { type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantCls: Record<ButtonVariant, string> = {
  primary:   'bg-primary-900 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-900',
  secondary: 'border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white dark:border-primary-700 dark:text-primary-100 dark:hover:bg-primary-700',
  ghost:     'text-primary-900 hover:bg-primary-100 dark:text-primary-100 dark:hover:bg-gray-800',
};

const sizeCls: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

const BASE = 'inline-flex items-center justify-center gap-2 font-semibold rounded-btn transition-colors duration-200';

export function buttonCls(variant: ButtonVariant = 'primary', size: ButtonSize = 'md'): string {
  return `${BASE} ${variantCls[variant]} ${sizeCls[size]}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`${buttonCls(variant, size)} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
