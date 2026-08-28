import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSiteSettings();
  return NextResponse.json(
    { name: s.name, phone: s.phone, whatsapp: s.whatsapp, tagline: s.tagline },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
