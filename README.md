# HDF Bâti — landing page

Landing page de conversion de **HDF Bâti** (Anzin, Nord) : pompes à chaleur et rénovation énergétique
pour les particuliers, solutions énergétiques pour les professionnels, courtage en énergie pour les
professionnels et collectivités.

Chaîne visée : **Publicité / SEO → accueil ou page profil → fiche d’étude (qualification) → scoring → CRM → WhatsApp Farid → RDV → devis → vente**.

- Stack : **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · lucide-react**
- Aucune librairie d'animation : apparitions et micro-interactions en CSS (+ IntersectionObserver), `prefers-reduced-motion` respecté.
- Police Inter (charte) auto-hébergée et préchargée — aucun appel à Google Fonts.

> Avant la mise en ligne : lire **[HDF_CONTENT_TO_VALIDATE.md](./HDF_CONTENT_TO_VALIDATE.md)** et la
> [checklist avant production](#checklist-avant-production).

---

## Outils IA du projet

Le dossier `.claude/` contient les outils utilisés pour faire évoluer le site avec Claude Code : **Impeccable** (design, détecteur anti-« look IA »), **Ponytail** (sobriété du code), **Graphify** (graphe du code) et les skills Anthropic `frontend-design` et `webapp-testing`. Voir `CLAUDE.md`. Aucun impact sur le site en production.

---

## Installation

Prérequis : Node.js ≥ 20.9 (testé avec Node 22).

```bash
npm install
cp .env.example .env.local      # puis compléter
npm run dev                     # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build et serveur de production |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm run check:content` | Liste tous les contenus `pending_validation` / `TODO_HDF_VALIDATION` du code |
| `npm run qa:screens -- http://localhost:3000 qa-screens` | Contrôle visuel : captures 375 / 390 / 430 / 768 / 1024 / 1440 px, débordements, textes tronqués, cibles tactiles, erreurs console, accueil + 3 pages profil, parcours complet de la fiche d’étude + formulaire de rappel |
| `node scripts/build-og.mjs` | Régénère l'image de partage `public/og-hdf-bati.jpg` |
| `python3 scripts/build-logo.py` | Régénère les SVG du logo corrigé (`pip install fonttools uharfbuzz`) |

`npm run qa:screens` utilise Playwright (déjà en devDependency) ; installer un navigateur une fois avec `npx playwright install chromium` si nécessaire.

---

## Architecture

```
app/
  layout.tsx              métadonnées SEO, JSON-LD LocalBusiness + WebSite, police, providers
  page.tsx                landing (sections) + JSON-LD FAQPage
  api/lead/route.ts       réception des leads → validation → scoring → CRM / WhatsApp / Meta CAPI
  interventions/[ville]   pages locales (générées uniquement depuis config/local-pages.ts)
  mentions-legales, confidentialite, cookies
  sitemap.ts, robots.ts, manifest.ts, icon.svg, apple-icon.png
components/
  brand/      Logo (SVG officiels corrigés)
  etude/      StudySheet (fiche d'étude par étapes), DossierHero, Dossier (sommaire + rubriques A → D), DossierEntries, ProfilePage
  layout/     Header (sticky, bouton selon la page), Footer, MobileActionBar, LegalPage
  sections/   Aides, WhyHdf, Callback, Faq, Contact
  forms/      Field (champs accessibles), CallbackForm
  analytics/  AnalyticsProvider (UTM, consentement, délégation des clics), ConsentBanner
  ui/         Button, Container, SectionHeading, Pending
config/       ← toute l'information métier, rien n'est dupliqué ailleurs
  company.ts  identité, NAP, légal, WhatsApp, réseaux (source unique)
  services.ts segments, cartes « Votre projet », parcours
  jawabot.ts  questions de la fiche d'étude par profil (données pures)
  dossiers.ts contenu des pages profil : titre, sommaire, rubriques A → D
  proofs.ts, faq.ts, aides.ts, navigation.ts, site.ts, tracking.ts, local-pages.ts
  validation.ts  système pending_validation / [À CONFIRMER AVEC FARID]
lib/
  analytics.ts   track() unique → dataLayer (GTM), gtag (GA4), fbq (Meta), event_id
  utm.ts         capture UTM / gclid / fbclid, session + first-touch
  lead.ts        modèle de lead, validation, résumé Farid, message WhatsApp
  scoring.ts     score 0-100 → chaud / tiède / froid
  consent.ts     consentement cookies (CNIL)
  schema.ts      données structurées schema.org
  jawabot/engine.ts   moteur de la fiche (reducer pur : réponses, retour à une rubrique, envoi)
  jawabot/adapter.ts  point d'extension backend (Knowledge Base / IA en V2)
  server/integrations.ts  webhooks CRM + alerte WhatsApp + Meta Conversions API
```

### Parcours de conversion

- **Accueil + une page par profil** (`/particuliers`, `/professionnels`, `/collectivites`) : chaque page ouvre sur la fiche d'étude du profil, puis le dossier d'étude (sommaire en 5 étapes + rubriques « Ce que nous étudions / Ce que vous préparez / Qui vous rappelle / Ce que vous recevez »), la FAQ du profil et le rappel. Bouton principal et barre mobile reprennent le libellé du profil.
- **Fiche d'étude** (`components/etude/StudySheet.tsx`) : formulaire par étapes intégré à la page (pas de fenêtre, pas de chat). Chaque rubrique se remplit en place, « Modifier » revient à une rubrique, progression « n/N », consentement explicite → `/api/lead` → fiche « Transmise » proposant **ensuite** WhatsApp (message pré-rempli avec la référence du lead) ou l'appel. Questions pilotées par `config/jawabot.ts`.
- **Formulaire express** « Vous préférez être rappelé ? » en version courte (profil, nom, téléphone, moment, consentement, anti-spam). Si la fiche d'étude a été commencée, le profil et ses réponses (code postal, projet…) sont repris et joints à la demande.
- Paramètre de campagne `?profil=particulier|professionnel|collectivite` : présélectionne le profil dans la fiche de l’accueil (utile pour des annonces Meta ciblées).

### Leads → CRM → WhatsApp Farid

`POST /api/lead` valide (téléphone FR normalisé en +33, code postal, consentement), calcule le score,
construit le résumé pour Farid puis envoie en parallèle :

1. `CRM_WEBHOOK_URL` : `{ type: "hdf_lead", pipelineStage: "nouveau", lead }` — lead complet avec UTM, first-touch, consentement horodaté, `event_id`.
2. `LEAD_NOTIFY_WEBHOOK_URL` : `{ text, leadId, temperature, lead }` — `text` est le message court prêt à envoyer à Farid (format UI Kit : besoin, score, contact, source, action).
3. Meta Conversions API (si `META_CAPI_TOKEN` et consentement publicité) : événement `Lead` dédupliqué avec le Pixel via `event_id`.

Signature optionnelle : en-tête `X-HDF-Signature = sha256(LEAD_WEBHOOK_SECRET + corps)`.
Sans connecteur : accepté et journalisé en préproduction ; **refusé (503) en production** pour ne jamais perdre un lead en silence.

### Analytics

Un seul point d'entrée : `track(event, params)` dans `lib/analytics.ts`. Les composants ne contiennent
aucun appel à gtag/fbq ; les clics téléphone / WhatsApp sont captés par délégation (`data-track`).

| Événement | Déclencheur | Meta |
|---|---|---|
| `view_landing` | chargement | (PageView du Pixel) |
| `select_segment` | choix du profil (fiche de l’accueil) | custom |
| `start_jawabot` | première réponse dans la fiche | custom |
| `jawabot_step` | chaque réponse (`step_id`, `step_index`) | custom |
| `qualified_lead` | fiche d’étude envoyée (+ `generate_lead` GA4) | `Lead` |
| `submit_callback` | formulaire de rappel envoyé (+ `generate_lead`) | `Lead` |
| `click_whatsapp` / `click_phone` | clic sur un lien WhatsApp / tel: | `Contact` |
| `appointment_request` | « Convenir d’un rendez-vous » choisi dans la fiche | `Schedule` |

Chaque événement porte les paramètres UTM de la session. Consent Mode v2 (tout refusé par défaut) ;
GTM / GA4 / Pixel ne sont chargés qu'après accord.

---

## Variables d'environnement

Voir `.env.example`.

| Variable | Côté | Obligatoire en prod | Rôle |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | **oui** | URL canonique (sans `/` final) |
| `NEXT_PUBLIC_SITE_ENV` | public | **oui** = `production` | Masque les placeholders, autorise l'indexation, exige un connecteur de lead |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | public | recommandé | Numéro WhatsApp (ex. `33601451110`) |
| `NEXT_PUBLIC_GTM_ID` | public | — | Google Tag Manager (`GTM-XXXX`) |
| `NEXT_PUBLIC_GA4_ID` | public | — | GA4 direct si pas de GTM (`G-XXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | public | — | Meta Pixel |
| `NEXT_PUBLIC_GSC_VERIFICATION` | public | — | Balise Google Search Console |
| `NEXT_PUBLIC_ANALYTICS_DEBUG` | public | — | `true` : journalise les événements en console |
| `CRM_WEBHOOK_URL` | serveur | **oui** (ou le suivant) | Webhook CRM |
| `LEAD_NOTIFY_WEBHOOK_URL` | serveur | **oui** (ou le précédent) | Alerte WhatsApp Farid |
| `LEAD_WEBHOOK_SECRET` | serveur | recommandé | Signature des webhooks |
| `META_PIXEL_ID`, `META_CAPI_TOKEN` | serveur | — | Meta Conversions API |
| `META_CAPI_TEST_CODE` | serveur | — | Code de test Meta (vide en prod) |

Les variables `NEXT_PUBLIC_*` sont figées au build : relancer un build après modification.

---

## Déploiement

### Vercel (recommandé)

1. Importer le repository `HDF_Bati` dans Vercel (framework détecté : Next.js ; aucune configuration de build à modifier).
2. Déclarer les variables d'environnement :
   - **Production** : `NEXT_PUBLIC_SITE_ENV=production`, `NEXT_PUBLIC_SITE_URL=https://<domaine>` + connecteurs.
   - **Preview** : `NEXT_PUBLIC_SITE_ENV=preview` (placeholders visibles, `noindex`).
3. Ajouter le domaine, forcer HTTPS, rediriger `www` ↔ apex selon le choix retenu.
4. Déployer, puis dérouler la checklist ci-dessous.

### Autre hébergeur Node

```bash
npm ci && npm run build
NODE_ENV=production PORT=3000 npm start
```

Derrière un reverse proxy (Nginx / Caddy) avec HTTPS. La route `/api/lead` nécessite un runtime Node
(pas d'export statique). La limitation anti-abus de l'API est en mémoire par instance : suffisante pour
une landing ; utiliser un store partagé si plusieurs instances.

---

## Checklist avant production

**Contenu & conformité**
- [ ] Tous les points bloquants de `HDF_CONTENT_TO_VALIDATE.md` (§1) traités ; `npm run check:content` relu.
- [ ] Master logo corrigé validé par Farid ; assets print / réseaux remplacés.
- [ ] Relecture juridique : mentions légales, confidentialité, bloc Aides, FAQ, texte de consentement.
- [ ] Aucune qualification (RGE…), assurance, avis ou chiffre affiché sans preuve.
- [ ] Aucune photo n’est publiée tant que de vraies photos de chantier ne sont pas fournies (les visuels IA ont été retirés).

**Configuration**
- [ ] `NEXT_PUBLIC_SITE_ENV=production` et `NEXT_PUBLIC_SITE_URL` renseignés, build relancé.
- [ ] Aucun badge « [À CONFIRMER AVEC FARID] » ni « Visuel provisoire (plus utilisé) » visible en production.
- [ ] `robots.txt` autorise l'indexation, `sitemap.xml` pointe vers le bon domaine.
- [ ] Connecteur CRM et alerte WhatsApp testés de bout en bout (fiche d’étude **et** formulaire de rappel) : lead reçu, résumé lisible, score, UTM présents.
- [ ] Numéro WhatsApp correct (message pré-rempli reçu avec la référence du lead).

**Mesure**
- [ ] GTM / GA4 : événements visibles en DebugView ; `generate_lead` marqué comme conversion.
- [ ] Meta Pixel + CAPI : `Lead` dédupliqué (même `event_id`) dans le Gestionnaire d'événements.
- [ ] Bannière cookies : refuser = aucun traceur chargé (vérifier l'onglet Réseau).
- [ ] Search Console : propriété validée, sitemap soumis.
- [ ] Fiche Google Business : même NAP que le site (nom, adresse, téléphone), lien vers le site.
- [ ] Test d'une annonce avec `?utm_source=facebook&utm_medium=paid&utm_campaign=...` → UTM présents dans le lead CRM.

**Qualité**
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` sans erreur.
- [ ] `npm run qa:screens` : 0 problème sur 4 pages × 6 largeurs, fiche d’étude et rappel OK.
- [ ] Lighthouse mobile (Performance, Accessibilité, SEO, Bonnes pratiques) sur l'URL de production.
- [ ] Test réel sur iPhone et Android (Safari / Chrome) : barre d'action, fiche d’étude au clavier virtuel, appel.
