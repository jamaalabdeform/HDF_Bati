---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/particuliers/page.tsx","app/professionnels/page.tsx","app/collectivites/page.tsx"]
---

# Surface: accueil HDF Bâti + pages profil

Scope: `/` (hub) and `/particuliers`, `/professionnels`, `/collectivites`. Visitor mode: Persuade (Meta/Google traffic, mostly phone, cold). Action: submit the stepped study form (or ask for a callback). Proof on hand: none beyond legal identity; claims stay pending-gated.

## Direction contract

THESIS: The page is the study file itself. HDF Bâti's promise is "on étudie avant de proposer", so the visitor fills a fiche d'étude that visibly completes rubric by rubric; it refuses the category default (hero photo + three benefit cards + chat bubble).

OWN-WORLD: A white sheet with square-ish corners (6px), 1px `line` rules and dotted fill-in leaders, laid on a vert profond field that owns the top of every page. Numbered rubrics in tabular figures (01–08), square checkboxes rather than pills, a status stamp (« À compléter » / « Transmis ») in vert HDF outline, folder tabs Habitat / Pro / Collectivités on the sheet's top edge. Orange appears only on the send/advance buttons.

STORY: I see which file is mine, I see what HDF Bâti will study and what I must prepare, I answer 8 short rubrics, I know who calls me back and what I receive.

FIRST VIEWPORT: Deep-green field. Left (desktop) / top (mobile): H1 "Votre énergie, mieux maîtrisée." and one sentence. Right / below: the sheet, active rubric open with its choices, earlier rubrics shown filled, later ones as blank ruled lines; progress "Étudions votre projet · 3/8" in the sheet header. The primary action is the current rubric's answer, inside the sheet. On mobile the active rubric sits within the first 700px.

FORM: Fiche d'étude — position 5 on the ranked list; seed key 257b5e88.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Pro/collectivité "ce que vous préparez" details pending Farid.
- Real photos: none; provisional AI images are kept out of the first viewport.
