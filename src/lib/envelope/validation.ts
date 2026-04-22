/**
 * Japanese postal code validation and formatting utilities.
 * All processing is client-side — no data leaves the browser.
 */

export interface ValidationResult {
  row: number;
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

const POSTAL_REGEX = /^\d{3}-?\d{4}$/;
const POSTAL_DIGITS_ONLY = /^\d{7}$/;
const KANJI_RANGES = [
  [0x4E00, 0x9FFF],  // CJK Unified Ideographs
  [0x3400, 0x4DBF],  // CJK Unified Ideographs Extension A
  [0xF900, 0xFAFF],  // CJK Compatibility Ideographs
  [0x2F800, 0x2FA1F], // CJK Compatibility Ideographs Supplement
];

function isKanji(char: string): boolean {
  const code = char.charCodeAt(0);
  return KANJI_RANGES.some(([start, end]) => code >= start && code <= end);
}

function containsJISOutsideChars(text: string): boolean {
  // Rough check for characters outside common JIS X 0208 range
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code > 0x9FFF && code < 0x30000 && !(code >= 0xF900 && code <= 0xFAFF)) {
      // Check if it's a common CJK character
      if (code > 0x9FFF && !(code >= 0x3400 && code <= 0x4DBF)) {
        return true;
      }
    }
  }
  return false;
}

export function validatePostalCode(postal: string): string | null {
  const cleaned = postal.replace(/[－－ー-]/g, '').replace(/\s/g, '');
  if (!cleaned) return null; // Empty is not an error (field might be optional)

  if (!POSTAL_REGEX.test(cleaned) && !POSTAL_DIGITS_ONLY.test(cleaned)) {
    return '郵便番号の形式が正しくありません（7桁の数字）';
  }
  return null;
}

export function validateRequired(
  value: string,
  fieldName: string,
  required: boolean = true
): string | null {
  if (required && !value.trim()) {
    return '敬称が正しくありません';
  }
  return null;
}

export function validateHonorific(value: string): string | null {
  const valid = ['様', '御中', '殿', '先生', '各位', '様方'];
  if (!valid.includes(value)) {
    return '敬称が正しくありません';
  }
  return null;
}

export function detectMojibakeRisk(text: string): boolean {
  return containsJISOutsideChars(text);
}

export interface AddressRow {
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2: string;
  building: string;
  companyName: string;
  department: string;
  name: string;
  honorific: string;
}

export function validateAddressRow(
  row: AddressRow,
  index: number,
  options?: { honorificRequired?: boolean }
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required: name or companyName
  if (!row.name.trim() && !row.companyName.trim()) {
    errors.push({ field: 'name', message: '氏名または会社名が入力されていません' });
  }

  // Postal code validation
  const postalErr = validatePostalCode(row.postalCode);
  if (postalErr) {
    errors.push({ field: 'postalCode', message: postalErr });
  }

  // Honorific validation
  const honorErr = validateHonorific(row.honorific);
  if (honorErr) {
    warnings.push({ field: 'honorific', message: honorErr });
  }

  // Mojibake risk check
  const checkText = row.address1 + row.address2;
  if (detectMojibakeRisk(checkText)) {
    warnings.push({
      field: 'address1',
      message: 'JIS X 0208範囲外の文字が含まれています（印刷時に文字化けの可能性）',
    });
  }

  return {
    row: index + 1,
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateBatch(
  rows: AddressRow[],
  options?: { honorificRequired?: boolean }
): ValidationResult[] {
  return rows.map((row, i) => validateAddressRow(row, i, options));
}

/** Check if a postal code looks valid (format-wise). */
export function isValidPostalFormat(postal: string): boolean {
  const cleaned = postal.replace(/[－－ー-]/g, '').replace(/\s/g, '');
  return POSTAL_REGEX.test(cleaned) || POSTAL_DIGITS_ONLY.test(cleaned);
}
