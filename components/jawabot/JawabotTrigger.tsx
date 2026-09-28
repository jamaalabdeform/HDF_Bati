"use client";

import type { Answers } from "@/config/jawabot";
import type { Segment } from "@/config/services";
import { buttonClasses } from "../ui/Button";
import { useJawabot } from "./JawabotProvider";

type ButtonStyle = Parameters<typeof buttonClasses>[0];

/**
 * Bouton qui ouvre Jawabot. Utilisable dans n'importe quelle section (server component parent).
 * Si `usePreferred`, le segment choisi par le visiteur (hero / URL) est repris.
 */
export function JawabotTrigger({
  children,
  segment,
  preset,
  origin,
  usePreferred = false,
  icon,
  iconEnd,
  ...style
}: ButtonStyle & {
  children: React.ReactNode;
  segment?: Segment;
  preset?: Answers;
  origin: string;
  usePreferred?: boolean;
  icon?: React.ReactNode;
  iconEnd?: React.ReactNode;
}) {
  const { open, preferredSegment } = useJawabot();
  return (
    <button
      type="button"
      className={buttonClasses(style)}
      aria-haspopup="dialog"
      onClick={() => open({ segment: segment ?? (usePreferred ? preferredSegment ?? undefined : undefined), preset, origin })}
    >
      {icon}
      <span>{children}</span>
      {iconEnd}
    </button>
  );
}
