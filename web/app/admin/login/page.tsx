"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";
export default function AdminLogin() {
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("admin123");
  const router = useRouter();
  async function login() {
    const r = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await r.json();
    localStorage.setItem("admin_token", data.access_token);
    router.push("/admin");
  }
  return <div><h1 className="text-2xl font-bold">Admin Login</h1><input className="border p-2 block mt-3" value={email} onChange={(e) => setEmail(e.target.value)} /><input className="border p-2 block mt-2" value={password} type="password" onChange={(e) => setPassword(e.target.value)} /><button className="mt-3 bg-black text-white px-4 py-2 rounded" onClick={login}>Login</button></div>;
}
