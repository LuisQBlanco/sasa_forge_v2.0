const badges = ["Fast Turnaround", "Multi-Material", "Laser Engraving", "4.9/5 Rating"];

export default function BadgePills() {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span key={badge} className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700 sm:text-sm">
          {badge}
        </span>
      ))}
    </div>
  );
}
