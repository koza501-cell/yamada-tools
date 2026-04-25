"use client";

import { useState, useCallback } from "react";
import BulkUploadZone from "./BulkUploadZone";
import ColumnMappingUI from "./ColumnMappingUI";
import BulkPreviewCarousel from "./BulkPreviewCarousel";
import { ColumnMap } from "@/lib/envelope/csvParser";
import { AddressRow, ValidationResult } from "@/lib/envelope/validation";
import { generateBulkPdf, EnvelopeSpec } from "@/lib/envelope/pdfExport";

interface BulkModePanelProps {
  envelopeSize: EnvelopeSpec;
  sender: { postalCode: string; address: string; companyName: string; name: string };
  onAddressSelect: (address: AddressRow) => void;
  userPlan: string;
  onValidate?: (rowCount: number) => Promise<boolean>;
}

export default function BulkModePanel({ envelopeSize, sender, onAddressSelect, userPlan, onValidate }: BulkModePanelProps) {
  const [rows, setRows] = useState<AddressRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMap, setColumnMap] = useState<ColumnMap | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<"idle" | "loaded" | "exporting">("idle");
  const [message, setMessage] = useState("");

  const handleDataLoaded = useCallback(async (data: {
    rows: AddressRow[];
    headers: string[];
    columnMap: ColumnMap | null;
    validationResults: ValidationResult[];
    fileName: string;
  }) => {
    if (onValidate && !(await onValidate(data.rows.length))) return;

    setRows(data.rows);
    setHeaders(data.headers);
    setColumnMap(data.columnMap);
    setValidationResults(data.validationResults);
    setSelectedIndices(data.rows.map((_, i) => i));
    setFileName(data.fileName);
    setStatus("loaded");

    const errorCount = data.validationResults.filter((r) => !r.valid).length;
    setMessage(`${data.rows.length}件読み込み完了${errorCount > 0 ? `（${errorCount}件エラーあり）` : ""}`);

    if (data.rows[0]) onAddressSelect(data.rows[0]);
  }, [onValidate, onAddressSelect]);

  const handleMapChange = useCallback((map: ColumnMap) => {
    setColumnMap(map);
    // Re-parse CSV if needed
  }, []);

  const handleExportPdf = useCallback(async () => {
    if (selectedIndices.length === 0) return;
    setStatus("exporting");

    try {
      const pdfBytes = await generateBulkPdf({
        envelopes: [envelopeSize],
        rows,
        sender,
        duplexBackFlap: false,
        selectedIndices,
      });

      const blob = new Blob([pdfBytes.buffer instanceof ArrayBuffer ? pdfBytes.buffer : new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `封筒印刷_${rows.length}件_${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setStatus("loaded");
      setMessage("PDFをダウンロードしました");
    } catch (e) {
      setStatus("loaded");
      setMessage("PDF生成に失敗しました");
    }
  }, [selectedIndices, rows, sender, envelopeSize]);

  const handleExportZip = useCallback(async () => {
    setMessage("ZIP出力は準備中です（個別PDFで代用してください）");
  }, []);

  const handleError = useCallback((message: string) => {
    setMessage(message);
  }, []);

  // Preview current address
  const goToRow = useCallback((index: number) => {
    if (rows[index]) onAddressSelect(rows[index]);
  }, [rows, onAddressSelect]);

  return (
    <div className="space-y-4">
      {/* Status message */}
      {message && (
        <div className={`text-sm px-4 py-2 rounded-lg ${
          message.includes("エラー") ? "bg-red-50 text-red-700 border border-red-200"
          : message.includes("制限") ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {message}
        </div>
      )}

      {/* Upload zone */}
      {status === "idle" && (
        <BulkUploadZone onDataLoaded={handleDataLoaded} onError={handleError} />
      )}

      {/* Column mapping */}
      {status === "loaded" && headers.length > 0 && columnMap && (
        <ColumnMappingUI
          headers={headers}
          columnMap={columnMap}
          onMapChange={handleMapChange}
        />
      )}



      {/* Preview carousel */}
      {status === "loaded" && rows.length > 0 && (
        <BulkPreviewCarousel
          rows={rows}
          validationResults={validationResults}
          selectedIndices={selectedIndices}
          onSelectionChange={setSelectedIndices}
          onExportPdf={handleExportPdf}
          onExportZip={handleExportZip}
        />
      )}

      {/* Reload button */}
      {status === "loaded" && (
        <button
          onClick={() => {
            setStatus("idle");
            setRows([]);
            setMessage("");
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          別のファイルを読み込む
        </button>
      )}
    </div>
  );
}
