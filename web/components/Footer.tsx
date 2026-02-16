import Link from "next/link";

import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";

export default function Footer() {
  const legal = siteContent.footer.legal.replace("{YEAR}", String(new Date().getFullYear()));

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <Container className="grid gap-8 py-10 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wide text-slate-900">{siteContent.brand.name}</h3>
          <p className="mt-2 text-sm text-slate-600">{siteContent.footer.about}</p>
          <p className="mt-3 text-xs text-slate-500">{siteContent.brand.parent}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick Links</h4>
          <div className="mt-3 grid gap-2 text-sm">
            {siteContent.footer.links.map((item) => (
              <Link key={item.href} href={item.href} className="text-slate-700 hover:text-blue-700">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Policies</h4>
          <div className="mt-3 grid gap-2 text-sm">
            {siteContent.footer.policies.map((p) => (
              <Link key={p.href} href={p.href} className="text-slate-700 hover:text-blue-700">
                {p.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact</h4>
          <p className="mt-3 text-sm text-slate-700">{siteContent.global.email}</p>
          <p className="text-sm text-slate-700">{siteContent.global.phone}</p>
          <a href={siteContent.global.whatsapp} className="mt-2 inline-block text-sm font-medium text-blue-700 hover:text-blue-800">
            WhatsApp
          </a>
        </div>
      </Container>
      <Container className="border-t border-slate-100 pb-8 pt-4">
        <p className="text-xs text-slate-500">{legal}</p>
      </Container>
    </footer>
  );
}
