# HDF Bâti — consignes pour Claude Code

## Outils à utiliser systématiquement

- **Impeccable** (`/impeccable`, `.claude/skills/impeccable`) : obligatoire pour tout travail de design / UI.
  Le site ne doit jamais « faire IA » (rédhibitoire pour le client). Après toute modification d'interface,
  lancer le détecteur sur la page rendue :
  `IMPECCABLE_BROWSER=<chromium --no-sandbox> .claude/skills/impeccable/scripts/impeccable detect --json http://localhost:3000/`.
  La charte HDF Bâti (Brand Book V6 : couleurs, police Inter, logo) prime sur les avertissements génériques.
- **Ponytail** (`/ponytail`) : solution la plus simple qui fonctionne, pas de dépendance ni d'abstraction inutile.
- **Graphify** (`graphify query "…"`) : interroger le graphe du code avant d'explorer les fichiers ; `graphify update .` après modification.
- **Skills Anthropic** : `frontend-design` (direction visuelle) et `webapp-testing` (tests Playwright).
- OmniRoute : volontairement non installé (passerelle vers d'autres fournisseurs, alertes de sécurité).

Les outils sont réinstallés automatiquement au démarrage des sessions web (`.claude/hooks/session-start.sh`).

## Règles métier

- Ne rien inventer : toute donnée non confirmée passe par `pending()` (`config/validation.ts`) et `HDF_CONTENT_TO_VALIDATE.md`.
- Logo : uniquement les SVG de `public/brand/` (jamais « HDF BÂT I »).
- Contrôle visuel obligatoire avant livraison : `npm run qa:screens`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
