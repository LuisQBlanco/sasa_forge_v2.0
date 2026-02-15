import type { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200 ${className}`}>{children}</div>;
}
