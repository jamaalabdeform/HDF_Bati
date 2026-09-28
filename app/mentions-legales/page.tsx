import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { Pending, ValidatedText } from "@/components/ui/Pending";
import { company, fullAddress, mailHref, telHref } from "@/config/company";
import { SHOW_PENDING, type Validated } from "@/config/validation";

/** Ligne « libellé : valeur » : omise en production tant que la valeur n'est pas confirmée. */
function Line({ label, data }: { label: string; data: Validated<string> }) {
  if (data.status !== "confirmed" && !SHOW_PENDING) return null;
  return (
    <>
      <br />
      {label} : <ValidatedText data={data} label={label} />
    </>
  );
}

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales" } };

export default function MentionsLegales() {
  const l = company.legal;
  return (
    <LegalPage title="Mentions légales" updated="septembre 2026">
      <Pending label="Relecture juridique des mentions légales avant mise en production." />
      <section>
        <h2>Éditeur du site</h2>
        <p>
          {l.denomination.value} · {l.form.value} au capital de {l.capital.value}
          <br />
          Siège social : {fullAddress}
          <br />
          {l.rcs.value} · SIREN {l.siren.value} · SIRET {l.siret.value}
          <br />
          Code APE : {l.ape.value}
          <Line label="N° TVA intracommunautaire" data={l.vat} />
          <br />
          Téléphone : <a href={telHref}>{company.phone.display}</a> · E-mail : <a href={mailHref}>{company.email}</a>
        </p>
        <p>
          Président : {l.president.value} · Directeur général : {l.directeurGeneral.value}
          <Line label="Directeur de la publication" data={l.publicationDirector} />
        </p>
      </section>
      {(l.host.status === "confirmed" || SHOW_PENDING) && (
        <section>
          <h2>Hébergement</h2>
          <p>
            <ValidatedText data={l.host} label="Hébergeur (raison sociale, adresse, téléphone)" />
          </p>
        </section>
      )}
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>La marque, le logo HDF BÂTI et l’ensemble des contenus de ce site sont la propriété de {l.denomination.value} ou utilisés avec autorisation. Toute reproduction sans accord préalable est interdite.</p>
      </section>
      <section>
        <h2>Informations sur les aides</h2>
        <p>Les informations relatives aux aides financières sont données à titre indicatif. Leur obtention dépend des conditions d’éligibilité et de la réglementation en vigueur ; aucune aide n’est garantie.</p>
      </section>
    </LegalPage>
  );
}
