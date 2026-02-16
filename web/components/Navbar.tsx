"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Container from "@/components/Container";
import { useCart } from "@/components/CartProvider";
import { siteContent } from "@/content/siteContent";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-slate-900">
          SASA <span className="text-blue-600">Forge</span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {siteContent.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                  active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/cart" className="ml-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:text-blue-700">
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </Container>
      {open && (
        <Container className="pb-4 lg:hidden">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid gap-2">
              {siteContent.nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold ${active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Cart{cartCount > 0 ? ` (${cartCount})` : ""}
              </Link>
            </div>
          </div>
        </Container>
      )}
    </nav>
  );
}
