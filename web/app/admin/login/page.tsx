"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AdminShell from "@/components/AdminShell";
import Button from "@/components/Button";
import { siteContent } from "@/content/siteContent";
import { API } from "@/lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const router = useRouter();

  async function login() {
    setError("");
    const r = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!data.access_token) {
      setError("Login failed. Check credentials.");
      return;
    }
    localStorage.setItem("admin_token", data.access_token);
    router.push("/admin");
  }

  return (
    <AdminShell title={siteContent.admin.login.title}>
      <div className="max-w-md space-y-4">
        <input
          className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm focus:border-blue-400 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm focus:border-blue-400 focus:outline-none"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <Button onClick={login}>{siteContent.admin.login.button}</Button>
        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
      </div>
    </AdminShell>
  );
}
