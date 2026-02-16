"use client";

import { useState } from "react";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";
import { API } from "@/lib/api";

export default function TrackOrder() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  async function track() {
    setError("");
    const res = await fetch(`${API}/track/order/${code}`);
    const body = await res.json();
    if (!res.ok) {
      setError(body.detail || "Not found");
      setData(null);
      return;
    }
    setData(body);
  }

  return (
    <section className="bg-clinic py-12">
      <Container className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Tracking</p>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-900">{siteContent.trackOrder.title}</h1>
        <p className="mt-3 text-slate-600">{siteContent.trackOrder.subtitle}</p>
        <Card className="mt-6">
          <label className="text-sm font-medium text-slate-700">
            {siteContent.trackOrder.inputLabel}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm focus:border-blue-400 focus:outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ORD_xxx"
              />
              <Button onClick={track}>{siteContent.trackOrder.button}</Button>
            </div>
          </label>
          <p className="mt-3 text-xs text-slate-500">{siteContent.trackOrder.help}</p>
        </Card>
        {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}
        {data && (
          <Card className="mt-6">
            <h2 className="text-lg font-bold text-slate-900">{siteContent.trackOrder.labels.status}: {data.status}</h2>
            <div className="mt-3 grid gap-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold">{siteContent.trackOrder.labels.lastUpdated}: </span>
                {data.updated_at || "-"}
              </p>
              <p>
                <span className="font-semibold">{siteContent.trackOrder.labels.trackingNumber}: </span>
                {data.tracking_number || "-"}
              </p>
            </div>
          </Card>
        )}
      </Container>
    </section>
  );
}
