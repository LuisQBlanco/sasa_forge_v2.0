import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import { siteContent } from "@/content/siteContent";

export default function ReturnsPolicyPage() {
  return (
    <section className="bg-clinic py-12">
      <Container className="max-w-4xl">
        <SectionHeader kicker="Policy" title="Returns" />
        <div className="clinic-panel">
          <ul className="grid gap-3 text-sm text-slate-700">
            {siteContent.policies.returns.map((line) => (
              <li key={line} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
