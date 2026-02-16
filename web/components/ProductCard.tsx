import Link from "next/link";
import { API } from "@/lib/api";

import Card from "@/components/Card";
import Button from "@/components/Button";

type Variant = { id: number; size: string; material: string; price_cad: number };
type Product = {
  id: number;
  slug: string;
  name: string;
  description?: string;
  images?: { url: string }[];
  variants?: Variant[];
  is_active?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const minPrice = product.variants && product.variants.length > 0 ? Math.min(...product.variants.map((v) => Number(v.price_cad))) : null;
  const hero = product.images && product.images.length > 0 ? product.images[0].url : null;

  return (
    <Card className="group flex h-full flex-col justify-between overflow-hidden p-0">
      <div>
        <div className="relative mb-4 h-44 overflow-hidden rounded-t-2xl bg-slate-100">
          {hero ? (
            // URL can be API-hosted upload path.
            <img src={`${API}${hero}`} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100" />
          )}
          {product.is_active === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
              <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Inactive</span>
            </div>
          )}
        </div>
        <div className="px-6 pb-1">
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.description || "Customizable product by SASA Forge."}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 px-6 pb-6">
        <p className="text-sm font-semibold text-blue-700">{minPrice !== null ? `From CAD $${minPrice}` : "Custom pricing"}</p>
        <Button href={`/shop/${product.slug}`} variant="secondary" className="px-4 py-2 text-xs uppercase tracking-wide">
          Details
        </Button>
      </div>
    </Card>
  );
}
