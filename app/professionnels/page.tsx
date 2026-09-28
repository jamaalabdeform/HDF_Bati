import type { Metadata } from "next";
import { ProfilePage } from "@/components/etude/ProfilePage";
import { dossiers } from "@/config/dossiers";

const d = dossiers.professionnel;

export const metadata: Metadata = {
  title: d.metaTitle,
  description: d.metaDescription,
  alternates: { canonical: "/professionnels" },
  openGraph: { url: "/professionnels", title: d.metaTitle, description: d.metaDescription },
};

export default function Page() {
  return <ProfilePage segment="professionnel" />;
}
