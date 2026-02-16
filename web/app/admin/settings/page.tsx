import AdminShell from "@/components/AdminShell";
import Card from "@/components/Card";
import { siteContent } from "@/content/siteContent";

export default function AdminSettingsPage() {
  return (
    <AdminShell title={siteContent.admin.sidebar[5]} subtitle="Shipping and payment settings overview.">
      <Card className="space-y-3">
        <p className="text-sm text-slate-700">
          Shipping mode: <span className="font-semibold">Carrier shipping only</span>
        </p>
        <p className="text-sm text-slate-700">
          Payments: <span className="font-semibold">Stripe + Interac e-Transfer</span>
        </p>
        <p className="text-sm text-slate-600">No pickup and no local delivery for MVP.</p>
      </Card>
    </AdminShell>
  );
}
