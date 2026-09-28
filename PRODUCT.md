# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Trois profils, **à poids égal** sur la landing (confirmé le 28/09/2026) :

- **Particuliers** : propriétaires (et désormais locataires, selon Farid) d'une **maison individuelle**, principalement dans les Hauts-de-France, qui envisagent une pompe à chaleur, du photovoltaïque ou une rénovation énergétique. Beaucoup arrivent d'une publicité Meta, sur smartphone, sans connaître HDF Bâti.
- **Professionnels** : dirigeants ou responsables (technique, administratif) d'entreprises, commerces, bâtiments tertiaires, agricoles ; besoins de PAC, photovoltaïque, performance du bâtiment ou contrats d'énergie.
- **Collectivités** : communes, intercommunalités, établissements publics, bailleurs ; principalement pour l'optimisation des contrats d'énergie (courtage).

Job commun : comprendre en quelques secondes si HDF Bâti peut les aider, puis être recontacté par une personne qui connaît déjà leur situation.

## Product Purpose

Landing page d'acquisition de HDF Bâti (SAS, Anzin, Nord). Elle transforme le trafic (Meta Ads, Google Ads, SEO local, Google Business, réseaux sociaux) en demandes qualifiées : visiteur → page du profil → fiche d’étude par étapes (pré-qualification) ou demande de rappel → lead scoré → CRM → WhatsApp de Farid → rendez-vous → devis → vente.

Succès : doubler la production (objectif Farid : 20 chantiers / mois minimum à 6 mois) et pouvoir relier chaque vente à la source qui l'a générée.

## Positioning

Ce que HDF Bâti peut affirmer et qu'un concurrent générique ne peut pas copier honnêtement (confirmé par Farid le 28/09/2026) :

- **Réactivité** : un prospect chaud est rappelé très vite (Farid indique « dans la minute »). Le délai affiché publiquement reste à formaliser en promesse tenable.
- **Aides gérées en direct** : Farid : « C'est direct. Farid est payé par l'État et règle le sous-traitant avec qui ils ont un compte à l'année. » Ce que cela change concrètement pour le client (démarches, avance de frais) reste à préciser avec Farid. Formulation publique **à valider juridiquement** avant diffusion (aucun « 1 € », « 100 % financé » ou aide garantie).

Également vrai mais non retenu comme différenciant principal : Farid (directeur général) comme interlocuteur, ancrage local à Anzin.

## Operating Context

- Farid Medjahed (DG) et son associé reçoivent les leads sur **WhatsApp** ; c'est leur poste de travail principal.
- Avant d'accepter une visite, Farid doit savoir : chauffage au gaz ou non, maison (pas d'appartement pour la PAC), adresse, éligibilité (avis d'imposition envoyé par e-mail).
- Pose réalisée par une société partenaire qualifiée RGE (QualiPAC, QualiPV, Qualisol, Qualibois) ; HDF Bâti n'est pas elle-même titulaire de ces qualifications.
- Prospection : inbound uniquement (réglementation stricte du démarchage en rénovation énergétique) ; consentement horodaté rattaché au lead.
- Sources actuelles : bouche-à-oreille, flyers, panneaux de chantier. Pas de site avant celui-ci.

## Capabilities and Constraints

- Offres : pompe à chaleur, photovoltaïque, rénovation énergétique (particuliers, pros, collectivités) ; courtage en énergie (pros, collectivités).
- Zone : Hauts-de-France, et partout en France selon le projet.
- Stack existante : Next.js 16, TypeScript, Tailwind CSS 4 (voir README).
- Fiche d’étude (moteur « Jawabot ») : qualification déterministe configurable (`config/jawabot.ts`), scoring provisoire (`lib/scoring.ts`), à relire avec Farid.
- Mesure : GA4 / GTM / Meta Pixel / CAPI après consentement ; UTM rattachés au lead.
- Décisions ouvertes : budget média, délai de rappel public, horaires, numéro WhatsApp définitif, domaine, CRM, wording aides et RGE, offre pour les locataires.

## Brand Commitments

- Nom : **HDF BÂTI** (jamais « HDF BÂT I »). Logo : uniquement les SVG corrigés de `public/brand/`.
- Signature : « Votre expert en rénovation énergétique ».
- Charte : Brand Book V6 (vert HDF #0B7A3B, vert énergie #79C51D, vert profond #083D2E, bleu confiance #073B63, orange action #E47A17 réservé aux CTA, police Inter). Badges d'activité : Habitat, Pro, Énergie, Collectivités.
- Ton (confirmé) : **vouvoiement, simple et direct** ; rassurant, compétent, concret, transparent. À dire : « Étudions votre projet », « Nous vous expliquons les étapes avant de vous engager ». À éviter : « 100 % financé », « gratuit », superlatifs, promesses d'économies garanties.
- Le site ne doit jamais « faire IA » (rédhibitoire pour le client).

## Evidence on Hand

- Fiche légale vérifiée (SIREN 925 387 680, RCS Valenciennes, siège 209 avenue Anatole France, 59410 Anzin).
- 14 avis Google déclarés (note non communiquée) — ne rien afficher sans lien vérifiable.
- **Aucune** photo réelle de chantier, aucun témoignage, aucun cas client, aucun chiffre de résultats à ce jour. Les visuels IA provisoires ont été retirés du site (28/09/2026) : aucune photo tant que de vraies photos de chantier ne sont pas fournies. Ne jamais fabriquer d'avis, de chiffres, de certifications ou de clients.
- Liste des contenus à obtenir : `HDF_CONTENT_TO_VALIDATE.md`.

## Product Principles

1. **Étudier avant de proposer** : la page promet une analyse, jamais un résultat.
2. **Un parcours par profil** : particulier, professionnel et collectivité ne sont jamais mélangés dans un même formulaire ou message.
3. **Qualifier pour Farid** : chaque interaction doit produire un lead exploitable sur WhatsApp, pas une conversation sans fin.
4. **Prouver avant de promettre** : toute preuve affichée est vérifiable ; ce qui n'est pas confirmé reste masqué en production.
5. **Mobile d'abord** : le visiteur Meta sur smartphone doit comprendre et agir en moins de 5 secondes.

## Accessibility & Inclusion

WCAG 2.2 AA visé : contrastes, navigation clavier, libellés de formulaires, cibles tactiles ≥ 44 px, `prefers-reduced-motion` respecté.
