import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="bg-surface py-24">
      <Container className="max-w-xl text-center">
        <h1 className="text-3xl font-bold text-deep">Cette page n’existe pas</h1>
        <p className="mt-3 text-muted">Le lien est peut-être incomplet (erreur 404). Revenez à l’accueil pour découvrir HDF Bâti.</p>
        <ButtonLink href="/" className="mt-8">Retour à l’accueil</ButtonLink>
      </Container>
    </section>
  );
}
