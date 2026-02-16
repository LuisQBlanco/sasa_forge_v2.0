import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";
import ProductCard from "@/components/ProductCard";
import { apiGet } from "@/lib/api";

export default async function Shop() {
  const products = await apiGet("/products").catch(() => []);
  return (
    <section className="py-12">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Catalog</p>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-900">{siteContent.shop.title}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">{siteContent.shop.subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {siteContent.shop.filters.map((f) => (
            <span key={f} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.length > 0 ? products.map((p: any) => <ProductCard key={p.id} product={p} />) : <p className="text-sm text-slate-600">{siteContent.shop.empty}</p>}
        </div>
      </Container>
    </section>
  );
}
