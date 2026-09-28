/** Génère public/og-hdf-bati.jpg (1200×630) : logo, titre et fiche d'étude, sans photo.  node scripts/build-og.mjs */
import { chromium } from "playwright";
import fs from "node:fs";

const b64 = (p) => fs.readFileSync(p).toString("base64");
const logo = `data:image/svg+xml;base64,${b64("public/brand/hdf-bati-logo-inverse.svg")}`;
const font = `data:font/woff2;base64,${b64("app/inter-latin-wght.woff2")}`;

const html = `<!doctype html><html><head><style>
@font-face{font-family:Inter;src:url(${font}) format("woff2");font-weight:100 900}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;font-family:Inter;background:#083D2E;display:flex;overflow:hidden}
.l{width:620px;padding:64px 56px;display:flex;flex-direction:column;justify-content:space-between;color:#fff}
.logo{width:380px}
h1{font-size:62px;line-height:1.04;letter-spacing:-.03em;font-weight:750}
h1 span{color:#79C51D}
p{margin-top:20px;font-size:24px;line-height:1.4;color:rgba(255,255,255,.82)}
.chips{display:flex;gap:10px}.chips b{font-size:15px;letter-spacing:.12em;text-transform:uppercase;padding:9px 16px;border-radius:4px;background:rgba(255,255,255,.1)}
.r{flex:1;padding:64px 56px 0 0;display:flex;align-items:flex-start}
.sheet{width:100%;background:#fff;border-radius:6px;color:#192d27;padding:26px 30px}
.hd{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #dce7df;padding-bottom:14px}
.hd b{font-size:20px;color:#083D2E}.st{font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#0B7A3B;border:2px solid #0B7A3B;border-radius:3px;padding:3px 8px}
.ticks{display:flex;gap:5px;margin:18px 0 8px}.ticks i{flex:1;height:7px;border-radius:1px;background:#dce7df}.ticks i.f{background:#0B7A3B}.ticks i.a{background:#79C51D}
.row{display:flex;gap:14px;align-items:baseline;border-top:1px solid #dce7df;padding:13px 0;font-size:19px}
.row .n{width:30px;color:#0B7A3B;font-weight:700;font-variant-numeric:tabular-nums}.row .k{color:#4c5f58}.row .d{flex:1;border-bottom:2px dotted rgba(8,61,46,.3);transform:translateY(-5px)}.row .v{font-weight:650;color:#083D2E}
</style></head><body><div class="l"><img class="logo" src="${logo}"><div><h1>Votre énergie,<br><span>mieux maîtrisée.</span></h1><p>Pompes à chaleur, rénovation énergétique<br>et optimisation des contrats d’énergie.</p></div><div class="chips"><b>Particuliers</b><b>Pros</b><b>Collectivités</b></div></div><div class="r"><div class="sheet"><div class="hd"><b>Fiche d’étude</b><span class="st">À compléter</span></div><div class="ticks"><i class="f"></i><i class="f"></i><i class="f"></i><i class="a"></i><i></i><i></i><i></i><i></i><i></i></div><div class="row"><span class="n">01</span><span class="k">Projet</span><span class="d"></span><span class="v">Pompe à chaleur</span></div><div class="row"><span class="n">02</span><span class="k">Logement</span><span class="d"></span><span class="v">Maison individuelle</span></div><div class="row"><span class="n">03</span><span class="k">Statut</span><span class="d"></span><span class="v">Propriétaire occupant</span></div><div class="row"><span class="n">04</span><span class="k">Code postal</span><span class="d"></span></div><div class="row"><span class="n">05</span><span class="k">Chauffage actuel</span><span class="d"></span></div></div></div></body></html>`;

const opts = fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {};
const browser = await chromium.launch(opts);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.waitForTimeout(300);
await page.screenshot({ path: "public/og-hdf-bati.jpg", type: "jpeg", quality: 86 });
await browser.close();
console.log("public/og-hdf-bati.jpg");
