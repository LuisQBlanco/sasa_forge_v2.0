"use client";

import { useState } from "react";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { useCart } from "@/components/CartProvider";
import { siteContent } from "@/content/siteContent";
import { apiPost } from "@/lib/api";

export default function Checkout() {
  const { items, clear } = useCart();
  const [msg, setMsg] = useState("");

  async function submit(payment_method: "stripe" | "interac") {
    const body = {
      customer_name: "Guest Customer",
      customer_email: "guest@example.com",
      customer_phone: "",
      shipping_line1: "123 Main St",
      shipping_city: "Toronto",
      shipping_province: "ON",
      shipping_postal_code: "M5V1A1",
      shipping_country: "CA",
      shipping_method: "carrier_shipping",
      payment_method,
      cart_lines: items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
    };

    const res = await apiPost("/checkout/session", body);
    if (res.checkout_url) {
      window.location.href = res.checkout_url;
      return;
    }

    setMsg(`${res.status}: ${res.instructions} -> ${res.recipient}`);
    clear();
  }

  return (
    <section className="bg-clinic py-12">
      <Container className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Payment</p>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">{siteContent.checkout.title}</h1>
          <p className="mt-3 text-slate-600">{siteContent.checkout.paymentOptionsText}</p>
          <Card className="mt-6">
            <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
            <div className="mt-4 space-y-3">
              {items.length === 0 && <p className="text-sm text-slate-500">No cart lines. Add products before checkout.</p>}
              {items.map((i) => (
                <div key={i.variant_id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">
                    {i.name} x {i.quantity}
                  </span>
                  <span className="font-semibold text-slate-900">CAD ${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card>
          <h2 className="text-lg font-bold text-slate-900">Choose payment method</h2>
          <p className="mt-2 text-sm text-slate-600">{siteContent.checkout.stripeNote}</p>
          <p className="mt-1 text-sm text-slate-600">{siteContent.checkout.interacInstructions}</p>
          <div className="mt-5 grid gap-3">
            <Button onClick={() => submit("stripe")}>{siteContent.checkout.buttons.stripe}</Button>
            <Button onClick={() => submit("interac")} variant="secondary">
              {siteContent.checkout.buttons.interac}
            </Button>
          </div>
          {msg && <p className="mt-5 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">{msg}</p>}
        </Card>
      </Container>
    </section>
  );
}
