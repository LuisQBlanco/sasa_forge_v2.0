"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
export default function CartPage() {
  const { items } = useCart();
  const total = items.reduce((a, b) => a + b.price * b.quantity, 0);
  return <div><h1 className="text-2xl font-bold">Cart</h1>{items.map((i) => <div key={i.variant_id}>{i.name} x {i.quantity}</div>)}<div className="mt-4">Total: CAD ${total.toFixed(2)}</div><Link href="/checkout" className="inline-block mt-4 bg-black text-white px-4 py-2 rounded">Checkout</Link></div>;
}
