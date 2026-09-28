import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HDF Bâti — Votre expert en rénovation énergétique",
    short_name: "HDF Bâti",
    start_url: "/",
    display: "browser",
    background_color: "#FFFFFF",
    theme_color: "#083D2E",
    lang: "fr",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
