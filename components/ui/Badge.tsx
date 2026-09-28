import { cn } from "./cn";

export type Tone = "green" | "navy" | "deep";

const tones: Record<Tone, string> = {
  green: "bg-hdf text-white",
  navy: "bg-navy text-white",
  deep: "bg-deep text-white",
};

const sizes = {
  md: "px-3 py-1 text-[0.7rem] tracking-[0.12em]",
  // Compact sur mobile (vignettes étroites), taille normale dès 640 px.
  responsive: "px-2 py-0.5 text-[0.6rem] tracking-[0.04em] sm:px-3 sm:py-1 sm:text-[0.7rem] sm:tracking-[0.12em]",
} as const;

export function Badge({ tone = "green", size = "md", children, className }: { tone?: Tone; size?: keyof typeof sizes; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold uppercase",
        sizes[size],
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
