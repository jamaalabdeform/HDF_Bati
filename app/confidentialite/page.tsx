import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { Pending } from "@/components/ui/Pending";
import { company, fullAddress, mailHref } from "@/config/company";

export const metadata: Metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite" } };

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" updated="septembre 2026">
      <Pending label="Politique à valider juridiquement (durées de conservation, sous-traitants CRM / WhatsApp / hébergeur)." />
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          {company.legal.denomination.value}, {fullAddress}. Contact : <a href={mailHref}>{company.email}</a>.
        </p>
      </section>
      <section>
        <h2>Données collectées</h2>
        <ul>
          <li>Via la fiche d’étude ou le formulaire de rappel : nom, téléphone, e-mail (facultatif), code postal, informations sur votre projet et, pour les professionnels, la structure et la fonction.</li>
          <li>Données de navigation et de campagne (source publicitaire, paramètres UTM) pour savoir comment vous nous avez connus.</li>
        </ul>
      </section>
      <section>
        <h2>Finalités et base légale</h2>
        <ul>
          <li>Vous recontacter au sujet de votre demande et préparer l’étude de votre projet — sur la base de votre consentement, recueilli et horodaté lors de l’envoi.</li>
          <li>Suivre le traitement commercial de votre demande (outil de gestion de la relation client).</li>
          <li>Mesurer l’efficacité de nos actions de communication — uniquement avec votre accord pour les cookies concernés.</li>
        </ul>
        <p>HDF Bâti ne réalise aucune prospection téléphonique non sollicitée : nous vous contactons uniquement suite à votre demande.</p>
      </section>
      <section>
        <h2>Destinataires</h2>
        <p>Les données sont destinées à HDF Bâti. Elles peuvent être traitées par des prestataires techniques (hébergement, outil CRM, messagerie) agissant pour le compte de HDF Bâti.</p>
        <Pending label="Liste des sous-traitants et localisation des données" />
      </section>
      <section>
        <h2>Durée de conservation</h2>
        <Pending label="Durée de conservation des demandes (ex. : 3 ans après le dernier contact)" />
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>
          Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité, ainsi que du droit de retirer votre consentement à tout moment, en écrivant à <a href={mailHref}>{company.email}</a>. Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).
        </p>
      </section>
    </LegalPage>
  );
}
