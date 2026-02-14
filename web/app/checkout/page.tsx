"use client";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { apiPost } from "@/lib/api";
export default function Checkout() {
  const { items, clear } = useCart();
  const [msg, setMsg] = useState("");
  async function submit(payment_method: "stripe" | "interac") {
    const body = { customer_name: "Guest Customer", customer_email: "guest@example.com", customer_phone: "", shipping_line1: "123 Main St", shipping_city: "Toronto", shipping_province: "ON", shipping_postal_code: "M5V1A1", shipping_country: "CA", shipping_method: "carrier_shipping", payment_method, cart_lines: items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })) };
    const res = await apiPost("/checkout/session", body);
    if (res.checkout_url) { window.location.href = res.checkout_url; return; }
    setMsg(`${res.status}: ${res.instructions} -> ${res.recipient}`);
    clear();
  }
  return <div><h1 className="text-2xl font-bold">Checkout</h1><p>Shipping: carrier shipping only.</p><div className="flex gap-2 mt-4"><button className="bg-black text-white px-4 py-2 rounded" onClick={() => submit("stripe")}>Pay with Stripe</button><button className="border px-4 py-2 rounded" onClick={() => submit("interac")}>Pay with Interac e-Transfer</button></div><p className="mt-4">{msg}</p></div>;
}
