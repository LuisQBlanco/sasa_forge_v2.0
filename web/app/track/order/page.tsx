"use client";

import { useState } from "react";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";
import SectionHeader from "@/components/SectionHeader";
import { API } from "@/lib/api";

export default function TrackOrder() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  async function track() {
    setError("");
    if (!code.trim()) {
      setError("Please enter an order code.");
      setData(null);
      return;
    }
    const res = await fetch(`${API}/track/order/${encodeURIComponent(code.trim())}`);
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
        <SectionHeader kicker="Tracking" title={siteContent.trackOrder.title} description={siteContent.trackOrder.subtitle} />
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
            <h2 className="text-lg font-bold text-slate-900">
              {siteContent.trackOrder.labels.status}: <span className="rounded-full bg-blue-50 px-2.5 py-1 text-sm text-blue-700">{data.status}</span>
            </h2>
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
