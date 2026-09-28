/**
 * Envoie un message WhatsApp de test à Farid avec la configuration de production.
 *   WHATSAPP_TOKEN=… WHATSAPP_PHONE_NUMBER_ID=… WHATSAPP_NOTIFY_TO=33601451110 \
 *   WHATSAPP_TEMPLATE_NAME=nouveau_lead_hdf npm run test:whatsapp
 * Sans WHATSAPP_TEMPLATE_NAME : texte libre (accepté seulement si Farid a écrit au numéro
 * expéditeur dans les dernières 24 h).
 */
const { WHATSAPP_TOKEN: token, WHATSAPP_PHONE_NUMBER_ID: from, WHATSAPP_NOTIFY_TO: to, WHATSAPP_TEMPLATE_NAME: template } = process.env;
const lang = process.env.WHATSAPP_TEMPLATE_LANG || "fr";
if (!token || !from || !to) {
  console.error("Variables manquantes : WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_NOTIFY_TO");
  process.exit(1);
}
const params = ["Particulier", "Test HDF Bâti", "06 00 00 00 00", "Message de test envoyé depuis le site · aucune action à faire", "Aucune (test)", "TEST"];
for (const raw of to.split(/[,;]+/)) {
  let n = raw.replace(/\D/g, "");
  if (/^0[1-9]\d{8}$/.test(n)) n = `33${n.slice(1)}`;
  const body = template
    ? { type: "template", template: { name: template, language: { code: lang }, components: [{ type: "body", parameters: params.map((text) => ({ type: "text", text })) }] } }
    : { type: "text", text: { body: "Test HDF Bâti : les leads du site arriveront ici." } };
  const res = await fetch(`https://graph.facebook.com/v21.0/${from}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: n, ...body }),
  });
  const data = await res.json().catch(() => ({}));
  console.log(`…${n.slice(-4)} → HTTP ${res.status}`, res.ok ? "envoyé" : JSON.stringify(data.error ?? data));
}
