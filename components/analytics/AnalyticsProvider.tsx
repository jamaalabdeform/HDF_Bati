"use client";

import { useEffect } from "react";
import { tracking } from "@/config/tracking";
import { track } from "@/lib/analytics";
import { onConsentChange, readConsent, type ConsentState } from "@/lib/consent";
import { captureAttribution } from "@/lib/utm";

/**
 * Point d'entrée unique du tracking :
 * - capture UTM / gclid / fbclid (session) ;
 * - événement view_landing ;
 * - clics téléphone / WhatsApp par délégation (aucun tracking dans les composants :
 *   ils portent seulement data-track="phone|whatsapp" et data-track-location) ;
 * - chargement de GTM / GA4 / Meta Pixel uniquement après consentement.
 */

function inject(id: string, src: string | null, inline?: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  if (src) {
    s.src = src;
    s.async = true;
  }
  if (inline) s.text = inline;
  document.head.appendChild(s);
}

/** gtag() exige un objet `arguments` (pas un tableau) dans le dataLayer. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature documentaire, gtag lit `arguments`
function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments as unknown as Record<string, unknown>);
}

function gtagConsent(state: ConsentState) {
  gtag("consent", "update", {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
  });
}

function loadTrackers(state: ConsentState) {
  gtagConsent(state);
  const { gtmId, ga4Id, metaPixelId } = tracking;

  if (gtmId && (state.analytics || state.marketing)) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    inject("gtm", `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
  } else if (ga4Id && state.analytics) {
    inject("ga4-lib", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`);
    inject(
      "ga4-init",
      null,
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(ga4Id)},{anonymize_ip:true});`,
    );
  }

  if (metaPixelId && state.marketing && !window.fbq) {
    inject(
      "meta-pixel",
      null,
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(metaPixelId)});fbq('track','PageView');`,
    );
  }
}

export function AnalyticsProvider() {
  useEffect(() => {
    document.documentElement.classList.remove("no-js");
    captureAttribution();

    // Consent Mode v2 : tout refusé par défaut.
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });

    const existing = readConsent();
    if (existing) loadTrackers(existing);
    const off = onConsentChange(loadTrackers);

    track("view_landing", { page_path: window.location.pathname, page_title: document.title });

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLElement>("a[href], [data-track]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const kind = a.dataset.track ?? (href.startsWith("tel:") ? "phone" : /wa\.me|whatsapp\.com/.test(href) ? "whatsapp" : null);
      const location = a.dataset.trackLocation ?? a.closest("[data-section]")?.getAttribute("data-section") ?? "unknown";
      if (kind === "phone") track("click_phone", { location });
      if (kind === "whatsapp") track("click_whatsapp", { location });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      off();
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}
