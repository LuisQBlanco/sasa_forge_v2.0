"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { useCart } from "@/components/CartProvider";
import { siteContent } from "@/content/siteContent";
import { API } from "@/lib/api";

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [message, setMessage] = useState("");
  const { add } = useCart();

  useEffect(() => {
    fetch(`${API}/products/${params.slug}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [params.slug]);

  if (!product) {
    return (
      <Container className="py-16">
        <p className="text-slate-600">Loading product...</p>
      </Container>
    );
  }

  return (
    <section className="bg-clinic py-12">
      <Container className="grid gap-8 lg:grid-cols-2">
        <Card className="p-4">
          <div className="h-80 rounded-2xl bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="h-20 rounded-xl bg-slate-100" />
            <div className="h-20 rounded-xl bg-slate-100" />
            <div className="h-20 rounded-xl bg-slate-100" />
          </div>
        </Card>
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">SASA Forge Product</p>
          <h1 className="text-4xl font-extrabold text-slate-900">{product.name}</h1>
          <p className="leading-7 text-slate-600">{product.description}</p>
          <div className="flex flex-wrap gap-2">
            {siteContent.product.valueProps.map((v) => (
              <span key={v} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {v}
              </span>
            ))}
          </div>
          <Card>
            <h2 className="text-lg font-bold text-slate-900">{siteContent.product.labels.material}</h2>
            <div className="mt-4 grid gap-3">
              {product.variants.map((v: any) => (
                <button
                  key={v.id}
                  className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/50"
                  onClick={() => {
                    add({ variant_id: v.id, quantity: 1, name: `${product.name} ${v.size}/${v.material}`, price: v.price_cad });
                    setMessage(`Added ${v.size} / ${v.material} to cart`);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      {v.size} / {v.material}
                    </span>
                    <span className="font-bold text-blue-700">CAD ${v.price_cad}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="text-sm font-medium text-slate-700">
                {siteContent.product.labels.material}
                <select className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
                  <option>Auto from variant</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {siteContent.product.labels.color}
                <select className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
                  <option>Default</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {siteContent.product.labels.size}
                <select className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
                  <option>Auto from variant</option>
                </select>
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              {siteContent.product.labels.personalization}
              <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Optional note" />
            </label>
            {message && <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p>}
            <div className="mt-5 flex gap-3">
              <Button href="/cart">{siteContent.product.buttons.addToCart}</Button>
              <Button href={`/quote?product=${encodeURIComponent(product.name)}`} variant="secondary">
                {siteContent.product.buttons.customQuote}
              </Button>
            </div>
            <div className="mt-6 space-y-2">
              <details className="rounded-xl border border-slate-200 bg-white p-3">
                <summary className="cursor-pointer font-semibold text-slate-900">{siteContent.product.accordion.description}</summary>
                <p className="mt-2 text-sm text-slate-600">{product.description || "No description yet."}</p>
              </details>
              <details className="rounded-xl border border-slate-200 bg-white p-3">
                <summary className="cursor-pointer font-semibold text-slate-900">{siteContent.product.accordion.materialsCare}</summary>
                <p className="mt-2 text-sm text-slate-600">{siteContent.product.accordion.materialsCareText}</p>
              </details>
              <details className="rounded-xl border border-slate-200 bg-white p-3">
                <summary className="cursor-pointer font-semibold text-slate-900">{siteContent.product.accordion.leadTimeShipping}</summary>
                <p className="mt-2 text-sm text-slate-600">
                  Lead time is based on queue and complexity. {siteContent.brand.shipping}
                </p>
              </details>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
