"use client";

import { ColumnMap } from "@/lib/envelope/csvParser";

interface ColumnMappingUIProps {
  headers: string[];
  columnMap: ColumnMap | null;
  onMapChange: (map: ColumnMap) => void;
}

const FIELDS: { key: keyof ColumnMap; label: string; required: boolean }[] = [
  { key: "postalCode", label: "郵便番号", required: false },
  { key: "prefecture", label: "都道府県", required: false },
  { key: "city", label: "市区町村", required: false },
  { key: "address1", label: "住所", required: false },
  { key: "address2", label: "住所2", required: false },
  { key: "building", label: "建物", required: false },
  { key: "companyName", label: "会社名", required: false },
  { key: "department", label: "部署", required: false },
  { key: "name", label: "氏名", required: true },
  { key: "honorific", label: "敬称", required: false },
];

export default function ColumnMappingUI({ headers, columnMap, onMapChange }: ColumnMappingUIProps) {
  const allHeaders = ["（未割り当て）", ...headers];

  const handleChange = (field: keyof ColumnMap, value: number) => {
    if (!columnMap) return;
    onMapChange({ ...columnMap, [field]: value - 1 });
  };

  const currentValue = (idx: number | undefined) => {
    if (idx === undefined || idx < 0) return 0;
    return idx + 1;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-gray-800 mb-3">列マッピング</h3>
      <p className="text-xs text-gray-500 mb-3">
        各フィールドに対応する列を選択してください。自動検出されましたが、必要に応じて修正できます。
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {FIELDS.map(({ key, label, required }) => (
          <div key={key} className="flex flex-col gap-0.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              {label}
              {required && <span className="text-danger">*</span>}
            </label>
            <select
              value={currentValue(columnMap?.[key])}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className={`text-xs bg-gray-50 border rounded px-2 py-1.5 w-full
                ${required && columnMap?.[key] === -1 ? "border-gray-200 bg-gray-50" : "border-gray-300"}`}
            >
              {allHeaders.map((h, i) => (
                <option key={i} value={i}>{i === 0 ? h : `${h} (列${i})`}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
