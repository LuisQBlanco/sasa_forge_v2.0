"use client";
import { useState } from "react";
import { API } from "@/lib/api";
export default function AdminProducts() {
  const [name, setName] = useState("");
  async function create() {
    const t = localStorage.getItem("admin_token");
    await fetch(`${API}/admin/products`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` }, body: JSON.stringify({ name, slug: name.toLowerCase().replace(/\s+/g, "-") }) });
    alert("Created");
  }
  return <div><h1 className="text-2xl font-bold mb-3">Admin Products</h1><input className="border p-2" value={name} onChange={(e) => setName(e.target.value)} /><button className="ml-2 border px-3 py-2" onClick={create}>Create</button></div>;
}
