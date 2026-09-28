import { PENDING_LABEL, SHOW_PENDING, type Validated } from "@/config/validation";
import { cn } from "./cn";

/**
 * Placeholder de contenu à valider.
 * Rendu uniquement hors production — en production, rien n'est affiché.
 * TODO_HDF_VALIDATION
 */
export function Pending({ label, note, className, inline = false }: { label: string; note?: string; className?: string; inline?: boolean }) {
  if (!SHOW_PENDING) return null;
  const Tag = inline ? "span" : "div";
  return (
    <Tag className={cn("pending-flag rounded-lg px-3 py-2 text-xs leading-snug", inline ? "inline-block" : "block", className)} data-pending="true">
      <strong className="font-bold">{PENDING_LABEL}</strong> {label}
      {note && <span className="mt-0.5 block opacity-80">{note}</span>}
    </Tag>
  );
}

/** Affiche la valeur confirmée, sinon le placeholder (hors prod) ou rien (prod). */
export function ValidatedText<T extends string>({ data, label, render }: { data: Validated<T>; label: string; render?: (v: T) => React.ReactNode }) {
  if (data.status === "confirmed" && data.value) return <>{render ? render(data.value) : data.value}</>;
  return <Pending inline label={label} note={data.note} />;
}
