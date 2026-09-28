import { Container } from "../ui/Container";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface py-14 sm:py-20">
      <Container width="text">
        <h1 className="text-3xl font-bold text-deep sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">Dernière mise à jour : {updated}</p>
        <div className="mt-8 space-y-8 rounded-[var(--radius-card)] bg-white p-6 leading-relaxed text-ink border border-line sm:p-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-deep [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:font-semibold [&_a]:text-hdf [&_a]:underline">
          {children}
        </div>
      </Container>
    </div>
  );
}
