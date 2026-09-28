import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "light";
type Size = "md" | "lg" | "sm";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-tight transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-[var(--ease-out-soft)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 select-none text-center whitespace-nowrap";

const variants: Record<Variant, string> = {
  // Orange action : texte encre (contraste AA 4.7:1) — l'orange est réservé à l'action.
  primary: "bg-action text-ink hover:bg-action-hover",
  secondary: "bg-hdf text-white hover:bg-hdf-dark",
  outline: "border-2 border-deep/15 bg-white text-deep hover:border-hdf hover:text-hdf",
  ghost: "text-deep hover:text-hdf underline-offset-4 hover:underline",
  light: "bg-white text-deep hover:bg-surface",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-5 text-[0.95rem]",
  lg: "min-h-14 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

export function buttonClasses({ variant = "primary", size = "md", className }: Omit<CommonProps, "children">) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant, size, className, children, icon, iconEnd, ...rest }: CommonProps & ComponentProps<"button">) {
  return (
    <button type="button" className={buttonClasses({ variant, size, className })} {...rest}>
      {icon}
      <span>{children}</span>
      {iconEnd}
    </button>
  );
}

export function ButtonLink({ variant, size, className, children, icon, iconEnd, href, ...rest }: CommonProps & ComponentProps<"a"> & { href: string }) {
  const classes = buttonClasses({ variant, size, className });
  const isInternal = href.startsWith("/") && !href.startsWith("//");
  if (isInternal) {
    return (
      <Link href={href} className={classes} {...rest}>
        {icon}
        <span>{children}</span>
        {iconEnd}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...rest}>
      {icon}
      <span>{children}</span>
      {iconEnd}
    </a>
  );
}
