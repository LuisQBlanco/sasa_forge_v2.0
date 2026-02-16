import Link from "next/link";

import AdminShell from "@/components/AdminShell";
import { siteContent } from "@/content/siteContent";

export default function AdminHome() {
  return (
    <AdminShell title={siteContent.admin.sidebar[0]} subtitle="Manage products, quotes, and orders from one place.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/login" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700">
          {siteContent.admin.login.title}
        </Link>
        <Link href="/admin/products" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700">
          {siteContent.admin.sidebar[1]}
        </Link>
        <Link href="/admin/orders" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700">
          {siteContent.admin.sidebar[3]}
        </Link>
        <Link href="/admin/quotes" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700">
          {siteContent.admin.sidebar[2]}
        </Link>
      </div>
    </AdminShell>
  );
}
