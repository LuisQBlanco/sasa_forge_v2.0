import AdminShell from "@/components/AdminShell";
import Card from "@/components/Card";
import { siteContent } from "@/content/siteContent";

export default function AdminStaffPage() {
  return (
    <AdminShell title={siteContent.admin.sidebar[4]} subtitle="Manage staff access (OWNER or STAFF).">
      <Card>
        <p className="text-sm text-slate-600">
          Staff management UI is reserved for the next iteration. Use API scripts for now to create users and assign roles.
        </p>
      </Card>
    </AdminShell>
  );
}
