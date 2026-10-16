# HDF Bâti — contenus à valider avant mise en production

> **Principe : rien n'est inventé.** Toute information non confirmée est déclarée dans le code avec
> `status: "pending_validation"` (fonction `pending()` de `config/validation.ts`) ou le marqueur
> `TODO_HDF_VALIDATION`. Elle s'affiche en préproduction sous la forme **[À CONFIRMER AVEC FARID]**
> et elle est **automatiquement masquée** quand `NEXT_PUBLIC_SITE_ENV=production`.
>
> Liste à jour générée depuis le code : `npm run check:content`

Sources déjà exploitées : Document maître V1, Questionnaire Farid V3 prérempli (RDV du 27/09/2026),
Brand Book V6, UI Kit Site & Jawabot V2, Logo Master FINAL, fiche légale publique.

---

## 1. Bloquant pour la mise en ligne

| # | Sujet | Où dans le code | Question / action |
|---|-------|-----------------|-------------------|
| 1 | **Nom de domaine** — ✅ hdf-bati.fr | `config/site.ts` → `siteDomain`, `NEXT_PUBLIC_SITE_URL` | Site en ligne sur https://www.hdf-bati.fr/. À vérifier chez l'hébergeur : `NEXT_PUBLIC_SITE_URL=https://www.hdf-bati.fr`, `NEXT_PUBLIC_SITE_ENV=production`, redirection de hdf-bati.fr vers www. Adresse e-mail sur le domaine (ex. contact@hdf-bati.fr) à créer, puis à reporter dans `config/company.ts` → `email`. |
| 2 | **Connecteur de leads** | `.env` → `WHATSAPP_*` (alerte directe) et/ou `CRM_WEBHOOK_URL` / `LEAD_NOTIFY_WEBHOOK_URL` | **Aujourd'hui aucun n'est renseigné : Farid ne reçoit rien.** Alerte WhatsApp directe prête dans le code (API officielle Meta) : suivre README § « Leads → WhatsApp de Farid » (numéro expéditeur dédié, jeton permanent, modèle `nouveau_lead_hdf`). En attendant : **relais WhatsApp par le visiteur** — la fiche se termine par un bouton qui envoie la demande rédigée au WhatsApp de HDF Bâti (le visiteur doit appuyer sur « Envoyer » dans WhatsApp). |
| 3 | **Numéro WhatsApp Business** — ✅ confirmé | `config/company.ts` → `whatsapp.number` | Farid, 15/10/2026 : **06 01 45 11 10** reçoit les demandes. Reste la configuration Meta pour l'envoi automatique (point 2). |
| 4 | **Adresse publique** — ✅ confirmé | `config/company.ts` → `address.publicDisplay` | Farid, 15/10/2026 : 209 avenue Anatole France, 59410 Anzin, affichée sur le site. |
| 5 | **Mentions légales** | `app/mentions-legales/page.tsx`, `config/company.ts` → `legal` | Directeur de la publication ; hébergeur (raison sociale, adresse, téléphone) ; n° TVA (brouillon FR63 925387680, à vérifier sur document fiscal). Relecture juridique. |
| 6 | **Politique de confidentialité** | `app/confidentialite/page.tsx` | Durées de conservation, liste des sous-traitants (hébergeur, CRM, WhatsApp), localisation des données. Relecture juridique. |
| 7 | **Bloc « Aides »** | `config/aides.ts`, `config/faq.ts` (items `legalReview`) | Relecture juridique des formulations (réglementation rénovation énergétique / DGCCRF). Aucune promesse « 1 € », « 100 % financé », « gratuit » n'est présente — à conserver ainsi. |
| 8 | **Conformité démarchage** | `lib/lead.ts` → `CONSENT_TEXT` | Valider le texte de consentement et le mécanisme de reprise de contact (inbound uniquement, consentement horodaté et rattaché au lead). |

## 2. Réassurance — à fournir par Farid (masqué en production tant que non confirmé)

| # | Sujet | Où | Détail |
|---|-------|----|--------|
| 9 | **Qualifications / RGE** — ✅ décision du 16/10/2026 | `config/proofs.ts` → `qualifications` | Affiché sans nom ni certificat : « Les installations sont réalisées par une entreprise partenaire qualifiée RGE… ». HDF Bâti n'est pas présentée comme titulaire. **À faire relire (point 7)** : mention RGE d'un partenaire non nommé. |
| 10 | **Assurances** — décision du 16/10/2026 : non publiée | — | Aucune attestation sur le site. L'assureur décennal reste obligatoire sur les devis et factures. |
| 11 | **Avis Google** — lien ✅, avis en attente de clé | `config/company.ts` → `googleBusiness.url` ; `.env` → `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | Lien de la fiche fourni le 15/10/2026 (https://maps.app.goo.gl/xBE36dihMVkMGd6NA) : le site affiche « Voir nos avis sur Google ». Pour afficher la note et 5 avis : créer la clé API Places (New) et renseigner le Place ID (README § Avis Google). |
| 12 | **Chantiers réalisés** | `config/proofs.ts` → `chantiers` ; `config/media.ts` | 4 à 5 vrais chantiers : photos avant/pendant/après, commune, équipement, accord client. |
| 13 | **Garanties / SAV** — ✅ décision du 16/10/2026 | `config/proofs.ts` → `garanties` | Garanties légales génériques (parfait achèvement 1 an, bon fonctionnement 2 ans, décennale 10 ans, selon l'installation), garantie constructeur précisée au devis, interlocuteur pour le suivi. Aucune durée commerciale inventée. |
| 14 | **Marques posées** — décision du 16/10/2026 : non affichées | — | Farid : « ça dépend de plein de choses ». Aucune marque sur le site ; la garantie constructeur renvoie au devis. |
| 15 | **Horaires** — ✅ confirmé | `config/company.ts` → `openingHours` | Farid, 15/10/2026 : réponse dans l'heure **7 jours sur 7, soir et week-end compris**. |
| 16 | **Coordonnées GPS** | `config/company.ts` → `geo` | Latitude / longitude de la fiche Google Business (schema.org `geo`). |
| 17 | **Réseaux sociaux** | `config/company.ts` → `social` | URLs Facebook, Instagram, LinkedIn (les liens n'apparaissent qu'une fois renseignés). |

## 2 bis. Positionnement (PRODUCT.md) — formulations prudentes en ligne

| # | Sujet | Où | Détail |
|---|-------|----|--------|
| 17a | **Réactivité** — ✅ confirmé | `config/positioning.ts` → `reactivite` | Farid, 06/10/2026 : « Réponse dans l'heure ». Affiché : « Une réponse dans l'heure », par l'équipe HDF Bâti elle-même. |
| 17b | **Aides gérées en direct** — ✅ confirmé, relecture juridique restante | `config/positioning.ts` → `aides`, `config/aides.ts`, `config/dossiers.ts` | Farid, 06/10/2026 : « Aucune avance de frais », « Accompagnement complet dans les démarches ». Affiché avec « Selon conditions d'éligibilité ». **À faire relire (point 7)** : la mention « sans avance de frais » est une promesse commerciale encadrée en rénovation énergétique. |
| 17c | **Étude** — ✅ confirmé | `config/dossiers.ts` → particulier | Farid, 06/10/2026 : « Étude complète sur le dimensionnement de la maison et le choix du matériel installé ». Affiché dans « Ce que nous étudions » et « Ce que vous recevez » (page Particuliers). Applicable aussi aux pros / collectivités ? |

## 3. Visuels

| # | Sujet | Où | Détail |
|---|-------|----|--------|
| 18 | **Photos de chantier** | — | Les visuels provisoires extraits des vidéos IA ont été **retirés** (refonte « fiche d'étude », 28/09/2026) : le site n'affiche aucune photo. Fournir 4 à 5 vraies photos HDF (avec accord client) pour les pages profil. |
| 19 | **Vidéos publicitaires** | — | La fin de la vidéo « Commercial_for_energy_advisory_firm » affiche un **faux numéro (079 61 58 41 69), une fausse adresse e-mail et un texte déformé** ; les polos portent un logo « HDF » inventé. Ne pas diffuser ces vidéos telles quelles en Meta Ads. |

## 3 bis. Pages profil — « Après votre demande » (`config/dossiers.ts`)

Rubriques affichées d'après le questionnaire de Farid (RDV du 27/09/2026) — **à relire par Farid avant la mise en ligne** :

| # | Sujet | Où | Détail |
|---|-------|----|--------|
| 19a | **Qui rappelle** | `dossiers.*.rappel` | « Un responsable de HDF Bâti reprend lui-même votre fiche : pas de centre d'appels. » (Farid ou son associé rappellent eux-mêmes ; Farid n'est pas nommé sur le site.) |
| 19b | **Pièces à préparer (particulier)** | `dossiers.particulier.preparez` | Adresse, mode de chauffage, **dernier avis d'imposition envoyé par e-mail** pour vérifier l'éligibilité aux aides. |
| 19c | **Pièces à préparer (pro / collectivité)** — ✅ | `dossiers.professionnel/collectivite.preparez` | Farid, 16/10/2026 : **factures d'électricité**, pour les professionnels comme pour les collectivités. |
| 19d | **Ce que reçoit le client** | `dossiers.*.recevez` | Formulations prudentes (réponse sur la faisabilité, proposition après étude, pas d'économie chiffrée avant l'étude). |

## 4. Logo — correction effectuée, à valider

Le master livré (`HDF_Bati_Logo_Master_FINAL.zip`) compose le mot en deux textes séparés
(« HDF BÂT » + « I » placé à x=686), ce qui produit **« HDF BÂT I »** sur tous les PNG livrés
(logo principal, carte de visite, visuels Instagram, avatar).

Correction appliquée (`scripts/build-logo.py`, fichiers `public/brand/*.svg`) :
- pictogramme maison, grande feuille, couleurs, police DejaVu Sans Bold, corps et approche : **identiques au master** ;
- « HDF BÂTI » composé en **un seul mot** (écart T→I : 6,7 px au lieu de 46 px) ;
- petite feuille **ancrée sur le fût du I** avec le décalage relatif du master ;
- signature « VOTRE EXPERT EN RÉNOVATION ÉNERGÉTIQUE » **entière** ;
- texte vectorisé : aucune dépendance à une police installée.

**Action :** faire valider ce master corrigé par Farid / le graphiste, puis remplacer les assets
print et réseaux sociaux (carte de visite, avatars, templates) qui portent encore « BÂT I ».

## 5. Fiche d’étude (Jawabot) & scoring

| # | Sujet | Où | Détail |
|---|-------|----|--------|
| 20 | **Arbre de questions** | `config/jawabot.ts` | Relire avec Farid : questions des 3 premières minutes d'appel (PAC, PV, B2B), vouvoiement, ton. |
| 21 | **Règles de scoring** | `lib/scoring.ts` | Pondérations provisoires basées sur les critères cités par Farid (maison, chauffage gaz, zone, délai, propriétaire). Seuils : chaud ≥ 70, tiède ≥ 45. À recalibrer sur les ventes réelles. |
| 22 | **Locataires** — ✅ | `config/jawabot.ts` → `statut`, `lib/scoring.ts` | Farid, 16/10/2026 : pompe à chaleur possible pour les locataires. Message affiché dans la fiche ; +5 au score. |
| 23 | **Appartements** | `config/jawabot.ts`, `config/faq.ts` | Message actuel : « Nos projets de pompe à chaleur concernent aujourd'hui les maisons individuelles ». À confirmer. |
| 24 | **Courtage** | `config/faq.ts` | Mode de rémunération (commission fournisseur) : vérifier l'obligation d'information du client et le wording. |

## 6. Marketing & mesure

| # | Sujet | Où | Détail |
|---|-------|----|--------|
| 25 | **Identifiants de mesure** | `.env` | GTM, GA4, Meta Pixel, Search Console, Meta CAPI (token). |
| 26 | **Budget média** | — | Inconnu au 27/09/2026 (questionnaire). |
| 27 | **Pages locales** | `config/local-pages.ts` | Structure prête (`/interventions/[ville]`), aucune page publiée : ne publier qu'avec de vrais chantiers locaux. |
