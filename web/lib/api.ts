const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const INTERNAL_API_URL = process.env.INTERNAL_API_URL || PUBLIC_API;
const API = typeof window === "undefined" ? INTERNAL_API_URL : PUBLIC_API;

export async function apiGet(path: string) {
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function apiPost(path: string, body: unknown, token?: string) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return res.json();
}

export { API };
