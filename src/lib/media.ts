// وسائط المقال الإضافية (صور / فيديو / يوتيوب) — تتخزن JSON في عمود Article.media
export type MediaItem = { type: "image" | "video" | "youtube"; url: string };

const TYPES = new Set(["image", "video", "youtube"]);
const MAX_ITEMS = 30;

export function parseMedia(raw: unknown): MediaItem[] {
  let v: unknown = raw;
  if (typeof raw === "string") {
    try {
      v = JSON.parse(raw || "[]");
    } catch {
      return [];
    }
  }
  if (!Array.isArray(v)) return [];
  return v
    .filter(
      (m): m is MediaItem =>
        !!m &&
        TYPES.has(m.type) &&
        typeof m.url === "string" &&
        (/^https:\/\//.test(m.url) || m.url.startsWith("/uploads/")) &&
        m.url.length <= 500
    )
    .map((m) => ({ type: m.type, url: m.url }))
    .slice(0, MAX_ITEMS);
}

export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : null;
}
