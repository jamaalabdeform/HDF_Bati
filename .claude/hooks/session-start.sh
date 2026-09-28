#!/bin/bash
# Prépare les sessions Claude Code sur le web : dépendances + outils (Graphify, Impeccable).
# Idempotent, silencieux, ne bloque jamais la session.
set -uo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

[ -d node_modules ] || npm install --no-audit --no-fund >/dev/null 2>&1 || true

# Graphify (graphe de connaissance du code, analyse AST locale)
command -v graphify >/dev/null 2>&1 || pip install -q "graphifyy==0.9.70" >/dev/null 2>&1 || true

# Moteur du détecteur Impeccable (binaire publié sur npm)
if [ ! -x "$HOME/.impeccable/bin/impeccable" ] && [ "$(uname -sm)" = "Linux x86_64" ]; then
  tmp=$(mktemp -d)
  if (cd "$tmp" && npm pack -s "@impeccable/cli-linux-x64@0.1.6" >/dev/null 2>&1 && tar xzf ./*.tgz); then
    mkdir -p "$HOME/.impeccable/bin" && cp "$tmp/package/bin/impeccable" "$HOME/.impeccable/bin/" && chmod +x "$HOME/.impeccable/bin/impeccable"
  fi
  rm -rf "$tmp"
fi

command -v graphify >/dev/null 2>&1 && graphify update . >/dev/null 2>&1 || true
exit 0
