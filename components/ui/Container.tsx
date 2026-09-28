import { cn } from "./cn";

// cn() ne fusionne pas les classes Tailwind : la largeur passe par `width`, jamais par className.
const widths = { page: "max-w-[76rem]", text: "max-w-3xl", narrow: "max-w-xl" } as const;

export function Container({
  children,
  className,
  width = "page",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  width?: keyof typeof widths;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return <Tag className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widths[width], className)}>{children}</Tag>;
}
