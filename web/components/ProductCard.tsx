import Link from "next/link";

import Card from "@/components/Card";
import Button from "@/components/Button";

type Variant = { id: number; size: string; material: string; price_cad: number };
type Product = {
  id: number;
  slug: string;
  name: string;
  description?: string;
  variants?: Variant[];
};

export default function ProductCard({ product }: { product: Product }) {
  const minPrice = product.variants && product.variants.length > 0 ? Math.min(...product.variants.map((v) => Number(v.price_cad))) : null;

  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <div className="mb-4 h-40 rounded-xl bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100" />
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.description || "Customizable product by SASA Forge."}</p>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-blue-700">{minPrice !== null ? `From CAD $${minPrice}` : "Custom pricing"}</p>
        <Button href={`/shop/${product.slug}`} variant="secondary" className="px-4 py-2 text-xs">
          View
        </Button>
      </div>
    </Card>
  );
}
