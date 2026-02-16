"use client";

import { useEffect, useState } from "react";

import AdminShell from "@/components/AdminShell";
import Button from "@/components/Button";
import { siteContent } from "@/content/siteContent";
import { API } from "@/lib/api";

type Row = {
  id: number;
  public_code: string;
  status: string;
  tracking_number: string | null;
  total_amount: number;
};

const statuses = ["Paid", "In Production", "Ready", "Shipped", "Delivered"];

export default function AdminOrders() {
  const [rows, setRows] = useState<Row[]>([]);
  const [drafts, setDrafts] = useState<Record<number, { status: string; tracking: string }>>({});
  const [message, setMessage] = useState("");

  async function load() {
    const t = localStorage.getItem("admin_token");
    const res = await fetch(`${API}/admin/orders`, { headers: { Authorization: `Bearer ${t}` } });
    const data = await res.json();
    if (Array.isArray(data)) {
      setRows(data);
      const next: Record<number, { status: string; tracking: string }> = {};
      data.forEach((r: Row) => {
        next[r.id] = { status: r.status, tracking: r.tracking_number || "" };
      });
      setDrafts(next);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save(id: number) {
    const t = localStorage.getItem("admin_token");
    const draft = drafts[id];
    const res = await fetch(`${API}/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify({ status: draft.status, tracking_number: draft.tracking }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.detail || "Failed to update order");
      return;
    }
    setMessage(`Order #${id} updated`);
    await load();
  }

  return (
    <AdminShell title={siteContent.admin.sidebar[3]} subtitle="Update status and tracking numbers.">
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold text-slate-900">
                #{row.id} · {row.public_code}
              </p>
              <p className="text-sm font-semibold text-blue-700">CAD {row.total_amount}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-[220px_1fr_160px]">
              <select
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={drafts[row.id]?.status || row.status}
                onChange={(e) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [row.id]: { ...(prev[row.id] || { tracking: "", status: row.status }), status: e.target.value },
                  }))
                }
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Tracking number"
                value={drafts[row.id]?.tracking || ""}
                onChange={(e) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [row.id]: { ...(prev[row.id] || { status: row.status, tracking: "" }), tracking: e.target.value },
                  }))
                }
              />
              <Button onClick={() => save(row.id)} className="px-4 py-2 text-xs">
                Save
              </Button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">{siteContent.admin.emptyStates.orders}</p>}
        {message && <p className="text-sm font-medium text-blue-700">{message}</p>}
      </div>
    </AdminShell>
  );
}
