import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";
import HeroClinicStyle from "@/components/HeroClinicStyle";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import { apiGet } from "@/lib/api";

export default async function Home() {
  const products = await apiGet("/products").catch(() => []);
  const featured = Array.isArray(products) ? products.slice(0, 4) : [];

  return (
    <>
      <HeroClinicStyle />

      <section className="clinic-section">
        <Container>
          <SectionHeader kicker="Capabilities" title={siteContent.home.whatWeMake.title} description={siteContent.home.whatWeMake.intro} />
          <div className="grid gap-5 md:grid-cols-3">
            {siteContent.home.whatWeMake.cards.map((item) => (
              <Card key={item.title} className="h-full">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="clinic-section bg-white">
        <Container>
          <SectionHeader kicker="Simple Process" title={siteContent.home.howItWorks.title} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {siteContent.home.howItWorks.steps.map((step, idx) => (
              <Card key={step.title} className="h-full">
                <p className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">Step {idx + 1}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="clinic-section">
        <Container>
          <SectionHeader
            kicker="Storefront"
            title={siteContent.home.featured.heading}
            description={siteContent.home.featured.subtext}
            action={
              <Button href={siteContent.home.featured.cta.href} variant="secondary">
                {siteContent.home.featured.cta.label}
              </Button>
            }
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featured.length > 0
              ? featured.map((product: any) => <ProductCard key={product.id} product={product} />)
              : [1, 2, 3, 4].map((n) => (
                  <Card key={n} className="h-full">
                    <div className="h-40 rounded-xl bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100" />
                    <h3 className="mt-4 text-lg font-semibold">Sample product {n}</h3>
                    <p className="mt-2 text-sm text-slate-600">Catalog loading fallback card.</p>
                  </Card>
                ))}
          </div>
        </Container>
      </section>

      <section className="clinic-section bg-white">
        <Container>
          <SectionHeader title={siteContent.home.why.heading} />
          <ul className="mt-6 grid gap-3 text-sm text-slate-700">
            {siteContent.home.why.bullets.map((bullet) => (
              <li key={bullet} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                {bullet}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
