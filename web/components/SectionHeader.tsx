import type { ReactNode } from "react";

type Props = {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export default function SectionHeader({ kicker, title, description, align = "left", action }: Props) {
  const centered = align === "center";
  return (
    <div className={`mb-8 ${centered ? "text-center" : ""}`}>
      {kicker && <p className={`text-sm font-semibold uppercase tracking-wider text-blue-700 ${centered ? "justify-center" : ""}`}>{kicker}</p>}
      <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{title}</h2>
      <div className={`clinic-divider ${centered ? "mx-auto" : ""}`} />
      {description && <p className={`mt-3 text-slate-600 ${centered ? "mx-auto max-w-3xl" : ""}`}>{description}</p>}
      {action && <div className={`mt-5 ${centered ? "mx-auto flex justify-center" : ""}`}>{action}</div>}
    </div>
  );
}
