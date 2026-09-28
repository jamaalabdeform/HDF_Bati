/**
 * Recense tous les contenus à valider dans le code.
 *   npm run check:content
 * Cherche : pending(...), status: "pending_validation", TODO_HDF_VALIDATION, provisional_ai.
 */
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["config", "lib", "components", "app"];
const PATTERNS = [/\bpending(<[^>]*>)?\(/, /pending_validation/, /TODO_HDF_VALIDATION/, /status: "provisional_ai"/];
const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(entry.name)) {
      fs.readFileSync(p, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (PATTERNS.some((re) => re.test(line)) && !line.includes("export const pending") && !line.includes("import ")) {
            hits.push(`${p}:${i + 1}  ${line.trim().slice(0, 140)}`);
          }
        });
    }
  }
}

ROOTS.forEach((r) => fs.existsSync(r) && walk(r));
console.log(`${hits.length} élément(s) à valider (voir aussi HDF_CONTENT_TO_VALIDATE.md)\n`);
console.log(hits.join("\n"));
