import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { Pending, ValidatedText } from "@/components/ui/Pending";
import { company, fullAddress, mailHref, telHref } from "@/config/company";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales" } };

export default function MentionsLegales() {
  const l = company.legal;
  return (
    <LegalPage title="Mentions légales" updated="septembre 2026">
      <Pending label="Relecture juridique des mentions légales avant mise en production." />
      <section>
        <h2>Éditeur du site</h2>
        <p>
          {l.denomination.value} — {l.form.value} au capital de {l.capital.value}
          <br />
          Siège social : {fullAddress}
          <br />
          {l.rcs.value} — SIREN {l.siren.value} — SIRET {l.siret.value}
          <br />
          Code APE : {l.ape.value}
          <br />
          N° TVA intracommunautaire : <ValidatedText data={l.vat} label="N° TVA" />
          <br />
          Téléphone : <a href={telHref}>{company.phone.display}</a> — E-mail : <a href={mailHref}>{company.email}</a>
        </p>
        <p>
          Président : {l.president.value} — Directeur général : {l.directeurGeneral.value}
          <br />
          Directeur de la publication : <ValidatedText data={l.publicationDirector} label="Directeur de la publication" />
        </p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>
          <ValidatedText data={l.host} label="Hébergeur (raison sociale, adresse, téléphone)" />
        </p>
      </section>
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
