import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import * as fs from "fs";
import * as path from "path";

export const runtime = "nodejs";

let fontData: Buffer | null = null;
function getFont(): Buffer {
  if (!fontData) {
    fontData = fs.readFileSync(path.join(process.cwd(), "public/fonts/NotoSansJP-Bold.otf"));
  }
  return fontData;
}

const CAT_COLOR: Record<string, string> = {
  "PDF編集": "#E53E3E", "PDF活用": "#E53E3E", "PDF活用術": "#E53E3E",
  "PDF・ファイル変換": "#E53E3E", "PDFツール": "#E53E3E",
  "ビジネス": "#2B6CB0", "ビジネス文書": "#2B6CB0", "ビジネス活用": "#2B6CB0",
  "ビジネス・法人": "#2B6CB0", "ビジネス・起業": "#2B6CB0",
  "Japan Business": "#2B6CB0", "経理・会計": "#2B6CB0", "経理・税務": "#2B6CB0",
  "業務効率化": "#2B6CB0", "書類作成": "#2B6CB0",
  "税金・確定申告": "#276749", "確定申告": "#276749", "税金・節税": "#276749",
  "税金・社会保険": "#276749", "税金・給与": "#276749",
  "税金・計算ツール活用術": "#276749", "税金・贈与": "#276749",
  "節税・ふるさと納税": "#276749", "節税・年金": "#276749",
  "副業・税金": "#276749", "資産運用": "#276749", "資産運用・節税": "#276749",
  "資産運用・老後": "#276749", "老後・資産形成": "#276749",
  "不動産": "#B7791F", "不動産・住まい": "#B7791F", "不動産・引越し": "#B7791F",
  "不動産・税金": "#B7791F", "不動産情報ツール活用術": "#B7791F",
  "住宅・不動産": "#B7791F", "生活・住まい": "#B7791F",
  "給与・労働": "#553C9A", "給与・社会保険": "#553C9A", "転職・キャリア": "#553C9A",
  "キャリア・資格": "#553C9A", "人事・外国人雇用": "#553C9A",
  "年金・社会保障": "#553C9A", "保険・ライフプラン": "#553C9A", "保険・医療": "#553C9A",
  "介護・保育": "#B83280", "教育・子育て": "#B83280",
  "相続・登記": "#744210", "相続・贈与": "#744210",
  "画像編集": "#0987A0", "画像ツール活用術": "#0987A0", "変換ツール": "#0987A0",
  "変換ツール活用術": "#0987A0", "計算ツール": "#0987A0", "ジェネレーター": "#0987A0",
  "Conversion tools": "#0987A0", "Generator tools": "#0987A0",
  "Image tools": "#0987A0", "Security tools": "#0987A0",
  "ガイド": "#1A365D", "体験談": "#1A365D", "クリニック経営": "#1A365D",
  "農業・畜産": "#276749", "飲食・経営": "#B7791F", "借金・ローン": "#E53E3E",
  "抽選・くじ引き": "#553C9A",
  "ai-tools": "#6B46C1", "excel": "#276749", "writing": "#2B6CB0",
  "image": "#0987A0", "business": "#2B6CB0", "business-doc": "#2B6CB0",
  "marketing": "#0987A0", "google": "#C53030", "career": "#553C9A",
  "english": "#B83280", "prompt": "#6B46C1", "security": "#C53030",
  "side-job": "#276749", "life": "#B7791F",
};

const CAT_LABEL: Record<string, string> = {
  "ai-tools": "AIツール", "excel": "Excel活用",
  "writing": "文章作成", "image": "画像生成",
  "business": "ビジネス", "business-doc": "ビジネス文書",
  "marketing": "マーケティング",
  "google": "Google活用", "career": "キャリア",
  "english": "英語", "prompt": "プロンプト",
  "security": "セキュリティ",
  "side-job": "副業", "life": "生活",
};

function getAccent(cat: string): string { return CAT_COLOR[cat] ?? "#1A365D"; }
function getCatLabel(cat: string): string { return CAT_LABEL[cat] ?? cat; }
function trunc(t: string, n: number): string { return t.length > n ? t.slice(0, n) + "…" : t; }

function BlogImage(title: string, category: string, font: Buffer) {
  const accent = getAccent(category);
  const catLabel = getCatLabel(category) || category;
  const line1 = trunc(title, 24);
  const line2 = title.length > 24 ? trunc(title.slice(24), 24) : "";
  const fontSize = title.length > 28 ? 46 : 52;

  return new ImageResponse(
    (
      <div style={{ width:"1200px", height:"630px", display:"flex", flexDirection:"row", backgroundColor:"#FFFFFF", fontFamily:"Noto Sans JP" }}>
        <div style={{ width:"12px", height:"630px", backgroundColor:accent, flexShrink:0, display:"flex" }} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"56px 64px 44px 56px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"36px" }}>
            <div style={{ backgroundColor:accent, color:"#FFFFFF", fontSize:"22px", fontWeight:700, padding:"6px 20px", borderRadius:"6px", display:"flex" }}>
              {"ブログ"}
            </div>
            {catLabel ? (
              <div style={{ backgroundColor:"#F7FAFC", color:accent, fontSize:"20px", fontWeight:700, padding:"6px 20px", borderRadius:"6px", border:`2px solid ${accent}`, display:"flex" }}>
                {catLabel}
              </div>
            ) : null}
          </div>
          <div style={{ display:"flex", flexDirection:"column", flex:1, justifyContent:"center" }}>
            <div style={{ fontSize:`${fontSize}px`, fontWeight:700, color:"#1A202C", lineHeight:1.4, display:"flex", flexDirection:"column" }}>
              <span style={{ display:"flex" }}>{line1}</span>
              {line2 ? <span style={{ display:"flex" }}>{line2}</span> : null}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid #E2E8F0", paddingTop:"22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
              <div style={{ width:"42px", height:"42px", backgroundColor:accent, borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", color:"#FFFFFF", fontWeight:700 }}>
                {"山"}
              </div>
              <div style={{ display:"flex", flexDirection:"column" }}>
                <span style={{ fontSize:"20px", fontWeight:700, color:"#1A202C", display:"flex" }}>{"山田ツール"}</span>
                <span style={{ fontSize:"15px", color:"#718096", display:"flex" }}>yamada-tools.jp</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:"12px" }}>
              <div style={{ backgroundColor:"#F7FAFC", color:"#4A5568", fontSize:"15px", padding:"5px 14px", borderRadius:"20px", border:"1px solid #E2E8F0", display:"flex" }}>{"日本国内サーバー"}</div>
              <div style={{ backgroundColor:"#F7FAFC", color:"#4A5568", fontSize:"15px", padding:"5px 14px", borderRadius:"20px", border:"1px solid #E2E8F0", display:"flex" }}>{"登録不要"}</div>
              <div style={{ backgroundColor:"#F7FAFC", color:"#4A5568", fontSize:"15px", padding:"5px 14px", borderRadius:"20px", border:"1px solid #E2E8F0", display:"flex" }}>{"完全無料"}</div>
            </div>
          </div>
        </div>
        <div style={{ width:"200px", height:"630px", backgroundColor:accent, opacity:0.07, flexShrink:0, display:"flex" }} />
      </div>
    ),
    { width:1200, height:630, fonts:[{ name:"Noto Sans JP", data:font, style:"normal", weight:700 }] }
  );
}

function AiRecipeImage(title: string, category: string, font: Buffer) {
  const accent = getAccent(category);
  const catLabel = getCatLabel(category) || category;
  const line1 = trunc(title, 22);
  const line2 = title.length > 22 ? trunc(title.slice(22), 22) : "";
  const fontSize = title.length > 26 ? 44 : 50;

  return new ImageResponse(
    (
      <div style={{ width:"1200px", height:"630px", display:"flex", flexDirection:"column", backgroundColor:"#0F172A", fontFamily:"Noto Sans JP", position:"relative" }}>
        <div style={{ width:"1200px", height:"6px", backgroundColor:accent, flexShrink:0, display:"flex" }} />
        <div style={{ position:"absolute", left:"-80px", top:"100px", width:"400px", height:"400px", backgroundColor:accent, opacity:0.08, borderRadius:"50%", display:"flex" }} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"44px 72px 40px 72px", position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"36px" }}>
            <div style={{ backgroundColor:accent, color:"#FFFFFF", fontSize:"20px", fontWeight:700, padding:"6px 20px", borderRadius:"6px", display:"flex" }}>
              {"リAIレシピ"}
            </div>
            {catLabel ? (
              <div style={{ backgroundColor:"rgba(255,255,255,0.07)", color:accent, fontSize:"18px", fontWeight:700, padding:"6px 20px", borderRadius:"6px", border:`1.5px solid ${accent}`, display:"flex" }}>
                {catLabel}
              </div>
            ) : null}
            <div style={{ marginLeft:"auto", backgroundColor:"rgba(255,255,255,0.05)", color:"#94A3B8", fontSize:"15px", padding:"6px 16px", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.1)", display:"flex" }}>
              {"コピペ OK • プロンプト付き"}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", flex:1, justifyContent:"center" }}>
            <div style={{ fontSize:`${fontSize}px`, fontWeight:700, color:"#F1F5F9", lineHeight:1.4, display:"flex", flexDirection:"column" }}>
              <span style={{ display:"flex" }}>{line1}</span>
              {line2 ? <span style={{ display:"flex" }}>{line2}</span> : null}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
              <div style={{ width:"42px", height:"42px", backgroundColor:accent, borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", color:"#FFFFFF", fontWeight:700 }}>
                {"山"}
              </div>
              <div style={{ display:"flex", flexDirection:"column" }}>
                <span style={{ fontSize:"20px", fontWeight:700, color:"#F1F5F9", display:"flex" }}>{"山田ツール"}</span>
                <span style={{ fontSize:"15px", color:"#64748B", display:"flex" }}>yamada-tools.jp</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:"10px" }}>
              <div style={{ backgroundColor:"rgba(255,255,255,0.05)", color:"#94A3B8", fontSize:"14px", padding:"5px 14px", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.1)", display:"flex" }}>ChatGPT</div>
              <div style={{ backgroundColor:"rgba(255,255,255,0.05)", color:"#94A3B8", fontSize:"14px", padding:"5px 14px", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.1)", display:"flex" }}>Claude</div>
              <div style={{ backgroundColor:"rgba(255,255,255,0.05)", color:"#94A3B8", fontSize:"14px", padding:"5px 14px", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.1)", display:"flex" }}>Gemini</div>
            </div>
          </div>
        </div>
        <div style={{ position:"absolute", right:0, top:0, width:"8px", height:"630px", backgroundColor:accent, display:"flex" }} />
      </div>
    ),
    { width:1200, height:630, fonts:[{ name:"Noto Sans JP", data:font, style:"normal", weight:700 }] }
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title    = searchParams.get("title") ?? "山田ツール";
  const type     = searchParams.get("type") ?? "blog";
  const category = searchParams.get("category") ?? "";
  const font     = getFont();
  if (type === "ai-recipe") return AiRecipeImage(title, category, font);
  return BlogImage(title, category, font);
}
