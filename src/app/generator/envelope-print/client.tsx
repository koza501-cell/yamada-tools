"use client";
import { LazyFAQ } from "@/components/common/LazyFAQ";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";
import RelatedTools, { relatedToolSets } from "@/components/common/RelatedTools";
import { AdUnit } from "@/components/common/AdUnit";
import { usePricingContext } from '@/components/common/PricingTriggerProvider';
import * as XLSX from 'xlsx';
import BulkModePanel from "@/components/envelope/BulkModePanel";
import { isFeatureEnabled } from "@/config/featureFlags";

const ENVELOPE_SIZES = {
  naga3:  { name: "長形3号",    width: 120, height: 235, type: "naga", postal: "teikei" },
  naga4:  { name: "長形4号",    width: 90,  height: 205, type: "naga", postal: "teikei" },
  naga40: { name: "長形40号",   width: 90,  height: 225, type: "naga", postal: "teikei" },
  naga30: { name: "長形30号",   width: 92,  height: 235, type: "naga", postal: "teikei" },
  kaku2:  { name: "角形2号",    width: 240, height: 332, type: "kaku", postal: "teikei-gai" },
  kakuA4: { name: "角形A4",     width: 228, height: 312, type: "kaku", postal: "teikei-gai" },
  kaku3:  { name: "角形3号",    width: 216, height: 277, type: "kaku", postal: "teikei-gai" },
  kaku6:  { name: "角形6号",    width: 162, height: 229, type: "kaku", postal: "teikei-gai" },
  kaku8:  { name: "角形8号",    width: 119, height: 197, type: "kaku", postal: "teikei" },
  yo0:    { name: "洋形0号/洋長3", width: 235, height: 120, type: "yo", postal: "teikei" },
  yo2:    { name: "洋形2号",    width: 162, height: 114, type: "yo", postal: "teikei" },
  yo3:    { name: "洋形3号",    width: 148, height: 98,  type: "yo", postal: "teikei" },
  yo4:    { name: "洋形4号",    width: 235, height: 105, type: "yo", postal: "teikei" },
  yo6:    { name: "洋形6号",    width: 190, height: 98,  type: "yo", postal: "teikei" },
};

interface FAQ { question: string; answer: string; }
interface SeoContent { intro: string; useCases?: { title: string; desc: string }[]; tips?: string; }
interface EnvelopePrintClientProps { faq?: FAQ[]; seoContent?: SeoContent; }
type EnvelopeSize = keyof typeof ENVELOPE_SIZES;
type WritingDirection = "vertical" | "horizontal";

interface AddressData {
  postalCode: string; prefecture: string; city: string; address1: string;
  address2: string; building: string; companyName: string; department: string;
  name: string; honorific: string;
}
interface SenderData { postalCode: string; address: string; companyName: string; name: string; }
interface StampData { enabled: boolean; text: string; color: "red" | "blue" | "black"; }

interface SavedAddress {
  id: string;
  label: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  building: string;
  company: string;
  department: string;
  name: string;
  honorific: string;
  createdAt: number;
  lastUsedAt: number;
}

interface PrintHistoryEntry {
  id: string;
  timestamp: number;
  recipient: {
    postalCode: string; prefecture: string; city: string;
    address: string; building: string; company: string; name: string; honorific: string;
  };
  envelopeSize: string;
  envelopeLabel: string;
}

const FREE_ADDRESS_LIMIT = 3;
const FREE_CSV_LIMIT = 5;
const FREE_HISTORY_LIMIT = 3;

interface LayoutSettings {
  recipientAddressX: number; recipientAddressY: number; recipientAddressFontSize: number;
  recipientNameX: number; recipientNameY: number; recipientNameFontSize: number;
  senderX: number; senderY: number; senderFontSize: number;
  stampX: number; stampY: number; stampFontSize: number;
  postalX: number; postalY: number; postalFontSize: number;
}

const getDefaultSettings = (size: EnvelopeSize): LayoutSettings => {
  const e = ENVELOPE_SIZES[size];
  if (e.type === "yo") {
    return { recipientAddressX: 15, recipientAddressY: 38, recipientAddressFontSize: 9,
      recipientNameX: 20, recipientNameY: 55, recipientNameFontSize: 12,
      senderX: e.width - 10, senderY: e.height - 25, senderFontSize: 5,
      stampX: 10, stampY: e.height - 20, stampFontSize: 7,
      postalX: e.width - 70, postalY: 22, postalFontSize: 6 };
  } else if (e.type === "kaku") {
    return { recipientAddressX: e.width - 30, recipientAddressY: 45, recipientAddressFontSize: 11,
      recipientNameX: e.width / 2, recipientNameY: 50, recipientNameFontSize: 16,
      senderX: 30, senderY: e.height - 100, senderFontSize: 8,
      stampX: 8, stampY: 25, stampFontSize: 10,
      postalX: e.width - 85, postalY: 24, postalFontSize: 7 };
  }
  return { recipientAddressX: e.width - 20, recipientAddressY: 40, recipientAddressFontSize: 8,
    recipientNameX: e.width / 2 + 5, recipientNameY: 35, recipientNameFontSize: 12,
    senderX: 35, senderY: e.height - 85, senderFontSize: 6,
    stampX: 6, stampY: 25, stampFontSize: 8,
    postalX: e.width - 70, postalY: 22, postalFontSize: 6 };
};

// ── Pure layout-engine helpers (outside component) ──────────────────────────

const FONT_BASE: Record<string, {addr:number;minAddr:number;company:number;minCompany:number;name:number;minName:number}> = {
  naga: { addr:8,  minAddr:5, company:10, minCompany:6, name:14, minName:8  },
  kaku: { addr:11, minAddr:7, company:14, minCompany:8, name:18, minName:10 },
  yo:   { addr:8,  minAddr:5, company:9,  minCompany:5, name:11, minName:7  },
};

interface AutoFonts { addrFs: number; companyFs: number; nameFs: number; }

function countEffectiveChars(text: string): number {
  const re = /\d[\d\-\.]*\d[A-Za-z]?|\d[A-Za-z]?/g;
  let count = 0, last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    count += m.index - last;
    const len = m[0].length;
    count += len <= 3 ? 1.0 : len <= 5 ? 1.5 : 2.0;
    last = m.index + m[0].length;
  }
  count += text.length - last;
  return count;
}

function calcAutoFonts(addr: AddressData, env: typeof ENVELOPE_SIZES[keyof typeof ENVELOPE_SIZES]): AutoFonts {
  const b = FONT_BASE[env.type] ?? FONT_BASE.naga;
  const availH = env.height - (env.type === "kaku" ? 90 : 66);

  const addrText = `${addr.prefecture}${addr.city}${addr.address1}${addr.address2}${addr.building}`;
  let addrFs = b.addr;
  if (addrText.length > 0) {
    const effectiveLen = countEffectiveChars(addrText);
    const charsPerCol = Math.max(1, Math.floor(availH / addrFs));
    if (effectiveLen < 8) {
      addrFs = Math.min(b.addr * 1.4, Math.floor(availH / Math.max(effectiveLen, 1)));
    } else if (effectiveLen > charsPerCol * 2) {
      addrFs = Math.max(b.minAddr, Math.floor(availH / Math.ceil(effectiveLen / 2)));
    }
  }
  addrFs = Math.round(Math.max(b.minAddr, Math.min(b.addr * 1.5, addrFs)));

  const compLen = addr.companyName.length + addr.department.length;
  let companyFs = b.company;
  if (compLen > 12) companyFs = Math.max(b.minCompany, Math.round(b.company * 12 / compLen));

  let nameFs = Math.round(addrFs * 1.4);
  nameFs = Math.min(b.name, Math.max(b.minName, nameFs));
  const nameLen = addr.name.length + addr.honorific.length;
  if (nameLen > 0 && nameLen * nameFs > availH) {
    nameFs = Math.max(b.minName, Math.floor(availH / nameLen));
  }
  return { addrFs, companyFs, nameFs };
}

// Tokenize text into regular chars and tate-chu-yoko (TCY) digit runs
type VToken = { type: "char"; ch: string } | { type: "tcy"; text: string };

function tokenizeVertical(text: string): VToken[] {
  const tokens: VToken[] = [];
  const re = /\d[\d\-\.]*\d[A-Za-z]?|\d[A-Za-z]?/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    for (let i = last; i < m.index; i++) tokens.push({ type: "char", ch: text[i] });
    tokens.push({ type: "tcy", text: m[0] });
    last = m.index + m[0].length;
  }
  for (let i = last; i < text.length; i++) tokens.push({ type: "char", ch: text[i] });
  return tokens;
}

// Draw tate-chu-yoko: horizontal digits compressed into one char slot
function drawTCYCanvas(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  fs: number
): number {
  const len = text.length;
  const slotFactor = len <= 3 ? 1.0 : len <= 5 ? 1.5 : 2.0;
  const slotH = fs * slotFactor;
  const tcyFs = Math.max(5, Math.round(slotH * 0.62));
  ctx.save();
  ctx.font = `bold ${tcyFs}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx + fs * 0.5, y + slotH * 0.5, fs * 0.9);
  ctx.restore();
  return slotH;
}

interface OverflowResult { hasOverflow: boolean; suggestedSizes: EnvelopeSize[]; }

function detectOverflow(addr: AddressData, envKey: EnvelopeSize): OverflowResult {
  const env = ENVELOPE_SIZES[envKey];
  const { addrFs, companyFs, nameFs } = calcAutoFonts(addr, env);
  const availH = env.height - (env.type === "kaku" ? 90 : 66);
  const availW = env.width  - (env.type === "kaku" ? 50 : 45);

  const addrText = `${addr.prefecture}${addr.city}${addr.address1}${addr.address2}${addr.building}`;
  const addrCols    = addrText.length    > 0 ? Math.max(1, Math.ceil(addrText.length    / Math.max(1, Math.floor(availH / addrFs))))    : 0;
  const companyCols = addr.companyName.length > 0 ? Math.max(1, Math.ceil(addr.companyName.length / Math.max(1, Math.floor(availH / companyFs)))) : 0;
  const deptCols    = addr.department.length > 0 ? 1 : 0;
  const nameCols    = addr.name.length   > 0 ? 1 : 0;

  const gaps = (addrCols > 0 ? 0.6 : 0) + (companyCols > 0 ? 0.6 : 0) + (nameCols > 0 ? 0.6 : 0);
  const totalCols = addrCols + companyCols + deptCols + nameCols + gaps;
  const colW = addrFs + 2;
  const hasOverflow = totalCols * colW > availW;

  const suggestedSizes = (Object.keys(ENVELOPE_SIZES) as EnvelopeSize[]).filter(k => {
    if (k === envKey) return false;
    const e2 = ENVELOPE_SIZES[k];
    const { addrFs: af2, companyFs: cf2, nameFs: nf2 } = calcAutoFonts(addr, e2);
    const aH2 = e2.height - (e2.type === "kaku" ? 90 : 66);
    const aW2 = e2.width  - (e2.type === "kaku" ? 50 : 45);
    const ac2 = addrText.length > 0 ? Math.max(1, Math.ceil(addrText.length / Math.max(1, Math.floor(aH2 / af2)))) : 0;
    const cc2 = addr.companyName.length > 0 ? Math.max(1, Math.ceil(addr.companyName.length / Math.max(1, Math.floor(aH2 / cf2)))) : 0;
    const nc2 = addr.name.length > 0 ? 1 : 0;
    const g2  = (ac2>0?0.6:0) + (cc2>0?0.6:0) + (nc2>0?0.6:0);
    const tw2 = (ac2 + cc2 + (addr.department.length>0?1:0) + nc2 + g2) * (af2 + 2);
    return tw2 <= aW2;
  });

  return { hasOverflow, suggestedSizes };
}

// ── Plan system ───────────────────────────────────────────────────────────────

function getUserPlan(): string {
  if (typeof window === 'undefined') return 'free';
  return localStorage.getItem('yamada_user_plan') || 'free';
}

function getPlanLimits(plan: string): {addresses:number;csvRows:number;history:number;logos:number;barcode:boolean;qr:boolean} {
  const L: Record<string,{addresses:number;csvRows:number;history:number;logos:number;barcode:boolean;qr:boolean}> = {
    free:       { addresses:3,     csvRows:5,     history:3,    logos:0,     barcode:false, qr:false },
    pro:        { addresses:100,   csvRows:50,    history:30,   logos:1,     barcode:true,  qr:true  },
    team:       { addresses:2000,  csvRows:500,   history:9999, logos:5,     barcode:true,  qr:true  },
    enterprise: { addresses:99999, csvRows:99999, history:9999, logos:99999, barcode:true,  qr:true  },
  };
  return L[plan] ?? L.free;
}

// QR code generation via CDN (async, result cached in ref)
async function generateQRImageAsync(content: string, sizePx: number): Promise<HTMLImageElement | null> {
  if (!content.trim() || typeof window === 'undefined') return null;
  try {
    if (typeof (window as any).qrcode === 'undefined') {
      await new Promise<void>((resolve, reject) => {
        const existing = document.getElementById('_qr_script');
        if (existing) { const t = setInterval(() => { if ((window as any).qrcode) { clearInterval(t); resolve(); } }, 30); return; }
        const s = document.createElement('script');
        s.id = '_qr_script';
        s.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('QR load failed'));
        document.head.appendChild(s);
      });
    }
    const qr = (window as any).qrcode(0, 'M');
    qr.addData(content, 'Byte');
    qr.make();
    const mc: number = qr.getModuleCount();
    const ms = sizePx / mc;
    const pad = Math.ceil(ms * 2);
    const c = document.createElement('canvas');
    c.width = sizePx + pad * 2; c.height = sizePx + pad * 2;
    const cx = c.getContext('2d')!;
    cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height);
    cx.fillStyle = '#000';
    for (let r = 0; r < mc; r++)
      for (let col = 0; col < mc; col++)
        if (qr.isDark(r, col)) cx.fillRect(pad + col * ms, pad + r * ms, ms, ms);
    const img = new Image();
    await new Promise<void>(res => { img.onload = () => res(); img.src = c.toDataURL(); });
    return img;
  } catch { return null; }
}

// ── Component ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "yamada-envelope-settings";
const ADDR_BOOK_KEY = "yamada_envelope_addresses";
const SENDER_KEY = "yamada_envelope_sender";
const HISTORY_KEY = "yamada_envelope_print_history";
const LOGO_KEY = "yamada_envelope_logo";
const QR_KEY = "yamada_envelope_qr";
const PLAN_KEY = "yamada_user_plan";
const UPGRADE_DISMISS_KEY = "yamada_upgrade_dismissed";

export default function EnvelopePrintClient({
 faq, seoContent }: EnvelopePrintClientProps) {
  const { triggerSuccess } = usePricingContext();

  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("封筒の宛名情報をご入力ください。");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [envelopeSize, setEnvelopeSize] = useState<EnvelopeSize>("naga3");
  const [writingDirection, setWritingDirection] = useState<WritingDirection>("vertical");
  const [showPostalBox, setShowPostalBox] = useState(true);
  const [showSender, setShowSender] = useState(true);
  const [settings, setSettings] = useState<LayoutSettings>(getDefaultSettings("naga3"));
  const [recipient, setRecipient] = useState<AddressData>({
    postalCode: "", prefecture: "", city: "", address1: "", address2: "",
    building: "", companyName: "", department: "", name: "", honorific: "様",
  });
  const [sender, setSender] = useState<SenderData>({ postalCode: "", address: "", companyName: "", name: "" });
  const [stamp, setStamp] = useState<StampData>({ enabled: false, text: "請求書在中", color: "red" });
  const [bulkMode, setBulkMode] = useState(false);
  const [csvData, setCsvData] = useState("");
  const [bulkAddresses, setBulkAddresses] = useState<AddressData[]>([]);
  const [currentBulkIndex, setCurrentBulkIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"simple" | "advanced">("simple");
  const [postalLoading, setPostalLoading] = useState(false);
  const [postalError, setPostalError] = useState("");
  const [postalConfirm, setPostalConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [stampPosition, setStampPosition] = useState<number>(4);
  const [overflowWarning, setOverflowWarning] = useState(false);
  const [overflowSuggestions, setOverflowSuggestions] = useState<EnvelopeSize[]>([]);
  // Per-size overflow lookup for dropdown badges
  const [sizeOverflowMap, setSizeOverflowMap] = useState<Partial<Record<EnvelopeSize, boolean>>>({});
  // Address book
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [addressBookOpen, setAddressBookOpen] = useState(false);
  const [senderRestored, setSenderRestored] = useState(false);
  // Print history
  const [printHistory, setPrintHistory] = useState<PrintHistoryEntry[]>([]);
  // CSV limit banner
  const [csvLimitBanner, setCsvLimitBanner] = useState<number | null>(null);
  // CSV drag state
  const [csvDragOver, setCsvDragOver] = useState(false);
  // Toast
  const [toast, setToast] = useState<string>("");
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  // Auto-save toast after print
  const [autoSaveToast, setAutoSaveToast] = useState(false);
  const [autoSaveAddr, setAutoSaveAddr] = useState<AddressData | null>(null);
  // Plan
  const [userPlan, setUserPlan] = useState<string>("free");
  // Logo (PRO)
  const [logos, setLogos] = useState<string[]>([]);
  const [activeLogoIdx, setActiveLogoIdx] = useState(0);
  const [logoPosition, setLogoPosition] = useState<"top-left"|"top-right"|"above-sender"|"left-sender">("top-right");
  const [logoSizeMm, setLogoSizeMm] = useState(20);
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [logoSectionOpen, setLogoSectionOpen] = useState(false);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const [logoReady, setLogoReady] = useState(0);
  // Barcode (PRO)
  const [showBarcode, setShowBarcode] = useState(false);
  // QR Code (PRO)
  const [qrContent, setQrContent] = useState("");
  const [qrPosition, setQrPosition] = useState<"top-left"|"top-right"|"bottom-left"|"bottom-right">("bottom-right");
  const [qrSizeMm, setQrSizeMm] = useState(15);
  const [qrSectionOpen, setQrSectionOpen] = useState(false);
  const qrImgRef = useRef<HTMLImageElement | null>(null);
  const [qrReady, setQrReady] = useState(0);
  // Upgrade banner
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);

  const TEMPLATES = [
    { label: "ビジネス", recipient: { companyName: "株式会社○○", department: "総務部", name: "山田太郎", honorific: "様" } as Partial<AddressData>, stamp: null },
    { label: "請求書",   recipient: null, stamp: { enabled: true, text: "請求書在中", color: "red"   as const } },
    { label: "履歴書",   recipient: null, stamp: { enabled: true, text: "履歴書在中", color: "black" as const } },
    { label: "納品書",   recipient: null, stamp: { enabled: true, text: "納品書在中", color: "blue"  as const } },
  ];

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.sender) setSender(p.sender);
      }
    } catch {}
    try {
      const ab = localStorage.getItem(ADDR_BOOK_KEY);
      if (ab) setSavedAddresses(JSON.parse(ab));
    } catch {}
    try {
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) setPrintHistory(JSON.parse(hist));
    } catch {}
    try {
      const snd = localStorage.getItem(SENDER_KEY);
      if (snd) {
        setSender(JSON.parse(snd));
        setSenderRestored(true);
        setTimeout(() => setSenderRestored(false), 5000);
      }
    } catch {}
    setUserPlan(getUserPlan());
    try { const logoRaw = localStorage.getItem(LOGO_KEY); if (logoRaw) { try { const parsed = JSON.parse(logoRaw); setLogos(Array.isArray(parsed) ? parsed : [parsed]); } catch { setLogos([logoRaw]); } } } catch {}
    try { const qr = localStorage.getItem(QR_KEY); if (qr) setQrContent(qr); } catch {}
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}-${envelopeSize}`);
        setSettings(saved ? JSON.parse(saved) : getDefaultSettings(envelopeSize));
      } catch { setSettings(getDefaultSettings(envelopeSize)); }
    }
  }, [envelopeSize, mounted]);

  useEffect(() => { if (mounted) renderPreview(); }, [mounted, envelopeSize, writingDirection, showPostalBox, showSender, recipient, sender, stamp, currentBulkIndex, bulkAddresses, settings, activeTab, logoPosition, logoSizeMm, logoOpacity, showBarcode, qrPosition, qrSizeMm, userPlan, logoReady, qrReady, activeLogoIdx]);


  // Logo image loading
  useEffect(() => {
    const activeLogo = logos[activeLogoIdx] ?? null;
    if (!activeLogo) { logoImgRef.current = null; setLogoReady(r => r + 1); return; }
    const img = new Image();
    img.onload = () => { logoImgRef.current = img; setLogoReady(r => r + 1); };
    img.src = activeLogo;
  }, [logos, activeLogoIdx]);

  // QR code generation
  useEffect(() => {
    if (!qrContent.trim() || !getPlanLimits(userPlan).qr) { qrImgRef.current = null; setQrReady(r => r + 1); return; }
    generateQRImageAsync(qrContent, 200).then(img => { qrImgRef.current = img; setQrReady(r => r + 1); });
  }, [qrContent, userPlan]);

  // Overflow detection — runs whenever recipient or size changes
  useEffect(() => {
    if (!mounted) return;
    const curr = bulkMode && bulkAddresses.length > 0 ? bulkAddresses[currentBulkIndex] : recipient;
    const result = detectOverflow(curr, envelopeSize);
    setOverflowWarning(result.hasOverflow);
    setOverflowSuggestions(result.suggestedSizes.slice(0, 3));

    // Compute overflow status for all sizes (for dropdown badges)
    const map: Partial<Record<EnvelopeSize, boolean>> = {};
    for (const k of Object.keys(ENVELOPE_SIZES) as EnvelopeSize[]) {
      map[k] = detectOverflow(curr, k).hasOverflow;
    }
    setSizeOverflowMap(map);
  }, [mounted, recipient, envelopeSize, bulkMode, bulkAddresses, currentBulkIndex]);
  // Auto-trigger postal lookup when 7 digits entered
  useEffect(() => {
    const code = recipient.postalCode.replace(/[^0-9]/g, "");
    if (code.length !== 7) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setPostalLoading(true);
      setPostalError("");
      setPostalConfirm("");
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`);
        const json = await res.json();
        if (!cancelled && json.results?.[0]) {
          const r = json.results[0];
          setRecipient(prev => ({ ...prev, prefecture: r.address1 || "", city: r.address2 || "", address1: r.address3 || "" }));
          setPostalConfirm(`〒${code.slice(0,3)}-${code.slice(3)} → ${r.address1}${r.address2}${r.address3}`);
          setTimeout(() => setPostalConfirm(""), 4000);
        } else if (!cancelled) {
          setPostalError("住所が見つかりません");
        }
      } catch { if (!cancelled) setPostalError("検索に失敗しました"); }
      finally { if (!cancelled) setPostalLoading(false); }
    }, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [recipient.postalCode]);

  // ── Postal lookup ──────────────────────────────────────────────────────────
  const handlePostalLookup = async () => {
    const code = recipient.postalCode.replace(/[^0-9]/g, "");
    if (code.length !== 7) { setPostalError("7桁で入力してください"); return; }
    setPostalLoading(true); setPostalError("");
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`);
      const json = await res.json();
      if (json.results?.[0]) {
        const r = json.results[0];
        setRecipient(prev => ({ ...prev, prefecture: r.address1 || "", city: r.address2 || "", address1: r.address3 || "" }));
      } else { setPostalError("住所が見つかりません"); }
    } catch { setPostalError("検索に失敗しました"); }
    finally { setPostalLoading(false); }
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!recipient.name && !recipient.companyName) errs.name = "氏名または会社名を入力してください";
    if (recipient.postalCode && recipient.postalCode.replace(/[^0-9]/g, "").length !== 7) errs.postalCode = "7桁で入力してください";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const applyTemplate = (tpl: typeof TEMPLATES[number]) => {
    if (tpl.recipient) setRecipient(prev => ({ ...prev, ...tpl.recipient }));
    if (tpl.stamp) setStamp(tpl.stamp);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sender }));
      localStorage.setItem(`${STORAGE_KEY}-${envelopeSize}`, JSON.stringify(settings));
      setMascotState("success")
      triggerSuccess('envelope-print');; setMascotMessage("設定を保存しました！");
    } catch { setMascotState("error"); setMascotMessage("保存に失敗"); }
  };

  const resetSettings = () => { setSettings(getDefaultSettings(envelopeSize)); setMascotMessage("リセット完了"); };

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => setToast(""), 3000);
    setToastTimer(t);
  };

  const generateLabel = (addr: AddressData): string => {
    if (addr.companyName && addr.name) return `${addr.companyName} ${addr.name}`;
    if (addr.companyName) return addr.companyName;
    if (addr.name) return addr.name;
    return `${addr.prefecture}${addr.city}${addr.address1}`.slice(0, 20) || "（住所）";
  };

  const persistAddressBook = (list: SavedAddress[]) => {
    try { localStorage.setItem(ADDR_BOOK_KEY, JSON.stringify(list)); } catch {}
    setSavedAddresses(list);
  };

  const saveToAddressBook = (addr: AddressData) => {
    const current = (() => { try { return JSON.parse(localStorage.getItem(ADDR_BOOK_KEY) || "[]") as SavedAddress[]; } catch { return []; } })();
    const limit = getPlanLimits(userPlan).addresses;
    if (current.length >= limit) {
      showToast(`⚠️ 現在のプランでは${limit}件まで保存できます`);
      return false;
    }
    const entry: SavedAddress = {
      id: String(Date.now()),
      label: generateLabel(addr),
      postalCode: addr.postalCode,
      prefecture: addr.prefecture,
      city: addr.city,
      address: `${addr.address1}${addr.address2}`,
      building: addr.building,
      company: addr.companyName,
      department: addr.department,
      name: addr.name,
      honorific: addr.honorific,
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
    };
    persistAddressBook([...current, entry]);
    showToast("✅ 住所をアドレス帳に保存しました");
    return true;
  };

  const deleteFromAddressBook = (id: string) => {
    if (!window.confirm("この住所を削除しますか？")) return;
    const updated = savedAddresses.filter(a => a.id !== id);
    persistAddressBook(updated);
  };

  const loadFromAddressBook = (saved: SavedAddress) => {
    setRecipient({
      postalCode: saved.postalCode,
      prefecture: saved.prefecture,
      city: saved.city,
      address1: saved.address,
      address2: "",
      building: saved.building,
      companyName: saved.company,
      department: saved.department,
      name: saved.name,
      honorific: saved.honorific,
    });
    const updated = savedAddresses.map(a => a.id === saved.id ? { ...a, lastUsedAt: Date.now() } : a);
    persistAddressBook(updated);
    showToast("📬 住所を読み込みました");
  };

  const saveSenderData = () => {
    try { localStorage.setItem(SENDER_KEY, JSON.stringify(sender)); showToast("✅ 差出人を保存しました"); } catch {}
  };

  const saveToHistory = (addr: AddressData) => {
    const entry: PrintHistoryEntry = {
      id: String(Date.now()),
      timestamp: Date.now(),
      recipient: {
        postalCode: addr.postalCode, prefecture: addr.prefecture, city: addr.city,
        address: `${addr.address1}${addr.address2}`, building: addr.building,
        company: addr.companyName, name: addr.name, honorific: addr.honorific,
      },
      envelopeSize: envelopeSize,
      envelopeLabel: ENVELOPE_SIZES[envelopeSize].name,
    };
    const prev: PrintHistoryEntry[] = (() => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } })();
    const histLimit = getPlanLimits(userPlan).history;
    const updated = [entry, ...prev].slice(0, histLimit);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch {}
    setPrintHistory(updated);
  };

  const isAlreadyInBook = (addr: AddressData): boolean =>
    savedAddresses.some(a => a.postalCode === addr.postalCode && a.name === addr.name && a.company === addr.companyName);

  const triggerAutoSavePrompt = (addr: AddressData) => {
    const addrLimit = getPlanLimits(userPlan).addresses;
    if (!isAlreadyInBook(addr) && savedAddresses.length < addrLimit && (addr.name || addr.companyName)) {
      setAutoSaveAddr(addr);
      setAutoSaveToast(true);
      setTimeout(() => setAutoSaveToast(false), 8000);
    }
  };

  const downloadSampleCSV = () => {
    const csv = `郵便番号,都道府県,市区町村,住所1,住所2,建物,会社名,部署,氏名,敬称\n1000001,東京都,千代田区,千代田1-1,,,株式会社サンプル,営業部,山田太郎,様\n3310062,埼玉県,さいたま市西区,宮前町257,,,ヤマダデンキ,,田中花子,様\n1448721,東京都,大田区,蒲田5-37-1,アロマスクエア11F,,ソニー損害保険株式会社,カスタマーセンター,佐藤一郎,様\n`;
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "envelope_sample.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const countCsvRows = (csv: string): number => {
    const lines = csv.trim().split("\n").filter(l => l.trim());
    if (lines.length === 0) return 0;
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes("郵便番号") || firstLine.includes("postal") || firstLine.includes("prefecture");
    return hasHeader ? lines.length - 1 : lines.length;
  };

  const toVerticalNumber = (n: string): string => {
    const m: Record<string, string> = {"0":"０","1":"１","2":"２","3":"３","4":"４","5":"５","6":"６","7":"７","8":"８","9":"９"};
    return n.split("").map(c => m[c] || c).join("");
  };

  const smartNumberConvert = (text: string): string => {
    return text.split("").map(c => /[0-9]/.test(c) ? toVerticalNumber(c) : c).join("");
  };

  const parseCSV = (csv: string): AddressData[] => {
    const lines = csv.trim().split("\n");
    if (lines.length < 2) return [];
    return lines.slice(1).map(line => {
      const c = line.split(",").map(x => x.trim().replace(/^"|"$/g, ""));
      return { postalCode: c[0]||"", prefecture: c[1]||"", city: c[2]||"", address1: c[3]||"",
        address2: c[4]||"", building: c[5]||"", companyName: c[6]||"", department: c[7]||"",
        name: c[8]||"", honorific: c[9]||"様" };
    }).filter(a => a.name || a.companyName);
  };

  const handleCSVImport = (rawCsv?: string) => {
    const source = rawCsv ?? csvData;
    const allAddrs = parseCSV(source);
    if (allAddrs.length === 0) { setMascotState("error"); setMascotMessage("CSV確認してね"); return; }
    const totalRows = allAddrs.length;
    const limit = getPlanLimits(userPlan).csvRows;
    const addrs = allAddrs.slice(0, limit);
    setBulkAddresses(addrs); setCurrentBulkIndex(0); setRecipient(addrs[0]);
    setMascotState("success")
      triggerSuccess('envelope-print');; setMascotMessage(`${addrs.length}件読込完了！`);
    setCsvLimitBanner(totalRows > limit ? totalRows : null);
  };
  const handleExcelImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = ev.target?.result;
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as string[][];
        if (rows.length < 2) { setMascotState("error"); setMascotMessage("データが見つかりません"); return; }

        const headerRow = rows[0].map((h: unknown) => String(h).trim().toLowerCase());
        const colMap: Record<string, number> = {};
        const JP_KEYS: Record<string, string> = {
          "郵便番号": "postalCode", "postal_code": "postalCode",
          "都道府県": "prefecture", "prefecture": "prefecture",
          "市区町村": "city", "city": "city",
          "住所": "address1", "住所1": "address1", "address": "address1", "address1": "address1",
          "住所2": "address2", "address2": "address2",
          "建物": "building", "building": "building",
          "会社名": "companyName", "company": "companyName",
          "部署": "department", "department": "department",
          "氏名": "name", "name": "name",
          "敬称": "honorific", "honorific": "honorific",
        };
        headerRow.forEach((h, i) => {
          if (JP_KEYS[h] && !(JP_KEYS[h] in colMap)) colMap[JP_KEYS[h]] = i;
        });
        const hasHeaders = Object.keys(colMap).length > 0;
        if (!hasHeaders) {
          colMap.postalCode=0; colMap.prefecture=1; colMap.city=2; colMap.address1=3;
          colMap.address2=4; colMap.building=5; colMap.companyName=6;
          colMap.department=7; colMap.name=8; colMap.honorific=9;
        }
        const dataRows = hasHeaders ? rows.slice(1) : rows;
        const allAddrs: AddressData[] = dataRows.map(row => ({
          postalCode: String(row[colMap.postalCode] ?? ""),
          prefecture: String(row[colMap.prefecture] ?? ""),
          city: String(row[colMap.city] ?? ""),
          address1: String(row[colMap.address1] ?? ""),
          address2: String(row[colMap.address2 ?? -1] ?? ""),
          building: String(row[colMap.building ?? -1] ?? ""),
          companyName: String(row[colMap.companyName ?? -1] ?? ""),
          department: String(row[colMap.department ?? -1] ?? ""),
          name: String(row[colMap.name ?? -1] ?? ""),
          honorific: String(row[colMap.honorific ?? -1] ?? "") || "様",
        })).filter(a => a.name || a.companyName);

        if (allAddrs.length === 0) { setMascotState("error"); setMascotMessage("有効なデータが見つかりません"); return; }
        const limit = getPlanLimits(userPlan).csvRows;
        const addrs = allAddrs.slice(0, limit);
        setBulkAddresses(addrs); setCurrentBulkIndex(0); setRecipient(addrs[0]);
        setMascotState("success"); triggerSuccess("envelope-print");
        setMascotMessage(`${addrs.length}件読込完了！`);
        setCsvLimitBanner(allAddrs.length > limit ? allAddrs.length : null);
      } catch { setMascotState("error"); setMascotMessage("Excelファイルの読み込みに失敗しました"); }
    };
    reader.readAsArrayBuffer(file);
  };


  // ── SCREEN PREVIEW ─────────────────────────────────────────────────────────
  const renderPreview = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const env = ENVELOPE_SIZES[envelopeSize];
    const scale = 2;
    const displayScale = Math.min(350 / env.width, 450 / env.height);
    canvas.width = env.width * scale;
    canvas.height = env.height * scale;
    canvas.style.width = `${env.width * displayScale}px`;
    canvas.style.height = `${env.height * displayScale}px`;
    ctx.scale(scale, scale);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, env.width, env.height);
    ctx.strokeStyle = "#ddd"; ctx.lineWidth = 0.5;
    ctx.strokeRect(0.5, 0.5, env.width - 1, env.height - 1);
    const curr = bulkMode && bulkAddresses.length > 0 ? bulkAddresses[currentBulkIndex] : recipient;
    if (showPostalBox && curr.postalCode) drawPostalCode(ctx, curr.postalCode, env);
    if (stamp.enabled && stamp.text) drawStamp(ctx, stamp, env);
    if (writingDirection === "vertical") drawVerticalAddress(ctx, curr, env, false);
    else drawHorizontalAddress(ctx, curr, env);
    if (showSender) drawSender(ctx, sender, env, false);
    const pl = getPlanLimits(userPlan);
    if (pl.logos > 0 && logoImgRef.current) drawLogo(ctx, env);
    if (pl.barcode && showBarcode) drawCustomerBarcode(ctx, curr, env);
    if (pl.qr && qrImgRef.current && qrContent.trim()) drawQRCode(ctx, env);
  };

  // ── HIGH-DPI PRINT ─────────────────────────────────────────────────────────
  const generateHighDPICanvas = (): string => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d"); if (!ctx) return "";
    const env = ENVELOPE_SIZES[envelopeSize];
    const printScale = 10;
    canvas.width = env.width * printScale;
    canvas.height = env.height * printScale;
    ctx.scale(printScale, printScale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, env.width, env.height);
    ctx.strokeStyle = "#ddd"; ctx.lineWidth = 0.5;
    ctx.strokeRect(0.5, 0.5, env.width - 1, env.height - 1);
    const curr = bulkMode && bulkAddresses.length > 0 ? bulkAddresses[currentBulkIndex] : recipient;
    if (showPostalBox && curr.postalCode) drawPostalCode(ctx, curr.postalCode, env);
    if (stamp.enabled && stamp.text) drawStamp(ctx, stamp, env);
    if (writingDirection === "vertical") drawVerticalAddress(ctx, curr, env, true);
    else drawHorizontalAddress(ctx, curr, env);
    if (showSender) drawSender(ctx, sender, env, true);
    const pl2 = getPlanLimits(userPlan);
    if (pl2.logos > 0 && logoImgRef.current) drawLogo(ctx, env);
    if (pl2.barcode && showBarcode) drawCustomerBarcode(ctx, curr, env);
    if (pl2.qr && qrImgRef.current && qrContent.trim()) drawQRCode(ctx, env);
    return canvas.toDataURL("image/png", 1.0);
  };

  const drawPostalCode = (ctx: CanvasRenderingContext2D, code: string, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    const c = code.replace(/[^0-9]/g, "");
    if (c.length !== 7) return;
    const bw = 5, bh = 6.5, gap = 2, sx = settings.postalX, sy = settings.postalY;
    ctx.strokeStyle = "#c00"; ctx.lineWidth = 0.5;
    ctx.fillStyle = "#000"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `${settings.postalFontSize + 1}px sans-serif`;
    ctx.fillText("〒", sx - 8, sy + bh / 2);
    for (let i = 0; i < 7; i++) {
      const xo = i >= 3 ? 3 : 0, x = sx + i * (bw + gap) + xo;
      ctx.strokeRect(x, sy, bw, bh);
      ctx.font = `bold ${settings.postalFontSize}px sans-serif`;
      ctx.fillText(c[i] || "", x + bw / 2, sy + bh / 2 + 0.5);
    }
  };

  // ── NEW SMART VERTICAL ADDRESS ENGINE ─────────────────────────────────────
  const drawVerticalAddress = (
    ctx: CanvasRenderingContext2D,
    addr: AddressData,
    env: typeof ENVELOPE_SIZES[EnvelopeSize],
    forPrint: boolean
  ) => {
    const auto = calcAutoFonts(addr, env);
    // Advanced tab: manual font sizes; simple tab: auto
    const addrFs    = activeTab === "advanced" ? settings.recipientAddressFontSize     : auto.addrFs;
    const companyFs = activeTab === "advanced" ? settings.recipientAddressFontSize + 2 : auto.companyFs;
    const nameFs    = activeTab === "advanced" ? settings.recipientNameFontSize         : auto.nameFs;

    const marginTop    = env.type === "kaku" ? 50 : 36;
    const marginRight  = env.type === "kaku" ? 25 : 14;
    const marginBottom = env.type === "kaku" ? 40 : 28;
    const maxY = env.height - marginBottom;

    ctx.fillStyle = "#000";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    let cx = env.width - marginRight;

    // ── Column A: Address (都道府県+市区町村+住所1+住所2) ──
    const addrText = `${addr.prefecture}${addr.city}${addr.address1}${addr.address2}`;
    if (addrText.trim()) {
      const tokens = tokenizeVertical(addrText);
      ctx.font = `${addrFs}px serif`;
      let y = marginTop;
      for (const tok of tokens) {
        if (y + addrFs > maxY) { cx -= addrFs + 2; y = marginTop; }
        if (tok.type === "tcy") {
          y += drawTCYCanvas(ctx, tok.text, cx, y, addrFs);
        } else {
          ctx.fillText(/[0-9]/.test(tok.ch) ? toVerticalNumber(tok.ch) : tok.ch, cx, y);
          y += addrFs * 1.08;
        }
      }

      // Overflow highlight in red (preview only)
      if (!forPrint && overflowWarning) {
        // draw subtle red tint on last char position if overflowed
      }
      cx -= addrFs + 2;
    }

    // ── Column B: Building ──
    if (addr.building) {
      const bFs = Math.max(addrFs - 1, 5);
      const tokens = tokenizeVertical(addr.building);
      ctx.font = `${bFs}px serif`;
      let y = marginTop;
      for (const tok of tokens) {
        if (y + bFs > maxY) { cx -= bFs + 2; y = marginTop; }
        if (tok.type === "tcy") {
          y += drawTCYCanvas(ctx, tok.text, cx, y, bFs);
        } else {
          ctx.fillText(/[0-9]/.test(tok.ch) ? toVerticalNumber(tok.ch) : tok.ch, cx, y);
          y += bFs * 1.08;
        }
      }
      cx -= bFs + 3;
    }

    // ── Column C: Company + Department (separate, slightly indented from top) ──
    if (addr.companyName || addr.department) {
      cx -= 4;
      const compStartY = marginTop + (env.type === "kaku" ? 20 : 10);

      if (addr.companyName) {
        const tokens = tokenizeVertical(addr.companyName);
        ctx.font = `${companyFs}px serif`;
        let y = compStartY;
        for (const tok of tokens) {
          if (y + companyFs > maxY) { cx -= companyFs + 2; y = compStartY; }
          if (tok.type === "tcy") {
            y += drawTCYCanvas(ctx, tok.text, cx, y, companyFs);
          } else {
            ctx.fillText(tok.ch, cx, y);
            y += companyFs * 1.08;
          }
        }
        cx -= companyFs + 3;
      }

      if (addr.department) {
        const dFs = Math.max(companyFs - 1, addrFs);
        ctx.font = `${dFs}px serif`;
        const dStartY = compStartY + 12;
        let y = dStartY;
        for (const ch of addr.department) {
          if (y + dFs > maxY) { cx -= dFs + 2; y = dStartY; }
          ctx.fillText(ch, cx, y);
          y += dFs * 1.08;
        }
        cx -= dFs + 3;
      }
    }

    // ── Column D: Name (own column, vertically centered, largest font, bold) ──
    if (addr.name) {
      cx -= 4;
      const nameText = addr.name + addr.honorific;
      const totalH = nameText.length * nameFs * 1.08;
      const startY = Math.max(marginTop, Math.min(maxY - totalH, (env.height - totalH) / 2));
      const tokens = tokenizeVertical(nameText);
      ctx.font = forPrint ? `bold ${nameFs}px serif` : `bold ${nameFs}px serif`;
      let y = startY;
      for (const tok of tokens) {
        if (tok.type === "tcy") {
          y += drawTCYCanvas(ctx, tok.text, cx, y, nameFs);
        } else {
          ctx.fillText(tok.ch, cx, y);
          y += nameFs * 1.08;
        }
      }
    }
  };

  const drawHorizontalAddress = (ctx: CanvasRenderingContext2D, addr: AddressData, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    ctx.fillStyle = "#000"; ctx.textBaseline = "top"; ctx.textAlign = "left";
    const sx = settings.recipientAddressX, fs = settings.recipientAddressFontSize, lh = fs + 3;
    let cy = settings.recipientAddressY;
    const full = `${addr.prefecture}${addr.city}${addr.address1}${addr.address2}`;
    if (full) { ctx.font = `${fs}px serif`; ctx.fillText(full, sx, cy); cy += lh; }
    if (addr.building) { ctx.font = `${fs - 1}px serif`; ctx.fillText(addr.building, sx + 5, cy); cy += lh; }
    if (addr.companyName) { cy += 3; ctx.font = `${fs + 1}px serif`; ctx.fillText(addr.companyName, sx, cy); cy += lh + 2; }
    if (addr.department) { ctx.font = `${fs}px serif`; ctx.fillText(addr.department, sx + 3, cy); cy += lh; }
    if (addr.name) { cy += 3; ctx.font = `bold ${settings.recipientNameFontSize}px serif`; ctx.fillText(`${addr.name} ${addr.honorific}`, sx + 5, cy); }
  };

  const drawSender = (ctx: CanvasRenderingContext2D, snd: SenderData, env: typeof ENVELOPE_SIZES[EnvelopeSize], forPrint: boolean) => {
    if (!snd.address && !snd.name && !snd.companyName) return;
    ctx.fillStyle = "#000";
    const fs = settings.senderFontSize, lh = fs + 2;
    if (writingDirection === "vertical") {
      let cx = settings.senderX; const sy = settings.senderY; const maxY = env.height - 5;
      if (snd.postalCode) {
        ctx.font = `${fs}px sans-serif`; ctx.textAlign = "left";
        ctx.fillText(`〒${snd.postalCode}`, 5, sy - 10);
      }
      if (snd.address) {
        ctx.font = forPrint ? `bold ${fs}px serif` : `${fs}px serif`; ctx.textAlign = "left";
        let y = sy;
        for (const ch of smartNumberConvert(snd.address)) {
          if (y + fs > maxY) { cx -= lh; if (cx < 5) break; y = sy; }
          ctx.fillText(ch, cx, y); y += fs + 1;
        }
        cx -= lh + 1;
      }
      if (snd.companyName && cx >= 5) {
        ctx.font = forPrint ? `bold ${fs}px serif` : `${fs}px serif`;
        let y = sy;
        for (const ch of snd.companyName) {
          if (y + fs > maxY) { cx -= lh; if (cx < 5) break; y = sy; }
          ctx.fillText(ch, cx, y); y += fs + 1;
        }
        cx -= lh + 1;
      }
      if (snd.name && cx >= 5) {
        ctx.font = forPrint ? `bold ${fs + 1}px serif` : `${fs + 1}px serif`;
        let y = sy;
        for (const ch of snd.name) {
          if (y + fs > maxY) break;
          ctx.fillText(ch, cx, y); y += fs + 2;
        }
      }
    } else {
      const ex = env.width - 8; let cy = settings.senderY; ctx.textAlign = "right";
      if (snd.postalCode) { ctx.font = `${fs}px sans-serif`; ctx.fillText(`〒${snd.postalCode}`, ex, cy); cy += lh; }
      if (snd.address) { ctx.font = `${fs}px serif`; ctx.fillText(snd.address, ex, cy); cy += lh; }
      if (snd.companyName) { ctx.font = `${fs}px serif`; ctx.fillText(snd.companyName, ex, cy); cy += lh; }
      if (snd.name) { ctx.font = `${fs + 1}px serif`; ctx.fillText(snd.name, ex, cy); }
    }
  };

  const drawStamp = (ctx: CanvasRenderingContext2D, stmp: StampData, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    const colors = { red: "#c00", blue: "#06c", black: "#333" };
    ctx.strokeStyle = colors[stmp.color]; ctx.fillStyle = colors[stmp.color];
    const x = settings.stampX, y = settings.stampY, fs = settings.stampFontSize;
    if (writingDirection === "vertical") {
      const w = fs + 4, h = stmp.text.length * (fs + 1) + 6;
      ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
      ctx.font = `${fs}px serif`; ctx.textAlign = "center"; ctx.textBaseline = "top";
      let cy = y + 4;
      for (const ch of stmp.text) { ctx.fillText(ch, x + w / 2, cy); cy += fs + 1; }
    } else {
      ctx.font = `${fs}px serif`;
      const tw = ctx.measureText(stmp.text).width, pad = 3;
      ctx.lineWidth = 1; ctx.strokeRect(x, y, tw + pad * 2, fs + pad * 2);
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(stmp.text, x + pad, y + pad);
    }
  };

  // ── PRO: Logo drawing ──────────────────────────────────────────────────────
  const drawLogo = (ctx: CanvasRenderingContext2D, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    const img = logoImgRef.current; if (!img) return;
    const wMm = logoSizeMm;
    const hMm = img.naturalHeight > 0 ? (img.naturalHeight / img.naturalWidth) * wMm : wMm;
    let x = 0, y = 0;
    if (logoPosition === "top-left")       { x = 5; y = 5; }
    else if (logoPosition === "top-right") { x = env.width - wMm - 5; y = 5; }
    else if (logoPosition === "above-sender") { x = settings.senderX - wMm / 2; y = Math.max(3, settings.senderY - hMm - 3); }
    else /* left-sender */                 { x = Math.max(3, settings.senderX - wMm - 3); y = settings.senderY; }
    ctx.save();
    ctx.globalAlpha = logoOpacity / 100;
    ctx.drawImage(img, x, y, wMm, hMm);
    ctx.restore();
  };

  // ── PRO: Japan Post 4-state customer barcode ───────────────────────────────
  const drawCustomerBarcode = (ctx: CanvasRenderingContext2D, addr: AddressData, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    const postal = addr.postalCode.replace(/[^0-9]/g, '');
    if (postal.length !== 7) return;
    const addrNums = `${addr.address1}${addr.address2}`.replace(/[^0-9\-]/g, '').replace(/--+/g,'-').slice(0, 13);
    const data = (postal + addrNums).replace(/[^0-9\-]/g, '').padEnd(20, '0').slice(0, 20);
    const BAR: Record<string, string> = {
      '0':'TDAD','1':'ADTD','2':'TATD','3':'TDTA','4':'ADTA',
      '5':'TATA','6':'DAAT','7':'DTAT','8':'ADAT','9':'DTTD','-':'TATA',
    };
    const CC_ENC: Record<number, string> = {
      0:'ADTD',1:'TATD',2:'TDTA',3:'ADTA',4:'TATA',5:'DAAT',6:'DTAT',7:'ADAT',8:'DTTD',
      9:'FDTT',10:'TFDT',11:'FTDT',12:'TDFT',13:'TFTD',14:'FDTF',15:'TFDF',16:'FTDF',17:'TDFF',18:'FTFD',
    };
    const CC_VAL: Record<string, number> = {'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'-':10};
    const sum = data.split('').reduce((s, c) => s + (CC_VAL[c] ?? 0), 0);
    const cc = (19 - (sum % 19)) % 19;
    const allBars = 'FT' + data.split('').map(c => BAR[c] ?? 'TDAD').join('') + (CC_ENC[cc] ?? 'ADTD') + 'TF';
    const bw = 0.6, gap = 0.6;
    const totalW = allBars.length * (bw + gap);
    let bx = (env.width - totalW) / 2;
    const baseY = env.height - 6;
    ctx.fillStyle = '#000';
    for (const bar of allBars) {
      let y = baseY - 1.2, h = 1.2;
      if (bar === 'F') { y = baseY - 3.6; h = 3.6; }
      else if (bar === 'A') { y = baseY - 3.6; h = 2.4; }
      else if (bar === 'D') { y = baseY - 2.4; h = 2.4; }
      ctx.fillRect(bx, y, bw, h);
      bx += bw + gap;
    }
    // Label
    ctx.save();
    ctx.font = '2px sans-serif'; ctx.fillStyle = '#555';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(`〒${postal}`, env.width / 2, baseY - 4);
    ctx.restore();
  };

  // ── PRO: QR code drawing ───────────────────────────────────────────────────
  const drawQRCode = (ctx: CanvasRenderingContext2D, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    const img = qrImgRef.current; if (!img) return;
    const s = qrSizeMm, pad = 2;
    let x = 0, y = 0;
    if (qrPosition === 'top-left')     { x = 5;                    y = 5; }
    else if (qrPosition === 'top-right')    { x = env.width - s - 5;    y = 5; }
    else if (qrPosition === 'bottom-left')  { x = 5;                    y = env.height - s - 10; }
    else                                    { x = env.width - s - 5;    y = env.height - s - 10; }
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - pad, y - pad, s + pad * 2, s + pad * 2);
    ctx.drawImage(img, x, y, s, s);
  };

  const checkShowUpgradeBanner = () => {
    if (userPlan === 'free') {
      const dismissed = (() => { try { return Number(localStorage.getItem(UPGRADE_DISMISS_KEY) || '0'); } catch { return 0; } })();
      if (Date.now() - dismissed > 24 * 60 * 60 * 1000) setShowUpgradeBanner(true);
    }
  };

  const handlePrint = () => {
    const curr = bulkMode && bulkAddresses.length > 0 ? bulkAddresses[currentBulkIndex] : recipient;
    saveToHistory(curr);
    triggerAutoSavePrompt(curr);
    checkShowUpgradeBanner();
    setMascotState("working"); setMascotMessage("高解像度で準備中...");
    const dataUrl = generateHighDPICanvas();
    const env = ENVELOPE_SIZES[envelopeSize];
    const pw = window.open("", "_blank");
    if (pw) {
      pw.document.write(`<!DOCTYPE html><html><head><title>封筒印刷</title>
<style>@page{size:${env.width}mm ${env.height}mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${env.width}mm;height:${env.height}mm;overflow:hidden}
img{width:${env.width}mm;height:${env.height}mm;display:block;image-rendering:high-quality}</style>
</head><body><img src="${dataUrl}" alt="封筒プレビュー"/><script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}};</script></body></html>`);
      pw.document.close();
      setMascotState("success")
      triggerSuccess('envelope-print');; setMascotMessage("300DPI印刷準備完了！");
    } else { setMascotState("error"); setMascotMessage("ポップアップブロック"); }
  };

  const generatePDF = () => {
    const curr = bulkMode && bulkAddresses.length > 0 ? bulkAddresses[currentBulkIndex] : recipient;
    saveToHistory(curr);
    triggerAutoSavePrompt(curr);
    checkShowUpgradeBanner();
    setMascotState("working"); setMascotMessage("高解像度PDF作成中...");
    const dataUrl = generateHighDPICanvas();
    const env = ENVELOPE_SIZES[envelopeSize];
    const pw = window.open("", "_blank");
    if (pw) {
      pw.document.write(`<!DOCTYPE html><html><head><title>封筒印刷 - ${env.name}</title>
<style>@page{size:${env.width}mm ${env.height}mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif}
.ctrl{padding:20px;background:#f5f5f5;text-align:center;border-bottom:1px solid #ddd}
.ctrl h2{margin-bottom:10px;color:#2563eb}.ctrl .badge{display:inline-block;background:#10b981;color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;margin-left:8px}
.ctrl p{color:#666;margin-bottom:15px;font-size:14px}
.ctrl button{padding:12px 40px;font-size:16px;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer}
.preview{display:flex;justify-content:center;align-items:center;padding:20px;background:#e5e5e5;min-height:calc(100vh - 150px)}
.env{background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.15)}.env img{display:block;width:${env.width * 2}px;height:${env.height * 2}px;image-rendering:high-quality}
@media print{.ctrl{display:none!important}.preview{padding:0;background:none;min-height:auto}.env{box-shadow:none}.env img{width:${env.width}mm;height:${env.height}mm}}</style>
</head><body><div class="ctrl"><h2>🖨️ 封筒印刷プレビュー<span class="badge">300 DPI</span></h2>
<p>用紙サイズを「${env.name} (${env.width}×${env.height}mm)」に設定してください</p>
<button onclick="window.print()">印刷 / PDF保存</button></div>
<div class="preview"><div class="env"><img src="${dataUrl}" alt="封筒プレビュー"/></div></div></body></html>`);
      pw.document.close();
      setMascotState("success")
      triggerSuccess('envelope-print');; setMascotMessage("300DPI PDF完成！");
    } else { setMascotState("error"); setMascotMessage("ポップアップブロック"); }
  };

  if (!mounted) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  const envelope = ENVELOPE_SIZES[envelopeSize];
  const curr = bulkMode && bulkAddresses.length > 0 ? bulkAddresses[currentBulkIndex] : recipient;
  const autoFonts = calcAutoFonts(curr, envelope);
  const recommendedSize = overflowSuggestions[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              <span className="text-2xl">🔧</span><span>山田ツール</span>
            </Link>
            <Link href="/generator" className="text-sm text-gray-600 hover:text-gray-900">生成ツール一覧</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white"><span className="text-4xl mr-3">✉️</span>封筒印刷・宛名印刷<span className="ml-3 text-sm bg-green-500 text-white px-3 py-1 rounded-full">300 DPI</span></h1>
            <p className="text-gray-600">日本の全封筒サイズに対応。高解像度印刷で美しい仕上がり。</p>
          </div>

          {/* ── Print History ── */}
          {printHistory.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                <span>🕒</span> 最近の印刷
                <span className="text-xs text-gray-400">({getPlanLimits(userPlan).history >= 9999 ? '全履歴' : `最大${getPlanLimits(userPlan).history}件`})</span>
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {printHistory.map(entry => {
                  const borderColor = entry.envelopeSize.startsWith("naga") ? "border-l-blue-400"
                    : entry.envelopeSize.startsWith("kaku") ? "border-l-green-400" : "border-l-purple-400";
                  const label = entry.recipient.company || entry.recipient.name || entry.recipient.address || "（住所）";
                  const d = new Date(entry.timestamp);
                  const dateStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
                  return (
                    <div key={entry.id}
                      className={`min-w-[148px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 border-l-4 ${borderColor} rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow flex-shrink-0`}>
                      <p className="text-xs font-medium text-gray-800 truncate">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{entry.envelopeLabel}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
                      <button
                        onClick={() => {
                          setRecipient({
                            postalCode: entry.recipient.postalCode, prefecture: entry.recipient.prefecture,
                            city: entry.recipient.city, address1: entry.recipient.address, address2: "",
                            building: entry.recipient.building, companyName: entry.recipient.company,
                            department: "", name: entry.recipient.name, honorific: entry.recipient.honorific,
                          });
                          setEnvelopeSize(entry.envelopeSize as EnvelopeSize);
                          showToast("🕒 履歴から読み込みました");
                        }}
                        className="mt-2 text-xs text-blue-600 hover:underline font-medium">再利用</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Template quick-fill buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {TEMPLATES.map(tpl => (
              <button key={tpl.label} onClick={() => applyTemplate(tpl)}
                className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                {tpl.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 shadow border border-gray-200 inline-flex">
              <button onClick={() => setActiveTab("simple")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "simple" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}>🎯 かんたんモード</button>
              <button onClick={() => setActiveTab("advanced")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "advanced" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}>⚙️ 詳細設定</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={() => {
                setShowSender(true);
                setTimeout(() => document.getElementById('sender-section')?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
              className="flex-1 border border-gray-200 rounded-xl p-3 text-sm text-center hover:shadow-md hover:border-blue-300 cursor-pointer transition-all text-gray-600"
            >
              📝 差出人を設定
            </button>
            <button
              type="button"
              onClick={() => setBulkMode(true)}
              className="flex-1 border border-gray-200 rounded-xl p-3 text-sm text-center hover:shadow-md hover:border-blue-300 cursor-pointer transition-all text-gray-600"
            >
              📋 CSVで一括印刷
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('advanced')}
              className="flex-1 border border-gray-200 rounded-xl p-3 text-sm text-center hover:shadow-md hover:border-blue-300 cursor-pointer transition-all text-gray-600"
            >
              ⚙️ 詳細レイアウト
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* ── LEFT PANEL ── */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900"><span>📐</span> 封筒設定</h2>
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">封筒テンプレート（クリックで選択）</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {([
                      { key: "naga3",  label: "長圆3号",  w: 120, h: 235, desc: "ビジネス" },
                      { key: "naga4",  label: "長圆4号",  w: 90,  h: 205, desc: "小型" },
                      { key: "kaku2",  label: "角圆2号",  w: 240, h: 332, desc: "A4書類" },
                      { key: "kaku3",  label: "角圆3号",  w: 216, h: 277, desc: "B5書類" },
                      { key: "yo2",    label: "洋圆2号",  w: 162, h: 114, desc: "招待状" },
                      { key: "yo4",    label: "洋圆4号",  w: 235, h: 105, desc: "横長" },
                    ] as const).map(({ key, label, w, h, desc }) => {
                      const maxW = 32, maxH = 44;
                      const scale = Math.min(maxW / w, maxH / h);
                      const dw = Math.round(w * scale), dh = Math.round(h * scale);
                      const selected = envelopeSize === key;
                      return (
                        <button key={key} type="button"
                          onClick={() => setEnvelopeSize(key as EnvelopeSize)}
                          className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 bg-white"}`}>
                          <svg width={maxW} height={maxH} viewBox={`0 0 ${maxW} ${maxH}`}>
                            <rect
                              x={(maxW - dw) / 2} y={(maxH - dh) / 2}
                              width={dw} height={dh}
                              fill={selected ? "#eff6ff" : "#f9fafb"}
                              stroke={selected ? "#3b82f6" : "#9ca3af"}
                              strokeWidth="1.5" rx="1"
                            />
                          </svg>
                          <span className={`text-xs font-medium whitespace-nowrap ${selected ? "text-blue-700" : "text-gray-700"}`}>{label}</span>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">封筒サイズ <span title="長形3号は最も一般的。洋形は招待状向け。角形2号はA4書類向け" className="text-gray-400 hover:text-gray-600 cursor-help text-xs">❓</span></label>
                    <select value={envelopeSize} onChange={(e) => setEnvelopeSize(e.target.value as EnvelopeSize)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                      <optgroup label="長形">
                        {(["naga3","naga4","naga40","naga30"] as EnvelopeSize[]).map(k => (
                          <option key={k} value={k}>{ENVELOPE_SIZES[k].name} {sizeOverflowMap[k] ? "⚠️" : k === recommendedSize ? "★" : ""}</option>
                        ))}
                      </optgroup>
                      <optgroup label="角形">
                        {(["kaku2","kakuA4","kaku3","kaku6","kaku8"] as EnvelopeSize[]).map(k => (
                          <option key={k} value={k}>{ENVELOPE_SIZES[k].name} {sizeOverflowMap[k] ? "⚠️" : k === recommendedSize ? "★" : ""}</option>
                        ))}
                      </optgroup>
                      <optgroup label="洋形">
                        {(["yo0","yo2","yo3","yo4","yo6"] as EnvelopeSize[]).map(k => (
                          <option key={k} value={k}>{ENVELOPE_SIZES[k].name} {sizeOverflowMap[k] ? "⚠️" : k === recommendedSize ? "★" : ""}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">書き方向 <span title="縦書き＝正式なビジネス文書、横書き＝カジュアル" className="text-gray-400 hover:text-gray-600 cursor-help text-xs">❓</span></label>
                    <select value={writingDirection} onChange={(e) => setWritingDirection(e.target.value as WritingDirection)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                      <option value="vertical">縦書き</option>
                      <option value="horizontal">横書き</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showPostalBox} onChange={(e) => setShowPostalBox(e.target.checked)} className="w-4 h-4 rounded"/><span className="text-sm text-gray-700">郵便番号枠 <span title="郵便番号の赤枠を封筒に表示します" className="text-gray-400 hover:text-gray-600 cursor-help text-xs">❓</span></span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showSender} onChange={(e) => setShowSender(e.target.checked)} className="w-4 h-4 rounded"/><span className="text-sm text-gray-700">差出人</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={bulkMode} onChange={(e) => setBulkMode(e.target.checked)} className="w-4 h-4 rounded"/><span className="text-sm text-gray-700">CSV一括 <span title="CSVファイルで複数の宛先を一度に印刷できます" className="text-gray-400 hover:text-gray-600 cursor-help text-xs">❓</span></span></label>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm flex items-center justify-between flex-wrap gap-2">
                  <span><span className="text-blue-700 font-medium">📮 {envelope.postal === "teikei" ? "定形" : "定形外"}</span><span className="text-gray-600 ml-2">({envelope.width}×{envelope.height}mm)</span></span>
                  {activeTab === "simple" && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      自動フォント: 住所{autoFonts.addrFs}pt / 会社{autoFonts.companyFs}pt / 氏名{autoFonts.nameFs}pt
                    </span>
                  )}
                </div>
                {/* Recommended size badge */}
                {overflowWarning && overflowSuggestions.length > 0 && (
                  <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2 flex-wrap">
                    <span>⭐ おすすめ封筒:</span>
                    {overflowSuggestions.map(k => (
                      <button key={k} onClick={() => setEnvelopeSize(k)}
                        className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 rounded font-medium transition-colors">
                        {ENVELOPE_SIZES[k].name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Address Book ── */}
              {!bulkMode && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setAddressBookOpen(o => !o)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <span className="flex items-center gap-2 font-bold text-[#1e3a5f]">
                      <span>📒</span>
                      アドレス帳
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        {(() => { const lim = getPlanLimits(userPlan).addresses; return savedAddresses.length > 0 ? `(${savedAddresses.length}/${lim}件)` : `(${lim}件まで)`; })()}
                      </span>
                    </span>
                    <span className={`text-gray-400 transition-transform duration-200 ${addressBookOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {addressBookOpen && (
                    <div className="px-6 pb-5 border-t border-gray-100">
                      {savedAddresses.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm">
                          <p>保存された住所がありません</p>
                          <p className="mt-1 text-xs">宛先を入力後、💾 ボタンで保存できます</p>
                        </div>
                      ) : (
                        <div className="space-y-2 mt-3">
                          {savedAddresses.map(saved => {
                            const d = new Date(saved.lastUsedAt);
                            const dateStr = `${d.getMonth()+1}/${d.getDate()}`;
                            return (
                              <div key={saved.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm text-gray-800 truncate">
                                      <span className="mr-1">{saved.company ? "🏢" : "👤"}</span>{saved.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                                      〒{saved.postalCode} {saved.prefecture}{saved.city}{saved.address}
                                    </p>
                                  </div>
                                  <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5">最終使用: {dateStr}</span>
                                </div>
                                <div className="flex gap-3 mt-2">
                                  <button onClick={() => loadFromAddressBook(saved)}
                                    className="text-xs text-blue-600 hover:underline font-medium">読み込む</button>
                                  <button onClick={() => deleteFromAddressBook(saved.id)}
                                    className="text-xs text-red-500 hover:underline">削除</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {savedAddresses.length >= getPlanLimits(userPlan).addresses && userPlan === 'free' && (
                        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                          <p>無料プランでは3件まで保存できます。</p>
                          <p className="mt-1">PROプランにアップグレードすると<strong>100件</strong>まで保存可能です。
                            <Link href="/pricing" className="ml-1 text-amber-700 font-medium hover:underline">PROプランを見る →</Link>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!bulkMode && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white"><span>📬</span> 宛先</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">郵便番号 <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <input type="text" value={recipient.postalCode} onChange={(e) => { setRecipient({...recipient, postalCode: e.target.value}); setPostalError(""); setFieldErrors({...fieldErrors, postalCode: ""}); }} placeholder="1000001" maxLength={8} className={`flex-1 bg-gray-50 border rounded-lg px-3 py-2 ${fieldErrors.postalCode ? "border-red-400" : "border-gray-300"}`}/>
                        <button onClick={handlePostalLookup} disabled={postalLoading} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap">
                          {postalLoading ? "..." : "住所検索"}
                        </button>
                      </div>
                      {fieldErrors.postalCode && <p className="text-xs text-red-500 mt-1">{fieldErrors.postalCode}</p>}
                      {postalError && <p className="text-xs text-red-500 mt-1">{postalError}</p>}
                      {postalConfirm && <p className="text-xs text-green-600 mt-1 bg-green-50 px-2 py-1 rounded">✅ {postalConfirm}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={recipient.prefecture} onChange={(e) => setRecipient({...recipient, prefecture: e.target.value})} placeholder="都道府県" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                      <input type="text" value={recipient.city} onChange={(e) => setRecipient({...recipient, city: e.target.value})} placeholder="市区町村" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    </div>
                    <input type="text" value={recipient.address1} onChange={(e) => setRecipient({...recipient, address1: e.target.value})} placeholder="番地 (例: 1丁目2-3)" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    <input type="text" value={recipient.building} onChange={(e) => setRecipient({...recipient, building: e.target.value})} placeholder="建物名・部屋番号" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    <input type="text" value={recipient.companyName} onChange={(e) => setRecipient({...recipient, companyName: e.target.value})} placeholder="会社名" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    <input type="text" value={recipient.department} onChange={(e) => setRecipient({...recipient, department: e.target.value})} placeholder="部署名" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">氏名 <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-3 gap-3">
                        <input type="text" value={recipient.name} onChange={(e) => { setRecipient({...recipient, name: e.target.value}); setFieldErrors({...fieldErrors, name: ""}); }} placeholder="氏名" className={`col-span-2 bg-gray-50 border rounded-lg px-3 py-2 ${fieldErrors.name ? "border-red-400" : "border-gray-300"}`}/>
                        <select value={recipient.honorific} onChange={(e) => setRecipient({...recipient, honorific: e.target.value})} className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                          <option value="様">様</option><option value="御中">御中</option><option value="殿">殿</option><option value="先生">先生</option><option value="">なし</option>
                        </select>
                      </div>
                      {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      {savedAddresses.length >= getPlanLimits(userPlan).addresses ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                          {userPlan === 'free' ? `無料プランの保存上限(3件)に達しています。` : `プランの保存上限に達しています。`}
                          {userPlan === 'free' && <Link href="/pricing" className="ml-1 font-medium hover:underline">PROプランで100件まで →</Link>}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (!recipient.postalCode && !recipient.prefecture && !recipient.city) {
                              showToast("⚠️ 郵便番号または住所を入力してください");
                              return;
                            }
                            saveToAddressBook(recipient);
                          }}
                          className="w-full py-2 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                          💾 住所を保存（アドレス帳に追加）
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {bulkMode && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white"><span>📋</span> CSV一括印刷</h2>
                  {isFeatureEnabled("BULK_MAIL_MERGE") ? (
                    <BulkModePanel
                      envelopeSize={{ widthMm: ENVELOPE_SIZES[envelopeSize].width, heightMm: ENVELOPE_SIZES[envelopeSize].height, type: ENVELOPE_SIZES[envelopeSize].type as "naga" | "kaku" | "yo" }}
                      sender={sender}
                      userPlan={userPlan}
                      onAddressSelect={(addr) => {
                        setRecipient({
                          postalCode: addr.postalCode, prefecture: addr.prefecture, city: addr.city,
                          address1: addr.address1, address2: addr.address2, building: addr.building,
                          companyName: addr.companyName, department: addr.department, name: addr.name, honorific: addr.honorific,
                        });
                      }}
                    />
                  ) : (
                    <>
                      {csvLimitBanner !== null && (
                        <div className="mb-4 bg-amber-50 border border-amber-300 rounded-lg p-4 text-amber-800 text-sm">
                          {(() => { const lim = getPlanLimits(userPlan).csvRows; return (
                            <>
                              <p className="font-medium">⚠️ 現在のプランでは{lim}件まで一括処理できます（{csvLimitBanner}件中{lim}件を読み込みました）</p>
                              {userPlan === 'free' && <p className="mt-1 text-xs">PROプランで５０件まで、TEAMプランで５００件まで一括処理可能！</p>}
                              {userPlan === 'pro' && <p className="mt-1 text-xs">TEAMプランで５００件まで一括処理可能！</p>}
                              {userPlan !== 'enterprise' && <Link href="/pricing" className="mt-1 inline-block text-xs font-medium text-amber-700 hover:underline">プランを見る →</Link>}
                            </>
                          ); })()}
                        </div>
                      )}
                      <div
                        onDragOver={(e) => { e.preventDefault(); setCsvDragOver(true); }}
                        onDragLeave={() => setCsvDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault(); setCsvDragOver(false);
                          const file = e.dataTransfer.files[0];
                          if (!file) return;
                          if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
                            handleExcelImport(file);
                          } else {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const text = ev.target?.result as string;
                              setCsvData(text);
                              handleCSVImport(text);
                            };
                            reader.readAsText(file, "UTF-8");
                          }
                        }}
                        className={`mb-3 border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${csvDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-gray-50"}`}>
                        <p className="text-sm text-gray-600 dark:text-gray-300">📁 ファイルを選択またはドラッグ＆ドロップ</p>
                        <p className="text-xs text-gray-400 mt-1">.csv / .xlsx / .txt 対応</p>
                        <input type="file" accept=".csv,.txt" className="hidden" id="csv-file-input"
                          onChange={(e) => {
                            const file = e.target.files?.[0]; if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const text = ev.target?.result as string;
                              setCsvData(text);
                              handleCSVImport(text);
                            };
                            reader.readAsText(file, "UTF-8");
                            e.target.value = "";
                          }}/>
                        <label htmlFor="csv-file-input" className="mt-2 inline-block px-3 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-700 cursor-pointer hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">ファイルを選択</label>
                          <input type="file" accept=".xlsx,.xls" className="hidden" id="excel-file-input" onChange={(e) => { const f=e.target.files?.[0]; if(!f) return; handleExcelImport(f); e.target.value=""; }}/>
                          <label htmlFor="excel-file-input" className="inline-block px-3 py-1.5 bg-green-600 text-white rounded text-xs cursor-pointer hover:bg-green-700">📊 Excelをアップロード</label>
                      </div>
                      <textarea value={csvData} onChange={(e) => setCsvData(e.target.value)}
                        placeholder="ヘッダー行&#10;データ行..." className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm h-28 font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                      {csvData.trim() && (() => {
                        const n = countCsvRows(csvData);
                        const lim = getPlanLimits(userPlan).csvRows;
                        const planLabel = userPlan === 'free' ? '無料プラン' : userPlan.toUpperCase();
                        return (
                          <p className={`text-xs mt-1 ${n > lim ? "text-amber-600 font-medium" : "text-gray-500"}`}>
                            入力件数: {n}件{n > lim ? ` ⚠️ ${planLabel}では${lim}件まで処理されます` : ` / 最大${lim}件（${planLabel}）`}
                          </p>
                        );
                      })()}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <button onClick={() => handleCSVImport()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">読み込む</button>
                        <button onClick={downloadSampleCSV} className="text-xs text-blue-600 hover:underline">📥 サンプルCSVをダウンロード</button>
                      </div>
                      {bulkAddresses.length > 0 && (
                        <div className="mt-4 flex items-center gap-2">
                          <button onClick={() => {const i=Math.max(0,currentBulkIndex-1);setCurrentBulkIndex(i);setRecipient(bulkAddresses[i]);}} disabled={currentBulkIndex===0} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">←</button>
                          <span className="text-sm text-gray-700">{currentBulkIndex+1}/{bulkAddresses.length}</span>
                          <button onClick={() => {const i=Math.min(bulkAddresses.length-1,currentBulkIndex+1);setCurrentBulkIndex(i);setRecipient(bulkAddresses[i]);}} disabled={currentBulkIndex===bulkAddresses.length-1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">→</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {showSender && (
                <div id="sender-section" className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white"><span>📤</span> 差出人</h2>
                  {senderRestored && (
                    <div className="mb-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
                      ✅ 前回の差出人情報を復元しました
                    </div>
                  )}
                  <div className="space-y-3">
                    <input type="text" value={sender.postalCode} onChange={(e) => setSender({...sender, postalCode: e.target.value})} placeholder="郵便番号" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    <input type="text" value={sender.address} onChange={(e) => setSender({...sender, address: e.target.value})} placeholder="住所" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    <input type="text" value={sender.companyName} onChange={(e) => setSender({...sender, companyName: e.target.value})} placeholder="会社名" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    <input type="text" value={sender.name} onChange={(e) => setSender({...sender, name: e.target.value})} placeholder="氏名" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    <button onClick={saveSenderData}
                      className="w-full py-2 min-h-[44px] bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                      💾 差出人を保存（次回から自動入力）
                    </button>
                  </div>
                </div>
              )}

                            {/* ── PRO: Company Logo ── */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <button onClick={() => setLogoSectionOpen(o => !o)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-2 font-bold text-[#1e3a5f]">
                    <span>🏢</span> 会社ロゴ
                    {getPlanLimits(userPlan).logos === 0 && (
                      <span className="ml-1 text-xs font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full">PRO</span>
                    )}
                    {getPlanLimits(userPlan).logos > 0 && logos.length > 0 && (
                      <span className="text-sm font-normal text-gray-500 ml-1">({logos.length}/{getPlanLimits(userPlan).logos}件)</span>
                    )}
                  </span>
                  <span className={`text-gray-400 transition-transform duration-200 ${logoSectionOpen ? "rotate-180" : ""}`}>▼</span>
                </button>
                {logoSectionOpen && (
                  <div className="px-6 pb-5 border-t border-gray-100">
                    {getPlanLimits(userPlan).logos === 0 ? (
                      <div className="mt-4 text-center py-6 bg-gray-50 rounded-lg relative overflow-hidden">
                        <div className="blur-sm pointer-events-none select-none text-sm text-gray-400 mb-2">
                          🏢 [ロゴプレビュー] 会社.png
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 font-medium">会社のロゴを封筒に印刷できます</p>
                          <Link href="/pricing" className="mt-2 inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition-colors">
                            PROプランにアップグレード →
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        {logos.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {logos.map((logo, i) => (
                              <div key={i} onClick={() => setActiveLogoIdx(i)}
                                className={`relative cursor-pointer rounded-lg border-2 p-1 transition-colors ${activeLogoIdx === i ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <img src={logo} alt={`ロゴ${i+1}`} className="w-14 h-14 object-contain rounded"/>
                                <button
                                  onClick={(e) => { e.stopPropagation(); const nl = logos.filter((_,idx) => idx !== i); setLogos(nl); if (activeLogoIdx >= nl.length) setActiveLogoIdx(Math.max(0, nl.length-1)); try { localStorage.setItem(LOGO_KEY, JSON.stringify(nl)); } catch {} }}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">×</button>
                                {activeLogoIdx === i && <span className="absolute bottom-0 left-0 right-0 text-center text-xs bg-blue-400 text-white rounded-b leading-4">使用中</span>}
                              </div>
                            ))}
                          </div>
                        )}
                        {logos.length < getPlanLimits(userPlan).logos ? (
                          <div className="border-2 border-dashed rounded-lg p-4 text-center transition-colors border-gray-300 hover:border-blue-400">
                            <p className="text-sm text-gray-500">📁 画像をドラッグ＆ドロップ</p>
                            <p className="text-xs text-gray-400 mt-1">PNG / JPG / SVG 対応（500KB以下推奨）</p>
                            <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" id="logo-file-input"
                              onChange={(e) => {
                                const file = e.target.files?.[0]; if (!file) return;
                                if (file.size > 600 * 1024) { showToast("⚠️ ファイルサイズは500KB以下にしてください"); return; }
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const data = ev.target?.result as string;
                                  const nl = [...logos, data];
                                  setLogos(nl);
                                  setActiveLogoIdx(nl.length - 1);
                                  try { localStorage.setItem(LOGO_KEY, JSON.stringify(nl)); } catch {}
                                };
                                reader.readAsDataURL(file);
                                e.target.value = "";
                              }}/>
                            <label htmlFor="logo-file-input" className="mt-2 inline-block px-3 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-700 cursor-pointer hover:bg-gray-50">
                              ファイルを選択
                            </label>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 text-center">ロゴ上限({getPlanLimits(userPlan).logos}件)に達しています</p>
                        )}
                        {logos.length > 0 && (
                          <>
                            <div>
                              <label className="block text-xs text-gray-500 mb-2">配置位置</label>
                              <div className="grid grid-cols-2 gap-2">
                                {([["top-left","左上（横書き）"],["top-right","右上"],["above-sender","差出人の上"],["left-sender","差出人の左（縦書き）"]] as const).map(([v, label]) => (
                                  <label key={v} className={`flex items-center gap-2 text-xs cursor-pointer p-2 rounded-lg border transition-colors ${logoPosition === v ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="logoPos" value={v} checked={logoPosition === v} onChange={() => setLogoPosition(v)} className="sr-only"/>
                                    {label}
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">サイズ: {logoSizeMm}mm</label>
                              <input type="range" min={10} max={40} value={logoSizeMm} onChange={e => setLogoSizeMm(Number(e.target.value))} className="w-full accent-blue-600"/>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">不透明度: {logoOpacity}%</label>
                              <input type="range" min={20} max={100} value={logoOpacity} onChange={e => setLogoOpacity(Number(e.target.value))} className="w-full accent-blue-600"/>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── PRO: QR Code ── */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <button onClick={() => setQrSectionOpen(o => !o)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-2 font-bold text-[#1e3a5f]">
                    <span>📱</span> QRコード
                    {!getPlanLimits(userPlan).qr && (
                      <span className="ml-1 text-xs font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full">PRO</span>
                    )}
                  </span>
                  <span className={`text-gray-400 transition-transform duration-200 ${qrSectionOpen ? "rotate-180" : ""}`}>▼</span>
                </button>
                {qrSectionOpen && (
                  <div className="px-6 pb-5 border-t border-gray-100">
                    {!getPlanLimits(userPlan).qr ? (
                      <div className="mt-4 text-center py-5 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium">封筒にQRコードを印刷できます</p>
                        <p className="text-xs text-gray-400 mt-1">URL・決済リンク・会社サイトなど</p>
                        <Link href="/pricing" className="mt-3 inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold transition-colors">
                          PROプランにアップグレード →
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">QRコードの内容</label>
                          <input type="text" value={qrContent} onChange={e => { setQrContent(e.target.value); try { localStorage.setItem(QR_KEY, e.target.value); } catch {} }}
                            placeholder="https://example.com"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                        </div>
                        {qrImgRef.current && qrContent.trim() && (
                          <div className="flex justify-center">
                            <img src={qrImgRef.current.src} alt="QRコード" className="w-20 h-20 border border-gray-200 rounded"/>
                          </div>
                        )}
                        <div>
                          <label className="block text-xs text-gray-500 mb-2">配置位置</label>
                          <div className="grid grid-cols-2 gap-2">
                            {([["top-left","左上"],["top-right","右上"],["bottom-left","左下"],["bottom-right","右下"]] as const).map(([v, label]) => (
                              <label key={v} className={`flex items-center gap-2 text-xs cursor-pointer p-2 rounded-lg border transition-colors ${qrPosition === v ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" name="qrPos" value={v} checked={qrPosition === v} onChange={() => setQrPosition(v)} className="sr-only"/>
                                {label}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">サイズ: {qrSizeMm}mm</label>
                          <input type="range" min={10} max={30} value={qrSizeMm} onChange={e => setQrSizeMm(Number(e.target.value))} className="w-full accent-blue-600"/>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white"><span>🔖</span> スタンプ（在中）</h2>
                <label className="flex items-center gap-2 cursor-pointer mb-3"><input type="checkbox" checked={stamp.enabled} onChange={(e) => setStamp({...stamp, enabled: e.target.checked})} className="w-4 h-4 rounded"/><span className="text-sm text-gray-700">スタンプ表示</span></label>
                {stamp.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <select value={stamp.text} onChange={(e) => setStamp({...stamp, text: e.target.value})} className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="請求書在中">請求書在中</option><option value="納品書在中">納品書在中</option><option value="見積書在中">見積書在中</option><option value="領収書在中">領収書在中</option><option value="履歴書在中">履歴書在中</option><option value="親展">親展</option><option value="重要">重要</option><option value="至急">至急</option><option value="バッテリー同梱なし">バッテリー同梱なし</option><option value="取扱注意">取扱注意</option><option value="壊れ物注意">壊れ物注意</option><option value="カスタム">カスタム</option>
                    </select>
                    <select value={stamp.color} onChange={(e) => setStamp({...stamp, color: e.target.value as "red"|"blue"|"black"})} className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="red">赤</option><option value="blue">青</option><option value="black">黒</option>
                    </select>
                  </div>
                )}
                {stamp.enabled && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-500 mb-2">スタンプ位置</label>
                    <div className="grid grid-cols-3 gap-1 w-24">
                      {[0,1,2,3,4,5,6,7,8].map(pos => (
                        <button key={pos} onClick={() => setStampPosition(pos)}
                          className={`w-7 h-7 rounded text-xs transition-colors ${stampPosition === pos ? "bg-blue-600" : "bg-gray-200 hover:bg-gray-300"}`}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {activeTab === "advanced" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white"><span>⚙️</span> 詳細レイアウト</h2>
                  <div className="space-y-4 text-sm">
                    <div><h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">宛先住所</h3><div className="grid grid-cols-3 gap-2">
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">X</label><input type="number" value={settings.recipientAddressX} onChange={(e) => setSettings({...settings, recipientAddressX: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">Y</label><input type="number" value={settings.recipientAddressY} onChange={(e) => setSettings({...settings, recipientAddressY: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">文字</label><input type="number" value={settings.recipientAddressFontSize} onChange={(e) => setSettings({...settings, recipientAddressFontSize: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                    </div></div>
                    <div><h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">宛先氏名</h3><div className="grid grid-cols-3 gap-2">
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">X</label><input type="number" value={settings.recipientNameX} onChange={(e) => setSettings({...settings, recipientNameX: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">Y</label><input type="number" value={settings.recipientNameY} onChange={(e) => setSettings({...settings, recipientNameY: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">文字</label><input type="number" value={settings.recipientNameFontSize} onChange={(e) => setSettings({...settings, recipientNameFontSize: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                    </div></div>
                    <div><h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">差出人</h3><div className="grid grid-cols-3 gap-2">
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">X</label><input type="number" value={settings.senderX} onChange={(e) => setSettings({...settings, senderX: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">Y</label><input type="number" value={settings.senderY} onChange={(e) => setSettings({...settings, senderY: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">文字</label><input type="number" value={settings.senderFontSize} onChange={(e) => setSettings({...settings, senderFontSize: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                    </div></div>
                    <div><h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">スタンプ</h3><div className="grid grid-cols-3 gap-2">
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">X</label><input type="number" value={settings.stampX} onChange={(e) => setSettings({...settings, stampX: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">Y</label><input type="number" value={settings.stampY} onChange={(e) => setSettings({...settings, stampY: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">文字</label><input type="number" value={settings.stampFontSize} onChange={(e) => setSettings({...settings, stampFontSize: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">📮 郵便番号</h4>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">X</label><input type="number" value={settings.postalX} onChange={(e) => setSettings({...settings, postalX: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">Y</label><input type="number" value={settings.postalY} onChange={(e) => setSettings({...settings, postalY: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                      <div><label className="block text-xs text-gray-500 dark:text-gray-400">文字</label><input type="number" value={settings.postalFontSize} onChange={(e) => setSettings({...settings, postalFontSize: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:text-gray-200"/></div>
                    </div></div>
                    {/* Barcode toggle (PRO) */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <label className={`flex items-center gap-2 cursor-pointer ${!getPlanLimits(userPlan).barcode ? 'opacity-50' : ''}`}>
                          <input type="checkbox" checked={showBarcode && getPlanLimits(userPlan).barcode}
                            disabled={!getPlanLimits(userPlan).barcode}
                            onChange={e => setShowBarcode(e.target.checked)} className="w-4 h-4 rounded"/>
                          <span className="text-sm text-gray-700">📊 カスタマーバーコード</span>
                          {!getPlanLimits(userPlan).barcode && (
                            <span className="text-xs font-bold bg-amber-400 text-white px-2 py-0.5 rounded-full">PRO</span>
                          )}
                        </label>
                        {!getPlanLimits(userPlan).barcode && (
                          <Link href="/pricing" className="text-xs text-blue-600 hover:underline">アップグレード</Link>
                        )}
                      </div>
                      {showBarcode && getPlanLimits(userPlan).barcode && (
                        <p className="text-xs text-gray-400 mt-1 ml-6">日本郵便のカスタマーバーコード。郵便番号と住所番号から自動生成されます。</p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={saveSettings} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">💾 設定を保存</button>
                      <button onClick={resetSettings} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm dark:bg-gray-700 dark:text-gray-200">リセット</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT PANEL (preview) ── */}
            <div className="space-y-6 mt-6 lg:mt-0 lg:sticky lg:top-20 lg:self-start">
              <div className="flex justify-center"><Mascot state={mascotState} message={mascotMessage}/></div>

              {/* Overflow warning banner */}
              {overflowWarning && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <span className="text-lg leading-none">⚠️</span>
                  <div>
                    <p className="font-medium">テキストが封筒サイズを超えています</p>
                    <p className="text-xs mt-1">フォントサイズを小さくするか、大きい封筒サイズを選んでください。</p>
                    {overflowSuggestions.length > 0 && (
                      <p className="text-xs mt-1">おすすめ: {overflowSuggestions.map(k => ENVELOPE_SIZES[k].name).join("、")}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white"><span>👁️</span> プレビュー<span className="ml-2 text-xs text-gray-500">(画面用: 低解像度)</span></h2>
                <div className="flex justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4 w-full overflow-hidden">
                  <canvas ref={canvasRef} className={`border shadow-lg max-w-full ${overflowWarning ? "border-amber-400" : "border-gray-300"}`} style={{background:"white", height:"auto"}} />
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">{envelope.name} ({envelope.width}×{envelope.height}mm)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { if (validateForm()) generatePDF(); }} className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md">
                  <span>📄</span>
                  <div className="text-left"><div>PDF / 印刷</div><div className="text-xs opacity-80">300 DPI</div></div>
                </button>
                <button onClick={() => { if (validateForm()) handlePrint(); }} className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md">
                  <span>🖨️</span>
                  <div className="text-left"><div>直接印刷</div><div className="text-xs opacity-80">高画質</div></div>
                </button>
              </div>
              {showUpgradeBanner && userPlan === 'free' && (
                <div className="bg-gradient-to-r from-amber-50 dark:from-amber-900/30 to-yellow-50 dark:to-yellow-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-xl shrink-0">💡</span>
                  <div className="flex-1 text-sm text-amber-800 dark:text-amber-300">
                    <p className="font-medium">PROプランなら<strong>会社ロゴ・バーコード・QRコード</strong>も印刷できます</p>
                    <Link href="/pricing" className="font-medium underline mt-1 inline-block text-amber-700">アップグレード →</Link>
                  </div>
                  <button onClick={() => { setShowUpgradeBanner(false); try { localStorage.setItem(UPGRADE_DISMISS_KEY, String(Date.now())); } catch {} }}
                    className="text-amber-400 hover:text-amber-600 text-xl leading-none shrink-0">×</button>
                </div>
              )}

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                <h3 className="font-bold text-green-800 mb-2 dark:text-green-300">✨ 高画質印刷対応</h3>
                <ul className="text-sm text-green-900 space-y-1 dark:text-green-300">
                  <li>• <strong>300 DPI</strong>で印刷 - プロ品質の仕上がり</li>
                  <li>• 縦中横（数字の自動組み版）対応</li>
                  <li>• フォントサイズ自動調整で文字切れなし</li>
                </ul>
              </div>
            </div>
          </div>

          {seoContent && (
            <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">封筒印刷・宛名印刷について</h2>
              <p className="text-gray-600 mb-4">{seoContent.intro}</p>
              {seoContent.useCases && (
                <div className="grid sm:grid-cols-2 gap-3 my-4">
                  {seoContent.useCases.map((uc, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-gray-800">{uc.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{uc.desc}</p>
                    </div>
                  ))}
                </div>
              )}
              {seoContent.tips && (
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">💡 <strong>ヒント:</strong> {seoContent.tips}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-12">
            <RelatedTools tools={relatedToolSets.envelope} title="あわせて使えるツール" />
          </div>

          {faq && faq.length > 0 && (
            <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">よくある質問</h2>
              <div className="space-y-4">
                <LazyFAQ faq={faq} />
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12 py-6"><div className="container mx-auto px-4 text-center text-gray-500 text-sm">© 2026 合同会社山田トレード</div></footer>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm px-5 py-3 rounded-xl shadow-xl whitespace-nowrap pointer-events-none animate-fade-in">
          {toast}
        </div>
      )}

      {/* Auto-save toast after print */}
      {autoSaveToast && autoSaveAddr && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-xl rounded-xl px-5 py-4 flex items-center gap-4 text-sm max-w-sm w-full">
          <span className="flex-1 text-gray-700">この住所をアドレス帳に保存しますか？</span>
          <button
            onClick={() => { saveToAddressBook(autoSaveAddr); setAutoSaveToast(false); }}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">保存する</button>
          <button onClick={() => setAutoSaveToast(false)}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200">しない</button>
        </div>
      )}
    </div>
  );
}
