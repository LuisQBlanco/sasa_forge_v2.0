import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { siteContent } from "@/content/siteContent";

export default function Contact() {
  return (
    <section className="bg-clinic py-12">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Contact</p>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-900">{siteContent.contact.title}</h1>
        <p className="mt-3 text-slate-600">{siteContent.contact.subtitle}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Card>
            <h2 className="text-lg font-bold text-slate-900">Email</h2>
            <a href={`mailto:${siteContent.global.email}`} className="mt-3 block text-sm font-semibold text-blue-700">
              {siteContent.global.email}
            </a>
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-slate-900">Phone</h2>
            <a href="tel:+14168225245" className="mt-3 block text-sm font-semibold text-blue-700">
              {siteContent.global.phone}
            </a>
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-slate-900">WhatsApp</h2>
            <a href={siteContent.global.whatsapp} className="mt-3 block text-sm font-semibold text-blue-700">
              {siteContent.contact.whatsappText}
            </a>
          </Card>
        </div>
        <Card className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">{siteContent.contact.serviceNote}</p>
          <Button href={siteContent.contact.cta.href} variant="secondary">
            {siteContent.contact.cta.label}
          </Button>
        </Card>
      </Container>
    </section>
  );
}
