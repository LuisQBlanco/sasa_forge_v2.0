"use client";
import { useEffect, useState } from "react";
import { API } from "@/lib/api";
export default function AdminQuotes() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    fetch(`${API}/admin/quotes`, { headers: { Authorization: `Bearer ${t}` } }).then((r) => r.json()).then(setRows);
  }, []);
  return <div><h1 className="text-2xl font-bold mb-3">Admin Quotes</h1><pre>{JSON.stringify(rows, null, 2)}</pre></div>;
}
