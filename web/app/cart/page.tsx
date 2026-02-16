"use client";

import Link from "next/link";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { useCart } from "@/components/CartProvider";
import { siteContent } from "@/content/siteContent";

export default function CartPage() {
  const { items } = useCart();
  const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0);
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  return (
    <section className="bg-clinic py-12">
      <Container>
        <SectionHeader kicker="Checkout" title={siteContent.cart.title} description={siteContent.cart.subtext} />
        <Card>
          {items.length === 0 ? (
            <div className="space-y-4">
              <p className="text-slate-600">Your cart is empty.</p>
              <Button href="/shop">Browse products</Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((i) => (
                  <div key={i.variant_id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-slate-900">{i.name}</p>
                      <p className="text-sm text-slate-500">Qty: {i.quantity}</p>
                    </div>
                    <p className="font-semibold text-blue-700">CAD ${(i.price * i.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t border-slate-200 pt-6 text-sm">
                <div className="flex items-center justify-between">
                  <span>{siteContent.cart.labels.subtotal}</span>
                  <span>CAD ${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{siteContent.cart.labels.shipping}</span>
                  <span>CAD ${shipping.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{siteContent.cart.labels.tax}</span>
                  <span>CAD ${tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xl font-bold text-slate-900">
                  <span>{siteContent.cart.labels.total}</span>
                  <span>CAD ${total.toFixed(2)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">{siteContent.cart.shippingNote}</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-3">
                  <Link href="/shop" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700">
                    {siteContent.cart.buttons.continueShopping}
                  </Link>
                  <Button href="/checkout">{siteContent.cart.buttons.checkout}</Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </Container>
    </section>
  );
}
