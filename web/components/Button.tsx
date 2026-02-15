import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

function styles(variant: Variant) {
  if (variant === "secondary") {
    return "border border-blue-600 bg-white text-blue-700 hover:bg-blue-50";
  }
  if (variant === "ghost") {
    return "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
  }
  return "bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700";
}

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
};

type LinkButtonProps = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type ActionButtonProps = BaseProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
};

type Props = LinkButtonProps | ActionButtonProps;

export default function Button({ children, className = "", variant = "primary", ...rest }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-200";
  const all = `${base} ${styles(variant)} ${className}`;

  if ("href" in rest && rest.href) {
    return (
      <Link href={rest.href} className={all}>
        {children}
      </Link>
    );
  }

  return (
    <button type={rest.type || "button"} onClick={rest.onClick} className={all}>
      {children}
    </button>
  );
}
