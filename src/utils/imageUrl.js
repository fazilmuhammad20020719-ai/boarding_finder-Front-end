// Listing photos are stored as Google Drive links like
//   https://drive.google.com/uc?id=FILE_ID&export=view
// which browsers can no longer embed. Drive's thumbnail endpoint can be.
export const FALLBACK_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600";

export function toDisplayImage(url, width = 1000) {
  if (!url || typeof url !== "string") return FALLBACK_LISTING_IMAGE;
  const driveId = url.match(/drive\.google\.com\/(?:uc\?(?:[^#]*&)?id=|file\/d\/|thumbnail\?id=)([a-zA-Z0-9_-]+)/)?.[1];
  if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${width}`;
  return url.startsWith("http") ? url : FALLBACK_LISTING_IMAGE;
}

/** First photo of a listing, whatever shape image_urls arrives in. */
export function firstListingImage(imageUrls, width) {
  let list = imageUrls;
  if (typeof list === "string") {
    try { list = JSON.parse(list); } catch { list = list.replace(/^[{[]|[}\]]$/g, "").split(","); }
  }
  const first = Array.isArray(list) ? String(list[0] || "").trim().replace(/^"|"$/g, "") : "";
  return toDisplayImage(first, width);
}
