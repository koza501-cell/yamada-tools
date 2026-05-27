const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://api.yamada-tools.jp";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("admin_token");
  if (!token) throw new Error("NOT_AUTHENTICATED");
  return { Authorization: `Bearer ${token}` };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) throw new Error("NOT_AUTHENTICATED");
  if (!res.ok) {
    let body = "";
    try { body = await res.text(); } catch { /* ignore */ }
    throw new Error(body || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface PendingItem {
  id: number;
  tool_slug: string;
  sentiment: number;
  comment: string;
  use_case_tags: string | null;
  user_role: string | null;
  user_age_band: string | null;
  lang: string;
  created_at: string;
}

export interface PendingList {
  items: PendingItem[];
  total: number;
}

export interface FeedbackStats {
  pending_count: number;
  approved_count: number;
  rejected_count: number;
  private_count: number;
  total_votes: number;
  tools_with_feedback: number;
  last_24h_count: number;
}

export async function listPending({
  limit = 50,
  offset = 0,
  toolSlug = "",
  order = "oldest",
}: {
  limit?: number;
  offset?: number;
  toolSlug?: string;
  order?: "oldest" | "newest";
}): Promise<PendingList> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    order,
  });
  if (toolSlug) params.set("tool_slug", toolSlug);
  const res = await fetch(`${API_BASE}/feedback/admin/pending?${params}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<PendingList>(res);
}

export async function approveFeedback(id: number): Promise<unknown> {
  const res = await fetch(`${API_BASE}/feedback/admin/${id}/approve`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse<unknown>(res);
}

export async function rejectFeedback(id: number, reason: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/feedback/admin/${id}/reject`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  return handleResponse<unknown>(res);
}

export async function getStats(): Promise<FeedbackStats> {
  const res = await fetch(`${API_BASE}/feedback/admin/stats`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<FeedbackStats>(res);
}
