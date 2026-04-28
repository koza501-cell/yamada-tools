"use client";
import type { ReactNode } from "react";

interface FormLabelProps {
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
}

export function FormLabel({ htmlFor, required, optional, children }: FormLabelProps) {
  if (process.env.NODE_ENV !== "production" && required && optional) {
    console.warn("FormLabel: 'required' and 'optional' cannot both be true. 'required' takes precedence.");
  }
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && (
        <span className="ml-1.5 inline-block text-[11px] font-medium text-white bg-red-500 px-1.5 py-0.5 rounded-[3px] leading-none align-middle">
          必須
        </span>
      )}
      {!required && optional && (
        <span className="ml-1.5 inline-block text-[11px] font-medium text-white bg-gray-400 px-1.5 py-0.5 rounded-[3px] leading-none align-middle">
          任意
        </span>
      )}
    </label>
  );
}
