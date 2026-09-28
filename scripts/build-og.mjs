/** Génère public/og-hdf-bati.jpg (1200×630) à partir du logo et du visuel hero.  node scripts/build-og.mjs */
import { chromium } from "playwright";
import fs from "node:fs";

const b64 = (p) => fs.readFileSync(p).toString("base64");
const logo = `data:image/svg+xml;base64,${b64("public/brand/hdf-bati-logo-inverse.svg")}`;
const photo = `data:image/jpeg;base64,${b64("public/images/provisoire-maison-nord.jpg")}`;
const font = `data:font/woff2;base64,${b64("app/inter-latin-wght.woff2")}`;

const html = `<!doctype html><html><head><style>
@font-face{font-family:Inter;src:url(${font}) format("woff2");font-weight:100 900}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;font-family:Inter;background:#083D2E;display:flex;overflow:hidden}
.l{width:640px;padding:64px 56px;display:flex;flex-direction:column;justify-content:space-between;color:#fff}
.logo{width:380px}
h1{font-size:62px;line-height:1.04;letter-spacing:-.03em;font-weight:750}
h1 span{color:#79C51D}
p{margin-top:20px;font-size:24px;line-height:1.4;color:rgba(255,255,255,.82)}
.chips{display:flex;gap:10px}.chips b{font-size:15px;letter-spacing:.12em;text-transform:uppercase;padding:9px 16px;border-radius:999px;background:rgba(255,255,255,.1)}
.r{flex:1;background:url(${photo}) center 45%/cover;border-radius:36px 0 0 36px}
</style></head><body><div class="l"><img class="logo" src="${logo}"><div><h1>Votre énergie,<br><span>mieux maîtrisée.</span></h1><p>Pompes à chaleur, rénovation énergétique<br>et optimisation des contrats d’énergie.</p></div><div class="chips"><b>Particuliers</b><b>Pros</b><b>Collectivités</b></div></div><div class="r"></div></body></html>`;

const opts = fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {};
const browser = await chromium.launch(opts);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.waitForTimeout(300);
await page.screenshot({ path: "public/og-hdf-bati.jpg", type: "jpeg", quality: 86 });
await browser.close();
console.log("public/og-hdf-bati.jpg");
