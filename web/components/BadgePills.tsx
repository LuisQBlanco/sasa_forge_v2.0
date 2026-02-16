import { siteContent } from "@/content/siteContent";

export default function BadgePills() {
  return (
    <div className="flex flex-wrap gap-2">
      {siteContent.home.badges.map((badge) => (
        <span key={badge} className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700 sm:text-sm">
          {badge}
        </span>
      ))}
    </div>
  );
}
