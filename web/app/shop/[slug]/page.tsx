"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { API } from "@/lib/api";
export default function ProductDetail({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const { add } = useCart();
  useEffect(() => { fetch(`${API}/products/${params.slug}`).then((r) => r.json()).then(setProduct); }, [params.slug]);
  if (!product) return <div>Loading...</div>;
  return <div><h1 className="text-2xl font-bold">{product.name}</h1><p>{product.description}</p><div className="grid gap-2 mt-4">{product.variants.map((v: any) => <button key={v.id} className="border p-2 rounded text-left" onClick={() => add({ variant_id: v.id, quantity: 1, name: `${product.name} ${v.size}/${v.material}`, price: v.price_cad })}>{v.size} / {v.material} - CAD ${v.price_cad}</button>)}</div></div>;
}
