"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  email: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<{ success: boolean; message: string }>;
  verify: (token: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const API_URL = "https://api.yamada-tools.jp/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("session_token");
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch(API_URL + "/me", { headers: { Authorization: "Bearer " + token } });
      if (res.ok) { setUser(await res.json()); }
      else { localStorage.removeItem("session_token"); }
    } catch (err) { console.error("Auth check failed:", err); }
    setLoading(false);
  };

  const login = async (email: string) => {
    try {
      const res = await fetch(API_URL + "/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email })
      });
      const data = await res.json();
      return res.ok ? { success: true, message: data.message } : { success: false, message: data.detail || "Error" };
    } catch { return { success: false, message: "Network error" }; }
  };

  const verify = async (token: string) => {
    try {
      const res = await fetch(API_URL + "/verify", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (res.ok) { localStorage.setItem("session_token", data.session_token); setUser(data.user); return { success: true, message: "OK" }; }
      return { success: false, message: data.detail || "Invalid" };
    } catch { return { success: false, message: "Network error" }; }
  };

  const logout = async () => {
    const token = localStorage.getItem("session_token");
    if (token) { await fetch(API_URL + "/logout", { method: "POST", headers: { Authorization: "Bearer " + token } }); }
    localStorage.removeItem("session_token"); setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, verify, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
