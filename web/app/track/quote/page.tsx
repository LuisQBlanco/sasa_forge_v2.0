"use client";
import { useState } from "react";
import { API } from "@/lib/api";
export default function TrackQuote() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<any>(null);
  return <div><h1 className="text-2xl font-bold">Track Quote</h1><input className="border p-2" value={code} onChange={(e) => setCode(e.target.value)} placeholder="QTE_xxx" /><button className="ml-2 border px-3 py-2" onClick={async () => setData(await (await fetch(`${API}/track/quote/${code}`)).json())}>Track</button>{data && <pre className="mt-4 bg-white p-3 border">{JSON.stringify(data, null, 2)}</pre>}</div>;
}
