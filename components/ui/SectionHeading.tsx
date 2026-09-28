import { cn } from "./cn";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  invert = false,
  id,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  invert?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]", align === "center" && "justify-center", invert ? "text-energy" : "text-hdf")}>
          <span aria-hidden className={cn("h-0.5 w-6 rounded-full", invert ? "bg-energy" : "bg-hdf")} />
          {eyebrow}
        </p>
      )}
      <h2 id={id} className={cn("text-[1.75rem] leading-[1.12] font-bold sm:text-4xl lg:text-[2.6rem]", invert ? "text-white" : "text-deep")}>
        {title}
      </h2>
      {intro && <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", invert ? "text-white/80" : "text-muted")}>{intro}</p>}
    </Reveal>
  );
}
