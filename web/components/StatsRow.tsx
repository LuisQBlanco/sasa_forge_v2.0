import { siteContent } from "@/content/siteContent";

export default function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      {siteContent.home.stats.map((item) => (
        <div key={item.label} className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-2xl font-extrabold text-blue-700">{item.value}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
