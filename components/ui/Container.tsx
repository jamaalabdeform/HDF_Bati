import { cn } from "./cn";

export function Container({ children, className, as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "section" | "header" | "footer" | "nav" }) {
  return <Tag className={cn("mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8", className)}>{children}</Tag>;
}
