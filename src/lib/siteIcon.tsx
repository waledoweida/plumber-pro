import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/content";

// صورة الأدمن مصغّرة لمربع (Cloudinary بيحوّلها PNG مربعة مباشرة)
export async function customIcon(px: number, transparent: boolean): Promise<Response | null> {
  const { faviconUrl } = await getSiteSettings();
  if (!faviconUrl) return null;
  try {
    let url = faviconUrl;
    if (url.startsWith("/")) url = `http://localhost:${process.env.PORT || 3000}${url}`;
    else if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
      const bg = transparent ? "" : ",b_white";
      url = url.replace("/upload/", `/upload/c_pad,w_${px},h_${px}${bg},f_png/`);
    }
    const r = await fetch(url, { cache: "no-store" });
    const type = r.headers.get("content-type") || "";
    if (!r.ok || !type.startsWith("image/")) return null;
    return new Response(await r.arrayBuffer(), {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=3600, s-maxage=3600" },
    });
  } catch {
    return null;
  }
}

export function generatedIcon(px: number, radius: number) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#112544", borderRadius: radius, borderBottom: `${Math.max(2, Math.round(px * 0.09))}px solid #ea6a1c` }}>
        <svg width={px * 0.6} height={px * 0.6} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>
    ),
    { width: px, height: px }
  );
}
