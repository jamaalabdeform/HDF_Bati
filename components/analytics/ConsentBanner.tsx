"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { hasAnyTracker, tracking } from "@/config/tracking";
import { readConsent, saveConsent } from "@/lib/consent";

/**
 * Bannière cookies conforme aux recommandations CNIL : refuser aussi simple qu'accepter,
 * aucun traceur avant choix. N'apparaît que si un outil de mesure est configuré.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Lecture du stockage local après hydratation (état externe au rendu serveur).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hasAnyTracker && !readConsent()) setOpen(true);
    const reopen = () => {
      const c = readConsent();
      setAnalytics(!!c?.analytics);
      setMarketing(!!c?.marketing);
      setCustom(true);
      setOpen(true);
    };
    window.addEventListener("hdf:consent-open", reopen);
    return () => window.removeEventListener("hdf:consent-open", reopen);
  }, []);

  if (!open) return null;
  const decide = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setOpen(false);
  };

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:p-0">
      <div className="rounded-2xl bg-white p-5 shadow-[var(--shadow-lift)] ring-1 ring-deep/10">
        <p id="consent-title" className="font-bold text-deep">Vos choix de confidentialité</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Avec votre accord, HDF Bâti mesure l’audience du site et l’efficacité de ses publicités. Vous pouvez changer d’avis à tout moment.{" "}
          <Link href="/cookies" className="font-semibold text-deep underline underline-offset-2">En savoir plus</Link>
        </p>
        {custom && (
          <div className="mt-4 space-y-3 rounded-xl bg-surface p-3 text-sm">
            {(tracking.gtmId || tracking.ga4Id) && (
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-0.5 size-5 accent-[#0B7A3B]" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                <span><strong className="text-deep">Mesure d’audience</strong> — Google Analytics</span>
              </label>
            )}
            {(tracking.gtmId || tracking.metaPixelId) && (
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-0.5 size-5 accent-[#0B7A3B]" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                <span><strong className="text-deep">Publicité</strong> — Meta (Facebook, Instagram), Google Ads</span>
              </label>
            )}
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => decide(false, false)} className="min-h-11 rounded-full border-2 border-deep/20 px-4 text-sm font-semibold text-deep hover:border-deep/40">
            Tout refuser
          </button>
          <button type="button" onClick={() => decide(true, true)} className="min-h-11 rounded-full border-2 border-deep bg-deep px-4 text-sm font-semibold text-white hover:bg-[#0a4a38]">
            Tout accepter
          </button>
        </div>
        <button type="button" onClick={() => (custom ? decide(analytics, marketing) : setCustom(true))} className="mt-2 min-h-11 w-full text-sm font-semibold text-deep underline underline-offset-2">
          {custom ? "Enregistrer mes choix" : "Personnaliser"}
        </button>
      </div>
    </div>
  );
}
