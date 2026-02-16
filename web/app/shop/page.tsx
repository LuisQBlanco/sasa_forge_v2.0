import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import { apiGet } from "@/lib/api";

export default async function Shop() {
  const products = await apiGet("/products").catch(() => []);
  return (
    <section className="bg-clinic py-12">
      <Container>
        <SectionHeader kicker="Catalog" title={siteContent.shop.title} description={siteContent.shop.subtitle} align="center" />
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {siteContent.shop.filters.map((f) => (
            <span key={f} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.length > 0 ? (
            products.map((p: any) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="clinic-panel col-span-full text-center">
              <p className="text-sm text-slate-600">{siteContent.shop.empty}</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
