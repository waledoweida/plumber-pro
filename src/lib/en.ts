// English content for the /en pages. Keyed by the same slugs as the Arabic DB rows;
// a service or area without a translation falls back to its Arabic text.

export type EnService = { title: string; short: string; description: string; features: string[] };
export type EnArea = { title: string; description: string; content: string };
export type Faq = { q: string; a: string };

export const EN_SERVICES: Record<string, EnService> = {
  "drain-cleaning": {
    title: "Drain & Sewer Unblocking",
    short: "Sinks, floor traps, toilets and main sewer lines cleared with jetting machines and an in-pipe camera.",
    description: "We locate the blockage with a camera inside the pipe, then flush the line with a high-pressure jetter so grease and scale are removed from the pipe walls — not just pushed further down. Manholes and inspection chambers are pumped out when needed.",
    features: ["In-pipe camera inspection", "High-pressure water jetting", "Manhole pumping", "24/7 call-outs"],
  },
  "leak-detection": {
    title: "Leak Detection Without Breaking",
    short: "Thermal and acoustic equipment pinpoints hidden leaks so we only open the exact spot.",
    description: "Rising water bill, damp walls or a meter that keeps turning? We trace hidden leaks under tiles, in walls and in underground lines with thermal imaging, acoustic listening and moisture meters, then repair them with a small, targeted opening.",
    features: ["Thermal imaging", "Acoustic leak listening", "Minimal opening", "Technical report on request"],
  },
  bathroom: {
    title: "Bathroom Renovation & Rough-in",
    short: "New water and drain lines, pressure testing before tiling, and clean fitting of sanitary ware.",
    description: "From a full rough-in to a quick refresh: correctly sized supply and drain pipes, a pressure test before the tiler starts, and neat installation of basins, toilets, mixers and smart taps — with a warranty on the fitting.",
    features: ["Full pipe rough-in", "Pressure test before tiling", "Sanitary ware fitting", "Installation warranty"],
  },
  heaters: {
    title: "Water Heaters",
    short: "Instant and central water heaters installed and repaired, always with a safety valve and proper earthing.",
    description: "Lukewarm water, a leaking tank or a heater that trips the breaker — we replace elements and thermostats, flush out scale and install new heaters with a pressure-relief valve and correct temperature settings.",
    features: ["Instant & central heaters", "Safety valves", "Element & thermostat repair", "Warranty"],
  },
  pumps: {
    title: "Water Pumps",
    short: "Weak pressure on the upper floor? The right pump, sized for your home and installed properly.",
    description: "We check the pump, pressure switch, pressure tank and roof tank, fix what is failing, or supply and install an automatic pump sized to the number of floors and outlets in your home.",
    features: ["Automatic & manual pumps", "Inspection first", "Pressure switch repair", "Professional installation"],
  },
  pipes: {
    title: "Pipe Installation & Replacement",
    short: "PPR and copper pipework that resists rust and lasts for years.",
    description: "Old, rusty lines or yellowish water? We replace supply lines partly or completely with PPR or copper depending on the location and use, then pressure-test the new pipework before closing it up.",
    features: ["PPR & copper", "Rust resistant", "Pressure tested", "Quality materials"],
  },
};

export const EN_AREAS: Record<string, EnArea> = {
  "kuwait-city": {
    title: "Kuwait City (Capital)",
    description: "Plumber in the Capital governorate",
    content: "City-centre offices and older family homes alike: Sharq, Qibla, Mirqab and the surrounding residential areas. Drain unblocking, leak detection and installations with a warranty — call us any time for emergencies.",
  },
  hawally: {
    title: "Hawally",
    description: "Plumber in Hawally and nearby areas",
    content: "Homes, apartment buildings and shops in Hawally. We know the older networks and shared building lines well and can reach you quickly anywhere in the governorate.",
  },
  salmiya: {
    title: "Salmiya",
    description: "Plumber in Salmiya for apartments and towers",
    content: "Salmiya is full of multi-storey apartments, so weak pressure on high floors and leaks in shared drain stacks are the jobs we see most. Pumps, drain work and scheduled maintenance.",
  },
  farwaniya: {
    title: "Farwaniya",
    description: "Plumber in Farwaniya and its suburbs",
    content: "Farwaniya, Khaitan, Omariya and nearby areas: drain unblocking, sewer lines and pipework with the price agreed before we start.",
  },
  ahmadi: {
    title: "Ahmadi",
    description: "Plumber in Ahmadi and Fahaheel",
    content: "Ahmadi, Fahaheel, Mangaf and the southern areas — repairs, installations and drain unblocking around the clock, with a warranty on our work.",
  },
  jahra: {
    title: "Jahra",
    description: "Plumber in Jahra",
    content: "Jahra and the western areas — organised visits for emergencies and for scheduled maintenance.",
  },
};

export const enService = <T extends { slug: string; title: string; short: string; description: string; features: string }>(s: T) => {
  const t = EN_SERVICES[s.slug];
  let feats: string[] = [];
  try { feats = JSON.parse(s.features || "[]"); } catch {}
  return t ? { ...t } : { title: s.title, short: s.short, description: s.description, features: feats };
};

export const enArea = <T extends { slug: string; title: string; description: string; content: string }>(a: T) =>
  EN_AREAS[a.slug] || { title: a.title, description: a.description, content: a.content };

const EN_SPECIFIC: Record<string, Faq[]> = {
  "drain-cleaning": [
    { q: "Do you need to break tiles to clear a drain?", a: "Normally not. We work through the floor trap, cleaning eye or manhole and use the camera to find the blockage. Breaking is only needed when the pipe itself is damaged." },
    { q: "My drain blocked again a month after cleaning — why?", a: "A basic rod only pokes a hole through the blockage and leaves grease on the pipe walls. We jet the whole line and tell you what caused it so it doesn't come back." },
  ],
  "leak-detection": [
    { q: "How do you find a leak without breaking?", a: "A thermal camera shows the cold, wet spot, an acoustic device hears water escaping from the pipe and a moisture meter checks walls. We open only at that point." },
    { q: "My bill is high but I can't see a leak — what should I do?", a: "Close every tap and watch the meter. If it keeps turning there is a hidden leak — call us and we'll check underground lines, bathrooms and the tank." },
  ],
  bathroom: [
    { q: "Do you do complete bathroom rough-ins?", a: "Yes — supply and drain pipes through to fitting the sanitary ware, with a pressure test before tiling so nothing leaks later." },
  ],
  heaters: [
    { q: "My heater only gives lukewarm water — why?", a: "Usually a weak element, a faulty thermostat or a tank full of scale. We replace the faulty part; if the tank is rusted we'll recommend a new heater." },
  ],
  pumps: [
    { q: "My pump keeps switching on and off by itself — why?", a: "Usually the pressure switch, the pressure tank or a leak in the line. We diagnose it and fix it on the same visit when the part is available." },
  ],
  pipes: [
    { q: "PPR or copper — which is better?", a: "PPR lasts long, doesn't rust and is good value; copper is very strong and handles heat well. We recommend based on where the pipe runs and what it carries." },
  ],
};

export function enServiceFaqs(slug: string, name: string): Faq[] {
  return [
    { q: `How much does ${name.toLowerCase()} cost?`, a: "It depends on the problem and the amount of work. The technician checks first and tells you the exact price before starting — nothing added afterwards." },
    { q: "Do you work on Fridays and public holidays?", a: "Yes, we work 24 hours a day, every day of the week, including Fridays and holidays." },
    { q: "How quickly can you get to me?", a: "For emergencies we aim to be with you as fast as possible; the time depends on your area and traffic at the time of the call." },
    ...(EN_SPECIFIC[slug] || []),
    { q: "Is the work guaranteed?", a: "Yes, you get a written warranty; its length depends on the type of work and the parts fitted." },
    { q: "Which areas do you cover?", a: "The Capital, Hawally, Salmiya, Farwaniya, Ahmadi and Jahra, and the areas around them." },
  ];
}

export const EN_HOME = {
  badge: "Open 24 hours · 7 days a week",
  title: "Certified plumber in Kuwait",
  subtitle: "Professional plumbing with a written warranty",
  desc: "Drain unblocking, leak detection without breaking, water heaters, pumps and pipework. Certified technicians and a clear price from the first call.",
  servicesTitle: "Complete plumbing services",
  servicesSub: "Everything from emergency call-outs to full bathroom rough-ins",
  howTitle: "How it works",
  how: [
    { t: "Tell us the problem", d: "Call, send a WhatsApp message or fill in the form" },
    { t: "We inspect and quote", d: "The technician checks the problem and agrees the price with you first" },
    { t: "Fixed and guaranteed", d: "We finish the job cleanly and give you a written warranty" },
  ],
  whyTitle: "Why choose us?",
  why: [
    "Certified, hands-on technicians",
    "A clear estimate from the first call",
    "Leak detection equipment — no needless breaking",
    "Written warranty on installations",
    "Coverage across Kuwait's governorates",
    "24-hour emergency service",
  ],
  ctaTitle: "Plumbing problem? We're on call around the clock",
  ctaDesc: "Don't wait for it to get worse — call or message us now.",
};

export const EN_WA = {
  default: "Hi, I have a plumbing problem and need a technician",
  service: (name: string) => `Hi, I'd like to ask about ${name.toLowerCase()}`,
  area: (area: string) => `Hi, I'm in ${area} and need a plumber`,
};
