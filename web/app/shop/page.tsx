import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { apiGet } from "@/lib/api";

export default async function Shop() {
  const products = await apiGet("/products");
  return (
    <section className="py-12">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Catalog</p>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-900">Shop Products</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Browse ready-to-order designs and select your preferred size and material from the product detail page.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
