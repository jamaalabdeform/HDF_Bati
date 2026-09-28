---
name: HDF Bâti
description: Votre expert en rénovation énergétique. On étudie avant de proposer.
colors:
  hdf: "#0b7a3b"
  hdf-dark: "#096a33"
  energy: "#79c51d"
  deep: "#083d2e"
  navy: "#073b63"
  action: "#e47a17"
  action-hover: "#ec8b30"
  surface: "#f2f7f4"
  line: "#dce7df"
  ink: "#192d27"
  muted: "#4c5f58"
  paper: "#ffffff"
  error: "#b42318"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    fontSize: "clamp(2.45rem, 5vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.85rem, 4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "\"cv11\", \"ss01\""
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
  rubric-number:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.25
    fontFeature: "\"tnum\""
  stamp:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.06em"
rounded:
  hairline: "1px"
  mark: "3px"
  card: "6px"
spacing:
  gutter-mobile: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
  sheet-x-mobile: "16px"
  sheet-x: "24px"
  section-y-mobile: "56px"
  section-y: "80px"
  column-gap: "64px"
  page-max: "76rem"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.ink}"
  button-sheet-green:
    backgroundColor: "{colors.hdf}"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "0 16px"
    height: "48px"
  button-sheet-green-hover:
    backgroundColor: "{colors.hdf-dark}"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep}"
    rounded: "{rounded.card}"
    padding: "0 16px"
    height: "48px"
  study-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px 24px"
  sheet-tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    height: "44px"
  sheet-tab-inactive:
    textColor: "{colors.paper}"
  choice-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.deep}"
    rounded: "{rounded.card}"
    padding: "8px 12px"
    height: "48px"
  choice-option-hover:
    backgroundColor: "{colors.surface}"
  status-stamp:
    textColor: "{colors.hdf}"
    typography: "{typography.stamp}"
    rounded: "{rounded.mark}"
    padding: "2px 8px"
  status-stamp-sent:
    backgroundColor: "{colors.hdf}"
    textColor: "{colors.paper}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "0 14px"
    height: "48px"
---

# Design System: HDF Bâti

## Overview

**Creative North Star: "La Fiche d'étude"**

Chaque page est le dossier d'étude lui-même. Un champ vert profond occupe le haut de la page, et une feuille blanche y est posée : filets de 1px, pointillés de remplissage, rubriques numérotées en chiffres tabulaires, cases carrées, tampon de statut. Le visiteur remplit la fiche rubrique par rubrique et la voit se compléter sous ses yeux. Tout le système découle de la promesse « on étudie avant de proposer » : on présente une analyse, pas un résultat.

La densité est celle d'un formulaire administratif bien tenu : sobre, lisible, rangé. On ne décore pas : pas de photo, pas de carte « bénéfice » à icône, pas de bulle de chat. La profondeur vient du contraste entre le champ vert profond et la feuille blanche, jamais d'un empilement d'ombres. L'orange n'apparaît que là où l'on agit.

Sous le champ, la page alterne blanc et `surface` (vert très pâle), en colonnes de texte réglées par des filets `line`. Le site ne doit jamais « faire IA » : pas de dégradé, pas de verre dépoli, pas d'illustration générée.

**Key Characteristics:**
- Champ `deep` en tête de chaque page, feuille blanche posée dessus avec `shadow-sheet`.
- Rubriques numérotées 01, 02… en chiffres tabulaires `hdf`, séparées par des filets `line`.
- Pointillés (`border-dotted`, `deep` à 25–35 %) comme lignes de remplissage entre libellé et réponse.
- Coins presque carrés : 6px pour feuille, boutons et champs ; 3px pour cases et tampon.
- Orange `action` réservé aux boutons d'action ; tout le reste vit dans les verts.
- Inter seule, en gras pour les titres, crénage resserré.

## Colors

Une palette de verts institutionnels, un bleu de confiance pour l'information, et un orange unique qui signifie « agir ».

### Primary
- **Vert HDF** (`hdf`) : couleur de la marque dans la feuille. Numéros de rubrique, segments de progression remplis, tampon « Transmise », bordure au survol et au focus des champs, bouton WhatsApp après envoi. `hdf-dark` est son état survol.
- **Vert profond** (`deep`) : le champ qui porte la feuille (héros, bloc de rappel, pied de page), la couleur des titres (H2, H3) sur fond clair, et la base des bordures translucides (`deep` à 20 % pour les champs et les choix, 25–35 % pour les pointillés).

### Secondary
- **Orange action** (`action`) : fond de tous les boutons d'appel à l'action, avec texte `ink` (contraste AA). `action-hover` au survol. Rien d'autre n'est orange.
- **Vert énergie** (`energy`) : accent sur fond profond uniquement. Seconde ligne du H1 d'accueil, icônes du pied de page et du bloc de rappel, barre verticale de la rubrique active, segment de progression en cours, anneau de focus dans `.on-deep`. Jamais comme texte sur blanc.

### Tertiary
- **Bleu confiance** (`navy`) : l'information et l'accessibilité. Anneau de focus sur fond clair, notes explicatives sous une rubrique, liens et icône d'information de la section Aides.

### Neutral
- **Papier** (`paper`) : le fond du corps et de la feuille.
- **Surface** (`surface`) : sections alternées, survol des choix et des liens du menu mobile, choix coché.
- **Filet** (`line`) : séparateurs de rubriques, bordures d'en-tête de feuille, segments de progression vides.
- **Encre** (`ink`) : texte courant et texte des boutons orange.
- **Gris sourd** (`muted`) : textes secondaires, libellés de rubriques à venir, numéros vides (6,5:1 sur blanc).
- **Erreur** (`error`) : messages et bordures des champs invalides ; sur fond profond, le message d'erreur passe en rose pâle (`#ffc9c2`).

### Named Rules
**The Orange-Is-Action Rule.** L'orange `action` sert uniquement de fond aux boutons qui font avancer (envoyer, étudier mon projet, demander un rappel). Jamais en texte, en icône, en bordure ou en anneau de focus.

**The Energy-On-Deep Rule.** Le vert énergie ne s'emploie que sur le champ `deep` ou comme marque d'état dans la feuille (barre active, segment en cours). Jamais comme couleur de texte sur blanc.

## Typography

**Display Font:** Inter (fichier local variable, repli ui-sans-serif, system-ui, Segoe UI, Roboto, Arial)
**Body Font:** Inter
**Label/Mono Font:** Inter en chiffres tabulaires (classe `tabular`) pour numéros de rubrique, téléphones, références et codes postaux.

**Character:** Une seule famille, travaillée par la graisse et le crénage. Les titres sont gras et serrés, le corps est aéré ; les jeux `cv11` et `ss01` sont actifs partout.

### Hierarchy
- **Display** (700, 2.45rem → 3.6rem, 1.02, -0.035em) : H1 de l'accueil uniquement. Les pages profil utilisent une variante plus petite (2rem → 3rem, 1.08, -0.03em).
- **Headline** (700, 1.85rem → 2.75rem, 1.1) : titres de section H2. Aucun sur-titre au-dessus : le titre porte seul le message.
- **Title** (700, 1.125rem → 1.4rem, 1.375) : question de la rubrique active, titres de rubriques et d'étapes, titre de la feuille (1.25rem → 1.4rem).
- **Body** (400, 0.95rem → 1.125rem, 1.625) : textes d'introduction et de section, limités à 60ch.
- **Label** (600, 0.875rem) : libellés de champs, boutons, onglets, réponses remplies.
- **Stamp** (700, 0.7rem, 0.06em, capitales) : le tampon de statut, seul texte en capitales du système.

### Named Rules
**The Tabular Figures Rule.** Tout chiffre qui se lit comme une donnée de dossier (01–10, 3/10, téléphone, référence, code postal) est en chiffres tabulaires.

**The Balanced Title Rule.** H1–H3 en `text-wrap: balance` et crénage négatif ; paragraphes en `text-wrap: pretty`.

## Layout

Conteneur centré de `page-max` (76rem), gouttières de 16px en mobile, 24px dès `sm`, 32px dès `lg`. Largeurs de texte réduites à 48rem (`text`) ou 36rem (`narrow`).

Le héros place texte à gauche et feuille à droite en grille `minmax(0,1fr) 33rem` à partir de `lg` ; en mobile la feuille suit le texte, et la rubrique active tient dans les 700 premiers pixels. Les sections suivent un rythme vertical fixe : 56px en mobile, 80px dès `sm`. Les grilles à deux colonnes asymétriques (0.8fr / 1.2fr, 0.85fr / 1.15fr) avec 64px d'écart à partir de `lg` sont le modèle par défaut ; les trois dossiers passent en trois colonnes.

À l'intérieur de la feuille, chaque rubrique est une grille `1.75rem 1fr` : le numéro dans la marge, le contenu à droite. Rembourrage horizontal de la feuille : 16px en mobile, 24px dès `sm`. Cibles tactiles d'au moins 44px (`min-h-11`), 48px pour champs, choix et boutons.

En-tête collant de 4.25rem ; le défilement d'ancre compense cette hauteur plus 1rem.

## Elevation & Depth

Le système est plat. La profondeur est tonale : la feuille blanche sur le champ vert profond. Une seule ombre sert à poser la feuille (et le formulaire de rappel, qui est une feuille), une seconde est réservée aux éléments réellement flottants.

### Shadow Vocabulary
- **Feuille posée** (`--shadow-sheet`) : fiche d'étude et formulaire de rappel sur fond `deep`. Liseré clair en haut, ombre longue et douce vers le bas.
- **Flottant** (`--shadow-float`) : panneaux qui flottent au-dessus de la page (bandeau de consentement).

### Named Rules
**The One Sheet Rule.** Seule une feuille posée sur le champ profond reçoit `shadow-sheet`. Les cartes, choix et sections sur fond clair restent plates, séparées par des filets.

## Shapes

Des coins presque carrés, comme du papier coupé. 6px (`rounded-md`, `--radius-card`) pour la feuille, les boutons, les champs, les choix et les onglets (arrondis seulement en haut, `rounded-t-md`). 3px pour les marques : cases à cocher, tampon, carrés numérotés des rubriques. 1px pour les segments de progression et les puces carrées. Pas de pilule, pas de cercle décoratif.

Les lignes font le travail des boîtes : filets pleins de 1px `line` entre les rubriques, pointillés `deep` translucides comme lignes à remplir, bordure basse de 2px pour la saisie de texte dans la feuille.

## Components

### Buttons
Directs et sans ornement ; l'orange signifie qu'on avance.
- **Shape:** coins légers (6px).
- **Primary:** fond `action`, texte `ink`, semi-gras ; tailles sm 44px / md 48px / lg 56px, rembourrage 16 à 28px. Icône flèche en fin de libellé.
- **Hover / Focus:** fond `action-hover`, transition 200ms `ease-out-soft`, léger enfoncement à l'appui (scale 0.98). Focus : contour 3px `navy` décalé de 3px (vert énergie sur champ profond).
- **Vert (après envoi):** fond `hdf`, texte blanc, survol `hdf-dark` : réservé aux suites de la fiche (WhatsApp).
- **Contour:** bordure 1px `deep` à 25 %, texte `deep`, survol bordure et texte `hdf` : action secondaire dans la feuille (appeler). Variante marque : bordure 2px `hdf`, texte `hdf`, survol plein `hdf` texte blanc (WhatsApp dans Contact).

### Cards / Containers
- **Corner Style:** 6px.
- **Background:** blanc sur champ profond ; sur fond clair, pas de carte : des colonnes réglées de filets (seule exception : la feuille du dossier d'étude, bordée, sans ombre).
- **Sections du bas:** pas de gabarit répété ; FAQ empilée à largeur de texte, « Pourquoi » titre au-dessus des colonnes, Contact en bandeau de trois coordonnées.
- **Formulaire de rappel:** version courte dans la même feuille que la fiche (cases carrées, bordure d'erreur sur le groupe), succès en « Demande de rappel » avec tampon « Transmise » et référence.
- **Barre d'action mobile:** fond blanc plein (pas de flou), un seul bouton vers la fiche ; le téléphone reste dans l'en-tête.
- **Shadow Strategy:** voir The One Sheet Rule.
- **Internal Padding:** 16–24px dans la feuille, 20–28px dans le formulaire de rappel.

### Inputs / Fields
- **Style:** hauteur 48px, bordure 1px `deep` à 20 %, fond blanc, coins 6px ; libellé semi-gras `deep` au-dessus, aide en `muted`.
- **Focus:** bordure `hdf` et halo `hdf` à 15 % (4px) ; survol bordure `deep` à 35 %.
- **Error:** bordure et message `error`, message sous le champ avec `role="alert"`.
- **Saisie dans la feuille:** ligne à remplir sans cadre, bordure basse 2px `deep` à 30 %, texte 1.125rem ; code postal en chiffres tabulaires espacés.
- **Cases:** carrées, 20px, coins 3px, cochées en `hdf`.

### Navigation
- Liens `deep` à 85 %, 0.92rem, medium ; survol fond `deep` à 5 %. Page courante en `hdf` soulignée 2px à 8px d'écart. Menu mobile en liste de lignes de 48px, survol `surface`. Téléphone en chiffres tabulaires, bouton orange « Étudier mon projet » à droite.

### Fiche d'étude (signature)
La feuille blanche posée sur le champ profond.
- **En-tête:** « Fiche d'étude » et sous-titre, tampon de statut à droite, filet `line` en dessous.
- **Tampon:** bordure 2px `hdf` à 70 %, texte `hdf`, capitales, droit ; « À compléter » au départ, puis « Transmise » plein `hdf` texte blanc à l'envoi, posé de biais (-2°) par l'animation `stamp-press` (400ms).
- **Progression:** « Étudions votre projet · n/N » puis une rangée de segments de 6px : `hdf` rempli, `energy` en cours, `line` à venir.
- **Rubriques:** remplie = numéro `hdf`, libellé `muted`, pointillé, réponse `deep` en semi-gras et lien « Modifier » ; active = barre verticale `energy` de 4px dans la marge, entrée `rubric-in` (280ms) ; à venir = numéro et libellé `muted` suivis d'un pointillé.
- **Choix:** lignes de 48px, bordure `deep` à 20 %, case carrée 3px ; survol bordure `hdf` et fond `surface`.
- **Onglets:** Particuliers / Professionnels / Collectivités sur le bord haut de la feuille des pages profil, coins hauts 6px ; actif blanc texte `deep`, inactifs blanc à 10 % texte blanc. La fiche de l'accueil n'a pas d'onglets : la rubrique 01 est le choix du profil.
- **Modifier:** ne reprend que la rubrique choisie ; les autres réponses, les coordonnées et le consentement sont conservés. Sur l'accueil, avant le choix du profil : deux lignes à remplir puis « Puis n autres questions courtes ».

### Dossier d'étude (pages profil)
- Seconde feuille blanche sur fond `surface`, bordure 1px `line`, coins 6px, sans ombre : en-tête « Dossier d'étude · Profil », sommaire des 5 étapes en marge (collant sur grand écran, filet 2px `deep`, numéros `hdf`), rubriques A → D dans le corps (lettre dans un carré 3px bordé `hdf`, puces carrées).

## Do's and Don'ts

### Do:
- **Do** poser toute nouvelle saisie sur la feuille blanche (6px, `shadow-sheet`) au-dessus du champ `deep`, en rubriques numérotées 01, 02… en chiffres tabulaires `hdf`.
- **Do** séparer par des filets `line` de 1px et des pointillés `deep` translucides plutôt que par des cartes ou des ombres.
- **Do** réserver l'orange `action` aux boutons d'action, avec texte `ink`.
- **Do** employer le vert énergie uniquement sur fond `deep` ou comme marque d'état dans la feuille.
- **Do** placer `.on-deep` sur toute section à fond `deep` pour que le focus passe en vert énergie ; ailleurs, focus `navy` 3px décalé de 3px.
- **Do** garder des cibles tactiles d'au moins 44px et respecter `prefers-reduced-motion`.

### Don't:
- **Don't** afficher de photographie ni de visuel généré tant que de vraies photos de chantier ne sont pas fournies.
- **Don't** mettre un sur-titre ou une accroche en capitales au-dessus d'un H1 ou d'un H2.
- **Don't** utiliser l'orange pour du texte, une icône, une bordure ou un focus.
- **Don't** écrire en vert énergie sur fond blanc.
- **Don't** arrondir au-delà de 6px, ni utiliser de pilules ou de puces rondes.
- **Don't** construire une section en « trois cartes avantage avec icône » ou une bulle de chat flottante.
