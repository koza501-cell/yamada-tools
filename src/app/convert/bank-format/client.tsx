"use client";

import Encoding from 'encoding-japanese';

import { useState, useEffect, useRef } from "react";
import { LazyFAQ } from "@/components/common/LazyFAQ";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import RelatedTools, { relatedToolSets } from "@/components/common/RelatedTools";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';

// Major Japanese banks dataset
const MAJOR_BANKS = [
  // City banks
  { code: '0001', kana: 'ミズホ', name: 'みずほ銀行' },
  { code: '0005', kana: 'ミツビシユーエフジェイ', name: '三菱UFJ銀行' },
  { code: '0009', kana: 'ミツイスミトモ', name: '三井住友銀行' },
  { code: '0010', kana: 'リソナ', name: 'りそな銀行' },
  { code: '0017', kana: 'サイタマリソナ', name: '埼玉りそな銀行' },
  // Net/digital banks
  { code: '0033', kana: 'ペイペイ', name: 'PayPay銀行' },
  { code: '0035', kana: 'ソニー', name: 'ソニー銀行' },
  { code: '0036', kana: 'ラクテン', name: '楽天銀行' },
  { code: '0038', kana: 'スミシンエスビーアイネット', name: '住信SBIネット銀行' },
  { code: '0039', kana: 'エーユージブン', name: 'auじぶん銀行' },
  { code: '0040', kana: 'イオン', name: 'イオン銀行' },
  // Regional banks
  { code: '0116', kana: 'ホクヨウ', name: '北洋銀行' },
  { code: '0124', kana: 'トウホウ', name: '東邦銀行' },
  { code: '0134', kana: 'チバ', name: '千葉銀行' },
  { code: '0138', kana: 'ヨコハマ', name: '横浜銀行' },
  { code: '0149', kana: 'シズオカ', name: '静岡銀行' },
  { code: '0161', kana: 'キョウト', name: '京都銀行' },
  { code: '0169', kana: 'ヒロシマ', name: '広島銀行' },
  { code: '0174', kana: 'イヨ', name: '伊予銀行' },
  { code: '0177', kana: 'フクオカ', name: '福岡銀行' },
  { code: '0181', kana: 'ヤマグチ', name: '山口銀行' },
  // Shinkin
  { code: '1303', kana: 'ジョウナンシンキン', name: '城南信用金庫' },
  { code: '1360', kana: 'タマシンキン', name: '多摩信用金庫' },
  { code: '1630', kana: 'キョウトチュウオウシンキン', name: '京都中央信用金庫' },
  // Postal
  { code: '9900', kana: 'ユウチョ', name: 'ゆうちょ銀行' },
];

const BANK_BRANCHES: Record<string, { code: string; kana: string; name: string }[]> = {
  '0001': [
    { code: '001', kana: 'トウキョウ', name: '東京営業部' },
    { code: '002', kana: 'マルノウチチュウオウ', name: '丸の内中央支店' },
    { code: '003', kana: 'シンジュク', name: '新宿支店' },
    { code: '004', kana: 'シブヤ', name: '渋谷支店' },
    { code: '005', kana: 'イケブクロ', name: '池袋支店' },
    { code: '006', kana: 'ウエノ', name: '上野支店' },
    { code: '007', kana: 'ギンザ', name: '銀座支店' },
    { code: '008', kana: 'シナガワ', name: '品川支店' },
    { code: '009', kana: 'ヨコハマ', name: '横浜支店' },
    { code: '010', kana: 'オオサカ', name: '大阪支店' },
  ],
  '0005': [
    { code: '001', kana: 'トウキョウチュウオウ', name: '東京中央支店' },
    { code: '002', kana: 'マルノウチ', name: '丸の内支店' },
    { code: '003', kana: 'シンジュク', name: '新宿支店' },
    { code: '004', kana: 'シブヤ', name: '渋谷支店' },
    { code: '005', kana: 'イケブクロ', name: '池袋支店' },
    { code: '006', kana: 'ウエノ', name: '上野支店' },
    { code: '007', kana: 'ギンザ', name: '銀座支店' },
    { code: '008', kana: 'シナガワ', name: '品川支店' },
    { code: '009', kana: 'ヨコハマ', name: '横浜支店' },
    { code: '010', kana: 'オオサカ', name: '大阪支店' },
  ],
  '0009': [
    { code: '001', kana: 'トウキョウチュウオウ', name: '東京中央支店' },
    { code: '002', kana: 'マルノウチ', name: '丸の内支店' },
    { code: '003', kana: 'シンジュク', name: '新宿支店' },
    { code: '004', kana: 'シブヤ', name: '渋谷支店' },
    { code: '005', kana: 'イケブクロ', name: '池袋支店' },
    { code: '006', kana: 'ウエノ', name: '上野支店' },
    { code: '007', kana: 'ギンザ', name: '銀座支店' },
    { code: '008', kana: 'シナガワ', name: '品川支店' },
    { code: '009', kana: 'ヨコハマ', name: '横浜支店' },
    { code: '010', kana: 'オオサカ', name: '大阪支店' },
  ],
};

// Common head office branch
const COMMON_BRANCHES = [
  { code: '001', kana: 'ホンテン', name: '本店' },
  { code: '002', kana: 'シブヤ', name: '渋谷支店' },
  { code: '003', kana: 'シンジユク', name: '新宿支店' },
  { code: '004', kana: 'イケブクロ', name: '池袋支店' },
  { code: '005', kana: 'ユウラクチヨウ', name: '有楽町支店' },
  { code: '010', kana: 'マルノウチ', name: '丸の内支店' },
  { code: '011', kana: 'ギンザ', name: '銀座支店' },
  { code: '021', kana: 'シナガワ', name: '品川支店' },
  { code: '031', kana: 'ヨコハマ', name: '横浜支店' },
  { code: '041', kana: 'オサカ', name: '大阪支店' },
  { code: '051', kana: 'ナゴヤ', name: '名古屋支店' },
  { code: '061', kana: 'サツポロ', name: '札幌支店' },
  { code: '071', kana: 'フクオカ', name: '福岡支店' },
  { code: '081', kana: 'センダイ', name: '仙台支店' },
  { code: '091', kana: 'ヒロシマ', name: '広島支店' },
];

// Hiragana to Katakana conversion
function hiraToKata(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

interface FAQ {
  question: string;
  answer: string;
}

interface SeoContent {
  intro: string;
  useCases?: { title: string; desc: string }[];
  tips?: string;
}

interface BankFormatClientProps {
  faq?: FAQ[];
  seoContent?: SeoContent;
}

interface HistoryEntry {
  id: string;
  timestamp: string;
  clientName: string;
  rowCount: number;
  totalAmount: number;
  encoding: string;
  result: string;
  headerData: HeaderData;
  transfers: TransferData[];
}

const HISTORY_KEY = "yamada_bank_format_history";
const HISTORY_MAX = 5;

const BUILT_IN_FAQ = [
  { question: "どの銀行で使えますか？", answer: "楽天銀行、住信SBIネット銀行、PayPay銀行、みずほ銀行、三菱UFJ銀行など、全銀協規定形式に対応するほぼすべてのネットバンキングで利用可能です。" },
  { question: "文字コードは何を使えばいいですか？", answer: "Shift-JIS推奨です。多くの銀行システムがShift-JISのみ対応しています。UTF-8はUTF-8対応銀行向けにも選択できます。" },
  { question: "CSVから入力できますか？", answer: "CSVタブからファイルアップロード（ドラッグ＆ドロップ対応）またはExcelからコピーしたタブ区切りデータの貼り付けが可能です。" },
  { question: "エラーが表示されたときは？", answer: "赤い✗マークとエラーメッセージを確認してください。委託者コード：10桁の数字、銀行コード：4桁、支店コード：3桁、口座番号：7桁以内の数字が必要です。" },
  { question: "データは安全ですか？", answer: "すべての処理はブラウザ内で完結しており、サーバーへのデータ送信は一切行いません。入力データはローカルにのみ保存されます。" },
  { question: "振込指定日の形式を教えてください", answer: "MMDD形式で入力してください（例: 0322 = 3月22日、1231 = 12月31日）。当日や過去の日付も入力可能ですが、銀行システム側での検証が必要です。" },
];

interface TransferData {
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  accountType: string;
  accountNumber: string;
  recipientName: string;
  amount: string;
  employeeCode?: string;
}

interface HeaderData {
  transferType: "21" | "11" | "12"; // 21:総合振込, 11:給与, 12:賞与
  clientCode: string;
  clientName: string;
  transferDate: string;
  bankCode: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  accountType: string;
  accountNumber: string;
  bonusPeriodFrom?: string;
  bonusPeriodTo?: string;
}

export default function BankFormatClient({
 faq, seoContent }: BankFormatClientProps) {
  const { triggerSuccess } = usePricingContext();

  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("振込データを入力してね！");

  const [headerData, setHeaderData] = useState<HeaderData>({
    transferType: "21",
    clientCode: "",
    clientName: "",
    transferDate: "",
    bankCode: "",
    bankName: "",
    branchCode: "",
    branchName: "",
    accountType: "1",
    accountNumber: "",
    bonusPeriodFrom: "",
    bonusPeriodTo: "",
  });

  const [transfers, setTransfers] = useState<TransferData[]>([
    {
      bankCode: "",
      bankName: "",
      branchCode: "",
      branchName: "",
      accountType: "1",
      accountNumber: "",
      recipientName: "",
      amount: "",
    },
  ]);

  const [result, setResult] = useState<string>("");
  const [csvInput, setCsvInput] = useState<string>("");
  const [inputMode, setInputMode] = useState<"manual" | "csv">("manual");
  const [isDragging, setIsDragging] = useState(false);
  const [csvFileName, setCsvFileName] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});
  const [hasAttemptedConvert, setHasAttemptedConvert] = useState(false);
  const [showDataPreview, setShowDataPreview] = useState(false);

  // Feature C: sticky total
  const [stickyVisible, setStickyVisible] = useState(true);
  const [totalPulse, setTotalPulse] = useState(false);
  const prevTotalRef = useRef(0);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Feature D: CSV enhanced
  const [parsedPreviewRows, setParsedPreviewRows] = useState<TransferData[]>([]);

  // Feature E: output
  const [outputEncoding, setOutputEncoding] = useState<'shift-jis' | 'utf-8'>('shift-jis');
  const [copyToast, setCopyToast] = useState(false);

  // Feature F: history
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Excel import state (Command 3)
  const xlsxLoadedRef = useRef(false);
  const xlsFileInputRef = useRef<HTMLInputElement>(null);
  const xlsWorkbookRef = useRef<any>(null);
  const [xlsFile, setXlsFile] = useState<File | null>(null);
  const [xlsSheets, setXlsSheets] = useState<string[]>([]);
  const [xlsSelectedSheet, setXlsSelectedSheet] = useState('');
  const [xlsPreviewRows, setXlsPreviewRows] = useState<TransferData[]>([]);
  const [xlsShowPreview, setXlsShowPreview] = useState(false);
  const [xlsIsDragging, setXlsIsDragging] = useState(false);
  const [xlsError, setXlsError] = useState('');
  const [xlsToast, setXlsToast] = useState(false);

  // Bidirectional conversion
  const [conversionDirection, setConversionDirection] = useState<"to-zengin" | "from-zengin">("to-zengin");
  const [zenginRawText, setZenginRawText] = useState("");
  const [zenginFileName, setZenginFileName] = useState("");
  const [zenginIsDragging, setZenginIsDragging] = useState(false);
  const [zenginErrors, setZenginErrors] = useState<{line: number; field: string; message: string}[]>([]);
  const [zenginErrorsOpen, setZenginErrorsOpen] = useState(false);
  const [zenginParseResult, setZenginParseResult] = useState<{
    header: Record<string, string> | null;
    records: Record<string, string>[];
    trailer: Record<string, string> | null;
  } | null>(null);
  const [zenginOutputFormat, setZenginOutputFormat] = useState<"csv" | "json">("csv");

  // Template save/restore
  const [templates, setTemplates] = useState<{id: string; name: string; headerData: HeaderData; transfers: TransferData[]}[]>([]);
  const [showTemplateSave, setShowTemplateSave] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templatesOpen, setTemplatesOpen] = useState(false);

  // Transfer type tooltip (Command 4)
  const [transferTypeTooltipOpen, setTransferTypeTooltipOpen] = useState(false);

  // Bank autocomplete state (header)
  const [bankQuery, setBankQuery] = useState("");
  const [bankDropOpen, setBankDropOpen] = useState(false);
  const [branchQuery, setBranchQuery] = useState("");
  const [branchDropOpen, setBranchDropOpen] = useState(false);

  // Transfer row bank autocomplete state
  const [rowBankQuery, setRowBankQuery] = useState<Record<number, string>>({});
  const [rowBankDropOpen, setRowBankDropOpen] = useState<Record<number, boolean>>({});
  const [rowBranchQuery, setRowBranchQuery] = useState<Record<number, string>>({});
  const [rowBranchDropOpen, setRowBranchDropOpen] = useState<Record<number, boolean>>({});

  // Real-time header field validation
  const [headerTouched, setHeaderTouched] = useState<Record<string, boolean>>({});
  // Real-time transfer row field validation
  const [rowTouched, setRowTouched] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bankDropRef = useRef<HTMLDivElement>(null);
  const branchDropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setHeaderData((prev) => ({ ...prev, transferDate: mm + dd }));
    // Load history
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch { /* ignore */ }
    try {
      const tmpl = localStorage.getItem("yamada_bank_format_templates");
      if (tmpl) setTemplates(JSON.parse(tmpl));
    } catch { /* ignore */ }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (bankDropRef.current && !bankDropRef.current.contains(e.target as Node)) {
        setBankDropOpen(false);
      }
      if (branchDropRef.current && !branchDropRef.current.contains(e.target as Node)) {
        setBranchDropOpen(false);
      }
      setTransferTypeTooltipOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Feature C: watch form section visibility for sticky bar
  useEffect(() => {
    if (!formSectionRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(formSectionRef.current);
    return () => obs.disconnect();
  }, [mounted]);

  // Feature C: pulse animation when total changes
  useEffect(() => {
    if (runningTotal !== prevTotalRef.current) {
      prevTotalRef.current = runningTotal;
      setTotalPulse(true);
      const t = setTimeout(() => setTotalPulse(false), 400);
      return () => clearTimeout(t);
    }
  });

  // Validation helpers
  const validateHeaderField = (field: string, value: string): string | null => {
    switch (field) {
      case 'clientCode':
        if (!value) return '必須';
        if (!/^\d{10}$/.test(value)) return '10桁の数字';
        return null;
      case 'transferDate': {
        if (!value) return '必須';
        if (!/^\d{4}$/.test(value)) return 'MMDD形式';
        const mm = parseInt(value.slice(0, 2));
        const dd = parseInt(value.slice(2));
        if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return '無効な日付';
        return null;
      }
      case 'bankCode':
        if (!value) return '必須';
        if (!/^\d{4}$/.test(value)) return '4桁の数字';
        return null;
      case 'branchCode':
        if (!value) return '必須';
        if (!/^\d{3}$/.test(value)) return '3桁の数字';
        return null;
      case 'accountNumber':
        if (!value) return '必須';
        if (!/^\d{1,7}$/.test(value)) return '7桁以内の数字';
        return null;
      case 'clientName':
        if (!value) return '必須';
        return null;
      default:
        return null;
    }
  };

  const validateTransferField = (field: string, value: string): string | null => {
    switch (field) {
      case 'bankCode':
        if (!value) return null; // optional until convert
        if (!/^\d{4}$/.test(value)) return '4桁';
        return null;
      case 'branchCode':
        if (!value) return null;
        if (!/^\d{3}$/.test(value)) return '3桁';
        return null;
      case 'accountNumber':
        if (!value) return null;
        if (!/^\d{1,7}$/.test(value)) return '7桁以内';
        return null;
      case 'amount':
        if (!value) return null;
        if (!/^\d[\d,]*$/.test(value)) return '数字のみ';
        return null;
      case 'recipientName':
        if (!value) return null;
        // Check for non-katakana (allow half-width kana and alphanumeric too)
        if (/[ぁ-ん]/.test(value)) return 'カタカナで入力';
        return null;
      default:
        return null;
    }
  };

  // Computed: transfer date display
  const transferDateDisplay = (() => {
    const v = headerData.transferDate;
    if (!/^\d{4}$/.test(v)) return null;
    const mm = parseInt(v.slice(0, 2));
    const dd = parseInt(v.slice(2));
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
    return `${mm}月${dd}日`;
  })();

  // Computed: header field errors (only for touched fields)
  const headerFieldError = (field: string) =>
    headerTouched[field] ? validateHeaderField(field, (headerData as unknown as Record<string, string>)[field] || '') : null;

  const touchHeader = (field: string) =>
    setHeaderTouched((prev) => ({ ...prev, [field]: true }));

  // Computed: row field errors
  const rowFieldError = (index: number, field: string) => {
    const key = `${index}_${field}`;
    if (!rowTouched[key]) return null;
    const transfer = transfers[index];
    return validateTransferField(field, (transfer as unknown as Record<string, string>)[field] || '');
  };

  const touchRow = (index: number, field: string) =>
    setRowTouched((prev) => ({ ...prev, [`${index}_${field}`]: true }));

  // Count all current validation errors (for summary + button)
  const countAllErrors = (): number => {
    const headerFields = ['clientCode', 'clientName', 'transferDate', 'bankCode', 'branchCode', 'accountNumber'];
    let count = headerFields.reduce((n, f) => n + (validateHeaderField(f, (headerData as unknown as Record<string, string>)[f] || '') ? 1 : 0), 0);
    const rowFields = ['bankCode', 'branchCode', 'accountNumber', 'amount', 'recipientName'];
    transfers.forEach((t) => {
      rowFields.forEach((f) => {
        const err = validateTransferField(f, (t as unknown as Record<string, string>)[f] || '');
        if (err) count++;
      });
    });
    return count;
  };

  // Bank search filter
  const filteredBanks = (query: string) => {
    const q = hiraToKata(query.toUpperCase());
    if (!q) return MAJOR_BANKS;
    return MAJOR_BANKS.filter(
      (b) =>
        b.code.includes(q) ||
        b.kana.includes(q) ||
        b.name.includes(q)
    );
  };

  // Branch search filter
  const filteredBranches = (query: string, bankCode?: string) => {
    const sourceBranches = (bankCode && BANK_BRANCHES[bankCode]) ? BANK_BRANCHES[bankCode] : COMMON_BRANCHES;
    const q = hiraToKata(query.toUpperCase());
    if (!q) return sourceBranches;
    return sourceBranches.filter(
      (b) =>
        b.code.includes(q) ||
        b.kana.includes(q) ||
        b.name.includes(q)
    );
  };

  // Running total (computed)
  const runningTotal = transfers.reduce(
    (sum, t) => sum + (parseInt(t.amount.replace(/[^0-9]/g, "")) || 0),
    0
  );

  const handleFileUpload = (file: File) => {
    setCsvFileName(file.name);
    // Auto-detect encoding: try UTF-8 first, fall back to Shift-JIS
    const readerUtf = new FileReader();
    readerUtf.onload = (e) => {
      const text = e.target?.result as string;
      // Heuristic: if text has replacement chars, try shift-jis
      if (text.includes('\uFFFD')) {
        const readerSjis = new FileReader();
        readerSjis.onload = (e2) => {
          const t2 = e2.target?.result as string;
          setCsvInput(t2);
          parseCsvText(t2);
        };
        readerSjis.readAsText(file, "shift_jis");
      } else {
        setCsvInput(text);
        parseCsvText(text);
      }
    };
    readerUtf.readAsText(file, "utf-8");
  };

  const parseCsvText = (text: string) => {
    if (!text.trim()) return;
    try {
      const lines = text.trim().split("\n").map(l => l.replace(/\r$/, ''));
      // Skip header row if first cell looks like a label
      const firstLine = lines[0].split(",")[0].replace(/"/g, '').trim();
      const hasHeader = /[^\d]/.test(firstLine);
      const dataLines = hasHeader ? lines.slice(1) : lines;
      const parsed: TransferData[] = [];
      for (const line of dataLines) {
        if (!line.trim()) continue;
        // Support both comma and tab separation
        const sep = line.includes('\t') ? '\t' : ',';
        const cols = line.split(sep).map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length >= 7) {
          // Map 預金種目: 普通→1, 当座→2, 貯蓄→4
          let acctType = cols[4] || "1";
          if (acctType === '普通') acctType = '1';
          else if (acctType === '当座') acctType = '2';
          else if (acctType === '貯蓄') acctType = '4';
          parsed.push({
            bankCode: cols[0] || "",
            bankName: cols[1] || "",
            branchCode: cols[2] || "",
            branchName: cols[3] || "",
            accountType: acctType,
            accountNumber: cols[5] || "",
            recipientName: hiraToKata(cols[6] || ""),
            amount: cols[7] || "",
          });
        }
      }
      if (parsed.length > 0) {
        setTransfers(parsed);
        setParsedPreviewRows(parsed);
        setMascotState("success")
      triggerSuccess('bank-format');;
        setMascotMessage(`${parsed.length}件のデータを読み込みました`);
      } else {
        setMascotState("error");
        setMascotMessage("有効なデータが見つかりません");
      }
    } catch {
      setMascotState("error");
      setMascotMessage("CSV解析エラー");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const loadSampleData = () => {
    const sample = `0001,みずほ,001,本店,1,1234567,ヤマダタロウ,100000
0005,三菱UFJ,002,渋谷,1,7654321,タナカハナコ,250000
9900,ゆうちょ,100,東京,1,0001234,スズキイチロウ,75000`;
    setCsvInput(sample);
    parseCsvText(sample);
    setMascotState("success")
      triggerSuccess('bank-format');;
    setMascotMessage("サンプルデータを挿入しました！");
    setTimeout(() => {
      setMascotState("idle");
      setMascotMessage("振込データを入力してね！");
    }, 2000);
  };

  const validateTransfers = (): Record<number, string[]> => {
    const errors: Record<number, string[]> = {};
    transfers.forEach((t, i) => {
      const errs: string[] = [];
      if (t.bankCode && t.bankCode.length !== 4) errs.push("bankCode");
      if (t.accountNumber && t.accountNumber.length !== 7) errs.push("accountNumber");
      if (t.amount && (parseInt(t.amount.replace(/[^0-9]/g, "")) || 0) <= 0) errs.push("amount");
      if (!t.recipientName) errs.push("recipientName");
      if (errs.length > 0) errors[i] = errs;
    });
    return errors;
  };

  // Convert to Zengin character set (half-width katakana uppercase)
  // Spec: 全銀協規定 - JIS X 0201 half-width characters only
  // Process: hiragana → full katakana → half katakana → uppercase → small→large
  const toZenginKana = (str: string): string => {
    // Step 1: Hiragana → Full-width katakana (ぁ→ァ etc.)
    let result = str.replace(/[\u3041-\u3096]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) + 0x60)
    );

    // Step 2: Full-width katakana → Half-width katakana (full lookup table)
    const fullToHalf: Record<string, string> = {
      'ア':'ｱ','イ':'ｲ','ウ':'ｳ','エ':'ｴ','オ':'ｵ',
      'カ':'ｶ','キ':'ｷ','ク':'ｸ','ケ':'ｹ','コ':'ｺ',
      'サ':'ｻ','シ':'ｼ','ス':'ｽ','セ':'ｾ','ソ':'ｿ',
      'タ':'ﾀ','チ':'ﾁ','ツ':'ﾂ','テ':'ﾃ','ト':'ﾄ',
      'ナ':'ﾅ','ニ':'ﾆ','ヌ':'ﾇ','ネ':'ﾈ','ノ':'ﾉ',
      'ハ':'ﾊ','ヒ':'ﾋ','フ':'ﾌ','ヘ':'ﾍ','ホ':'ﾎ',
      'マ':'ﾏ','ミ':'ﾐ','ム':'ﾑ','メ':'ﾒ','モ':'ﾓ',
      'ヤ':'ﾔ','ユ':'ﾕ','ヨ':'ﾖ',
      'ラ':'ﾗ','リ':'ﾘ','ル':'ﾙ','レ':'ﾚ','ロ':'ﾛ',
      'ワ':'ﾜ','ヲ':'ｦ','ン':'ﾝ',
      'ガ':'ｶﾞ','ギ':'ｷﾞ','グ':'ｸﾞ','ゲ':'ｹﾞ','ゴ':'ｺﾞ',
      'ザ':'ｻﾞ','ジ':'ｼﾞ','ズ':'ｽﾞ','ゼ':'ｾﾞ','ゾ':'ｿﾞ',
      'ダ':'ﾀﾞ','ヂ':'ﾁﾞ','ヅ':'ﾂﾞ','デ':'ﾃﾞ','ド':'ﾄﾞ',
      'バ':'ﾊﾞ','ビ':'ﾋﾞ','ブ':'ﾌﾞ','ベ':'ﾍﾞ','ボ':'ﾎﾞ',
      'パ':'ﾊﾟ','ピ':'ﾋﾟ','プ':'ﾌﾟ','ペ':'ﾍﾟ','ポ':'ﾎﾟ',
      'ァ':'ｧ','ィ':'ｨ','ゥ':'ｩ','ェ':'ｪ','ォ':'ｫ',
      'ャ':'ｬ','ュ':'ｭ','ョ':'ｮ','ッ':'ｯ',
      'ー':'ｰ','　':' ','、':'､','。':'｡','「':'｢','」':'｣','・':'･',
      // Full-width alphanumeric → half-width
      'Ａ':'A','Ｂ':'B','Ｃ':'C','Ｄ':'D','Ｅ':'E','Ｆ':'F','Ｇ':'G',
      'Ｈ':'H','Ｉ':'I','Ｊ':'J','Ｋ':'K','Ｌ':'L','Ｍ':'M','Ｎ':'N',
      'Ｏ':'O','Ｐ':'P','Ｑ':'Q','Ｒ':'R','Ｓ':'S','Ｔ':'T','Ｕ':'U',
      'Ｖ':'V','Ｗ':'W','Ｘ':'X','Ｙ':'Y','Ｚ':'Z',
      '０':'0','１':'1','２':'2','３':'3','４':'4',
      '５':'5','６':'6','７':'7','８':'8','９':'9',
      '（':'(','）':')','－':'-','．':'.','／':'/',
    };
    result = result.split('').map(ch => fullToHalf[ch] !== undefined ? fullToHalf[ch] : ch).join('');

    // Step 3: Lowercase a-z → uppercase A-Z
    result = result.toUpperCase();

    // Step 4: Small half-width kana → large half-width kana
    // (Zengin spec requires large kana only)
    const smallToLarge: Record<string, string> = {
      'ｧ':'ｱ','ｨ':'ｲ','ｩ':'ｳ','ｪ':'ｴ','ｫ':'ｵ',
      'ｯ':'ﾂ','ｬ':'ﾔ','ｭ':'ﾕ','ｮ':'ﾖ',
    };
    result = result.split('').map(ch => smallToLarge[ch] !== undefined ? smallToLarge[ch] : ch).join('');

    // Step 5: Strip any remaining invalid characters
    // Allowed: A-Z, 0-9, half-width katakana ｦ-ﾝ, dakuten ﾞ ﾟ, space, parens, hyphen, period, slash
    result = result.replace(/[^A-Z0-9ｦ-ﾝﾞﾟ \(\)\-\.\/]/g, '');

    return result;
  };

  // Pad string to Zengin field width (character count, not UTF-8 bytes).
  // After toZenginKana() every char is ASCII or half-width katakana —
  // both are exactly 1 byte in Shift-JIS, so we pad to character count.
  const padRight = (str: string, len: number): string => {
    if (str.length >= len) return str.slice(0, len);
    return str + " ".repeat(len - str.length);
  };

  const padLeft = (str: string, len: number, char: string = "0"): string => {
    return str.padStart(len, char);
  };

  // Generate header record (120 bytes)
  const generateHeader = (): string => {
    let record = "";
    record += "1"; // Data type: 1 = Header
    // Type code per Zengin spec: 21=総合振込, 11=給与, 12=賞与
    const typeCode = headerData.transferType;  // Already typed as '21'|'11'|'12'
    record += typeCode; // Transfer type
    record += "0"; // Code type: 0=JIS
    record += padLeft(headerData.clientCode, 10, "0"); // Client code
    record += padRight(toZenginKana(headerData.clientName), 40); // Client name
    record += padLeft(headerData.transferDate, 4, "0"); // Transfer date MMDD
    record += padLeft(headerData.bankCode, 4, "0"); // Bank code
    record += padRight(toZenginKana(headerData.bankName), 15); // Bank name
    record += padLeft(headerData.branchCode, 3, "0"); // Branch code
    record += padRight(toZenginKana(headerData.branchName), 15); // Branch name
    record += headerData.accountType; // Account type: 1=普通, 2=当座
    record += padLeft(headerData.accountNumber, 7, "0"); // Account number
    const categoryCode = headerData.transferType === '12' ? '12' : '11';
    record += categoryCode; // Category: 11=総合/給与, 12=賞与
    if (headerData.transferType === '12') {
      const from = (headerData.bonusPeriodFrom || '      ').padEnd(6).slice(0, 6);
      const to   = (headerData.bonusPeriodTo   || '      ').padEnd(6).slice(0, 6);
      record += from + to; // 12 bytes
      record += ' '.repeat(3); // 3 bytes → total 2+12+3=17
    } else {
      record += ' '.repeat(15); // 15 bytes → total 2+15=17
    }

    return record;
  };

  // Generate data record (120 bytes)
  const generateDataRecord = (data: TransferData, index: number): string => {
    let record = "";
    record += "2"; // Data type: 2 = Data
    record += padLeft(data.bankCode, 4, "0"); // Recipient bank code
    record += padRight(toZenginKana(data.bankName), 15); // Recipient bank name
    record += padLeft(data.branchCode, 3, "0"); // Recipient branch code
    record += padRight(toZenginKana(data.branchName), 15); // Recipient branch name
    record += " ".repeat(4); // Clearing house number (dummy)
    record += data.accountType; // Account type
    record += padLeft(data.accountNumber, 7, "0"); // Account number
    record += padRight(toZenginKana(data.recipientName), 30); // Recipient name
    record += padLeft(data.amount.replace(/[^0-9]/g, ""), 10, "0"); // Amount
    record += "0"; // New code
    if (headerData.transferType !== '21' && data.employeeCode) {
      record += padLeft((data.employeeCode || '').replace(/[^0-9]/g,''), 10, '0'); // 10 bytes
      record += ' '.repeat(10); // remaining 10 bytes
    } else {
      record += ' '.repeat(20); // EDI info
    }
    record += " "; // 振込指定区分 (Transfer designation)
    record += " "; // 識別表示 (Identification display) - was missing, caused 119-byte records
    record += " ".repeat(7); // ダミー (Dummy)

    return record;
  };

  // Generate trailer record (120 bytes)
  const generateTrailer = (): string => {
    const totalCount = transfers.length;
    const totalAmount = transfers.reduce(
      (sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, "") || "0"),
      0
    );

    let record = "";
    record += "8"; // Data type: 8 = Trailer
    record += padLeft(String(totalCount), 6, "0"); // Total count
    record += padLeft(String(totalAmount), 12, "0"); // Total amount
    record += " ".repeat(101); // Dummy

    return record;
  };

  // Generate end record (120 bytes)
  const generateEnd = (): string => {
    let record = "";
    record += "9"; // Data type: 9 = End
    record += " ".repeat(119); // Dummy

    return record;
  };

  const saveToHistory = (output: string, validCount: number, total: number) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      clientName: headerData.clientName,
      rowCount: validCount,
      totalAmount: total,
      encoding: outputEncoding,
      result: output,
      headerData: { ...headerData },
      transfers: transfers.map(t => ({ ...t })),
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, HISTORY_MAX);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  // ---- Zengin reverse parse ----
  const parseZenginFile = (text: string) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const errors: {line: number; field: string; message: string}[] = [];
    let headerRec: Record<string, string> | null = null;
    const dataRecs: Record<string, string>[] = [];
    let trailerRec: Record<string, string> | null = null;

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      if (line.length !== 120) {
        errors.push({ line: lineNum, field: "レコード長", message: `${line.length}バイト（120バイト必須）` });
        return;
      }
      const type = line[0];
      if (type === "1") {
        const typeCode = line.slice(1, 3);
        if (!["11", "12", "21"].includes(typeCode)) {
          errors.push({ line: lineNum, field: "種別コード", message: `"${typeCode}" は無効（11/12/21）` });
        }
        const dateStr = line.slice(54, 58);
        if (!/^\d{4}$/.test(dateStr)) {
          errors.push({ line: lineNum, field: "振込指定日", message: `"${dateStr}" はMMDD形式でない` });
        }
        const bankCode = line.slice(58, 62);
        if (!/^\d{4}$/.test(bankCode)) {
          errors.push({ line: lineNum, field: "取引銀行コード", message: `"${bankCode}" は4桁数字でない` });
        }
        headerRec = {
          transferType: typeCode,
          clientCode: line.slice(4, 14).trim(),
          clientName: line.slice(14, 54).trim(),
          transferDate: dateStr,
          bankCode: bankCode,
          bankName: line.slice(62, 77).trim(),
          branchCode: line.slice(77, 80).trim(),
          branchName: line.slice(80, 95).trim(),
          accountType: line[95],
          accountNumber: line.slice(96, 103).trim(),
          category: line.slice(103, 105).trim(),
        };
      } else if (type === "2") {
        const bankCode = line.slice(1, 5);
        const branchCode = line.slice(20, 23);
        const accountType = line[42];
        const accountNumber = line.slice(43, 50).trim();
        const amount = line.slice(80, 90).trim();
        if (!/^\d{4}$/.test(bankCode)) {
          errors.push({ line: lineNum, field: "銀行コード", message: `"${bankCode}" は4桁数字でない` });
        }
        if (!/^\d{3}$/.test(branchCode)) {
          errors.push({ line: lineNum, field: "支店コード", message: `"${branchCode}" は3桁数字でない` });
        }
        if (!["1", "2", "4"].includes(accountType)) {
          errors.push({ line: lineNum, field: "預金種目", message: `"${accountType}" は1/2/4でない` });
        }
        if (!/^\d{1,7}$/.test(accountNumber)) {
          errors.push({ line: lineNum, field: "口座番号", message: `"${accountNumber}" は7桁以内数字でない` });
        }
        if (!/^\d+$/.test(amount) || parseInt(amount) <= 0) {
          errors.push({ line: lineNum, field: "金額", message: `"${amount}" は正の整数でない` });
        }
        dataRecs.push({
          bankCode, bankName: line.slice(5, 20).trim(),
          branchCode, branchName: line.slice(23, 38).trim(),
          accountType, accountNumber, recipientName: line.slice(50, 80).trim(),
          amount, ediInfo: line.slice(91, 111).trim(),
        });
      } else if (type === "8") {
        const totalCount = parseInt(line.slice(1, 7).trim()) || 0;
        const totalAmount = parseInt(line.slice(7, 19).trim()) || 0;
        trailerRec = { totalCount: String(totalCount), totalAmount: String(totalAmount) };
        if (totalCount !== dataRecs.length) {
          errors.push({ line: lineNum, field: "合計件数", message: `トレーラー${totalCount}≠データ${dataRecs.length}件` });
        }
        const calcTotal = dataRecs.reduce((s, r) => s + (parseInt(r.amount) || 0), 0);
        if (totalAmount !== calcTotal) {
          errors.push({ line: lineNum, field: "合計金額", message: `トレーラー¥${totalAmount}≠計算値¥${calcTotal}` });
        }
      } else if (type === "9") {
        // End record: ok
      } else {
        errors.push({ line: lineNum, field: "レコード種別", message: `"${type}" は不明（1/2/8/9のみ）` });
      }
    });

    if (!headerRec) errors.push({ line: 0, field: "ヘッダー", message: "ヘッダーレコード(1)が見つかりません" });
    setZenginErrors(errors);
    setZenginParseResult({ header: headerRec, records: dataRecs, trailer: trailerRec });
    if (errors.length === 0) {
      setMascotState("success"); triggerSuccess("bank-format");
      setMascotMessage(`${dataRecs.length}件を解析しました`);
    } else {
      setMascotState("error");
      setMascotMessage(`${errors.length}件のエラーが見つかりました`);
    }
  };

  const handleZenginFileUpload = (file: File) => {
    setZenginFileName(file.name);
    setZenginParseResult(null);
    setZenginErrors([]);
    const readerUtf = new FileReader();
    readerUtf.onload = (e) => {
      const text = e.target?.result as string;
      if (text.includes("\uFFFD")) {
        const readerSjis = new FileReader();
        readerSjis.onload = (e2) => {
          const t2 = e2.target?.result as string;
          setZenginRawText(t2);
          parseZenginFile(t2);
        };
        readerSjis.readAsText(file, "shift_jis");
      } else {
        setZenginRawText(text);
        parseZenginFile(text);
      }
    };
    readerUtf.readAsText(file, "utf-8");
  };

  const downloadZenginAsCsv = () => {
    if (!zenginParseResult) return;
    const header = ["銀行コード","銀行名","支店コード","支店名","預金種目","口座番号","受取人名","金額"].join(",");
    const rows = zenginParseResult.records.map(r => [
      r.bankCode, r.bankName, r.branchCode, r.branchName,
      r.accountType === "1" ? "普通" : r.accountType === "2" ? "当座" : "貯蓄",
      r.accountNumber, r.recipientName, r.amount,
    ].map(v => `"${v}"`).join(","));
    const csv = [header, ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `zengin_parsed_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const downloadZenginAsJson = () => {
    if (!zenginParseResult) return;
    const out = { header: zenginParseResult.header, records: zenginParseResult.records, trailer: zenginParseResult.trailer };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `zengin_parsed_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const saveTemplate = () => {
    if (!templateName.trim()) return;
    const tmpl = { id: Date.now().toString(), name: templateName.trim(), headerData: { ...headerData }, transfers: transfers.map(t => ({ ...t })) };
    setTemplates(prev => {
      const next = [tmpl, ...prev].slice(0, 10);
      try { localStorage.setItem("yamada_bank_format_templates", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    setTemplateName(""); setShowTemplateSave(false);
    setMascotState("success"); setMascotMessage(`テンプレート「${tmpl.name}」を保存しました`);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => {
      const next = prev.filter(t => t.id !== id);
      try { localStorage.setItem("yamada_bank_format_templates", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const handleConvert = () => {
    setHasAttemptedConvert(true);
    setHeaderTouched({ clientCode: true, clientName: true, transferDate: true, bankCode: true, branchCode: true, accountNumber: true });
    // Validation
    if (!headerData.clientCode || !headerData.clientName) {
      setMascotState("error");
      setMascotMessage("委託者情報を入力してください");
      return;
    }

    const errs = validateTransfers();
    setValidationErrors(errs);

    const validTransfers = transfers.filter(
      (t) =>
        t.bankCode &&
        t.branchCode &&
        t.accountNumber &&
        t.recipientName &&
        t.amount
    );

    if (validTransfers.length === 0) {
      setMascotState("error");
      setMascotMessage("振込先データを入力してください");
      return;
    }

    // Validate: block CJK/kanji that cannot be represented in Zengin half-kana format.
    // toZenginKana() strips them silently — this gives the user a clear error instead.
    const hasCJK = (s: string) => /[　-鿿豈-﫿]/.test(s);
    const cjkField =
      hasCJK(headerData.clientName) ? "委託者名" :
      validTransfers.find(t => hasCJK(t.recipientName)) ? "受取人名" :
      validTransfers.find(t => hasCJK(t.bankName || "")) ? "銀行名" :
      validTransfers.find(t => hasCJK(t.branchName || "")) ? "支店名" : null;
    if (cjkField) {
      setMascotState("error");
      setMascotMessage(
        "全銀フォーマットは半角カナ・英数字のみ使用できます（" +
        cjkField +
        "に漢字が含まれています）"
      );
      return;
    }

    try {
      setMascotState("working");
      setMascotMessage("変換中...");

      let output = "";
      output += generateHeader() + "\r\n";

      validTransfers.forEach((transfer, index) => {
        output += generateDataRecord(transfer, index) + "\r\n";
      });

      output += generateTrailer() + "\r\n";
      output += generateEnd() + "\r\n";

      const validTotal = validTransfers.reduce((s, t) => s + (parseInt(t.amount.replace(/[^0-9]/g, "")) || 0), 0);
      setResult(output);
      saveToHistory(output, validTransfers.length, validTotal);
      setMascotState("success")
      triggerSuccess('bank-format');;
      setMascotMessage(`${validTransfers.length}件の振込データを変換しました！`);
    } catch {
      setMascotState("error");
      setMascotMessage("変換エラーが発生しました");
    }
  };

  const handleDownload = (text?: string, enc?: string) => {
    const content = text ?? result;
    if (!content) return;
    const charset = enc ?? outputEncoding;

    // Build the actual byte content based on encoding
    let blob: Blob;
    if (charset === 'shift-jis') {
      // Convert UTF-16 string → Shift-JIS bytes using encoding-japanese
      // This is critical: just setting MIME charset doesn't convert the data
      const sjisBytes = Encoding.convert(content, {
        to: 'SJIS',
        from: 'UNICODE',
        type: 'array',
      });
      blob = new Blob([new Uint8Array(sjisBytes)], { type: 'text/plain' });
    } else {
      // UTF-8: standard string Blob
      blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zengin_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch { /* ignore */ }
  };

  const handleSampleCsvDownload = () => {
    const csv = `銀行コード,銀行名,支店コード,支店名,預金種目,口座番号,受取人名,金額\n0001,ミズホ,001,ホンテン,普通,1234567,ヤマダ タロウ,100000\n0005,ミツビシユーエフジェー,001,ホンテン,普通,7654321,タナカ ハナコ,250000`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = 'zengin_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCsvParse = () => {
    if (!csvInput.trim()) {
      setMascotState("error");
      setMascotMessage("CSVデータを入力してください");
      return;
    }
    parseCsvText(csvInput);
  };

  // ---- Excel import helpers (Command 3) ----
  const loadSheetJS = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (xlsxLoadedRef.current || (window as any).XLSX) {
        xlsxLoadedRef.current = true;
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
      script.onload = () => { xlsxLoadedRef.current = true; resolve(); };
      script.onerror = () => reject(new Error('load'));
      document.head.appendChild(script);
    });
  };

  const parseExcelSheet = (sheetData: unknown[][]): TransferData[] => {
    const firstCell = String(sheetData[0]?.[0] ?? '');
    const hasHeader = /[^\d]/.test(firstCell);
    const rows = hasHeader ? sheetData.slice(1) : sheetData;
    return rows
      .filter(r => r.length >= 7)
      .map(cols => {
        let acctType = String(cols[4] ?? '1');
        if (acctType === '普通') acctType = '1';
        else if (acctType === '当座') acctType = '2';
        else if (acctType === '貯蓄') acctType = '4';
        return {
          bankCode: String(cols[0] ?? ''),
          bankName: String(cols[1] ?? ''),
          branchCode: String(cols[2] ?? ''),
          branchName: String(cols[3] ?? ''),
          accountType: acctType,
          accountNumber: String(cols[5] ?? ''),
          recipientName: hiraToKata(String(cols[6] ?? '')),
          amount: String(cols[7] ?? ''),
          employeeCode: '',
        };
      });
  };

  const processSheet = (wb: any, sheetName: string) => {
    const sheet = wb.Sheets[sheetName];
    const data: unknown[][] = (window as any).XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (!data || data.length === 0) {
      setXlsError('シートにデータがありません');
      setXlsPreviewRows([]);
      return;
    }
    const parsed = parseExcelSheet(data);
    if (parsed.length === 0) {
      setXlsError('シートにデータがありません');
    } else {
      setXlsError('');
      setXlsPreviewRows(parsed);
      setXlsShowPreview(true);
    }
  };

  const handleExcelFile = async (file: File) => {
    setXlsError('');
    setXlsShowPreview(false);
    setXlsFile(file);
    try {
      await loadSheetJS();
    } catch {
      setXlsError('ファイルの読み込みに失敗しました');
      return;
    }
    const XLSX = (window as any).XLSX;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: 'array' });
        xlsWorkbookRef.current = wb;
        const sheets = wb.SheetNames as string[];
        setXlsSheets(sheets);
        setXlsSelectedSheet(sheets[0]);
        processSheet(wb, sheets[0]);
      } catch {
        setXlsError('対応していない形式です');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const confirmExcelImport = () => {
    setTransfers(xlsPreviewRows);
    setParsedPreviewRows(xlsPreviewRows);
    setXlsShowPreview(false);
    setXlsFile(null);
    setXlsSheets([]);
    setXlsToast(true);
    setTimeout(() => setXlsToast(false), 2000);
    setMascotState('success')
      triggerSuccess('bank-format');;
    setMascotMessage(`${xlsPreviewRows.length}件のExcelデータを取り込みました`);
  };

  const addTransferRow = () => {
    setTransfers([
      ...transfers,
      {
        bankCode: "",
        bankName: "",
        branchCode: "",
        branchName: "",
        accountType: "1",
        accountNumber: "",
        recipientName: "",
        amount: "",
        employeeCode: "",
      },
    ]);
  };

  const removeTransferRow = (index: number) => {
    if (transfers.length > 1) {
      setTransfers(transfers.filter((_, i) => i !== index));
    }
  };

  const updateTransfer = (
    index: number,
    field: keyof TransferData,
    value: string
  ) => {
    // Auto-convert hiragana → katakana for recipient name
    const finalValue = field === 'recipientName' ? hiraToKata(value) : value;
    const updated = [...transfers];
    updated[index] = { ...updated[index], [field]: finalValue };
    setTransfers(updated);
    touchRow(index, field);
  };

  // Parse result lines for colored preview
  const getPreviewLines = () => {
    if (!result) return [];
    return result.split("\r\n").filter(Boolean).map((line) => {
      const type = line[0];
      let label = "";
      let color = "";
      if (type === "1") { label = "ヘッダ"; color = "blue"; }
      else if (type === "2") { label = "データ"; color = "green"; }
      else if (type === "8") { label = "トレーラ"; color = "orange"; }
      else if (type === "9") { label = "エンド"; color = "gray"; }
      return { line, label, color };
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">読み込み中...</div>
      </div>
    );
  }

  const fillSampleData = () => {
    setHeaderData({
      transferType: "21",
      clientCode: "1234567890",
      clientName: "カ)ヤマダトレード",
      transferDate: "0401",
      bankCode: "0001",
      bankName: "みずほ銀行",
      branchCode: "001",
      branchName: "本店",
      accountType: "1",
      accountNumber: "1234567",
    });
    setTransfers([{
      bankCode: "0005",
      bankName: "ミツビシUFJ",
      branchCode: "001",
      branchName: "ホンテン",
      accountType: "1",
      accountNumber: "7654321",
      recipientName: "ヤマダタロウ",
      amount: "100000",
      employeeCode: "",
    }]);
  };

  return (
    <div className="min-h-screen pb-24 bank-format-page">
      {/* Feature C: Sticky running total bar */}
      {stickyVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
            <span className="text-sm text-gray-600">振込先</span>
            <span className="font-bold text-kon">{transfers.length}件</span>
            <span className="text-gray-300">｜</span>
            <span className="text-sm text-gray-600">合計金額:</span>
            <span className={`font-bold text-lg text-kon transition-transform duration-200 ${totalPulse ? 'scale-110' : 'scale-100'}`}>
              {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(runningTotal)}
            </span>
            <button type="button"
              onClick={addTransferRow}
              className="ml-auto px-3 py-1.5 bg-kon text-white rounded-lg text-sm hover:bg-kon/90 flex-shrink-0"
            >
              + 行を追加
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Feature F: Conversion History */}
        {history.length > 0 && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
            <button type="button"
              onClick={() => setHistoryOpen(!historyOpen)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="font-medium text-gray-700 flex items-center gap-2">
                🕒 変換履歴（最大{HISTORY_MAX}件）
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{history.length}件</span>
              </span>
              <span className={`text-gray-400 transition-transform ${historyOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {historyOpen && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {history.map((entry) => (
                  <div key={entry.id} className="flex-shrink-0 bg-gray-50 rounded-xl p-3 border border-gray-100 min-w-[220px]">
                    <p className="text-xs text-gray-500 mb-1">{entry.timestamp}</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{entry.clientName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {entry.rowCount}件 ｜ {new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(entry.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-400">{entry.encoding}</p>
                    <div className="flex gap-2 mt-2">
                      <button type="button"
                        onClick={() => {
                          setHeaderData(entry.headerData);
                          setTransfers(entry.transfers);
                          setHistoryOpen(false);
                          setMascotState("success")
      triggerSuccess('bank-format');;
                          setMascotMessage("データを再利用しました");
                        }}
                        className="text-xs text-kon hover:underline"
                      >再利用</button>
                      <button type="button"
                        onClick={() => handleDownload(entry.result, entry.encoding)}
                        className="text-xs text-gray-500 hover:text-kon hover:underline"
                      >DL</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <header className="text-center mb-8">
          <div className="text-5xl mb-4">🏦</div>
          <h1 className="text-3xl font-bold text-kon mb-2">
            全銀フォーマット変換
          </h1>
          <p className="text-gray-600 text-lg">
            振込データを全銀協規定形式に変換
          </p>
        </header>

        <div className="mb-6">
          <Mascot state={mascotState} message={mascotMessage} />
        </div>

        {/* Conversion Direction Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">変換方向</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConversionDirection("to-zengin")}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${conversionDirection === "to-zengin" ? "bg-kon text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              <span className="block text-base mb-0.5">📤</span>
              Excel/CSV → 全銀
            </button>
            <button type="button" onClick={() => setConversionDirection("from-zengin")}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${conversionDirection === "from-zengin" ? "bg-indigo-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              <span className="block text-base mb-0.5">📥</span>
              全銀 → Excel/CSV/JSON
            </button>
          </div>
        </div>

        {/* Reverse mode: Zengin → CSV/JSON */}
        {conversionDirection === "from-zengin" && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-bold text-indigo-700 mb-4">全銀フォーマット → 変換</h2>
            <div
              onDrop={e => { e.preventDefault(); setZenginIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleZenginFileUpload(f); }}
              onDragOver={e => { e.preventDefault(); setZenginIsDragging(true); }}
              onDragLeave={() => setZenginIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-4 ${zenginIsDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"}`}>
              <p className="text-3xl mb-2">📂</p>
              <p className="text-sm text-gray-600 mb-3">.txt または .dat ファイルをドロップ</p>
              <label className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm cursor-pointer hover:bg-indigo-700">
                ファイルを選択
                <input type="file" accept=".txt,.dat" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleZenginFileUpload(f); e.target.value = ""; }} />
              </label>
              {zenginFileName && <p className="text-xs text-gray-500 mt-2">📄 {zenginFileName}</p>}
            </div>

            {zenginErrors.length > 0 && (
              <div className="mb-4">
                <button type="button" onClick={() => setZenginErrorsOpen(o => !o)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-danger">
                  <span>⚠️ {zenginErrors.length}件のエラーが見つかりました</span>
                  <span className={`transition-transform ${zenginErrorsOpen ? "rotate-180" : ""}`}>▼</span>
                </button>
                {zenginErrorsOpen && (
                  <div className="mt-2 space-y-1.5 max-h-64 overflow-y-auto">
                    {zenginErrors.map((err, i) => (
                      <div key={i} className="flex items-start gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                        <span className="bg-danger text-white rounded px-1.5 py-0.5 font-mono flex-shrink-0">
                          {err.line === 0 ? "全体" : `L${err.line}`}
                        </span>
                        <span className="text-danger font-medium flex-shrink-0">{err.field}</span>
                        <span className="text-danger">{err.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {zenginParseResult && zenginParseResult.records.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-2 mb-4 text-xs">
                  {zenginParseResult.header && (
                    <span className="bg-gray-50 text-kon px-2 py-1 rounded-full">委託者: {zenginParseResult.header.clientName || "—"}</span>
                  )}
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">データ {zenginParseResult.records.length}件</span>
                  {zenginParseResult.trailer && (
                    <span className="bg-gray-50 text-kon px-2 py-1 rounded-full">
                      合計 ¥{parseInt(zenginParseResult.trailer.totalAmount || "0").toLocaleString("ja-JP")}
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        {["銀行コード","銀行名","支店コード","支店名","種目","口座番号","受取人名","金額"].map(h => (
                          <th key={h} className="px-2 py-2 text-left font-medium whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {zenginParseResult.records.slice(0, 10).map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-2 py-1.5 font-mono">{r.bankCode}</td>
                          <td className="px-2 py-1.5">{r.bankName}</td>
                          <td className="px-2 py-1.5 font-mono">{r.branchCode}</td>
                          <td className="px-2 py-1.5">{r.branchName}</td>
                          <td className="px-2 py-1.5">{r.accountType === "1" ? "普通" : r.accountType === "2" ? "当座" : "貯蓄"}</td>
                          <td className="px-2 py-1.5 font-mono">{r.accountNumber}</td>
                          <td className="px-2 py-1.5">{r.recipientName}</td>
                          <td className="px-2 py-1.5 text-right font-mono">¥{parseInt(r.amount || "0").toLocaleString("ja-JP")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {zenginParseResult.records.length > 10 && (
                    <p className="text-xs text-gray-400 text-center py-2">… 他{zenginParseResult.records.length - 10}件</p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-600">出力形式:</span>
                  <label className="flex items-center gap-1 cursor-pointer text-sm">
                    <input type="radio" name="zenginFmt" value="csv" checked={zenginOutputFormat === "csv"} onChange={() => setZenginOutputFormat("csv")} className="accent-indigo-600" />CSV
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer text-sm">
                    <input type="radio" name="zenginFmt" value="json" checked={zenginOutputFormat === "json"} onChange={() => setZenginOutputFormat("json")} className="accent-indigo-600" />JSON
                  </label>
                  <button type="button" onClick={zenginOutputFormat === "csv" ? downloadZenginAsCsv : downloadZenginAsJson}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700">
                    📥 ダウンロード
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Template management (to-zengin only) */}
        {conversionDirection === "to-zengin" && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-4">
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setTemplatesOpen(o => !o)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700">
                📁 テンプレート
                {templates.length > 0 && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{templates.length}件</span>}
                <span className={`text-gray-400 text-xs transition-transform ${templatesOpen ? "rotate-180" : ""}`}>▼</span>
              </button>
              <button type="button" onClick={() => setShowTemplateSave(o => !o)}
                className="text-xs px-3 py-1.5 bg-kon text-white rounded-lg hover:bg-kon/90">
                💾 テンプレート保存
              </button>
            </div>
            {showTemplateSave && (
              <div className="mt-3 flex gap-2">
                <input type="text" value={templateName} onChange={e => setTemplateName(e.target.value)}
                  placeholder="テンプレート名" className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                <button type="button" onClick={saveTemplate} className="px-3 py-1.5 bg-kon text-white rounded-lg text-sm hover:bg-kon/90">保存</button>
                <button type="button" onClick={() => setShowTemplateSave(false)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600">取消</button>
              </div>
            )}
            {templatesOpen && templates.length > 0 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {templates.map(tmpl => (
                  <div key={tmpl.id} className="flex-shrink-0 bg-gray-50 rounded-xl p-3 border border-gray-100 min-w-[180px]">
                    <p className="text-sm font-medium text-gray-800 truncate mb-2">{tmpl.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{tmpl.transfers.length}件</p>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setHeaderData(tmpl.headerData); setTransfers(tmpl.transfers); setTemplatesOpen(false); setMascotState("success"); setMascotMessage("テンプレートを復元しました"); }}
                        className="text-xs text-kon hover:underline">復元</button>
                      <button type="button" onClick={() => deleteTemplate(tmpl.id)}
                        className="text-xs text-danger hover:text-danger hover:underline">削除</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {templatesOpen && templates.length === 0 && (
              <p className="mt-3 text-xs text-gray-400">保存されたテンプレートはありません</p>
            )}
          </section>
        )}

        {/* Input Mode Toggle (to-zengin only) */}
        {conversionDirection === "to-zengin" && (<>
        {/* Input Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button type="button"
            onClick={() => setInputMode("manual")}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
              inputMode === "manual"
                ? "bg-kon text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            手動入力
          </button>
          <button type="button"
            onClick={() => setInputMode("csv")}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
              inputMode === "csv"
                ? "bg-kon text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            CSV入力
          </button>
        </div>

        {/* Progress Stepper */}
        {(() => {
          const hFields = ['clientCode','clientName','transferDate','bankCode','branchCode','accountNumber'];
          const headerComplete = hFields.every(f => !validateHeaderField(f, (headerData as unknown as Record<string,string>)[f] || ''));
          const tFields = ['bankCode','branchCode','accountNumber','amount','recipientName'];
          const transfersValid = transfers.every(t =>
            tFields.every(f => !validateTransferField(f, (t as unknown as Record<string,string>)[f] || ''))
          );
          const currentStep = !headerComplete ? 1 : !transfersValid ? 2 : 3;
          const steps = [
            { n: 1, label: '委託者情報' },
            { n: 2, label: '振込先データ' },
            { n: 3, label: '確認・変換' },
          ];
          return (
            <div className="flex items-center my-4" role="list" aria-label="進行ステップ">
              {steps.map((step, i) => (
                <div key={step.n} className="flex items-center flex-1 last:flex-none" role="listitem">
                  <div className="flex flex-col items-center">
                    <div aria-current={step.n === currentStep ? "step" : undefined} aria-label={`ステップ${step.n}: ${step.label}`} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      step.n < currentStep ? 'bg-green-500 text-white' :
                      step.n === currentStep ? 'bg-kon text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {step.n < currentStep ? '✓' : step.n}
                    </div>
                    <span className={`text-xs mt-1 whitespace-nowrap ${
                      step.n === currentStep ? 'text-kon font-medium' : 'text-gray-400'
                    }`}>{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${
                      step.n < currentStep ? 'bg-kon' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Header Information */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-kon">委託者情報（依頼元）</h2>
            <button
              type="button"
              onClick={fillSampleData}
              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-kon hover:text-kon transition-colors"
            >
              📋 サンプルデータを入力
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                振込種別
                <div className="relative inline-block">
                  <button type="button" onClick={() => setTransferTypeTooltipOpen(o => !o)}
                    className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-xs leading-none flex items-center justify-center hover:bg-gray-300">?</button>
                  {transferTypeTooltipOpen && (
                    <div className="absolute left-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3 w-52 text-xs text-gray-600 dark:text-gray-300">
                      <p className="font-medium mb-1">振込種別について</p>
                      <p className="mb-1">🔵 <strong>総合振込</strong>: 一般的な振込（種別コード21）</p>
                      <p className="mb-1">🟢 <strong>給与振込</strong>: 給与の一括振込（種別コード11）</p>
                      <p>🟡 <strong>賞与振込</strong>: 賞与の一括振込（種別コード11/区分12）</p>
                    </div>
                  )}
                </div>
              </label>
              <select
                value={headerData.transferType}
                onChange={(e) =>
                  setHeaderData({
                    ...headerData,
                    transferType: e.target.value as "21" | "11" | "12",
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="21">総合振込</option>
                <option value="11">給与振込</option>
                <option value="12">賞与振込</option>
              </select>
            </div>
            {/* 委託者コード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                委託者コード
                {headerTouched['clientCode'] && (headerFieldError('clientCode')
                  ? <span className="text-danger text-xs ml-1">✗ {headerFieldError('clientCode')}</span>
                  : <span className="text-green-500 text-xs ml-1">✓</span>
                )}
              </label>
              <input
                type="text"
                value={headerData.clientCode}
                onChange={(e) => {
                  setHeaderData({ ...headerData, clientCode: e.target.value });
                  touchHeader('clientCode');
                }}
                onBlur={() => touchHeader('clientCode')}
                placeholder="10桁"
                maxLength={10}
                className={`w-full px-3 py-2 border rounded-lg ${
                  headerTouched['clientCode'] && headerFieldError('clientCode')
                    ? 'border-danger bg-gray-50'
                    : headerTouched['clientCode'] && !headerFieldError('clientCode')
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200'
                }`}
              />
            </div>
            {/* 委託者名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                委託者名（カナ）
                {headerTouched['clientName'] && (headerFieldError('clientName')
                  ? <span className="text-danger text-xs ml-1">✗ {headerFieldError('clientName')}</span>
                  : <span className="text-green-500 text-xs ml-1">✓</span>
                )}
              </label>
              <input
                type="text"
                value={headerData.clientName}
                onChange={(e) => {
                  setHeaderData({ ...headerData, clientName: hiraToKata(e.target.value) });
                  touchHeader('clientName');
                }}
                onBlur={() => touchHeader('clientName')}
                placeholder="カブシキガイシャ ヤマダ"
                className={`w-full px-3 py-2 border rounded-lg ${
                  headerTouched['clientName'] && headerFieldError('clientName')
                    ? 'border-danger bg-gray-50'
                    : headerTouched['clientName'] && !headerFieldError('clientName')
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200'
                }`}
              />
            </div>
            {/* 振込指定日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                振込指定日（MMDD）
                {headerTouched['transferDate'] && (headerFieldError('transferDate')
                  ? <span className="text-danger text-xs ml-1">✗ {headerFieldError('transferDate')}</span>
                  : <span className="text-green-500 text-xs ml-1">✓ {transferDateDisplay}</span>
                )}
              </label>
              <input
                type="text"
                value={headerData.transferDate}
                onChange={(e) => {
                  setHeaderData({ ...headerData, transferDate: e.target.value });
                  touchHeader('transferDate');
                }}
                onBlur={() => touchHeader('transferDate')}
                placeholder="0115"
                maxLength={4}
                className={`w-full px-3 py-2 border rounded-lg ${
                  headerTouched['transferDate'] && headerFieldError('transferDate')
                    ? 'border-danger bg-gray-50'
                    : headerTouched['transferDate'] && !headerFieldError('transferDate')
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200'
                }`}
              />
            </div>
            {/* 仕向銀行 — autocomplete spanning 2 columns */}
            <div className="col-span-2 md:col-span-2" ref={bankDropRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                仕向銀行
                {headerTouched['bankCode'] && (headerFieldError('bankCode')
                  ? <span className="text-danger text-xs ml-1">✗ {headerFieldError('bankCode')}</span>
                  : <span className="text-green-500 text-xs ml-1">✓ {MAJOR_BANKS.find(b => b.code === headerData.bankCode)?.name || ''}</span>
                )}
              </label>
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bankQuery || headerData.bankCode}
                    onChange={(e) => {
                      setBankQuery(e.target.value);
                      setBankDropOpen(true);
                      if (/^\d{4}$/.test(e.target.value)) {
                        const match = MAJOR_BANKS.find(b => b.code === e.target.value);
                        if (match) {
                          setHeaderData({ ...headerData, bankCode: match.code, bankName: match.kana });
                          setBankQuery('');
                          setBankDropOpen(false);
                        } else {
                          setHeaderData({ ...headerData, bankCode: e.target.value });
                        }
                        touchHeader('bankCode');
                      }
                    }}
                    onFocus={() => { setBankQuery(''); setBankDropOpen(true); }}
                    onBlur={() => { setTimeout(() => setBankDropOpen(false), 150); touchHeader('bankCode'); }}
                    placeholder="銀行名・コードで検索"
                    className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                      headerTouched['bankCode'] && headerFieldError('bankCode')
                        ? 'border-danger bg-gray-50'
                        : headerTouched['bankCode'] && !headerFieldError('bankCode')
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  />
                  <span className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                    {headerData.bankCode && <span className="font-mono bg-gray-100 px-2 py-1 rounded">{headerData.bankCode}</span>}
                  </span>
                </div>
                {bankDropOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredBanks(bankQuery).map((b) => (
                      <button
                        key={b.code}
                        type="button"
                        onMouseDown={() => {
                          setHeaderData({ ...headerData, bankCode: b.code, bankName: b.kana });
                          setBankQuery('');
                          setBankDropOpen(false);
                          touchHeader('bankCode');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-ai/30 transition-colors"
                      >
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 w-10 flex-shrink-0">{b.code}</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{b.name}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{b.kana}</span>
                      </button>
                    ))}
                    {filteredBanks(bankQuery).length === 0 && (
                      <p className="px-3 py-2 text-sm text-gray-400">該当なし — 手動でコードを入力してください</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* 仕向支店 — autocomplete spanning 2 columns */}
            <div className="col-span-2 md:col-span-2" ref={branchDropRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                仕向支店
                {headerTouched['branchCode'] && (headerFieldError('branchCode')
                  ? <span className="text-danger text-xs ml-1">✗ {headerFieldError('branchCode')}</span>
                  : <span className="text-green-500 text-xs ml-1">✓ {COMMON_BRANCHES.find(b => b.code === headerData.branchCode)?.name || ''}</span>
                )}
              </label>
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={branchQuery || headerData.branchCode}
                    onChange={(e) => {
                      setBranchQuery(e.target.value);
                      setBranchDropOpen(true);
                      if (/^\d{3}$/.test(e.target.value)) {
                        const match = COMMON_BRANCHES.find(b => b.code === e.target.value);
                        if (match) {
                          setHeaderData({ ...headerData, branchCode: match.code, branchName: match.kana });
                          setBranchQuery('');
                          setBranchDropOpen(false);
                        } else {
                          setHeaderData({ ...headerData, branchCode: e.target.value });
                        }
                        touchHeader('branchCode');
                      }
                    }}
                    onFocus={() => { setBranchQuery(''); setBranchDropOpen(true); }}
                    onBlur={() => { setTimeout(() => setBranchDropOpen(false), 150); touchHeader('branchCode'); }}
                    placeholder="支店名・コードで検索"
                    className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                      headerTouched['branchCode'] && headerFieldError('branchCode')
                        ? 'border-danger bg-gray-50'
                        : headerTouched['branchCode'] && !headerFieldError('branchCode')
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  />
                  <span className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                    {headerData.branchCode && <span className="font-mono bg-gray-100 px-2 py-1 rounded">{headerData.branchCode}</span>}
                  </span>
                </div>
                {branchDropOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredBranches(branchQuery, headerData.bankCode).map((b) => (
                      <button
                        key={b.code}
                        type="button"
                        onMouseDown={() => {
                          setHeaderData({ ...headerData, branchCode: b.code, branchName: b.kana });
                          setBranchQuery('');
                          setBranchDropOpen(false);
                          touchHeader('branchCode');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-ai/30 transition-colors"
                      >
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 w-10 flex-shrink-0">{b.code}</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{b.name}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{b.kana}</span>
                      </button>
                    ))}
                    {filteredBranches(branchQuery).length === 0 && (
                      <p className="px-3 py-2 text-sm text-gray-400">該当なし — 手動でコードを入力してください</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* 預金種目 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                預金種目
              </label>
              <select
                value={headerData.accountType}
                onChange={(e) =>
                  setHeaderData({ ...headerData, accountType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="1">普通</option>
                <option value="2">当座</option>
                <option value="4">貯蓄</option>
              </select>
            </div>
            {/* 口座番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                口座番号
                {headerTouched['accountNumber'] && (headerFieldError('accountNumber')
                  ? <span className="text-danger text-xs ml-1">✗ {headerFieldError('accountNumber')}</span>
                  : <span className="text-green-500 text-xs ml-1">✓</span>
                )}
              </label>
              <input
                type="text"
                value={headerData.accountNumber}
                onChange={(e) => {
                  setHeaderData({ ...headerData, accountNumber: e.target.value });
                  touchHeader('accountNumber');
                }}
                onBlur={() => touchHeader('accountNumber')}
                placeholder="1234567"
                maxLength={7}
                className={`w-full px-3 py-2 border rounded-lg ${
                  headerTouched['accountNumber'] && headerFieldError('accountNumber')
                    ? 'border-danger bg-gray-50'
                    : headerTouched['accountNumber'] && !headerFieldError('accountNumber')
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200'
                }`}
              />
            </div>
            {headerData.transferType === '12' && (
              <div className="col-span-2 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  賞与対象期間
                </label>
                <div className="flex items-center gap-2">
                  <input type="text" value={headerData.bonusPeriodFrom || ''}
                    onChange={e => setHeaderData({...headerData, bonusPeriodFrom: e.target.value})}
                    placeholder="202401" maxLength={6}
                    className="w-28 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-gray-200" />
                  <span className="text-gray-400">〜</span>
                  <input type="text" value={headerData.bonusPeriodTo || ''}
                    onChange={e => setHeaderData({...headerData, bonusPeriodTo: e.target.value})}
                    placeholder="202406" maxLength={6}
                    className="w-28 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-gray-200" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CSV Input Mode — Feature D */}
        {inputMode === "csv" && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-kon">CSV入力</h2>
              <button type="button"
                onClick={handleSampleCsvDownload}
                className="text-xs text-kon hover:underline flex items-center gap-1"
              >
                📥 サンプルCSVダウンロード
              </button>
            </div>

            {/* Column mapping hint */}
            <div className="flex gap-1 flex-wrap mb-4">
              {['銀行コード','銀行名','支店コード','支店名','預金種目','口座番号','受取人名','金額'].map((col, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                  {i+1}:{col}
                </span>
              ))}
            </div>

            {/* Drag-drop zone */}
            <div
              role="button"
            aria-label="CSVファイルをアップロード。csv、txt対応"
            onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-4 ${
                isDragging
                  ? "border-kon bg-gray-50 scale-[1.01]"
                  : "border-gray-300 hover:border-kon hover:bg-gray-50"
              }`}
            >
              <div className="text-3xl mb-2">📁</div>
              {csvFileName ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-kon/10 text-kon rounded-full text-sm font-medium">
                    📄 {csvFileName}
                    <button type="button" onClick={(e) => { e.stopPropagation(); setCsvFileName(''); setCsvInput(''); setParsedPreviewRows([]); }}
                      className="ml-1 text-gray-400 hover:text-danger text-xs">✕</button>
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">CSVファイルをドラッグ＆ドロップ</p>
                  <p className="text-xs text-gray-400 mt-1">または<span className="text-kon underline">クリックして選択</span>（.csv / .txt）</p>
                  <p className="text-xs text-gray-400 mt-1">文字コード自動判定（Shift-JIS / UTF-8）</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>

            {/* Paste area */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📋 Excelからコピーしたデータを貼り付け（タブ区切り対応）
            </label>
            <textarea
              value={csvInput}
              onChange={(e) => {
                setCsvInput(e.target.value);
                if (e.target.value.trim()) parseCsvText(e.target.value);
              }}
              placeholder={`0001\tミズホ\t001\tホンテン\t普通\t1234567\tヤマダタロウ\t100000`}
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm mb-3 focus:border-kon focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              <button type="button"
                onClick={handleCsvParse}
                className="px-4 py-2 bg-kon text-white rounded-lg hover:bg-kon/90 text-sm"
              >
                解析して反映
              </button>
              <button type="button"
                onClick={loadSampleData}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                サンプル挿入
              </button>
            </div>

            {/* Excel upload section */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 font-medium px-2">または</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📊 Excelファイル (.xlsx / .xls)
                {xlsToast && (
                  <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Excelデータを取り込みました</span>
                )}
              </p>
              <div
                role="button"
                aria-label="Excelファイルをアップロード。xlsx、xls対応"
                onDrop={e => { e.preventDefault(); setXlsIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleExcelFile(f); }}
                onDragOver={e => { e.preventDefault(); setXlsIsDragging(true); }}
                onDragLeave={() => setXlsIsDragging(false)}
                onClick={() => xlsFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  xlsIsDragging ? 'border-green-400 bg-green-50 dark:bg-green-900/20 scale-[1.01]'
                    : 'border-gray-300 dark:border-gray-600 hover:border-kon hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className="text-2xl mb-1">📊</div>
                {xlsFile ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    📄 {xlsFile.name}
                    <button type="button" onClick={e => { e.stopPropagation(); setXlsFile(null); setXlsSheets([]); setXlsShowPreview(false); setXlsError(''); }}
                      className="ml-1 text-gray-400 hover:text-danger text-xs">✕</button>
                  </span>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Excelファイルをドラッグ＆ドロップ</p>
                    <p className="text-xs text-gray-400 mt-1">または<span className="text-kon underline">クリックして選択</span>（.xlsx / .xls）</p>
                  </>
                )}
                <input ref={xlsFileInputRef} type="file" accept=".xlsx,.xls" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleExcelFile(f); }} />
              </div>
              {xlsError && <p className="text-danger text-xs mt-2">⚠️ {xlsError}</p>}
              {xlsSheets.length > 1 && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 dark:text-gray-400">シートを選択:</span>
                  {xlsSheets.map(s => (
                    <button key={s} type="button"
                      onClick={() => { setXlsSelectedSheet(s); processSheet(xlsWorkbookRef.current, s); }}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        xlsSelectedSheet === s
                          ? 'bg-kon text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                      }`}>{s}</button>
                  ))}
                </div>
              )}
              {xlsShowPreview && xlsPreviewRows.length > 0 && (
                <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded-full">{xlsPreviewRows.length}件</span>
                    プレビュー（先頭3行表示）
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          {['銀行','支店','種目','口座番号','受取人名','金額'].map(h => (
                            <th key={h} className="px-2 py-1 text-left text-gray-500 dark:text-gray-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {xlsPreviewRows.slice(0, 3).map((r, i) => (
                          <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                            <td className="px-2 py-1 dark:text-gray-300">{r.bankCode} {r.bankName}</td>
                            <td className="px-2 py-1 dark:text-gray-300">{r.branchCode} {r.branchName}</td>
                            <td className="px-2 py-1 dark:text-gray-300">{r.accountType === '1' ? '普通' : r.accountType === '2' ? '当座' : '貯蓄'}</td>
                            <td className="px-2 py-1 font-mono dark:text-gray-300">{r.accountNumber}</td>
                            <td className="px-2 py-1 dark:text-gray-300">{r.recipientName}</td>
                            <td className="px-2 py-1 font-mono dark:text-gray-300">¥{parseInt(r.amount||'0').toLocaleString('ja-JP')}</td>
                          </tr>
                        ))}
                        {xlsPreviewRows.length > 3 && (
                          <tr className="border-t border-gray-100 dark:border-gray-700">
                            <td colSpan={6} className="px-2 py-1 text-center text-gray-400">… 他{xlsPreviewRows.length - 3}件</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                    <button type="button" onClick={confirmExcelImport}
                      className="px-4 py-1.5 bg-kon text-white text-sm rounded-lg hover:bg-kon/90">
                      このデータを取り込む
                    </button>
                    <button type="button" onClick={() => { setXlsShowPreview(false); setXlsFile(null); setXlsSheets([]); setXlsError(''); }}
                      className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Parsed preview */}
            {parsedPreviewRows.length > 0 && (
              <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 flex items-center gap-2">
                  <span className="bg-green-500 text-white px-2 py-0.5 rounded-full">{parsedPreviewRows.length}件</span>
                  読み込み済み
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        {['銀行','支店','種目','口座番号','受取人名','金額'].map(h => (
                          <th key={h} className="px-2 py-1 text-left text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedPreviewRows.slice(0, 5).map((r, i) => (
                        <tr key={i} className="border-t border-gray-100">
                          <td className="px-2 py-1">{r.bankCode} {r.bankName}</td>
                          <td className="px-2 py-1">{r.branchCode} {r.branchName}</td>
                          <td className="px-2 py-1">{r.accountType === '1' ? '普通' : r.accountType === '2' ? '当座' : '貯蓄'}</td>
                          <td className="px-2 py-1 font-mono">{r.accountNumber}</td>
                          <td className="px-2 py-1">{r.recipientName}</td>
                          <td className="px-2 py-1 font-mono">¥{parseInt(r.amount || '0').toLocaleString('ja-JP')}</td>
                        </tr>
                      ))}
                      {parsedPreviewRows.length > 5 && (
                        <tr className="border-t border-gray-100">
                          <td colSpan={6} className="px-2 py-1 text-center text-gray-400">… 他{parsedPreviewRows.length - 5}件</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Transfer Data */}
        <section ref={formSectionRef} id="form-section" className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-kon">
              振込先データ（{transfers.length}件）
            </h2>
            <button type="button"
              onClick={addTransferRow}
              className="px-3 py-1 bg-kon text-white rounded-lg text-sm hover:bg-kon/90"
            >
              + 行を追加
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-2 py-2 text-left text-gray-700 dark:text-gray-200">銀行コード</th>
                  <th className="px-2 py-2 text-left text-gray-700 dark:text-gray-200">銀行名</th>
                  <th className="px-2 py-2 text-left text-gray-700 dark:text-gray-200">支店コード</th>
                  <th className="px-2 py-2 text-left text-gray-700 dark:text-gray-200">支店名</th>
                  <th className="px-2 py-2 text-left text-gray-700 dark:text-gray-200">種目</th>
                  <th className="px-2 py-2 text-left text-gray-700 dark:text-gray-200">口座番号</th>
                  <th className="px-2 py-2 text-left text-gray-700 dark:text-gray-200">受取人名</th>
                  {headerData.transferType !== '21' && (
                    <th className="px-2 py-2 text-left text-gray-700 dark:text-gray-200">従業員コード</th>
                  )}
                  <th className="px-2 py-2 text-left text-gray-700 dark:text-gray-200">金額</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer, index) => {
                  const rBankErr = rowFieldError(index, 'bankCode');
                  const rBranchErr = rowFieldError(index, 'branchCode');
                  const rAccErr = rowFieldError(index, 'accountNumber');
                  const rAmtErr = rowFieldError(index, 'amount');
                  const rNameErr = rowFieldError(index, 'recipientName');
                  const anyRealTimeErr = rBankErr || rBranchErr || rAccErr || rAmtErr || rNameErr;
                  return (
                    <tr key={index} className={`border-b ${anyRealTimeErr ? "bg-gray-50" : ""}`}>
                      {/* Bank code — autocomplete */}
                      <td className="px-1 py-2 relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={rowBankQuery[index] !== undefined ? rowBankQuery[index] : transfer.bankCode}
                            onChange={(e) => {
                              const q = e.target.value;
                              setRowBankQuery((prev) => ({ ...prev, [index]: q }));
                              setRowBankDropOpen((prev) => ({ ...prev, [index]: true }));
                              if (/^\d{4}$/.test(q)) {
                                const match = MAJOR_BANKS.find(b => b.code === q);
                                if (match) {
                                  updateTransfer(index, "bankCode", match.code);
                                  updateTransfer(index, "bankName", match.kana);
                                  setRowBankQuery((prev) => ({ ...prev, [index]: '' }));
                                  setRowBankDropOpen((prev) => ({ ...prev, [index]: false }));
                                } else {
                                  updateTransfer(index, "bankCode", q);
                                }
                              }
                            }}
                            onFocus={() => {
                              setRowBankQuery((prev) => ({ ...prev, [index]: '' }));
                              setRowBankDropOpen((prev) => ({ ...prev, [index]: true }));
                            }}
                            onBlur={() => setTimeout(() => setRowBankDropOpen((prev) => ({ ...prev, [index]: false })), 150)}
                            placeholder="銀行"
                            className={`w-24 px-2 py-1 border rounded text-xs ${
                              rBankErr ? 'border-danger bg-gray-50' :
                              rowTouched[`${index}_bankCode`] && !rBankErr && transfer.bankCode ? 'border-green-400' : ''
                            }`}
                          />
                          {rowBankDropOpen[index] && (
                            <div className="absolute z-50 left-0 top-full mt-0.5 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {filteredBanks(rowBankQuery[index] || '').map((b) => (
                                <button
                                  key={b.code}
                                  type="button"
                                  onMouseDown={() => {
                                    updateTransfer(index, "bankCode", b.code);
                                    updateTransfer(index, "bankName", b.kana);
                                    setRowBankQuery((prev) => ({ ...prev, [index]: '' }));
                                    setRowBankDropOpen((prev) => ({ ...prev, [index]: false }));
                                  }}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-ai/30 dark:text-gray-200"
                                >
                                  <span className="font-mono text-xs text-gray-400 w-9 flex-shrink-0">{b.code}</span>
                                  <span className="text-xs text-gray-800 truncate">{b.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {rBankErr && <p className="text-danger text-xs mt-0.5">{rBankErr}</p>}
                      </td>
                      {/* Bank name (auto-filled, editable) */}
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          value={transfer.bankName}
                          onChange={(e) => updateTransfer(index, "bankName", e.target.value)}
                          className="w-20 px-2 py-2 border rounded text-xs border-gray-200"
                          placeholder="カナ"
                        />
                      </td>
                      {/* Branch code — autocomplete */}
                      <td className="px-1 py-2 relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={rowBranchQuery[index] !== undefined ? rowBranchQuery[index] : transfer.branchCode}
                            onChange={(e) => {
                              const q = e.target.value;
                              setRowBranchQuery((prev) => ({ ...prev, [index]: q }));
                              setRowBranchDropOpen((prev) => ({ ...prev, [index]: true }));
                              if (/^\d{3}$/.test(q)) {
                                const match = COMMON_BRANCHES.find(b => b.code === q);
                                if (match) {
                                  updateTransfer(index, "branchCode", match.code);
                                  updateTransfer(index, "branchName", match.kana);
                                  setRowBranchQuery((prev) => ({ ...prev, [index]: '' }));
                                  setRowBranchDropOpen((prev) => ({ ...prev, [index]: false }));
                                } else {
                                  updateTransfer(index, "branchCode", q);
                                }
                              }
                            }}
                            onFocus={() => {
                              setRowBranchQuery((prev) => ({ ...prev, [index]: '' }));
                              setRowBranchDropOpen((prev) => ({ ...prev, [index]: true }));
                            }}
                            onBlur={() => setTimeout(() => setRowBranchDropOpen((prev) => ({ ...prev, [index]: false })), 150)}
                            placeholder="支店"
                            className={`w-20 px-2 py-1 border rounded text-xs ${
                              rBranchErr ? 'border-danger bg-gray-50' :
                              rowTouched[`${index}_branchCode`] && !rBranchErr && transfer.branchCode ? 'border-green-400' : ''
                            }`}
                          />
                          {rowBranchDropOpen[index] && (
                            <div className="absolute z-50 left-0 top-full mt-0.5 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {filteredBranches(rowBranchQuery[index] || '', transfer.bankCode).map((b) => (
                                <button
                                  key={b.code}
                                  type="button"
                                  onMouseDown={() => {
                                    updateTransfer(index, "branchCode", b.code);
                                    updateTransfer(index, "branchName", b.kana);
                                    setRowBranchQuery((prev) => ({ ...prev, [index]: '' }));
                                    setRowBranchDropOpen((prev) => ({ ...prev, [index]: false }));
                                  }}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-ai/30 dark:text-gray-200"
                                >
                                  <span className="font-mono text-xs text-gray-400 w-7 flex-shrink-0">{b.code}</span>
                                  <span className="text-xs text-gray-800 truncate">{b.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {rBranchErr && <p className="text-danger text-xs mt-0.5">{rBranchErr}</p>}
                      </td>
                      {/* Branch name (auto-filled, editable) */}
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          value={transfer.branchName}
                          onChange={(e) => updateTransfer(index, "branchName", e.target.value)}
                          className="w-20 px-2 py-2 border rounded text-xs border-gray-200"
                          placeholder="カナ"
                        />
                      </td>
                      <td className="px-1 py-2">
                        <select
                          value={transfer.accountType}
                          onChange={(e) => updateTransfer(index, "accountType", e.target.value)}
                          className="w-14 px-1 py-2 border rounded text-xs"
                        >
                          <option value="1">普通</option>
                          <option value="2">当座</option>
                        </select>
                      </td>
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          value={transfer.accountNumber}
                          onChange={(e) => updateTransfer(index, "accountNumber", e.target.value)}
                          onBlur={() => touchRow(index, 'accountNumber')}
                          maxLength={7}
                          placeholder="1234567"
                          className={`w-20 px-2 py-1 border rounded text-xs ${
                            rAccErr ? 'border-danger bg-gray-50' :
                            rowTouched[`${index}_accountNumber`] && !rAccErr && transfer.accountNumber ? 'border-green-400' : ''
                          }`}
                        />
                        {rAccErr && <p className="text-danger text-xs mt-0.5">{rAccErr}</p>}
                      </td>
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          value={transfer.recipientName}
                          onChange={(e) => updateTransfer(index, "recipientName", e.target.value)}
                          onBlur={() => touchRow(index, 'recipientName')}
                          placeholder="カナ"
                          className={`w-28 px-2 py-1 border rounded text-xs ${
                            rNameErr ? 'border-danger bg-gray-50' :
                            rowTouched[`${index}_recipientName`] && !rNameErr && transfer.recipientName ? 'border-green-400' : ''
                          }`}
                        />
                        {rNameErr && <p className="text-danger text-xs mt-0.5">{rNameErr}</p>}
                      </td>
                      {headerData.transferType !== '21' && (
                        <td className="px-1 py-2">
                          <input type="text" value={transfer.employeeCode || ''}
                            onChange={e => updateTransfer(index, 'employeeCode', e.target.value.replace(/[^0-9]/g,''))}
                            placeholder="任意" maxLength={10}
                            className="w-24 px-2 py-1 border border-gray-200 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-800 dark:text-gray-200" />
                        </td>
                      )}
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          value={transfer.amount}
                          onChange={(e) => updateTransfer(index, "amount", e.target.value)}
                          onBlur={() => touchRow(index, 'amount')}
                          placeholder="100000"
                          className={`w-24 px-2 py-1 border rounded text-xs ${
                            rAmtErr ? 'border-danger bg-gray-50' :
                            rowTouched[`${index}_amount`] && !rAmtErr && transfer.amount ? 'border-green-400' : ''
                          }`}
                        />
                        {rAmtErr && <p className="text-danger text-xs mt-0.5">{rAmtErr}</p>}
                      </td>
                      <td className="px-1 py-2">
                        <button type="button"
                          onClick={() => removeTransferRow(index)}
                          className="text-danger hover:text-danger text-xs"
                          disabled={transfers.length === 1}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Spacer for sticky bar */}
        <div className="h-4 mb-2" />

        {/* Validation summary */}
        {(() => {
          const errCount = countAllErrors();
          if (!hasAttemptedConvert || errCount === 0) return null;
          return (
            <div role="alert" aria-live="assertive" className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-sm text-danger">
              <span className="text-lg">⚠️</span>
              <span>{errCount}件の入力エラーがあります。修正してから変換してください。</span>
            </div>
          );
        })()}

        {/* Convert Button */}
        {(() => {
          const errCount = countAllErrors();
          const hasRequiredHeader = !!(headerData.clientCode && headerData.clientName);
          const disabled = hasAttemptedConvert && errCount > 0;
          return (
            <button type="button"
              onClick={handleConvert}
              disabled={disabled}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-6 flex items-center justify-center gap-2 ${
                disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-kon to-ai text-white hover:shadow-lg'
              }`}
            >
              全銀フォーマットに変換
              {disabled && (
                <span className="ml-2 bg-danger text-white text-xs rounded-full px-2 py-0.5">
                  {errCount}エラー
                </span>
              )}
            </button>
          );
        })()}

        {/* Result — Feature E */}
        {result && (
          <section className="bg-white dark:bg-gray-900 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 mb-6 relative" id="result-section">
            {/* Copy toast */}
            {copyToast && (
              <div className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg z-10 animate-fade-in">
                📋 コピーしました
              </div>
            )}

            {/* Heading */}
            <h3 className="font-bold text-kon dark:text-white text-lg mb-4">📄 変換結果プレビュー</h3>

            {/* Record count summary */}
            {(() => {
              const lines = result.split('\r\n').filter(Boolean);
              const headerCount = lines.filter(l => l[0] === '1').length;
              const dataCount = lines.filter(l => l[0] === '2').length;
              const trailerCount = lines.filter(l => l[0] === '8').length;
              const endCount = lines.filter(l => l[0] === '9').length;
              return (
                <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
                  <span className="bg-gray-50 text-kon dark:bg-kon/40 dark:text-gray-300 px-2 py-1 rounded-full font-medium">ヘッダー {headerCount}件</span>
                  <span className="text-gray-400">+</span>
                  <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-1 rounded-full font-medium">データ {dataCount}件</span>
                  <span className="text-gray-400">+</span>
                  <span className="bg-gray-50 text-kon dark:bg-kon/40 dark:text-amber-300 px-2 py-1 rounded-full font-medium">トレーラー {trailerCount}件</span>
                  <span className="text-gray-400">+</span>
                  <span className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full font-medium">エンド {endCount}件</span>
                  <span className="text-gray-400">=</span>
                  <span className="bg-kon text-white px-2 py-1 rounded-full font-bold">全 {lines.length} レコード</span>
                </div>
              );
            })()}

            {/* File info */}
            <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">📦 {new TextEncoder().encode(result).length}バイト</span>
              <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">📄 {result.split('\r\n').filter(Boolean).length}レコード</span>
              <span className="bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">🔤 {outputEncoding === 'shift-jis' ? 'Shift-JIS' : 'UTF-8'}</span>
            </div>

            {/* Color-coded preview */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4">
              {/* Character position ruler */}
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 border-l-4 border-l-transparent">
                <span className="flex-shrink-0 w-24 text-xs text-gray-400 font-sans invisible">ruler</span>
                <span className="font-mono text-xs text-gray-300 dark:text-gray-600 select-none whitespace-pre overflow-x-auto">
                  {Array.from({ length: 12 }, (_, i) => String((i + 1) * 10).padStart(10)).join('')}
                </span>
              </div>
              {getPreviewLines().map(({ line, label, color }, i) => {
                const dataIndex = (() => {
                  let di = 0;
                  return color === 'green' ? (() => {
                    const prev = getPreviewLines().slice(0, i);
                    return prev.filter(p => p.color === 'green').length + 1;
                  })() : 0;
                })();
                return (
                  <div key={i} className={`flex items-start gap-2 px-3 py-1.5 border-b dark:border-gray-700 last:border-0 border-l-4 ${
                    color === 'blue'   ? 'bg-gray-50 dark:bg-kon/30 border-l-blue-500' :
                    color === 'green'  ? (dataIndex % 2 === 1 ? 'bg-white dark:bg-gray-800 border-l-green-500' : 'bg-gray-50 dark:bg-gray-700 border-l-green-500') :
                    color === 'orange' ? 'bg-gray-50 dark:bg-kon/30 border-l-amber-500' :
                                         'bg-gray-100 dark:bg-gray-600 border-l-gray-500'
                  }`}>
                    <span className={`flex-shrink-0 w-24 text-center text-white text-xs px-1.5 py-0.5 rounded font-sans ${
                      color === 'blue'   ? 'bg-kon' :
                      color === 'green'  ? 'bg-green-500' :
                      color === 'orange' ? 'bg-kon' :
                                           'bg-gray-400'
                    }`}>
                      {color === 'blue'   ? 'ヘッダー' :
                       color === 'green'  ? `データ #${dataIndex}` :
                       color === 'orange' ? 'トレーラー' : 'エンド'}
                    </span>
                    {color === 'blue' ? (
                      <span className="font-mono text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-nowrap">
                        <span>{line.slice(0, 1)}</span>
                        <span className="bg-gray-50 dark:bg-kon text-kon dark:text-gray-300 px-0.5 rounded">{line.slice(1, 3)}</span>
                        <span>{line.slice(3, 103)}</span>
                        <span className="bg-gray-50 dark:bg-kon text-kon dark:text-amber-200 px-0.5 rounded">{line.slice(103, 105)}</span>
                        <span>{line.slice(105)}</span>
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-nowrap">{line}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Encoding selector + action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 text-sm mr-2">
                <span className="text-gray-500 dark:text-gray-400 text-xs">エンコーディング:</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="enc" value="shift-jis"
                    checked={outputEncoding === 'shift-jis'}
                    onChange={() => setOutputEncoding('shift-jis')}
                    className="accent-kon" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Shift-JIS</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="enc" value="utf-8"
                    checked={outputEncoding === 'utf-8'}
                    onChange={() => setOutputEncoding('utf-8')}
                    className="accent-kon" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">UTF-8</span>
                </label>
              </div>
              <button type="button"
                onClick={() => handleDownload()}
                className="flex items-center gap-2 px-5 py-2.5 bg-kon text-white rounded-xl font-medium text-sm hover:bg-kon/90 transition-colors"
              >
                📥 ダウンロード
              </button>
              <button type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-kon text-kon dark:text-white dark:border-white rounded-xl font-medium text-sm hover:bg-kon/5 transition-colors"
              >
                📋 コピー
              </button>
              <button type="button"
                onClick={() => { setResult(""); document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ml-auto"
              >
                ✏️ 戻って修正
              </button>
            </div>
          </section>
        )}

        {/* Related Tools */}
        </>)}

        <RelatedTools tools={relatedToolSets.bankFormat} title="あわせて使えるツール" />



        <div className="mt-8 text-center">
          <Link href="/convert" className="text-kon hover:text-ai">
            ← 変換ツール一覧に戻る
          </Link>
        </div>

        {/* SEO Content */}
        {seoContent && (
          <section className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="font-bold text-kon mb-4 text-lg">全銀フォーマット変換について</h2>
            <p className="text-gray-600 mb-4">{seoContent.intro}</p>
            {seoContent.useCases && (
              <div className="grid sm:grid-cols-2 gap-3 my-4">
                {seoContent.useCases.map((uc, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-800">{uc.title}</p>
                    <p className="text-sm text-gray-600">{uc.desc}</p>
                  </div>
                ))}
              </div>
            )}
            {seoContent.tips && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-kon">💡 <strong>ヒント:</strong> {seoContent.tips}</p>
              </div>
            )}
          </section>
        )}

        {/* FAQ */}
        <section className="mt-8">
          <h2 className="font-bold text-kon mb-4 text-lg">よくある質問</h2>
          <div className="space-y-3">
            <LazyFAQ faq={faq ?? BUILT_IN_FAQ} />
          </div>
        </section>
        <AdUnit slot="5612038947" format="horizontal" />
      </div>
    </div>
  );
}
