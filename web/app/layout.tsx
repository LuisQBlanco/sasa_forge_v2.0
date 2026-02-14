import "./globals.css";
import Link from "next/link";
import { CartProvider } from "@/components/CartProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <CartProvider>
          <header className="p-4 border-b bg-white flex gap-4 flex-wrap">
            <Link href="/">SASA Forge</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/quote">Custom Quote</Link>
            <Link href="/track/order">Track Order</Link>
            <Link href="/track/quote">Track Quote</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/admin">Admin</Link>
          </header>
          <main className="max-w-5xl mx-auto p-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
