import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { JawabotTrigger } from "@/components/jawabot/JawabotTrigger";
import { publishedLocalPages } from "@/config/local-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  const pages = publishedLocalPages();
  // Aucune page publiée : une seule route technique, renvoyant 404.
  return pages.length ? pages.map((p) => ({ ville: p.slug })) : [{ ville: "_" }];
}

type Props = { params: Promise<{ ville: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params;
  const page = publishedLocalPages().find((p) => p.slug === ville);
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/interventions/${page.slug}` } };
}

export default async function LocalLandingPage({ params }: Props) {
  const { ville } = await params;
  const page = publishedLocalPages().find((p) => p.slug === ville);
  if (!page) notFound();
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-bold text-deep sm:text-5xl">{page.title}</h1>
        <p className="mt-4 text-lg text-muted">{page.intro}</p>
        <div className="mt-10 grid gap-4">
          {page.realisations.map((r) => (
            <article key={r.title} className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-bold text-deep">{r.title}</h2>
              <p className="mt-2 text-muted">{r.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <JawabotTrigger origin={`local_${page.slug}`} segment="particulier" size="lg">Étudier mon projet</JawabotTrigger>
        </div>
      </Container>
    </section>
  );
}
