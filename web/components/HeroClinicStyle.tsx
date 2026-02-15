import Button from "@/components/Button";
import Card from "@/components/Card";
import Container from "@/components/Container";
import BadgePills from "@/components/BadgePills";
import StatsRow from "@/components/StatsRow";

export default function HeroClinicStyle() {
  return (
    <section className="bg-clinic">
      <Container className="grid gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div className="space-y-6">
          <BadgePills />
          <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Precision Fabrication for
            <span className="text-blue-600"> 3D Printing</span> and Laser Projects
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            SASA Forge delivers custom 3D printing and laser cutting/engraving for Toronto/GTA clients with dependable Canada-wide shipping and fast project handling.
          </p>
          <StatsRow />
          <div className="flex flex-wrap gap-3">
            <Button href="/shop">Shop Now</Button>
            <Button href="/quote" variant="secondary">
              Get a Quote
            </Button>
          </div>
          <Card className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">⚡</div>
            <div>
              <p className="text-sm text-slate-500">Quick Quote</p>
              <a href="mailto:sasaamazingsolutions@gmail.com" className="block text-sm font-semibold text-slate-900 hover:text-blue-700">
                sasaamazingsolutions@gmail.com
              </a>
              <a href="https://wa.me/14168225245" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                WhatsApp
              </a>
            </div>
          </Card>
        </div>
        <div className="relative">
          <div className="relative min-h-[380px] overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-100 via-white to-blue-200 p-8 shadow-xl shadow-blue-100">
            <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-blue-300/30" />
            <div className="absolute -right-10 bottom-8 h-28 w-28 rounded-full bg-blue-300/30" />
            <div className="relative z-10 space-y-3">
              <Card className="max-w-[220px]">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Next Available Slot</p>
                <p className="mt-1 text-lg font-bold text-slate-900">Today 2:30 PM</p>
                <p className="text-sm text-slate-500">Rush manufacturing queue</p>
              </Card>
              <div className="mt-24 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg">
                <p className="text-sm text-slate-600">Reliable prints, precision cuts, and consistent quality for prototypes and production batches.</p>
              </div>
              <Card className="max-w-[160px]">
                <p className="text-xs text-slate-500">Customer Rating</p>
                <p className="text-2xl font-bold text-blue-700">4.9/5</p>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
