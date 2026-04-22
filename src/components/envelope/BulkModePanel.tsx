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
}

export default function BulkModePanel({ envelopeSize, sender, onAddressSelect, userPlan }: BulkModePanelProps) {
  const [rows, setRows] = useState<AddressRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMap, setColumnMap] = useState<ColumnMap | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState<"idle" | "loaded" | "exporting">("idle");
  const [message, setMessage] = useState("");

  const getPlanLimit = useCallback((): number => {
    switch (userPlan) {
      case "enterprise": return 9999;
      case "team": return 500;
      case "pro": return 50;
      default: return 5;
    }
  }, [userPlan]);

  const handleDataLoaded = useCallback((data: {
    rows: AddressRow[];
    headers: string[];
    columnMap: ColumnMap | null;
    validationResults: ValidationResult[];
    fileName: string;
  }) => {
    const limit = getPlanLimit();
    const slicedRows = data.rows.slice(0, limit);
    const slicedValidation = data.validationResults.slice(0, limit);

    setRows(slicedRows);
    setHeaders(data.headers);
    setColumnMap(data.columnMap);
    setValidationResults(slicedValidation);
    setSelectedIndices(slicedRows.map((_, i) => i));
    setFileName(data.fileName);
    setStatus("loaded");

    if (data.rows.length > limit) {
      setMessage(`制限: ${limit}件まで処理します（${data.rows.length}件中${limit}件を読み込み）`);
    } else {
      const errorCount = slicedValidation.filter((r) => !r.valid).length;
      setMessage(`${slicedRows.length}件読み込み完了${errorCount > 0 ? `（${errorCount}件エラーあり）` : ""}`);
    }

    // Select first valid address
    const firstValid = slicedRows[0];
    if (firstValid) onAddressSelect(firstValid);
  }, [getPlanLimit, onAddressSelect]);

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

      {/* Row limit info */}
      {status === "loaded" && rows.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-xs text-blue-700 flex items-center gap-2">
          <span className="font-medium">プラン制限:</span>
          {userPlan === "free" && "無料: 5件 / PRO: 50件 / TEAM: 500件"}
          {userPlan === "pro" && "50件 / TEAM: 500件"}
          {userPlan === "team" && "500件"}
          {userPlan === "enterprise" && "無制限"}
        </div>
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
