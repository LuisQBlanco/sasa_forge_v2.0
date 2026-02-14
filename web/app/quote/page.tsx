"use client";
import { useState } from "react";
import { API } from "@/lib/api";
export default function QuotePage() {
  const [id, setId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  async function createQuote() {
    const res = await fetch(`${API}/quotes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_name: "Guest", customer_email: "guest@example.com", material: "PLA", notes: "Need strong infill" }) });
    const data = await res.json(); setId(data.id); setCode(data.public_code);
  }
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!id || !e.target.files?.[0]) return;
    const fd = new FormData(); fd.append("file", e.target.files[0]);
    await fetch(`${API}/quotes/${id}/files`, { method: "POST", body: fd });
    alert("Uploaded");
  }
  return <div><h1 className="text-2xl font-bold">Custom Quote</h1><p>SLA: 48 hours. Accepted files: STL, 3MF, STEP, PNG, JPG (max 100MB).</p><button className="bg-black text-white px-4 py-2 rounded mt-4" onClick={createQuote}>Create Quote</button>{id && <div className="mt-4">Quote code: {code}<input type="file" onChange={upload} className="block mt-2" /></div>}</div>;
}
