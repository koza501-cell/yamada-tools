"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Mascot, { MascotState } from "@/components/common/Mascot";

const ENVELOPE_SIZES = {
  naga3: { name: "長形3号", width: 120, height: 235, type: "naga", postal: "teikei" },
  naga4: { name: "長形4号", width: 90, height: 205, type: "naga", postal: "teikei" },
  naga40: { name: "長形40号", width: 90, height: 225, type: "naga", postal: "teikei" },
  naga30: { name: "長形30号", width: 92, height: 235, type: "naga", postal: "teikei" },
  kaku2: { name: "角形2号", width: 240, height: 332, type: "kaku", postal: "teikei-gai" },
  kakuA4: { name: "角形A4", width: 228, height: 312, type: "kaku", postal: "teikei-gai" },
  kaku3: { name: "角形3号", width: 216, height: 277, type: "kaku", postal: "teikei-gai" },
  kaku6: { name: "角形6号", width: 162, height: 229, type: "kaku", postal: "teikei-gai" },
  kaku8: { name: "角形8号", width: 119, height: 197, type: "kaku", postal: "teikei" },
  yo0: { name: "洋形0号/洋長3", width: 235, height: 120, type: "yo", postal: "teikei" },
  yo2: { name: "洋形2号", width: 162, height: 114, type: "yo", postal: "teikei" },
  yo3: { name: "洋形3号", width: 148, height: 98, type: "yo", postal: "teikei" },
  yo4: { name: "洋形4号", width: 235, height: 105, type: "yo", postal: "teikei" },
  yo6: { name: "洋形6号", width: 190, height: 98, type: "yo", postal: "teikei" },
};

type EnvelopeSize = keyof typeof ENVELOPE_SIZES;
type WritingDirection = "vertical" | "horizontal";

interface AddressData {
  postalCode: string; prefecture: string; city: string; address1: string;
  address2: string; building: string; companyName: string; department: string;
  name: string; honorific: string;
}

interface SenderData {
  postalCode: string; address: string; companyName: string; name: string;
}

interface StampData {
  enabled: boolean; text: string; color: "red" | "blue" | "black";
}

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
    return { recipientAddressX: 15, recipientAddressY: 25, recipientAddressFontSize: 9,
      recipientNameX: 20, recipientNameY: 55, recipientNameFontSize: 12,
      senderX: e.width - 10, senderY: e.height - 25, senderFontSize: 5,
      stampX: 10, stampY: e.height - 20, stampFontSize: 7,
      postalX: e.width - 70, postalY: 8, postalFontSize: 6 };
  } else if (e.type === "kaku") {
    return { recipientAddressX: e.width - 30, recipientAddressY: 35, recipientAddressFontSize: 11,
      recipientNameX: e.width / 2, recipientNameY: 50, recipientNameFontSize: 16,
      senderX: 30, senderY: e.height - 100, senderFontSize: 8,
      stampX: 8, stampY: 25, stampFontSize: 10,
      postalX: e.width - 85, postalY: 10, postalFontSize: 7 };
  }
  return { recipientAddressX: e.width - 20, recipientAddressY: 28, recipientAddressFontSize: 8,
    recipientNameX: e.width / 2 + 5, recipientNameY: 35, recipientNameFontSize: 12,
    senderX: 35, senderY: e.height - 85, senderFontSize: 6,
    stampX: 6, stampY: 25, stampFontSize: 8,
    postalX: e.width - 70, postalY: 8, postalFontSize: 6 };
};

const STORAGE_KEY = "yamada-envelope-settings";

export default function EnvelopePrintClient() {
  const [mounted, setMounted] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [mascotMessage, setMascotMessage] = useState("封筒の宛名を作成しよう！");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [envelopeSize, setEnvelopeSize] = useState<EnvelopeSize>("naga3");
  const [writingDirection, setWritingDirection] = useState<WritingDirection>("vertical");
  const [showPostalBox, setShowPostalBox] = useState(true);
  const [showSender, setShowSender] = useState(true);
  const [professionalMode, setProfessionalMode] = useState(false);
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

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.sender) setSender(p.sender);
        if (p.professionalMode !== undefined) setProfessionalMode(p.professionalMode);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}-${envelopeSize}`);
        setSettings(saved ? JSON.parse(saved) : getDefaultSettings(envelopeSize));
      } catch { setSettings(getDefaultSettings(envelopeSize)); }
    }
  }, [envelopeSize, mounted]);

  useEffect(() => { if (mounted) renderPreview(); }, [mounted, envelopeSize, writingDirection, showPostalBox, showSender, recipient, sender, stamp, currentBulkIndex, bulkAddresses, settings]);

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sender, professionalMode }));
      localStorage.setItem(`${STORAGE_KEY}-${envelopeSize}`, JSON.stringify(settings));
      setMascotState("success"); setMascotMessage("設定を保存しました！");
    } catch { setMascotState("error"); setMascotMessage("保存に失敗"); }
  };

  const resetSettings = () => { setSettings(getDefaultSettings(envelopeSize)); setMascotMessage("リセット完了"); };

  const toVerticalNumber = (n: string): string => {
    const m: Record<string,string> = {"0":"〇","1":"一","2":"二","3":"三","4":"四","5":"五","6":"六","7":"七","8":"八","9":"九"};
    return n.split("").map(c => m[c] || c).join("");
  };

  const smartNumberConvert = (text: string): string => {
    // Keep trailing numbers (building numbers) as digits
    // Convert numbers in middle of text to kanji
    const match = text.match(/^(.+?)(\d+[-－]?\d*)$/);
    if (match) {
      const [, prefix, suffix] = match;
      return prefix.split("").map(c => /[0-9]/.test(c) ? toVerticalNumber(c) : c).join("") + suffix;
    }
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

  const handleCSVImport = () => {
    const addrs = parseCSV(csvData);
    if (addrs.length > 0) {
      setBulkAddresses(addrs); setCurrentBulkIndex(0); setRecipient(addrs[0]);
      setMascotState("success"); setMascotMessage(`${addrs.length}件読込完了！`);
    } else { setMascotState("error"); setMascotMessage("CSV確認してね"); }
  };

  const renderPreview = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const env = ENVELOPE_SIZES[envelopeSize];
    const scale = 2, displayScale = Math.min(350/env.width, 450/env.height);
    canvas.width = env.width * scale; canvas.height = env.height * scale;
    canvas.style.width = `${env.width * displayScale}px`; canvas.style.height = `${env.height * displayScale}px`;
    ctx.scale(scale, scale);
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, env.width, env.height);
    ctx.strokeStyle = "#ddd"; ctx.lineWidth = 0.5; ctx.strokeRect(0.5, 0.5, env.width-1, env.height-1);
    const curr = bulkMode && bulkAddresses.length > 0 ? bulkAddresses[currentBulkIndex] : recipient;
    if (showPostalBox && curr.postalCode) drawPostalCode(ctx, curr.postalCode, env);
    if (stamp.enabled && stamp.text) drawStamp(ctx, stamp, env);
    if (writingDirection === "vertical") drawVerticalAddress(ctx, curr, env);
    else drawHorizontalAddress(ctx, curr, env);
    if (showSender) drawSender(ctx, sender, env);
  };

  const drawPostalCode = (ctx: CanvasRenderingContext2D, code: string, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    const c = code.replace(/[^0-9]/g, ""); if (c.length !== 7) return;
    const bw=5, bh=6.5, gap=2, sx=settings.postalX, sy=settings.postalY;
    ctx.strokeStyle = "#c00"; ctx.lineWidth = 0.5;
    ctx.font = `${settings.postalFontSize+1}px sans-serif`; ctx.fillStyle = "#000";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("〒", sx-8, sy+bh/2);
    for (let i=0; i<7; i++) {
      const xo = i>=3?3:0, x = sx + i*(bw+gap) + xo;
      ctx.strokeRect(x, sy, bw, bh);
      ctx.font = `bold ${settings.postalFontSize}px sans-serif`;
      ctx.fillText(c[i]||"", x+bw/2, sy+bh/2+0.5);
    }
  };

  const drawVerticalAddress = (ctx: CanvasRenderingContext2D, addr: AddressData, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    ctx.fillStyle = "#000"; ctx.textBaseline = "top";
    const sx=settings.recipientAddressX, sy=settings.recipientAddressY, fs=settings.recipientAddressFontSize;
    const lh=fs+2, maxY=env.height-80;
    let cx = sx;
    const full = `${addr.prefecture}${addr.city}${addr.address1}${addr.address2}`;
    if (full) {
      ctx.font = `${fs}px serif`;
      let y = sy;
      for (const ch of full.split("")) {
        if (y > maxY) { cx -= lh; y = sy; }
        ctx.fillText(/[0-9]/.test(ch)?toVerticalNumber(ch):ch, cx, y); y += fs;
      }
      cx -= lh;
    }
    if (addr.building) {
      ctx.font = `${fs-1}px serif`; let y = sy;
      for (const ch of addr.building.split("")) {
        if (y > maxY) { cx -= lh; y = sy; }
        ctx.fillText(/[0-9]/.test(ch)?toVerticalNumber(ch):ch, cx, y); y += fs-1;
      }
      cx -= lh;
    }
    if (addr.companyName) {
      cx -= 3; ctx.font = `${fs+1}px serif`; let y = sy+8;
      for (const ch of addr.companyName.split("")) {
        if (y > maxY) { cx -= lh; y = sy+8; }
        ctx.fillText(ch, cx, y); y += fs+1;
      }
      cx -= lh+1;
    }
    if (addr.department) {
      ctx.font = `${fs}px serif`; let y = sy+12;
      for (const ch of addr.department.split("")) {
        if (y > maxY) { cx -= lh; y = sy+12; }
        ctx.fillText(ch, cx, y); y += fs;
      }
    }
    if (addr.name) {
      const nfs = settings.recipientNameFontSize;
      ctx.font = `bold ${nfs}px serif`; let y = settings.recipientNameY;
      for (const ch of (addr.name+addr.honorific).split("")) {
        ctx.fillText(ch, settings.recipientNameX, y); y += nfs;
      }
    }
  };

  const drawHorizontalAddress = (ctx: CanvasRenderingContext2D, addr: AddressData, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    ctx.fillStyle = "#000"; ctx.textBaseline = "top"; ctx.textAlign = "left";
    const sx=settings.recipientAddressX, fs=settings.recipientAddressFontSize, lh=fs+3;
    let cy = settings.recipientAddressY;
    const full = `${addr.prefecture}${addr.city}${addr.address1}${addr.address2}`;
    if (full) { ctx.font = `${fs}px serif`; ctx.fillText(full, sx, cy); cy += lh; }
    if (addr.building) { ctx.font = `${fs-1}px serif`; ctx.fillText(addr.building, sx+5, cy); cy += lh; }
    if (addr.companyName) { cy+=3; ctx.font = `${fs+1}px serif`; ctx.fillText(addr.companyName, sx, cy); cy += lh+2; }
    if (addr.department) { ctx.font = `${fs}px serif`; ctx.fillText(addr.department, sx+3, cy); cy += lh; }
    if (addr.name) { cy+=3; ctx.font = `bold ${settings.recipientNameFontSize}px serif`; ctx.fillText(`${addr.name} ${addr.honorific}`, sx+5, cy); }
  };

  const drawSender = (ctx: CanvasRenderingContext2D, snd: SenderData, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    if (!snd.address && !snd.name && !snd.companyName) return;
    ctx.fillStyle = "#000";
    const fs=settings.senderFontSize, lh=fs+2;
    if (writingDirection === "vertical") {
      let cx=settings.senderX; const sy=settings.senderY, maxY=env.height-5;
      if (snd.postalCode) { ctx.font=`${fs}px sans-serif`; ctx.textAlign="left"; ctx.fillText(`〒${snd.postalCode}`, 5, sy-10); }
      if (snd.address) {
        ctx.font = `${fs}px serif`; ctx.textAlign="left"; let y=sy;
        const convertedAddr = smartNumberConvert(snd.address);
        for (const ch of convertedAddr.split("")) {
          if (y + fs > maxY) { cx -= lh; if(cx<5)break; y = sy; }
          ctx.fillText(ch, cx, y); y += fs+1;
        }
        cx -= lh+1;
      }
      if (snd.companyName && cx>=5) {
        ctx.font = `${fs}px serif`; let y=sy;
        for (const ch of snd.companyName.split("")) {
          if (y + fs > maxY) { cx -= lh; if(cx<5)break; y = sy; }
          ctx.fillText(ch, cx, y); y += fs+1;
        }
        cx -= lh+1;
      }
      if (snd.name && cx>=5) {
        ctx.font = `${fs+1}px serif`; let y=sy;
        for (const ch of snd.name.split("")) { 
          if(y + fs > maxY)break; 
          ctx.fillText(ch, cx, y); y += fs+2; 
        }
      }
    } else {
      const ex=env.width-8; let cy=settings.senderY; ctx.textAlign="right";
      if (snd.postalCode) { ctx.font=`${fs}px sans-serif`; ctx.fillText(`〒${snd.postalCode}`, ex, cy); cy+=lh; }
      if (snd.address) {
        ctx.font=`${fs}px serif`;
        const maxCh=Math.floor((env.width-20)/(fs*0.6));
        ctx.fillText(snd.address.length>maxCh ? snd.address.substring(0,maxCh-1)+"…" : snd.address, ex, cy); cy+=lh;
      }
      if (snd.companyName) { ctx.font=`${fs}px serif`; ctx.fillText(snd.companyName, ex, cy); cy+=lh; }
      if (snd.name) { ctx.font=`${fs+1}px serif`; ctx.fillText(snd.name, ex, cy); }
    }
  };

  const drawStamp = (ctx: CanvasRenderingContext2D, stmp: StampData, env: typeof ENVELOPE_SIZES[EnvelopeSize]) => {
    const colors = { red: "#c00", blue: "#06c", black: "#333" };
    ctx.strokeStyle = colors[stmp.color]; ctx.fillStyle = colors[stmp.color];
    const x=settings.stampX, y=settings.stampY, fs=settings.stampFontSize;
    if (writingDirection === "vertical") {
      const w=fs+4, h=stmp.text.length*(fs+1)+6;
      ctx.lineWidth=1; ctx.strokeRect(x, y, w, h);
      ctx.font=`${fs}px serif`; ctx.textAlign="center"; ctx.textBaseline="top";
      let cy=y+4;
      for (const ch of stmp.text.split("")) { ctx.fillText(ch, x+w/2, cy); cy+=fs+1; }
    } else {
      ctx.font=`${fs}px serif`;
      const tw=ctx.measureText(stmp.text).width, pad=3;
      ctx.lineWidth=1; ctx.strokeRect(x, y, tw+pad*2, fs+pad*2);
      ctx.textAlign="left"; ctx.textBaseline="top"; ctx.fillText(stmp.text, x+pad, y+pad);
    }
  };

  const handlePrint = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png", 1.0);
    const env = ENVELOPE_SIZES[envelopeSize];
    const pw = window.open("", "_blank");
    if (pw) {
      pw.document.write(`<!DOCTYPE html><html><head><title>封筒印刷</title>
<style>@page{size:${env.width}mm ${env.height}mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${env.width}mm;height:${env.height}mm;overflow:hidden}
img{width:${env.width}mm;height:${env.height}mm;display:block}</style>
</head><body><img src="${dataUrl}"/><script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}};</script></body></html>`);
      pw.document.close();
    }
  };

  const generatePDF = () => {
    setMascotState("working"); setMascotMessage("準備中...");
    const canvas = canvasRef.current;
    if (!canvas) { setMascotState("error"); setMascotMessage("エラー"); return; }
    const env = ENVELOPE_SIZES[envelopeSize];
    const dataUrl = canvas.toDataURL("image/png", 1.0);
    const pw = window.open("", "_blank");
    if (pw) {
      pw.document.write(`<!DOCTYPE html><html><head><title>封筒印刷 - ${env.name}</title>
<style>@page{size:${env.width}mm ${env.height}mm;margin:0}*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif}
.ctrl{padding:20px;background:#f5f5f5;text-align:center;border-bottom:1px solid #ddd}
.ctrl h2{margin-bottom:10px}.ctrl p{color:#666;margin-bottom:15px;font-size:14px}
.ctrl button{padding:12px 40px;font-size:16px;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer}
.preview{display:flex;justify-content:center;align-items:center;padding:20px;background:#e5e5e5;min-height:calc(100vh - 150px)}
.env{background:#fff;box-shadow:0 4px 20px rgba(0,0,0,.15)}.env img{display:block;width:${env.width*2}px;height:${env.height*2}px}
@media print{.ctrl{display:none!important}.preview{padding:0;background:none;min-height:auto}.env{box-shadow:none}.env img{width:${env.width}mm;height:${env.height}mm}}</style>
</head><body><div class="ctrl"><h2>🖨️ 封筒印刷プレビュー</h2>
<p>用紙サイズを「${env.name} (${env.width}×${env.height}mm)」に設定してください</p>
<button onclick="window.print()">印刷 / PDF保存</button></div>
<div class="preview"><div class="env"><img src="${dataUrl}"/></div></div></body></html>`);
      pw.document.close();
      setMascotState("success"); setMascotMessage("新しいタブで開きました！");
    } else { setMascotState("error"); setMascotMessage("ポップアップブロック"); }
  };

  if (!mounted) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  const envelope = ENVELOPE_SIZES[envelopeSize];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              <span className="text-2xl">🔧</span><span>Yamada Tools</span>
            </Link>
            <Link href="/generator" className="text-sm text-gray-600 hover:text-gray-900">生成ツール一覧</Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900"><span className="text-4xl mr-3">✉️</span>封筒印刷・宛名印刷</h1>
            <p className="text-gray-600">日本の全封筒サイズに対応。縦書き・横書き、郵便番号枠、会社ロゴにも対応。</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 shadow border border-gray-200 inline-flex">
              <button onClick={() => setProfessionalMode(false)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!professionalMode ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"}`}>🎯 シンプル</button>
              <button onClick={() => setProfessionalMode(true)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${professionalMode ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"}`}>⚙️ 詳細設定</button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900"><span>📐</span> 封筒設定</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">封筒サイズ</label>
                    <select value={envelopeSize} onChange={(e) => setEnvelopeSize(e.target.value as EnvelopeSize)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800">
                      <optgroup label="長形"><option value="naga3">長形3号 (120×235)</option><option value="naga4">長形4号 (90×205)</option><option value="naga40">長形40号 (90×225)</option><option value="naga30">長形30号 (92×235)</option></optgroup>
                      <optgroup label="角形"><option value="kaku2">角形2号 (240×332)</option><option value="kakuA4">角形A4 (228×312)</option><option value="kaku3">角形3号 (216×277)</option><option value="kaku6">角形6号 (162×229)</option><option value="kaku8">角形8号 (119×197)</option></optgroup>
                      <optgroup label="洋形"><option value="yo0">洋形0号 (235×120)</option><option value="yo2">洋形2号 (162×114)</option><option value="yo3">洋形3号 (148×98)</option><option value="yo4">洋形4号 (235×105)</option><option value="yo6">洋形6号 (190×98)</option></optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">書き方向</label>
                    <select value={writingDirection} onChange={(e) => setWritingDirection(e.target.value as WritingDirection)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800">
                      <option value="vertical">縦書き</option><option value="horizontal">横書き</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showPostalBox} onChange={(e) => setShowPostalBox(e.target.checked)} className="w-4 h-4 rounded"/><span className="text-sm text-gray-700">郵便番号枠</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showSender} onChange={(e) => setShowSender(e.target.checked)} className="w-4 h-4 rounded"/><span className="text-sm text-gray-700">差出人</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={bulkMode} onChange={(e) => setBulkMode(e.target.checked)} className="w-4 h-4 rounded"/><span className="text-sm text-gray-700">CSV一括</span></label>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm"><span className="text-blue-700 font-medium">📮 {envelope.postal === "teikei" ? "定形" : "定形外"}</span><span className="text-gray-600 ml-2">({envelope.width}×{envelope.height}mm)</span></div>
              </div>

              {!bulkMode && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-gray-900"><span>📬</span> 宛先</h2>
                  <div className="space-y-3">
                    <input type="text" value={recipient.postalCode} onChange={(e) => setRecipient({...recipient, postalCode: e.target.value})} placeholder="郵便番号 1000001" maxLength={8} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={recipient.prefecture} onChange={(e) => setRecipient({...recipient, prefecture: e.target.value})} placeholder="都道府県" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                      <input type="text" value={recipient.city} onChange={(e) => setRecipient({...recipient, city: e.target.value})} placeholder="市区町村" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                    </div>
                    <input type="text" value={recipient.address1} onChange={(e) => setRecipient({...recipient, address1: e.target.value})} placeholder="住所" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                    <input type="text" value={recipient.building} onChange={(e) => setRecipient({...recipient, building: e.target.value})} placeholder="建物名" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                    <input type="text" value={recipient.companyName} onChange={(e) => setRecipient({...recipient, companyName: e.target.value})} placeholder="会社名" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                    <input type="text" value={recipient.department} onChange={(e) => setRecipient({...recipient, department: e.target.value})} placeholder="部署" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                    <div className="grid grid-cols-3 gap-3">
                      <input type="text" value={recipient.name} onChange={(e) => setRecipient({...recipient, name: e.target.value})} placeholder="氏名" className="col-span-2 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                      <select value={recipient.honorific} onChange={(e) => setRecipient({...recipient, honorific: e.target.value})} className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                        <option value="様">様</option><option value="御中">御中</option><option value="殿">殿</option><option value="先生">先生</option><option value="">なし</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {bulkMode && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-gray-900"><span>📋</span> CSV一括</h2>
                  <p className="text-xs text-gray-500 mb-2">形式: 郵便番号,都道府県,市区町村,住所1,住所2,建物,会社名,部署,氏名,敬称</p>
                  <textarea value={csvData} onChange={(e) => setCsvData(e.target.value)} placeholder="ヘッダー行&#10;データ行..." className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm h-28 font-mono"/>
                  <button onClick={handleCSVImport} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">読み込む</button>
                  {bulkAddresses.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      <button onClick={() => {const i=Math.max(0,currentBulkIndex-1);setCurrentBulkIndex(i);setRecipient(bulkAddresses[i]);}} disabled={currentBulkIndex===0} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">←</button>
                      <span className="text-sm text-gray-700">{currentBulkIndex+1}/{bulkAddresses.length}</span>
                      <button onClick={() => {const i=Math.min(bulkAddresses.length-1,currentBulkIndex+1);setCurrentBulkIndex(i);setRecipient(bulkAddresses[i]);}} disabled={currentBulkIndex===bulkAddresses.length-1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">→</button>
                    </div>
                  )}
                </div>
              )}

              {showSender && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-gray-900"><span>📤</span> 差出人</h2>
                  <div className="space-y-3">
                    <input type="text" value={sender.postalCode} onChange={(e) => setSender({...sender, postalCode: e.target.value})} placeholder="郵便番号" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                    <input type="text" value={sender.address} onChange={(e) => setSender({...sender, address: e.target.value})} placeholder="住所" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                    <input type="text" value={sender.companyName} onChange={(e) => setSender({...sender, companyName: e.target.value})} placeholder="会社名" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                    <input type="text" value={sender.name} onChange={(e) => setSender({...sender, name: e.target.value})} placeholder="氏名" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"/>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-gray-900"><span>🔖</span> スタンプ（在中）</h2>
                <label className="flex items-center gap-2 cursor-pointer mb-3"><input type="checkbox" checked={stamp.enabled} onChange={(e) => setStamp({...stamp, enabled: e.target.checked})} className="w-4 h-4 rounded"/><span className="text-sm text-gray-700">スタンプ表示</span></label>
                {stamp.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <select value={stamp.text} onChange={(e) => setStamp({...stamp, text: e.target.value})} className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="請求書在中">請求書在中</option><option value="納品書在中">納品書在中</option><option value="見積書在中">見積書在中</option><option value="領収書在中">領収書在中</option><option value="履歴書在中">履歴書在中</option><option value="親展">親展</option><option value="重要">重要</option><option value="至急">至急</option>
                    </select>
                    <select value={stamp.color} onChange={(e) => setStamp({...stamp, color: e.target.value as "red"|"blue"|"black"})} className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="red">赤</option><option value="blue">青</option><option value="black">黒</option>
                    </select>
                  </div>
                )}
              </div>

              {professionalMode && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-lg font-bold mb-4 text-gray-900"><span>⚙️</span> 詳細レイアウト</h2>
                  <div className="space-y-4 text-sm">
                    <div><h3 className="font-medium text-gray-700 mb-2">宛先住所</h3><div className="grid grid-cols-3 gap-2">
                      <div><label className="block text-xs text-gray-500">X</label><input type="number" value={settings.recipientAddressX} onChange={(e) => setSettings({...settings, recipientAddressX: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                      <div><label className="block text-xs text-gray-500">Y</label><input type="number" value={settings.recipientAddressY} onChange={(e) => setSettings({...settings, recipientAddressY: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                      <div><label className="block text-xs text-gray-500">文字</label><input type="number" value={settings.recipientAddressFontSize} onChange={(e) => setSettings({...settings, recipientAddressFontSize: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                    </div></div>
                    <div><h3 className="font-medium text-gray-700 mb-2">宛先氏名</h3><div className="grid grid-cols-3 gap-2">
                      <div><label className="block text-xs text-gray-500">X</label><input type="number" value={settings.recipientNameX} onChange={(e) => setSettings({...settings, recipientNameX: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                      <div><label className="block text-xs text-gray-500">Y</label><input type="number" value={settings.recipientNameY} onChange={(e) => setSettings({...settings, recipientNameY: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                      <div><label className="block text-xs text-gray-500">文字</label><input type="number" value={settings.recipientNameFontSize} onChange={(e) => setSettings({...settings, recipientNameFontSize: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                    </div></div>
                    <div><h3 className="font-medium text-gray-700 mb-2">差出人</h3><div className="grid grid-cols-3 gap-2">
                      <div><label className="block text-xs text-gray-500">X</label><input type="number" value={settings.senderX} onChange={(e) => setSettings({...settings, senderX: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                      <div><label className="block text-xs text-gray-500">Y</label><input type="number" value={settings.senderY} onChange={(e) => setSettings({...settings, senderY: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                      <div><label className="block text-xs text-gray-500">文字</label><input type="number" value={settings.senderFontSize} onChange={(e) => setSettings({...settings, senderFontSize: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                    </div></div>
                    <div><h3 className="font-medium text-gray-700 mb-2">スタンプ</h3><div className="grid grid-cols-3 gap-2">
                      <div><label className="block text-xs text-gray-500">X</label><input type="number" value={settings.stampX} onChange={(e) => setSettings({...settings, stampX: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                      <div><label className="block text-xs text-gray-500">Y</label><input type="number" value={settings.stampY} onChange={(e) => setSettings({...settings, stampY: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                      <div><label className="block text-xs text-gray-500">文字</label><input type="number" value={settings.stampFontSize} onChange={(e) => setSettings({...settings, stampFontSize: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></div>
                    </div></div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={saveSettings} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">💾 設定を保存</button>
                      <button onClick={resetSettings} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">リセット</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex justify-center"><Mascot state={mascotState} message={mascotMessage}/></div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-gray-900"><span>👁️</span> プレビュー</h2>
                <div className="flex justify-center bg-gray-100 rounded-lg p-4"><canvas ref={canvasRef} className="border border-gray-300 shadow-lg" style={{background:"white"}}/></div>
                <p className="text-center text-sm text-gray-500 mt-2">{envelope.name} ({envelope.width}×{envelope.height}mm)</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={generatePDF} className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"><span>📄</span>PDF / 印刷</button>
                <button onClick={handlePrint} className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md"><span>🖨️</span>直接印刷</button>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-bold text-amber-800 mb-2">💡 ヒント</h3>
                <ul className="text-sm text-amber-900 space-y-1">
                  <li>• 「詳細設定」で位置・文字サイズを調整できます</li>
                  <li>• 設定はブラウザのキャッシュに保存されます（クリアで削除）</li>
                  <li>• 「直接印刷」は1ページのみ印刷されます</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">よくある質問</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div><h3 className="font-bold text-blue-600 mb-2">Q: 設定は保存できますか？</h3><p className="text-gray-600 text-sm">「詳細設定」で「設定を保存」をクリックするとブラウザのキャッシュに保存されます。キャッシュクリアで削除されます。</p></div>
              <div><h3 className="font-bold text-blue-600 mb-2">Q: 印刷で2ページになる</h3><p className="text-gray-600 text-sm">「直接印刷」ボタンで1ページのみ印刷されます。プリンター設定で余白を「なし」にしてください。</p></div>
              <div><h3 className="font-bold text-blue-600 mb-2">Q: 文字がはみ出す</h3><p className="text-gray-600 text-sm">「詳細設定」で位置や文字サイズを調整してください。</p></div>
              <div><h3 className="font-bold text-blue-600 mb-2">Q: どの封筒サイズ？</h3><p className="text-gray-600 text-sm">A4を3つ折り→長形3号、A4そのまま→角形2号が一般的です。</p></div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12 py-6"><div className="container mx-auto px-4 text-center text-gray-500 text-sm">© 2024 Yamada Tools</div></footer>
    </div>
  );
}
