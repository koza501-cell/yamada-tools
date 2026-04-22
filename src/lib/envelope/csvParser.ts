import * as XLSX from "xlsx";
import { AddressRow } from "./validation";

export interface ColumnMap {
  postalCode: number;
  prefecture: number;
  city: number;
  address1: number;
  address2: number;
  building: number;
  companyName: number;
  department: number;
  name: number;
  honorific: number;
}

export interface ColumnCandidate {
  field: keyof ColumnMap;
  header: string;
  index: number;
}

const JP_KEYS: Record<string, string> = {
  "郵便番号": "postalCode",
  "postal_code": "postalCode",
  "postalcode": "postalCode",
  "都道府県": "prefecture",
  "prefecture": "prefecture",
  "市区町村": "city",
  "city": "city",
  "住所": "address1",
  "住所1": "address1",
  "address": "address1",
  "address1": "address1",
  "住所2": "address2",
  "address2": "address2",
  "建物": "building",
  "building": "building",
  "建物名": "building",
  "会社名": "companyName",
  "company": "companyName",
  "company_name": "companyName",
  "部署": "department",
  "department": "department",
  "部署名": "department",
  "氏名": "name",
  "name": "name",
  "お名前": "name",
  "honorific": "honorific",
  "敬称": "honorific",
  "title": "honorific",
};

const DEFAULT_HEADERS: string[] = [
  "郵便番号", "都道府県", "市区町村", "住所", "住所2",
  "建物", "会社名", "部署", "氏名", "敬称",
];

export function autoDetectColumns(headers: string[]): ColumnMap | null {
  const normalized = headers.map((h) => String(h).trim());
  const map: Partial<ColumnMap> = {};

  normalized.forEach((h, i) => {
    const key = h.toLowerCase();
    if (JP_KEYS[key] && !(JP_KEYS[key] in map)) {
      (map as any)[JP_KEYS[key]] = i;
    } else if (JP_KEYS[h] && !(JP_KEYS[h] in map)) {
      (map as any)[JP_KEYS[h]] = i;
    }
  });

  if (Object.keys(map).length === 0) return null;

  return {
    postalCode: map.postalCode ?? -1,
    prefecture: map.prefecture ?? -1,
    city: map.city ?? -1,
    address1: map.address1 ?? -1,
    address2: map.address2 ?? -1,
    building: map.building ?? -1,
    companyName: map.companyName ?? -1,
    department: map.department ?? -1,
    name: map.name ?? -1,
    honorific: map.honorific ?? -1,
  };
}

export function getColumnCandidates(headers: string[]): ColumnCandidate[] {
  return headers.map((h, i) => ({
    field: "name" as keyof ColumnMap,
    header: String(h).trim(),
    index: i,
  }));
}

export function parseCSVWithMap(
  csv: string,
  map: ColumnMap,
  hasHeader: boolean
): AddressRow[] {
  const lines = csv.trim().split("\n").filter((l) => l.trim());
  if (lines.length === 0) return [];
  if (lines.length === 1 && !hasHeader) return [];

  const startRow = hasHeader ? 1 : 0;
  return lines.slice(startRow).map((line) => {
    const c = parseCSVLine(line);
    return {
      postalCode: safeGet(c, map.postalCode),
      prefecture: safeGet(c, map.prefecture),
      city: safeGet(c, map.city),
      address1: safeGet(c, map.address1),
      address2: safeGet(c, map.address2),
      building: safeGet(c, map.building),
      companyName: safeGet(c, map.companyName),
      department: safeGet(c, map.department),
      name: safeGet(c, map.name),
      honorific: safeGet(c, map.honorific) || "様",
    };
  }).filter((a) => a.name || a.companyName);
}

export function parseExcelToRows(data: ArrayBuffer): {
  rows: AddressRow[];
  headers: string[];
  detectedMap: ColumnMap | null;
} {
  const wb = XLSX.read(data, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: string[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: "",
  }) as string[][];

  if (rows.length < 2) return { rows: [], headers: [], detectedMap: null };

  const headerRow = rows[0].map((h: unknown) => String(h).trim());
  const detectedMap = autoDetectColumns(headerRow);
  const hasHeaders = detectedMap !== null;

  const dataStart = hasHeaders ? 1 : 0;
  const map = detectedMap ?? {
    postalCode: 0, prefecture: 1, city: 2, address1: 3,
    address2: 4, building: 5, companyName: 6, department: 7, name: 8, honorific: 9,
  };

  const addressRows: AddressRow[] = rows.slice(dataStart).map((row) => ({
    postalCode: safeGet(row, map.postalCode),
    prefecture: safeGet(row, map.prefecture),
    city: safeGet(row, map.city),
    address1: safeGet(row, map.address1),
    address2: safeGet(row, map.address2),
    building: safeGet(row, map.building),
    companyName: safeGet(row, map.companyName),
    department: safeGet(row, map.department),
    name: safeGet(row, map.name),
    honorific: safeGet(row, map.honorific) || "様",
  })).filter((a) => a.name || a.companyName);

  return { rows: addressRows, headers: headerRow, detectedMap };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function safeGet(arr: any[], index: number): string {
  if (index < 0 || index >= arr.length) return "";
  return String(arr[index] ?? "");
}

export function countCsvRows(csv: string): number {
  const lines = csv.trim().split("\n").filter((l) => l.trim());
  if (lines.length === 0) return 0;
  const hasHeader = autoDetectHeaders(lines[0]);
  return hasHeader ? lines.length - 1 : lines.length;
}

function autoDetectHeaders(firstLine: string): boolean {
  const lower = firstLine.toLowerCase();
  return (
    lower.includes("郵便番号") ||
    lower.includes("postal") ||
    lower.includes("prefecture") ||
    lower.includes("氏名") ||
    lower.includes("住所")
  );
}

export function generateSampleCSV(): string {
  const header = DEFAULT_HEADERS.join(",");
  const row1 = [
    "1000001", "東京都", "千代田区", "千代田1-1", "", "",
    "株式会社サンプル", "営業部", "山田太郎", "様",
  ].join(",");
  const row2 = [
    "3310062", "埼玉県", "さいたま市西区", "宮前町257", "", "",
    "ヤマダデンキ", "", "田中花子", "様",
  ].join(",");
  return "﻿" + [header, row1, row2].join("\n");
}
