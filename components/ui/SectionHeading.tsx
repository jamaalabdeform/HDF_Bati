import { cn } from "./cn";

/** Titre de section : le titre porte seul le message (pas de sur-titre). */
export function SectionHeading({
  title,
  intro,
  align = "left",
  invert = false,
  id,
  className,
}: {
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <h2 id={id} className={cn("text-[1.85rem] leading-[1.1] font-bold sm:text-4xl lg:text-[2.75rem]", invert ? "text-white" : "text-deep")}>
        {title}
      </h2>
      {intro && <p className={cn("mt-4 max-w-[60ch] text-base leading-relaxed sm:text-lg", align === "center" && "mx-auto", invert ? "text-white/80" : "text-muted")}>{intro}</p>}
    </div>
  );
}
