import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import HeroClinicStyle from "@/components/HeroClinicStyle";
import ProductCard from "@/components/ProductCard";
import { apiGet } from "@/lib/api";

const makeItems = [
  {
    title: "Functional Prototypes",
    body: "Rapid iteration with PLA, PETG, TPU and engineering materials for practical fit tests.",
  },
  {
    title: "Laser-Cut Components",
    body: "Clean, repeatable cuts for custom parts, branding inserts, and workshop fixtures.",
  },
  {
    title: "Engraved Products",
    body: "Personalized keychains, plaques, and production marks for business-ready output.",
  },
];

const steps = [
  { title: "Upload", body: "Submit STL/3MF/STEP or image files and project notes." },
  { title: "Quote / Pay", body: "Receive pricing within 48 hours and confirm via Stripe or e-Transfer." },
  { title: "Produce / Ship", body: "We fabricate, quality-check, and ship across Canada from Toronto/GTA." },
];

export default async function Home() {
  const products = await apiGet("/products").catch(() => []);
  const featured = Array.isArray(products) ? products.slice(0, 4) : [];

  return (
    <>
      <HeroClinicStyle />

      <section className="py-14">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Capabilities</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">What we make</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {makeItems.map((item) => (
              <Card key={item.title}>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Simple Process</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">How it works</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((step, idx) => (
              <Card key={step.title}>
                <p className="text-sm font-semibold text-blue-700">Step {idx + 1}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Storefront</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Featured products</h2>
            </div>
            <Button href="/shop" variant="secondary">
              Browse all
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featured.length > 0
              ? featured.map((product: any) => <ProductCard key={product.id} product={product} />)
              : [1, 2, 3, 4].map((n) => (
                  <Card key={n}>
                    <div className="h-40 rounded-xl bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100" />
                    <h3 className="mt-4 text-lg font-semibold">Sample product {n}</h3>
                    <p className="mt-2 text-sm text-slate-600">Catalog loading fallback card.</p>
                  </Card>
                ))}
          </div>
        </Container>
      </section>
    </>
  );
}
