"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  listPending,
  approveFeedback,
  rejectFeedback,
  getStats,
  type PendingItem,
  type FeedbackStats,
} from "@/lib/feedback-admin-api";

const PAGE_SIZE = 50;

export default function FeedbackModerationPage() {
  const router = useRouter();
  const [items, setItems] = useState<PendingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [slugFilter, setSlugFilter] = useState("");
  const [debouncedSlug, setDebouncedSlug] = useState("");
  const [order, setOrder] = useState<"oldest" | "newest">("oldest");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: number } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);
  const didMount = useRef(false);

  const redirectToLogin = useCallback(() => {
    router.replace("/admin/login?returnTo=/admin/feedback");
  }, [router]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSlug(slugFilter), 300);
    return () => clearTimeout(t);
  }, [slugFilter]);

  const loadData = useCallback(
    async (currentOffset: number) => {
      setLoading(true);
      try {
        const [list, statsData] = await Promise.all([
          listPending({
            limit: PAGE_SIZE,
            offset: currentOffset,
            toolSlug: debouncedSlug,
            order,
          }),
          getStats(),
        ]);
        setItems(list.items);
        setTotal(list.total);
        setStats(statsData);
        setOffset(currentOffset);
      } catch (e) {
        if (e instanceof Error && e.message === "NOT_AUTHENTICATED") {
          redirectToLogin();
        }
      } finally {
        setLoading(false);
      }
    },
    [debouncedSlug, order, redirectToLogin]
  );

  // Auth check on mount + initial load
  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      redirectToLogin();
      return;
    }
    loadData(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload on filter/sort change (skip initial mount)
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    loadData(0);
  }, [debouncedSlug, order, loadData]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (id: number) => {
    try {
      await approveFeedback(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setTotal((t) => t - 1);
      setStats((s) =>
        s
          ? { ...s, pending_count: s.pending_count - 1, approved_count: s.approved_count + 1 }
          : s
      );
      showToast("✅ 承認しました");
    } catch (e) {
      if (e instanceof Error && e.message === "NOT_AUTHENTICATED") redirectToLogin();
      else showToast("❌ エラーが発生しました");
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectModal || !rejectReason.trim()) return;
    setRejectLoading(true);
    try {
      await rejectFeedback(rejectModal.id, rejectReason.slice(0, 100));
      setItems((prev) => prev.filter((i) => i.id !== rejectModal.id));
      setTotal((t) => t - 1);
      setStats((s) =>
        s
          ? { ...s, pending_count: s.pending_count - 1, rejected_count: s.rejected_count + 1 }
          : s
      );
      setRejectModal(null);
      setRejectReason("");
      showToast("✅ 却下しました");
    } catch (e) {
      if (e instanceof Error && e.message === "NOT_AUTHENTICATED") redirectToLogin();
      else showToast("❌ エラーが発生しました");
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-6 py-3 text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-kon">💬 フィードバック モデレーション</h1>
        {stats && (
          <p className="text-sm text-gray-500 mt-1">
            未承認: <strong className="text-kon">{stats.pending_count}</strong>
            {" / "}承認済み: <strong>{stats.approved_count}</strong>
            {" / "}却下: <strong>{stats.rejected_count}</strong>
            {" / "}プライベート: <strong>{stats.private_count}</strong>
            {" / "}過去24時間: <strong>{stats.last_24h_count}</strong>
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="ツールスラッグでフィルタ (例: pdf/compress)"
          value={slugFilter}
          onChange={(e) => setSlugFilter(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kon"
        />
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as "oldest" | "newest")}
          className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kon"
        >
          <option value="oldest">古い順</option>
          <option value="newest">新しい順</option>
        </select>
        <button type="button"
          onClick={() => loadData(offset)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
        >
          🔄 更新
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">読み込み中...</div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-gray-500 text-lg">モデレーション待ちのコメントはありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-gray-500 font-medium whitespace-nowrap">ツール</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">評価</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">コメント</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">タグ</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium whitespace-nowrap">属性</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">言語</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium whitespace-nowrap">投稿日時</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium whitespace-nowrap">アクション</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const attribution = [item.user_role, item.user_age_band]
                    .filter(Boolean)
                    .join(" / ");
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <a
                          href={`https://yamada-tools.jp/${item.tool_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-kon hover:underline text-xs"
                        >
                          {item.tool_slug}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xl">
                        {item.sentiment === 1 ? "😊" : "😐"}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-gray-700">{item.comment}</p>
                      </td>
                      <td className="px-4 py-3 max-w-[120px]">
                        <span className="text-xs text-gray-500 truncate block">
                          {item.use_case_tags ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-500">{attribution || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                          {item.lang}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {item.created_at.split("T")[0]}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 whitespace-nowrap">
                          <button type="button"
                            onClick={() => handleApprove(item.id)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            承認
                          </button>
                          <button type="button"
                            onClick={() => {
                              setRejectModal({ id: item.id });
                              setRejectReason("");
                            }}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            却下
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <span>
            {offset + 1}〜{Math.min(offset + PAGE_SIZE, total)} / {total}件
          </span>
          <div className="flex gap-2">
            {offset > 0 && (
              <button type="button"
                onClick={() => loadData(offset - PAGE_SIZE)}
                className="px-4 py-2 bg-white rounded-xl shadow-sm hover:bg-gray-50"
              >
                前のページ
              </button>
            )}
            {offset + PAGE_SIZE < total && (
              <button type="button"
                onClick={() => loadData(offset + PAGE_SIZE)}
                className="px-4 py-2 bg-white rounded-xl shadow-sm hover:bg-gray-50"
              >
                次のページ
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-kon mb-4">却下する理由</h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value.slice(0, 100))}
              placeholder="却下理由を入力してください（最大100文字）"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-kon"
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {rejectReason.length}/100
            </p>
            <div className="flex gap-3 mt-4">
              <button type="button"
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button type="button"
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim() || rejectLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {rejectLoading ? "処理中..." : "却下"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
