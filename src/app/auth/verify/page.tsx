"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verify } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) { setStatus("error"); setMessage("トークンがありません"); return; }
    verifyToken(token);
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    const result = await verify(token);
    if (result.success) {
      setStatus("success");
      setTimeout(() => router.push("/"), 2000);
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="text-5xl mb-4 animate-spin">⏳</div>
            <h1 className="text-xl font-bold text-kon">認証中...</h1>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-600 mb-4">ログイン成功！</h1>
            <p className="text-gray-600">ホームページに移動します...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">認証エラー</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link href="/auth/login" className="text-sakura hover:underline">もう一度ログインする</Link>
          </>
        )}
      </div>
    </div>
  );
}
