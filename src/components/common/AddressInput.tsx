"use client";
import { useState, useRef } from "react";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  placeholder?: string;
  buttonLabel?: string;
  buttonIcon?: string;
}

export default function AddressInput({
  value, onChange, onSearch, loading,
  placeholder = "例: 東京都千代田区丸の内1-1-1",
  buttonLabel = "調べる",
  buttonIcon = "🔍",
}: AddressInputProps) {
  const [zipcode, setZipcode] = useState("");
  const [zipLoading, setZipLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleZipLookup = async (zip: string) => {
    const digits = zip.replace(/[^0-9]/g, "");
    if (digits.length !== 7) return;
    setZipLoading(true);
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${digits}`);
      const data = await res.json();
      if (data.results?.[0]) {
        const r = data.results[0];
        onChange(r.address1 + r.address2 + r.address3);
        inputRef.current?.focus();
      }
    } catch {}
    finally { setZipLoading(false); }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setZipcode(v);
    if (v.replace(/[^0-9]/g, "").length === 7) handleZipLookup(v);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <div className="relative flex-shrink-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">〒</span>
          <input type="text"
            className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-36 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="1234567" value={zipcode} onChange={handleZipChange} maxLength={8} />
          {zipLoading && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-500">検索中...</span>}
        </div>
        <span className="text-xs text-gray-400">郵便番号を入力すると住所が自動補完されます</span>
      </div>
      <div className="flex gap-2">
        <input ref={inputRef} type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()} />
        <button type="button" onClick={onSearch} disabled={loading || !value.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold px-4 py-3 rounded-lg transition-colors whitespace-nowrap">
          {loading ? "検索中..." : `${buttonIcon} ${buttonLabel}`}
        </button>
      </div>
    </div>
  );
}
