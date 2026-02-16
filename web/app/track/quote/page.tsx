"use client";

import { useState } from "react";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";
import SectionHeader from "@/components/SectionHeader";
import { API } from "@/lib/api";

export default function TrackQuote() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paying, setPaying] = useState<"" | "deposit" | "final">("");

  async function track() {
    setError("");
    setPaymentError("");
    if (!code.trim()) {
      setError("Please enter a quote code.");
      setData(null);
      return;
    }
    const res = await fetch(`${API}/track/quote/${encodeURIComponent(code.trim())}`);
    const body = await res.json();
    if (!res.ok) {
      setError(body.detail || "Not found");
      setData(null);
      return;
    }
    setData(body);
  }

  async function openPayment(kind: "deposit" | "final") {
    if (!data?.public_code) return;
    setPaying(kind);
    setPaymentError("");
    try {
      const res = await fetch(`${API}/track/quote/${data.public_code}/payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const body = await res.json();
      if (!res.ok) {
        setPaymentError(body.detail || "Unable to generate payment link.");
        return;
      }
      if (body.checkout_url) {
        window.location.href = body.checkout_url;
        return;
      }
      setPaymentError("No payment link available.");
    } catch {
      setPaymentError("Unable to generate payment link.");
    } finally {
      setPaying("");
    }
  }

  const canPayDeposit = Boolean(data?.deposit_amount) && !Boolean(data?.deposit_paid);
  const canPayFinal = Boolean(data?.final_due) && !Boolean(data?.final_paid);

  return (
    <section className="bg-clinic py-12">
      <Container className="max-w-4xl">
        <SectionHeader kicker="Tracking" title={siteContent.trackQuote.title} description={siteContent.trackQuote.subtitle} />
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
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">{data.status}</span>
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
                  <Button
                    variant={canPayDeposit ? "primary" : "ghost"}
                    className={!canPayDeposit || !!paying ? "pointer-events-none opacity-50" : ""}
                    onClick={() => openPayment("deposit")}
                  >
                    {paying === "deposit"
                      ? "Opening..."
                      : data?.deposit_paid
                        ? "Deposit Paid"
                        : siteContent.trackQuote.labels.payDeposit}
                  </Button>
                  <Button
                    variant={canPayFinal ? "secondary" : "ghost"}
                    className={!canPayFinal || !!paying ? "pointer-events-none opacity-50" : ""}
                    onClick={() => openPayment("final")}
                  >
                    {paying === "final"
                      ? "Opening..."
                      : data?.final_paid
                        ? "Final Paid"
                        : siteContent.trackQuote.labels.payFinal}
                  </Button>
                </div>
                {paymentError && <p className="mt-2 text-xs text-rose-600">{paymentError}</p>}
              </div>
            </div>
          </Card>
        )}
      </Container>
    </section>
  );
}
