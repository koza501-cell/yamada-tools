"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  email: string;
  plan: string;
  display_name?: string;
  company_name?: string;
  email_verified?: boolean;
  trial_started_at?: string;
  trial_ends_at?: string;
  trial_active?: boolean;
  trial_days_remaining?: number;
  effective_plan?: string;
  day_pass_expires_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, companyName?: string) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  magicLink: (email: string) => Promise<{ success: boolean; message: string }>;
  startTrial: (email: string, companyName?: string) => Promise<{ success: boolean; message: string; trialEndsAt?: string }>;
  verify: (token: string) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { display_name?: string; company_name?: string }) => Promise<void>;
  isPro: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp") + "/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("session_token");
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch(API_URL + "/me", { headers: { Authorization: "Bearer " + token } });
      if (res.ok) { setUser(await res.json()); } else { localStorage.removeItem("session_token"); }
    } catch (err) { console.error("Auth check failed:", err); }
    setLoading(false);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("session_token");
    if (!token) return;
    try {
      const res = await fetch(API_URL + "/me", { headers: { Authorization: "Bearer " + token } });
      if (res.ok) { setUser(await res.json()); }
    } catch (err) { console.error("Refresh user failed:", err); }
  };

  const register = async (email: string, password: string, companyName?: string) => {
    try {
      const res = await fetch(API_URL + "/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, company_name: companyName || "" }) });
      const data = await res.json();
      return res.ok ? { success: true, message: data.message } : { success: false, message: data.detail || "登録に失敗しました" };
    } catch { return { success: false, message: "ネットワークエラー" }; }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(API_URL + "/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (res.ok) { localStorage.setItem("session_token", data.session_token); setUser(data.user); return { success: true, message: "ログイン成功" }; }
      return { success: false, message: data.detail || "ログインに失敗しました" };
    } catch { return { success: false, message: "ネットワークエラー" }; }
  };

  const magicLink = async (email: string) => {
    try {
      const res = await fetch(API_URL + "/magic-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      return res.ok ? { success: true, message: data.message } : { success: false, message: data.detail || "エラー" };
    } catch { return { success: false, message: "ネットワークエラー" }; }
  };

  const startTrial = async (email: string, companyName?: string) => {
    try {
      const res = await fetch(API_URL + "/start-trial", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, company_name: companyName || "" }) });
      const data = await res.json();
      if (res.ok) { return { success: true, message: data.message, trialEndsAt: data.trial_ends_at }; }
      return { success: false, message: data.detail || "トライアル開始に失敗しました" };
    } catch { return { success: false, message: "ネットワークエラー" }; }
  };

  const verify = async (token: string) => {
    try {
      const res = await fetch(API_URL + "/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await res.json();
      if (res.ok) { localStorage.setItem("session_token", data.session_token); setUser(data.user); return { success: true, message: "OK" }; }
      return { success: false, message: data.detail || "認証に失敗しました" };
    } catch { return { success: false, message: "ネットワークエラー" }; }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch(API_URL + "/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      return { success: true, message: data.message };
    } catch { return { success: false, message: "ネットワークエラー" }; }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const res = await fetch(API_URL + "/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      const data = await res.json();
      return res.ok ? { success: true, message: data.message } : { success: false, message: data.detail || "エラー" };
    } catch { return { success: false, message: "ネットワークエラー" }; }
  };

  const logout = async () => {
    const token = localStorage.getItem("session_token");
    if (token) { await fetch(API_URL + "/logout", { method: "POST", headers: { Authorization: "Bearer " + token } }); }
    localStorage.removeItem("session_token");
    setUser(null);
  };

  const updateProfile = async (data: { display_name?: string; company_name?: string }) => {
    const token = localStorage.getItem("session_token");
    const res = await fetch(API_URL + "/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("更新に失敗しました");
    const updated = await res.json();
    setUser(updated);
  };

  const isPro = user?.effective_plan === "pro" || user?.effective_plan === "pro_trial" || user?.effective_plan === "team";

  return (
    <AuthContext.Provider value={{ user, loading, register, login, magicLink, startTrial, verify, forgotPassword, resetPassword, logout, refreshUser, updateProfile, isPro }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
