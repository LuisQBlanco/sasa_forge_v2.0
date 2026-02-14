import Link from "next/link";
export default function AdminHome() {
  return <div><h1 className="text-2xl font-bold">Admin</h1><div className="mt-4 flex gap-3"><Link href="/admin/login">Login</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/quotes">Quotes</Link></div></div>;
}
