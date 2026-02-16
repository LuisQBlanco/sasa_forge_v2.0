import Link from "next/link";
import type { ReactNode } from "react";

import Card from "@/components/Card";
import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";

const items = [
  { href: "/admin", label: siteContent.admin.sidebar[0] },
  { href: "/admin/products", label: siteContent.admin.sidebar[1] },
  { href: "/admin/quotes", label: siteContent.admin.sidebar[2] },
  { href: "/admin/orders", label: siteContent.admin.sidebar[3] },
  { href: "/admin?tab=staff", label: siteContent.admin.sidebar[4] },
  { href: "/admin?tab=settings", label: siteContent.admin.sidebar[5] },
];

export default function AdminShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="py-12">
      <Container>
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Admin Panel</p>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-3 text-slate-600">{subtitle}</p>}
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <Card className="h-fit p-4">
            <nav className="grid gap-2">
              {items.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                  {item.label}
                </Link>
              ))}
            </nav>
          </Card>
          <Card>{children}</Card>
        </div>
      </Container>
    </section>
  );
}
