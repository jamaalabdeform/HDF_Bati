import { cn } from "./cn";

export type Tone = "green" | "navy" | "deep";

const tones: Record<Tone, string> = {
  green: "bg-hdf text-white",
  navy: "bg-navy text-white",
  deep: "bg-deep text-white",
};

export function Badge({ tone = "green", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-[0.12em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
