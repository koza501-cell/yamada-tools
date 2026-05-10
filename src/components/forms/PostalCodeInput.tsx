"use client";
import { useRef, useState, forwardRef, type InputHTMLAttributes } from "react";

const ZIPCLOUD_URL = "https://zipcloud.ibsnet.co.jp/api/search";
const SESSION_PREFIX = "zipcloud:";
const DEBOUNCE_MS = 300;

export interface PostalResult {
  prefecture: string;
  city: string;
  town: string;
}

export interface PostalCodeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onResolved?: (result: PostalResult) => void;
}

export const PostalCodeInput = forwardRef<HTMLInputElement, PostalCodeInputProps>(
  function PostalCodeInput(
    { value, onChange, onResolved, className = "", ...rest },
    ref
  ) {
    const [hint, setHint] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function lookup(code: string) {
      const clean = code.replace(/-/g, "");
      if (clean.length !== 7 || !/^\d{7}$/.test(clean)) return;

      const cacheKey = SESSION_PREFIX + clean;
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          onResolved?.(JSON.parse(cached) as PostalResult);
          setHint(null);
          return;
        }
      } catch { /* sessionStorage unavailable */ }

      try {
        const res = await fetch(`${ZIPCLOUD_URL}?zipcode=${clean}`);
        if (!res.ok) throw new Error("network");
        const data = (await res.json()) as {
          results?: { address1: string; address2: string; address3: string }[];
        };
        const r = data?.results?.[0];
        if (!r) throw new Error("not found");
        const result: PostalResult = {
          prefecture: r.address1 ?? "",
          city: r.address2 ?? "",
          town: r.address3 ?? "",
        };
        try { sessionStorage.setItem(cacheKey, JSON.stringify(result)); } catch { /* quota */ }
        onResolved?.(result);
        setHint(null);
      } catch {
        setHint("住所を取得できませんでした。手入力してください。");
      }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value.replace(/-/g, "");
      onChange(raw);
      setHint(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => lookup(raw), DEBOUNCE_MS);
    }

    function handleBlur() {
      if (timerRef.current) clearTimeout(timerRef.current);
      lookup(value);
    }

    return (
      <div>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          maxLength={8}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="1234567"
          className={`w-full px-3 py-2 border border-gray-200 rounded-lg ${className}`}
          {...rest}
        />
        {hint && (
          <p className="mt-1 text-xs text-kon" role="status">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
