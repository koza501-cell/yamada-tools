import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const title = searchParams.get("title") || "山田ツール";
  const type = searchParams.get("type") || "tool"; // "tool" or "blog"
  const category = searchParams.get("category") || "";
  
  const isBlog = type === "blog";
  
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: isBlog 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            display: "flex",
          }}
        />
        
        {/* Main Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "48px 64px",
            margin: "40px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            maxWidth: "1100px",
          }}
        >
          {/* Type Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                backgroundColor: isBlog ? "#667eea" : "#f472b6",
                color: "white",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {isBlog ? "📝 ブログ" : "🛠️ 無料ツール"}
            </span>
            {category && (
              <span
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "18px",
                }}
              >
                {category}
              </span>
            )}
          </div>
          
          {/* Title */}
          <h1
            style={{
              fontSize: title.length > 30 ? "42px" : "52px",
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "center",
              lineHeight: 1.3,
              margin: "0 0 24px 0",
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
          
          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "18px" }}>
              <span>🇯🇵</span>
              <span>日本国内サーバー</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "18px" }}>
              <span>🔒</span>
              <span>安全・無料</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontSize: "18px" }}>
              <span>⚡</span>
              <span>登録不要</span>
            </div>
          </div>
        </div>
        
        {/* Logo */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "28px", color: "white", fontWeight: "bold" }}>
            🌸 山田ツール
          </span>
          <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)" }}>
            yamada-tools.jp
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
