"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileSpreadsheet, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { ColumnMap, autoDetectColumns, parseCSVWithMap, parseExcelToRows, generateSampleCSV } from "@/lib/envelope/csvParser";
import { AddressRow, validateBatch, ValidationResult } from "@/lib/envelope/validation";

interface BulkUploadZoneProps {
  onDataLoaded: (data: {
    rows: AddressRow[];
    headers: string[];
    columnMap: ColumnMap | null;
    validationResults: ValidationResult[];
    fileName: string;
  }) => void;
  onError: (message: string) => void;
}

export default function BulkUploadZone({ onDataLoaded, onError }: BulkUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const processCSV = useCallback((text: string, fileName: string) => {
    setProcessing(true);
    try {
      const lines = text.trim().split("\n").filter((l) => l.trim());
      if (lines.length < 2) {
        onError("データが不足しています。ヘッダー行と最低1行のデータが必要です。");
        return;
      }

      const headerRow = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      const detectedMap = autoDetectColumns(headerRow);
      const hasHeader = detectedMap !== null;

      const map = detectedMap ?? {
        postalCode: 0, prefecture: 1, city: 2, address1: 3,
        address2: 4, building: 5, companyName: 6, department: 7, name: 8, honorific: 9,
      };

      const rows = parseCSVWithMap(text, map, hasHeader);
      if (rows.length === 0) {
        onError("有効なデータが見つかりませんでした。氏名または会社名が必要です。");
        return;
      }

      const validationResults = validateBatch(rows);
      const totalErrors = validationResults.filter((r) => !r.valid).length;

      onDataLoaded({
        rows,
        headers: hasHeader ? headerRow : [],
        columnMap: map,
        validationResults,
        fileName,
      });
    } catch (e) {
      onError("CSVの解析に失敗しました。ファイル形式を確認してください。");
    } finally {
      setProcessing(false);
    }
  }, [onDataLoaded, onError]);

  const processExcel = useCallback(async (file: File) => {
    setProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const result = parseExcelToRows(buffer);

      if (result.rows.length === 0) {
        onError("有効なデータが見つかりませんでした。");
        return;
      }

      const validationResults = validateBatch(result.rows);

      onDataLoaded({
        rows: result.rows,
        headers: result.headers,
        columnMap: result.detectedMap,
        validationResults,
        fileName: file.name,
      });
    } catch (e) {
      onError("Excelファイルの読み込みに失敗しました。");
    } finally {
      setProcessing(false);
    }
  }, [onDataLoaded, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (ev) => processCSV(ev.target?.result as string || "", file.name);
      reader.readAsText(file, "UTF-8");
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      processExcel(file);
    } else {
      onError("対応形式: .csv, .xlsx, .xls");
    }
  }, [processCSV, processExcel, onError]);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer
          ${dragOver ? "border-kon bg-gray-50 scale-[1.01]" : "border-gray-300 hover:border-gray-400 bg-gray-50"}`}
        onClick={() => csvInputRef.current?.click()}
      >
        {processing ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-kon" />
            <p className="text-sm text-gray-600">ファイルを処理中...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              ファイルをドラッグ＆ドロップ、またはクリックして選択
            </p>
            <p className="text-xs text-gray-400 mt-1">
              対応形式: CSV / Excel (.xlsx, .xls)
            </p>
          </>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => processCSV(ev.target?.result as string || "", file.name);
          reader.readAsText(file, "UTF-8");
          e.target.value = "";
        }}
      />
      <input
        ref={excelInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          processExcel(file);
          e.target.value = "";
        }}
      />

      {/* Quick action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={(e) => { e.stopPropagation(); csvInputRef.current?.click(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
        >
          <FileText className="w-3.5 h-3.5" />
          CSVを選択
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); excelInputRef.current?.click(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Excelをアップロード
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); downloadSampleCSV(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
        >
          📥 サンプルCSV
        </button>
      </div>

      {/* CSV textarea alternative */}
      <div>
        <p className="text-xs text-gray-500 mb-1">または、CSVデータを直接貼り付け:</p>
        <textarea
          id="bulk-csv-textarea"
          rows={4}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono"
          placeholder={"郵便番号,都道府県,市区町村,住所,会社名,氏名,敬称\n1000001,東京都,千代田区,千代田1-1,株式会社サンプル,山田太郎,様"}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (text.includes("郵便番号") || text.includes("postal")) {
              setTimeout(() => {
                const el = document.getElementById("bulk-csv-textarea") as HTMLTextAreaElement;
                if (el && el.value.trim()) {
                  processCSV(el.value, "貼り付けデータ");
                }
              }, 100);
            }
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <AlertCircle className="w-3 h-3" />
        <span>データはブラウザ内でのみ処理され、サーバーに送信されることはありません</span>
      </div>
    </div>
  );
}

function downloadSampleCSV() {
  const csv = generateSampleCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "envelope_sample.csv";
  a.click();
  URL.revokeObjectURL(url);
}
