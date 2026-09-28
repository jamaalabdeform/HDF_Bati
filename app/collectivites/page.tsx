import type { Metadata } from "next";
import { ProfilePage } from "@/components/etude/ProfilePage";
import { dossiers } from "@/config/dossiers";

const d = dossiers.collectivite;

export const metadata: Metadata = {
  title: d.metaTitle,
  description: d.metaDescription,
  alternates: { canonical: "/collectivites" },
  openGraph: { url: "/collectivites", title: d.metaTitle, description: d.metaDescription },
};

export default function Page() {
  return <ProfilePage segment="collectivite" />;
}
