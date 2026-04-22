"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, XCircle, Download } from "lucide-react";
import { AddressRow, ValidationResult } from "@/lib/envelope/validation";

interface BulkPreviewCarouselProps {
  rows: AddressRow[];
  validationResults: ValidationResult[];
  selectedIndices: number[];
  onSelectionChange: (indices: number[]) => void;
  onExportPdf: () => void;
  onExportZip: () => void;
}

export default function BulkPreviewCarousel({
  rows,
  validationResults,
  selectedIndices,
  onSelectionChange,
  onExportPdf,
  onExportZip,
}: BulkPreviewCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const totalPages = rows.length;

  const toggleRow = (index: number) => {
    if (selectedIndices.includes(index)) {
      onSelectionChange(selectedIndices.filter((i) => i !== index));
    } else {
      onSelectionChange([...selectedIndices, index]);
    }
  };

  const selectAll = () => {
    onSelectionChange(rows.map((_, i) => i));
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  const currentRow = rows[currentPage];
  const currentValidation = validationResults[currentPage];
  const isValid = currentValidation?.valid ?? true;

  const totalValid = validationResults.filter((r) => r.valid).length;
  const totalErrors = validationResults.filter((r) => !r.valid).length;
  const totalWarnings = validationResults.reduce((s, r) => s + r.warnings.length, 0);
  const selectedCount = selectedIndices.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Summary bar */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium text-gray-700">全{totalPages}件</span>
          <span className="text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {totalValid}件OK
          </span>
          {totalErrors > 0 && (
            <span className="text-red-600 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {totalErrors}件エラー
            </span>
          )}
          {totalWarnings > 0 && (
            <span className="text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {totalWarnings}件警告
            </span>
          )}
          <span className="text-blue-600 font-medium">{selectedCount}件選択中</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={selectAll}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            全選択
          </button>
          <button
            onClick={deselectAll}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            解除
          </button>
        </div>
      </div>

      {/* View mode toggle */}
      <div className="px-4 py-2 border-b border-gray-100 flex gap-2">
        <button
          onClick={() => setViewMode("carousel")}
          className={`text-xs px-3 py-1 rounded-full ${viewMode === "carousel" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-500 hover:bg-gray-100"}`}
        >
          カルーセル
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`text-xs px-3 py-1 rounded-full ${viewMode === "grid" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-500 hover:bg-gray-100"}`}
        >
          サムネイル一覧
        </button>
      </div>

      {viewMode === "carousel" && currentRow && (
        <div className="p-4">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> 前へ
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {currentPage + 1} / {totalPages}
              </span>
              {/* Jump to page */}
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage + 1}
                onChange={(e) => {
                  const p = Math.max(1, Math.min(totalPages, Number(e.target.value) || 1));
                  setCurrentPage(p - 1);
                }}
                className="w-16 text-xs bg-gray-50 border border-gray-300 rounded px-2 py-1 text-center"
              />
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40"
            >
              次へ <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Row content card */}
          <div className={`rounded-xl border-2 p-4 ${isValid ? "border-gray-200" : "border-red-300 bg-red-50"}`}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-bold text-gray-500">行 {currentPage + 1}</span>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIndices.includes(currentPage)}
                  onChange={() => toggleRow(currentPage)}
                  className="w-4 h-4 rounded"
                />
                印刷対象
              </label>
            </div>

            <div className="space-y-1 text-sm">
              <p className="font-bold text-gray-800">
                {currentRow.companyName && <>{currentRow.companyName} </>}
                {currentRow.name && <>{currentRow.name} {currentRow.honorific}</>}
              </p>
              {currentRow.department && <p className="text-xs text-gray-500">{currentRow.department}</p>}
              {currentRow.postalCode && <p className="text-xs text-gray-600">〒{currentRow.postalCode}</p>}
              <p className="text-xs text-gray-600">
                {currentRow.prefecture}{currentRow.city}{currentRow.address1}{currentRow.address2}
              </p>
              {currentRow.building && <p className="text-xs text-gray-500">{currentRow.building}</p>}
            </div>

            {/* Validation errors */}
            {currentValidation && !currentValidation.valid && (
              <div className="mt-3 space-y-1">
                {currentValidation.errors.map((err, i) => (
                  <p key={i} className="text-xs text-red-600 flex items-start gap-1">
                    <XCircle className="w-3 h-3 mt-0.5 shrink-0" /> {err.message}
                  </p>
                ))}
              </div>
            )}
            {currentValidation && currentValidation.warnings.length > 0 && (
              <div className="mt-2 space-y-1">
                {currentValidation.warnings.map((w, i) => (
                  <p key={i} className="text-xs text-amber-600 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /> {w.message}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="mt-4 flex gap-1 overflow-x-auto pb-1">
            {rows.map((_, i) => {
              const v = validationResults[i];
              const isSelected = selectedIndices.includes(i);
              const isCurrent = i === currentPage;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-6 h-6 rounded text-[10px] font-medium flex items-center justify-center shrink-0 transition-all
                    ${isCurrent ? "ring-2 ring-blue-400 scale-110" : ""}
                    ${!v?.valid ? "bg-red-100 text-red-700" : isSelected ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}
                    ${!isSelected && v?.valid ? "opacity-50" : ""}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "grid" && (
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {rows.map((row, i) => {
              const v = validationResults[i];
              const isSelected = selectedIndices.includes(i);
              return (
                <div
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`p-2 rounded-lg border text-xs cursor-pointer transition-all
                    ${isSelected ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                    ${!v?.valid ? "border-red-200 bg-red-50" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-500">#{i + 1}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(i)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-3 h-3"
                    />
                  </div>
                  <p className="truncate font-medium text-gray-800">
                    {row.name || row.companyName || "(氏名なし)"}
                  </p>
                  {!v?.valid && <XCircle className="w-3 h-3 text-red-500 mt-1" />}
                  {v?.valid && v.warnings.length > 0 && <AlertCircle className="w-3 h-3 text-amber-500 mt-1" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Export buttons */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button
          onClick={onExportPdf}
          disabled={selectedCount === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> PDF一括出力 ({selectedCount}件)
        </button>
        <button
          onClick={onExportZip}
          disabled={selectedCount === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> ZIP出力
        </button>
      </div>
    </div>
  );
}
