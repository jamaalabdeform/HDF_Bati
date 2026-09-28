import { cn } from "../ui/cn";

export function BotBubble({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "info" | "error" }) {
  return (
    <div className="animate-bubble-in flex items-end gap-2">
      <span aria-hidden className="mb-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/hdf-bati-pictogramme-blanc.svg" alt="" width={16} height={17} />
      </span>
      <p
        className={cn(
          "max-w-[85%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-[0.93rem] leading-snug shadow-[0_1px_2px_rgb(8_61_46_/_0.06)]",
          tone === "default" && "bg-white text-ink",
          tone === "info" && "bg-[#e8f4ec] text-deep ring-1 ring-hdf/15",
          tone === "error" && "bg-[#fdecea] text-[#8b1d12] ring-1 ring-[#e5a39b]",
        )}
      >
        <span className="sr-only">Jawabot : </span>
        {children}
      </p>
    </div>
  );
}

export function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-bubble-in flex justify-end">
      <p className="max-w-[85%] rounded-2xl rounded-br-md bg-hdf px-3.5 py-2.5 text-[0.93rem] leading-snug font-medium text-white">
        <span className="sr-only">Vous : </span>
        {children}
      </p>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex items-end gap-2" aria-label="Jawabot écrit…" role="status">
      <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/hdf-bati-pictogramme-blanc.svg" alt="" width={16} height={17} />
      </span>
      <span className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3.5">
        <span className="typing-dot size-1.5 rounded-full bg-deep/60" />
        <span className="typing-dot size-1.5 rounded-full bg-deep/60" />
        <span className="typing-dot size-1.5 rounded-full bg-deep/60" />
      </span>
    </div>
  );
}
