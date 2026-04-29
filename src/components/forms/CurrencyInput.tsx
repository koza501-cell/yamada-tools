"use client";
import { useState, forwardRef, type InputHTMLAttributes } from "react";

const FORMAT = new Intl.NumberFormat("ja-JP");

export interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number | "";
  onChange: (value: number | "") => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput({ value, onChange, className = "", onFocus, onBlur, ...rest }, ref) {
    const [focused, setFocused] = useState(false);

    const displayValue = focused
      ? value === "" ? "" : String(value)
      : value === "" ? "" : `${FORMAT.format(Number(value))} 円`;

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      setFocused(true);
      onFocus?.(e);
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      setFocused(false);
      onBlur?.(e);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value.replace(/[^\d]/g, "");
      if (raw === "") {
        onChange("");
        return;
      }
      const n = parseInt(raw, 10);
      onChange(isNaN(n) ? "" : n);
    }

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-right ${className}`}
        {...rest}
      />
    );
  }
);
