import Link from "next/link";
import { apiGet } from "@/lib/api";

export default async function Shop() {
  const products = await apiGet("/products");
  return (
    <div className="grid gap-4">
      {products.map((p: any) => (
        <Link key={p.id} href={`/shop/${p.slug}`} className="p-4 bg-white border rounded">
          <h3 className="font-semibold">{p.name}</h3>
          <p>{p.description}</p>
        </Link>
      ))}
    </div>
  );
}
