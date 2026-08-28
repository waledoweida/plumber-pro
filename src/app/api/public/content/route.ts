import { NextResponse } from "next/server";
import { getSiteSettings, getTexts, getVisibility } from "@/lib/content";

export const dynamic = "force-dynamic";

/** Public read-only bundle for client components (header) */
export async function GET() {
  const [settings, texts, visibility] = await Promise.all([
    getSiteSettings(),
    getTexts(),
    getVisibility(),
  ]);
  return NextResponse.json(
    {
      name: settings.name,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      tagline: settings.tagline,
      texts,
      visibility,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
