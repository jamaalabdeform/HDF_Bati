import "server-only";

/**
 * Avis Google de la fiche HDF Bâti, via l'API officielle Google Places (New).
 *
 *  GOOGLE_PLACES_API_KEY  clé API (Google Cloud → API « Places API (New) », clé restreinte à cette API)
 *  GOOGLE_PLACE_ID        identifiant de la fiche (outil « Place ID Finder » de Google)
 *
 * Rien n'est inventé ni recopié à la main : note, nombre d'avis et avis viennent de Google,
 * avec l'auteur et le lien exigés par Google. Mise à jour au plus une fois par jour.
 * Sans configuration (ou en cas d'erreur), la section n'est pas affichée.
 */

const BASE = process.env.GOOGLE_PLACES_API_BASE || "https://places.googleapis.com/v1";

export interface GoogleReview {
  author: string;
  authorUrl?: string;
  rating: number;
  text: string;
  relativeTime?: string;
  publishTime?: string;
  googleUrl?: string;
}

export interface GoogleReviews {
  rating: number;
  count: number;
  mapsUrl?: string;
  reviewsUrl?: string;
  writeReviewUrl?: string;
  reviews: GoogleReview[];
}

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  googleMapsLinks?: { reviewsUri?: string; writeAReviewUri?: string };
  reviews?: {
    rating?: number;
    relativePublishTimeDescription?: string;
    publishTime?: string;
    googleMapsUri?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string };
  }[];
}

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;
  try {
    const res = await fetch(`${BASE}/places/${encodeURIComponent(placeId)}?languageCode=fr&regionCode=FR`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,googleMapsLinks,reviews",
      },
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[google] Places API", res.status, (await res.text().catch(() => "")).slice(0, 300));
      return null;
    }
    const d = (await res.json()) as PlacesResponse;
    if (!d.userRatingCount || typeof d.rating !== "number") return null;
    return {
      rating: d.rating,
      count: d.userRatingCount,
      mapsUrl: d.googleMapsUri,
      reviewsUrl: d.googleMapsLinks?.reviewsUri ?? d.googleMapsUri,
      writeReviewUrl: d.googleMapsLinks?.writeAReviewUri,
      reviews: (d.reviews ?? [])
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? "Client Google",
          authorUrl: r.authorAttribution?.uri,
          rating: r.rating ?? 0,
          text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
          relativeTime: r.relativePublishTimeDescription,
          publishTime: r.publishTime,
          googleUrl: r.googleMapsUri,
        }))
        .filter((r) => r.text.length > 0),
    };
  } catch (e) {
    console.error("[google] Places API indisponible", e);
    return null;
  }
}
