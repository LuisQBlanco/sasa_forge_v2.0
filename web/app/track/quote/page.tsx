"use client";

import { useState } from "react";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";
import { API } from "@/lib/api";

export default function TrackQuote() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  async function track() {
    setError("");
    const res = await fetch(`${API}/track/quote/${code}`);
    const body = await res.json();
    if (!res.ok) {
      setError(body.detail || "Not found");
      setData(null);
      return;
    }
    setData(body);
  }

  const hasDeposit = Boolean(data?.deposit_amount);
  const hasFinal = Boolean(data?.final_due);

  return (
    <section className="bg-clinic py-12">
      <Container className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Tracking</p>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-900">{siteContent.trackQuote.title}</h1>
        <p className="mt-3 text-slate-600">{siteContent.trackQuote.subtitle}</p>
        <Card className="mt-6">
          <label className="text-sm font-medium text-slate-700">
            {siteContent.trackQuote.inputLabel}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm focus:border-blue-400 focus:outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="QTE_xxx"
              />
              <Button onClick={track}>{siteContent.trackQuote.button}</Button>
            </div>
          </label>
          <p className="mt-3 text-xs text-slate-500">{siteContent.trackQuote.help}</p>
        </Card>
        {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}
        {data && (
          <Card className="mt-6">
            <div className="grid gap-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold">{siteContent.trackQuote.labels.status}: </span>
                {data.status}
              </p>
              <p>
                <span className="font-semibold">{siteContent.trackQuote.labels.pricedTotal}: </span>
                {data.priced_total ?? "-"}
              </p>
              <p>
                <span className="font-semibold">{siteContent.trackQuote.labels.depositDue}: </span>
                {data.deposit_amount ?? "-"}
              </p>
              <div className="pt-2">
                <p className="mb-2 font-semibold">{siteContent.trackQuote.labels.actions}</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant={hasDeposit ? "primary" : "ghost"} className={!hasDeposit ? "pointer-events-none opacity-50" : ""}>
                    {siteContent.trackQuote.labels.payDeposit}
                  </Button>
                  <Button variant={hasFinal ? "secondary" : "ghost"} className={!hasFinal ? "pointer-events-none opacity-50" : ""}>
                    {siteContent.trackQuote.labels.payFinal}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </Container>
    </section>
  );
}
