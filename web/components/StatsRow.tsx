import { siteContent } from "@/content/siteContent";

export default function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {siteContent.home.stats.map((item) => (
        <div key={item.label}>
          <p className="text-2xl font-extrabold text-blue-700">{item.value}</p>
          <p className="text-sm text-slate-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
