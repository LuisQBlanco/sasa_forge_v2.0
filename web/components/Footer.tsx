import Link from "next/link";

import Container from "@/components/Container";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <Container className="grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">SASA Forge</h3>
          <p className="mt-2 text-sm text-slate-600">3D Printing & Laser Fabrication for Toronto/GTA and Canada-wide shipping.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick links</h4>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/shop" className="text-slate-700 hover:text-blue-700">
              Shop
            </Link>
            <Link href="/quote" className="text-slate-700 hover:text-blue-700">
              Get a Quote
            </Link>
            <Link href="/track/order" className="text-slate-700 hover:text-blue-700">
              Track Order
            </Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact</h4>
          <p className="mt-3 text-sm text-slate-700">sasaamazingsolutions@gmail.com</p>
          <p className="text-sm text-slate-700">+1 (416) 822-5245</p>
          <a href="https://wa.me/14168225245" className="mt-2 inline-block text-sm font-medium text-blue-700 hover:text-blue-800">
            WhatsApp
          </a>
        </div>
      </Container>
    </footer>
  );
}
