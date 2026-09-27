import { getSiteSettings } from "@/lib/content";
import WhatsAppWidget from "./WhatsAppWidget";

export default async function FloatingButtons() {
  const site = await getSiteSettings();
  return <WhatsAppWidget phone={site.phone} whatsapp={site.whatsapp} name={site.name} />;
}
