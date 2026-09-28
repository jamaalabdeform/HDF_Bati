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
| 1 | **Nom de domaine** | `config/site.ts` → `siteDomain`, variable `NEXT_PUBLIC_SITE_URL` | Réserver / confirmer le domaine (ex. hdf-bati.fr). Indispensable pour canonical, sitemap, OpenGraph. **Décision du 28/09/2026 : l'adresse HDF.bati@gmail.com reste affichée jusqu'à l'achat du domaine** ; ensuite, créer une adresse sur le domaine (ex. contact@…) et la reporter dans `config/company.ts` → `email`. |
| 2 | **Connecteur de leads** | `.env` → `CRM_WEBHOOK_URL` et/ou `LEAD_NOTIFY_WEBHOOK_URL` | Choisir le CRM et l'outil d'alerte WhatsApp (Make, n8n, WhatsApp Cloud API…). **En production sans connecteur, l'API refuse le lead (503) pour ne jamais le perdre silencieusement.** |
| 3 | **Numéro WhatsApp Business** | `config/company.ts` → `whatsapp.number` / `NEXT_PUBLIC_WHATSAPP_NUMBER` | Confirmer le numéro qui reçoit les prospects (Farid + associé). Brouillon actuel : 06 01 45 11 10. |
| 4 | **Adresse publique** | `config/company.ts` → `address.publicDisplay` | Farid confirme que le siège (209 avenue Anatole France, 59410 Anzin) est l'adresse à afficher sur le site et sur Google. |
| 5 | **Mentions légales** | `app/mentions-legales/page.tsx`, `config/company.ts` → `legal` | Directeur de la publication ; hébergeur (raison sociale, adresse, téléphone) ; n° TVA (brouillon FR63 925387680, à vérifier sur document fiscal). Relecture juridique. |
| 6 | **Politique de confidentialité** | `app/confidentialite/page.tsx` | Durées de conservation, liste des sous-traitants (hébergeur, CRM, WhatsApp), localisation des données. Relecture juridique. |
| 7 | **Bloc « Aides »** | `config/aides.ts`, `config/faq.ts` (items `legalReview`) | Relecture juridique des formulations (réglementation rénovation énergétique / DGCCRF). Aucune promesse « 1 € », « 100 % financé », « gratuit » n'est présente — à conserver ainsi. |
| 8 | **Conformité démarchage** | `lib/lead.ts` → `CONSENT_TEXT` | Valider le texte de consentement et le mécanisme de reprise de contact (inbound uniquement, consentement horodaté et rattaché au lead). |

## 2. Réassurance — à fournir par Farid (masqué en production tant que non confirmé)

| # | Sujet | Où | Détail |
|---|-------|----|--------|
| 9 | **Qualifications / RGE** | `config/proofs.ts` → `qualifications` | Farid indique que les travaux sont réalisés par une **société partenaire** qualifiée RGE (QualiPAC, QualiPV, Qualisol, Qualibois). Il faut : nom du partenaire, certificats, périmètres, dates de validité et **wording validé juridiquement**. HDF Bâti ne doit **pas** être présentée comme titulaire de ces qualifications. |
| 10 | **Assurances** | `config/proofs.ts` → `assurance` | Décennale / RC Pro : assureur, activités couvertes (PAC, PV), attestation. |
| 11 | **Avis Google** | `config/company.ts` → `googleBusiness` ; `config/proofs.ts` → `avis` | 14 avis déclarés au 27/09/2026, **note non communiquée**. Fournir le lien public de la fiche ; n'afficher qu'une donnée vérifiable (idéalement via lien/widget). Aucun `aggregateRating` n'est déclaré en schema.org. |
| 12 | **Chantiers réalisés** | `config/proofs.ts` → `chantiers` ; `config/media.ts` | 4 à 5 vrais chantiers : photos avant/pendant/après, commune, équipement, accord client. |
| 13 | **Garanties / SAV** | `config/proofs.ts` → `garanties` | Garanties matériel / main-d'œuvre, organisation du SAV. |
| 14 | **Marques posées** | `config/proofs.ts` → `marques` | Marques / gammes de PAC et de panneaux. |
| 15 | **Horaires & délai de rappel** | `config/company.ts` → `openingHours`, `responseTime` | Farid indique rappeler « dans la minute » un prospect chaud : définir une promesse publique tenable (ex. « sous 24 h ouvrées »). |
| 16 | **Coordonnées GPS** | `config/company.ts` → `geo` | Latitude / longitude de la fiche Google Business (schema.org `geo`). |
| 17 | **Réseaux sociaux** | `config/company.ts` → `social` | URLs Facebook, Instagram, LinkedIn (les liens n'apparaissent qu'une fois renseignés). |

## 2 bis. Positionnement (PRODUCT.md) — formulations prudentes en ligne

| # | Sujet | Où | Détail |
|---|-------|----|--------|
| 17a | **Réactivité** | `config/positioning.ts` → `reactivite.precise` | Affiché aujourd'hui : « Un conseiller vous rappelle rapidement » / « Pas de centre d'appels ». À fournir : délai public tenable (Farid : « dans la minute » pour un prospect chaud) et horaires. |
| 17b | **Aides gérées en direct** | `config/positioning.ts` → `aides.precise`, `config/aides.ts` | Affiché aujourd'hui : « Nous nous occupons des démarches d'aides avec vous », « Selon conditions d'éligibilité ». À valider juridiquement : mécanisme exact (HDF Bâti perçoit l'aide et règle le sous-traitant), ce que le client n'a pas à faire ou à avancer. |

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
| 19c | **Pièces à préparer (pro / collectivité)** | `dossiers.professionnel/collectivite.preparez.precise` | Non communiqué : factures, contrats, historiques ? (masqué en production). |
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
| 22 | **Locataires** | `config/jawabot.ts` → `statut` | Farid indique avoir désormais « accès au locataire » : préciser ce qui est proposé aux locataires. |
| 23 | **Appartements** | `config/jawabot.ts`, `config/faq.ts` | Message actuel : « Nos projets de pompe à chaleur concernent aujourd'hui les maisons individuelles ». À confirmer. |
| 24 | **Courtage** | `config/faq.ts` | Mode de rémunération (commission fournisseur) : vérifier l'obligation d'information du client et le wording. |

## 6. Marketing & mesure

| # | Sujet | Où | Détail |
|---|-------|----|--------|
| 25 | **Identifiants de mesure** | `.env` | GTM, GA4, Meta Pixel, Search Console, Meta CAPI (token). |
| 26 | **Budget média** | — | Inconnu au 27/09/2026 (questionnaire). |
| 27 | **Pages locales** | `config/local-pages.ts` | Structure prête (`/interventions/[ville]`), aucune page publiée : ne publier qu'avec de vrais chantiers locaux. |
