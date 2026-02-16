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
  priced_total: number | null;
};

const statuses = ["New", "In Review", "Priced", "Accepted", "Closed"];

export default function AdminQuotes() {
  const [rows, setRows] = useState<Row[]>([]);
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [statusInputs, setStatusInputs] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  async function load() {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      setNeedsLogin(true);
      return;
    }
    const res = await fetch(`${API}/admin/quotes`, { headers: { Authorization: `Bearer ${t}` } });
    if (res.status === 401 || res.status === 403) {
      setNeedsLogin(true);
      return;
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      setNeedsLogin(false);
      setRows(data);
      const p: Record<number, string> = {};
      const s: Record<number, string> = {};
      data.forEach((r: Row) => {
        p[r.id] = r.priced_total ? String(r.priced_total) : "";
        s[r.id] = r.status;
      });
      setPriceInputs(p);
      setStatusInputs(s);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: number) {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      setNeedsLogin(true);
      return;
    }
    const res = await fetch(`${API}/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify({ status: statusInputs[id] }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.detail || "Failed status update");
      return;
    }
    setMessage(`Quote #${id} status updated`);
    await load();
  }

  async function setPrice(id: number) {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      setNeedsLogin(true);
      return;
    }
    const res = await fetch(`${API}/admin/quotes/${id}/price`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      body: JSON.stringify({ priced_total: Number(priceInputs[id]) }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.detail || "Failed pricing");
      return;
    }
    setMessage(`Quote #${id} priced. Deposit link generated.`);
    if (data.deposit_checkout_url) {
      window.open(data.deposit_checkout_url, "_blank");
    }
    await load();
  }

  async function createFinalLink(id: number) {
    const t = localStorage.getItem("admin_token");
    if (!t) {
      setNeedsLogin(true);
      return;
    }
    const res = await fetch(`${API}/admin/quotes/${id}/final-payment-link`, {
      method: "POST",
      headers: { Authorization: `Bearer ${t}` },
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.detail || "Failed final payment link");
      return;
    }
    setMessage(`Final payment link generated for quote #${id}`);
    if (data.final_checkout_url) {
      window.open(data.final_checkout_url, "_blank");
    }
  }

  return (
    <AdminShell title={siteContent.admin.sidebar[2]} subtitle="Set pricing, update status, and generate payment links.">
      {needsLogin && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Admin session required. Please sign in first.
          <div className="mt-3">
            <Button href="/admin/login" variant="secondary" className="px-4 py-2 text-xs">
              Go To Admin Login
            </Button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-slate-900">
                #{row.id} · {row.public_code}
              </p>
              <p className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">Current total: {row.priced_total ?? "-"}</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-[220px_180px_1fr]">
              <select
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                value={statusInputs[row.id] || row.status}
                onChange={(e) => setStatusInputs((prev) => ({ ...prev, [row.id]: e.target.value }))}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <Button onClick={() => updateStatus(row.id)} className="px-4 py-2 text-xs">
                Save Status
              </Button>
              <div className="flex flex-wrap gap-2">
                <input
                  className="min-w-[160px] rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Total price CAD"
                  value={priceInputs[row.id] || ""}
                  onChange={(e) => setPriceInputs((prev) => ({ ...prev, [row.id]: e.target.value }))}
                />
                <Button onClick={() => setPrice(row.id)} className="px-4 py-2 text-xs">
                  Set Price + Deposit Link
                </Button>
                <Button onClick={() => createFinalLink(row.id)} variant="secondary" className="px-4 py-2 text-xs">
                  Final Payment Link
                </Button>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">{siteContent.admin.emptyStates.quotes}</p>}
        {message && <p className="text-sm font-medium text-blue-700">{message}</p>}
      </div>
    </AdminShell>
  );
}
