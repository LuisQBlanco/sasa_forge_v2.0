const stats = [
  { value: "5+", label: "Materials" },
  { value: "500+", label: "Parts Printed" },
  { value: "48h", label: "Quote SLA" },
];

export default function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((item) => (
        <div key={item.label}>
          <p className="text-2xl font-extrabold text-blue-700">{item.value}</p>
          <p className="text-sm text-slate-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
