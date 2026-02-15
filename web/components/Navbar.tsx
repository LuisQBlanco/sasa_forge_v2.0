"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Container from "@/components/Container";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Get a Quote", href: "/quote" },
  { label: "Track Order", href: "/track/order" },
  { label: "Track Quote", href: "/track/quote" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
          SASA <span className="text-blue-600">Forge</span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </Container>
      <Container className="pb-3 lg:hidden">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-700">
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </nav>
  );
}
