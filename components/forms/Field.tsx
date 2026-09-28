import { useId } from "react";
import Link from "next/link";
import { cn } from "../ui/cn";

const control =
  "block w-full min-h-12 rounded-md border border-deep/20 bg-white px-3.5 text-base text-ink placeholder:text-muted transition-[border-color,box-shadow] outline-none hover:border-deep/35 focus:border-hdf focus:ring-4 focus:ring-hdf/15 aria-[invalid=true]:border-[#b42318] aria-[invalid=true]:ring-[#b42318]/10";

interface FieldShell {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  dark?: boolean;
}

function Shell({ id, label, error, hint, optional, className, children, dark }: FieldShell & { id: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-sm font-semibold", dark ? "text-white" : "text-deep")}>
        {label}
        {optional && <span className={cn("ml-1 font-normal", dark ? "text-white/70" : "text-muted")}>(facultatif)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className={cn("text-xs", dark ? "text-white/70" : "text-muted")}>{hint}</p>}
      {error && (
        <p id={`${id}-error`} className={cn("text-xs font-semibold", dark ? "text-[#ffc9c2]" : "text-[#b42318]")} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ label, error, hint, optional, className, dark, ...input }: FieldShell & React.ComponentProps<"input">) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional} className={className} dark={dark}>
      <input
        id={id}
        className={control}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        required={!optional}
        {...input}
      />
    </Shell>
  );
}

export function SelectField({ label, error, hint, optional, className, dark, options, placeholder, ...select }: FieldShell & React.ComponentProps<"select"> & { options: readonly { value: string; label: string }[]; placeholder: string }) {
  const id = useId();
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional} className={className} dark={dark}>
      <select id={id} className={cn(control, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23083D2E%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10")} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} required={!optional} {...select}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Shell>
  );
}

export function ConsentField({ checked, onChange, error, text, dark }: { checked: boolean; onChange: (v: boolean) => void; error?: string; text: string; dark?: boolean }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-[3px] accent-[#0B7A3B]"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          required
        />
        <label htmlFor={id} className={cn("cursor-pointer text-xs leading-relaxed", dark ? "text-white/85" : "text-muted")}>
          {text}{" "}
          <Link href="/confidentialite" className={cn("font-semibold underline underline-offset-2", dark ? "text-white" : "text-deep")} target="_blank">
            Politique de confidentialité
          </Link>
          .
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className={cn("mt-1.5 text-xs font-semibold", dark ? "text-[#ffc9c2]" : "text-[#b42318]")} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
