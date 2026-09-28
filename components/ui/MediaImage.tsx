import Image from "next/image";
import type { MediaAsset } from "@/config/media";
import { SHOW_PENDING } from "@/config/validation";
import { cn } from "./cn";

/**
 * Image remplaçable depuis config/media.ts.
 * Les visuels provisoires sont signalés hors production.
 */
export function MediaImage({ asset, sizes, priority, quality = 75, className, imgClassName }: { asset: MediaAsset; sizes: string; priority?: boolean; quality?: 60 | 75; className?: string; imgClassName?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={sizes}
        preload={priority}
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
        quality={quality}
        className={cn("object-cover", imgClassName)}
        style={{ objectPosition: asset.focus ?? "50% 50%" }}
      />
      {SHOW_PENDING && asset.status === "provisional_ai" && (
        <span className="pending-flag absolute top-2 left-2 z-10 rounded-md px-2 py-1 text-[0.65rem] font-bold" data-pending="true">
          Visuel provisoire — à remplacer par une photo HDF
        </span>
      )}
    </div>
  );
}
