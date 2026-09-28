"use client";

import { useEffect, useState } from "react";

/** Vrai tant que la section `id` occupe une partie significative de l'écran. */
export function useSectionInView(id: string): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el || !("IntersectionObserver" in window)) return;
    // -96px en haut : zone masquée par l’en-tête collant.
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "-96px 0px -35% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return inView;
}
