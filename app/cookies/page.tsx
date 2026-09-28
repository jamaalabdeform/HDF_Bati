import type { Metadata } from "next";
import { ConsentLink } from "@/components/layout/ConsentLink";
import { LegalPage } from "@/components/layout/LegalPage";
import { hasAnyTracker } from "@/config/tracking";

export const metadata: Metadata = { title: "Cookies", alternates: { canonical: "/cookies" } };

export default function Cookies() {
  return (
    <LegalPage title="Cookies et traceurs" updated="septembre 2026">
      <section>
        <h2>Notre approche</h2>
        <p>Aucun cookie de mesure d’audience ou de publicité n’est déposé sans votre accord. Refuser est aussi simple qu’accepter, et vous pouvez modifier votre choix à tout moment.</p>
      </section>
      <section>
        <h2>Traceurs utilisés avec votre accord</h2>
        <ul>
          <li>Mesure d’audience : Google Analytics 4 (via Google Tag Manager).</li>
          <li>Publicité : Meta Pixel (Facebook, Instagram) et Google Ads, pour mesurer l’efficacité de nos campagnes.</li>
        </ul>
      </section>
      <section>
        <h2>Stockage technique</h2>
        <p>Le site conserve localement votre choix de consentement et, le temps de votre visite, la source de campagne qui vous a amené (paramètres UTM) afin de l’associer à votre demande. Si vous commencez la fiche d’étude, vos réponses sur le projet (jamais vos nom, téléphone ou e-mail) sont gardées dans votre navigateur le temps de la visite, pour que vous puissiez la reprendre ; elles sont effacées à l’envoi ou à la fermeture de l’onglet.</p>
      </section>
      <section>
        <h2>Modifier mes choix</h2>
        {hasAnyTracker ? (
          <p>
            <ConsentLink className="font-semibold text-hdf underline" />
          </p>
        ) : (
          <p>Aucun outil de mesure n’est actif actuellement sur ce site.</p>
        )}
      </section>
    </LegalPage>
  );
}
