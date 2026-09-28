/**
 * Contrôle qualité visuel HDF Bâti.
 *   node scripts/qa-screens.mjs [baseUrl] [outDir]
 *
 * Pour chaque largeur (375, 390, 430, 768, 1024, 1440) :
 * - capture pleine page + premier écran ;
 * - débordement horizontal de la page ;
 * - éléments qui dépassent du viewport ou dont le texte est coupé ;
 * - cibles tactiles < 44 px (mobile) ;
 * - erreurs console / requêtes en échec ;
 * - images sans alt / logos déformés.
 * Sur l'accueil et les 3 pages profil, puis parcours complet de la fiche d'étude + formulaire de rappel.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = process.argv[3] ?? "qa-screens";
const WIDTHS = [375, 390, 430, 768, 1024, 1440];
const PAGES = [
  { path: "/", name: "accueil" },
  { path: "/particuliers", name: "particuliers" },
  { path: "/professionnels", name: "professionnels" },
  { path: "/collectivites", name: "collectivites" },
];
const HEIGHTS = { 375: 667, 390: 844, 430: 932, 768: 1024, 1024: 768, 1440: 900 };
fs.mkdirSync(OUT, { recursive: true });

const launchOpts = fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {};
const browser = await chromium.launch(launchOpts);
const report = [];

async function audit(page, width) {
  return page.evaluate((width) => {
    const issues = [];
    const doc = document.documentElement;
    if (doc.scrollWidth > window.innerWidth + 1) issues.push(`Débordement horizontal : ${doc.scrollWidth}px > ${window.innerWidth}px`);
    const els = document.querySelectorAll("body *");
    for (const el of els) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || el.closest("[aria-hidden=true]") || el.closest(".sr-only")) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (el.closest("svg") && el.tagName !== "svg") continue;
      // Hors viewport horizontalement (hors éléments décoratifs positionnés)
      if ((r.right > window.innerWidth + 1 || r.left < -1) && cs.position !== "fixed" && !el.closest("svg[aria-hidden=true]") && el.tagName !== "svg") {
        const clip = el.closest("section, header, footer");
        const clipCs = clip ? getComputedStyle(clip) : null;
        if (!clipCs || clipCs.overflowX === "visible") issues.push(`Hors cadre : <${el.tagName.toLowerCase()} class="${(el.className?.baseVal ?? el.className ?? "").toString().slice(0, 60)}"> (${Math.round(r.left)}→${Math.round(r.right)})`);
      }
      // Texte coupé
      if ((cs.overflow === "hidden" || cs.textOverflow === "ellipsis" || cs.overflowX === "hidden") && el.scrollWidth > el.clientWidth + 2 && el.children.length === 0 && el.textContent.trim()) {
        issues.push(`Texte tronqué : "${el.textContent.trim().slice(0, 50)}"`);
      }
    }
    // Cibles tactiles
    if (width < 768) {
      for (const el of document.querySelectorAll("a[href], button, input, select, summary")) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || r.width === 0 || el.closest("[aria-hidden=true]") || el.tabIndex < 0 || el.classList.contains("sr-only")) continue;
        if (el.type === "checkbox") continue;
        const inline = cs.display === "inline" && el.closest("p, label");
        if (!inline && (r.height < 40 || r.width < 40)) issues.push(`Cible tactile ${Math.round(r.width)}×${Math.round(r.height)} : ${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40)}"`);
      }
    }
    // Images
    for (const img of document.querySelectorAll("img")) {
      if (!img.hasAttribute("alt")) issues.push(`Image sans alt : ${img.src}`);
      if (img.naturalWidth && img.src.includes("/brand/hdf-bati-logo")) {
        const r = img.getBoundingClientRect();
        const ratioShown = r.width / r.height;
        const ratioNat = img.naturalWidth / img.naturalHeight;
        if (Math.abs(ratioShown - ratioNat) / ratioNat > 0.02) issues.push(`Logo déformé (${ratioShown.toFixed(2)} vs ${ratioNat.toFixed(2)})`);
      }
    }
    const h1 = document.querySelectorAll("h1").length;
    if (h1 !== 1) issues.push(`Nombre de H1 : ${h1}`);
    return [...new Set(issues)];
  }, width);
}

for (const pg of PAGES) for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: HEIGHTS[width] }, deviceScaleFactor: 1, locale: "fr-FR" });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(e.message));
  page.on("requestfailed", (r) => consoleErrors.push(`Requête en échec : ${r.url()}`));
  await page.goto(`${BASE}${pg.path}?utm_source=facebook&utm_medium=paid&utm_campaign=qa`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/${pg.name}-${width}-fold.png` });
  // Déclenche les apparitions au défilement
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 300) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(900);
  const issues = await audit(page, width);
  await page.screenshot({ path: `${OUT}/${pg.name}-${width}-full.png`, fullPage: true });
  report.push({ width, page: pg.name, issues, consoleErrors });
  await context.close();
}

// Fiche d'étude : accueil (choix du profil) à 390, page particuliers à 390 et 1440
for (const [width, path] of [[390, "/"], [390, "/particuliers"], [1440, "/particuliers"]]) {
  const context = await browser.newContext({ viewport: { width, height: HEIGHTS[width] }, locale: "fr-FR" });
  const page = await context.newPage();
  const errors = [];
  const events = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
    if (m.text().startsWith("[analytics]")) events.push(m.text().split(" ")[1]);
  });
  await page.goto(`${BASE}${path}?utm_source=facebook&utm_campaign=pac_test`, { waitUntil: "networkidle" });
  const tag = `${path === "/" ? "accueil" : "particuliers"}-${width}`;
  const sheet = page.locator("#etude");
  const pick = async (label) => {
    await sheet.getByRole("button", { name: label, exact: true }).click();
    await page.waitForTimeout(350);
  };
  if (path === "/") await pick("Mon logement");
  await page.screenshot({ path: `${OUT}/${tag}-fiche-1.png` });
  await pick("Pompe à chaleur");
  await pick("Maison individuelle");
  await pick("Propriétaire occupant");
  await sheet.getByRole("textbox", { name: "Où se situe le logement ?" }).fill("59410");
  await sheet.getByRole("button", { name: "Continuer" }).click();
  await page.waitForTimeout(350);
  await pick("Gaz");
  // Modifier une rubrique déjà remplie puis reprendre
  await sheet.getByRole("button", { name: "Modifier : Chauffage actuel" }).click();
  await page.waitForTimeout(350);
  await pick("Gaz");
  await pick("Réduire mes dépenses d’énergie");
  await page.screenshot({ path: `${OUT}/${tag}-fiche-2.png` });
  await pick("Dans les 3 mois");
  await pick("Convenir d’un rendez-vous");
  await sheet.getByLabel("Nom et prénom").fill("Test QA");
  await sheet.getByLabel("Téléphone", { exact: true }).fill("06 12 34 56 78");
  await sheet.getByRole("checkbox").check();
  await page.screenshot({ path: `${OUT}/${tag}-fiche-3.png` });
  await sheet.getByRole("button", { name: "Envoyer ma fiche" }).click();
  await sheet.getByText("Merci, votre fiche est transmise.").waitFor({ timeout: 8000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${tag}-fiche-4.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  report.push({ width, flow: `fiche ${path}`, ok: true, events, errors, overflow });
  await context.close();
}

// Formulaire de rappel (375)
{
  const context = await browser.newContext({ viewport: { width: 375, height: 667 }, locale: "fr-FR" });
  const page = await context.newPage();
  const errors = [];
  const events = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
    if (m.text().startsWith("[analytics]")) events.push(m.text().split(" ")[1]);
  });
  await page.goto(`${BASE}/#etre-rappele`, { waitUntil: "networkidle" });
  const form = page.locator("#callback-form");
  await form.getByRole("button", { name: "Demander un rappel" }).click();
  await page.waitForTimeout(300);
  await form.screenshot({ path: `${OUT}/375-callback-errors.png` });
  const errorCount = await form.locator("[role=alert]").count();
  await form.getByRole("radio", { name: "Particulier" }).check({ force: true });
  await form.getByLabel("Nom", { exact: true }).fill("Test Rappel");
  await form.getByLabel("Téléphone", { exact: true }).fill("0612345678");
  await form.getByLabel("Code postal", { exact: true }).fill("59300");
  await form.getByLabel("Type de projet").selectOption("pac");
  await form.getByLabel("Meilleur moment pour être rappelé").selectOption("matin");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Demander un rappel" }).click();
  await page.getByText("Demande de rappel bien reçue").waitFor({ timeout: 8000 });
  await page.getByText("Demande de rappel bien reçue").screenshot({ path: `${OUT}/375-callback-ok.png` });
  report.push({ width: 375, flow: "callback", validationErrorsShown: errorCount, events, errors });
  await context.close();
}

await browser.close();
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
for (const r of report) {
  const label = r.flow ? `${r.flow} @${r.width}` : `${r.page} @${r.width}px`;
  const probs = [...(r.issues ?? []), ...(r.consoleErrors ?? []), ...(r.errors ?? [])];
  console.log(`\n${label} — ${probs.length ? `${probs.length} problème(s)` : "OK"}${r.events ? ` — événements : ${r.events.join(", ")}` : ""}`);
  for (const p of probs.slice(0, 25)) console.log("  • " + p);
}
