// رسومات SVG بسيطة لكل موضوع — كحلي ونحاسي
const N = "#1e338a", N2 = "#2552eb", C = "#f5a70b", C2 = "#fcd34d", L = "#dbe8fe", W = "#ffffff";
export const ART = {
  meter: `<circle cx="200" cy="200" r="150" fill="${W}" stroke="${N}" stroke-width="14"/>
    <circle cx="200" cy="200" r="118" fill="none" stroke="${L}" stroke-width="4" stroke-dasharray="6 10"/>
    <rect x="130" y="130" width="140" height="44" rx="6" fill="${N}"/>
    <text x="200" y="162" font-size="30" fill="${W}" text-anchor="middle" font-family="monospace" letter-spacing="6">00427</text>
    <g transform="rotate(35 200 250)"><path d="M200 250 L200 190" stroke="${C}" stroke-width="10" stroke-linecap="round"/></g>
    <circle cx="200" cy="250" r="14" fill="${C}"/>
    <path d="M40 200 H0 M360 200 H400" stroke="${N}" stroke-width="30"/>
    <path d="M300 330 q20 30 0 50 q-20 -20 0 -50z" fill="${C2}"/>`,
  pipes: `<path d="M20 120 H220 Q260 120 260 160 V330" fill="none" stroke="${C}" stroke-width="44"/>
    <path d="M20 250 H130 Q170 250 170 290 V380" fill="none" stroke="${L}" stroke-width="44"/>
    <path d="M380 60 V200 Q380 240 340 240 H300" fill="none" stroke="${N2}" stroke-width="44"/>
    <rect x="90" y="96" width="30" height="48" fill="${N}"/><rect x="236" y="220" width="48" height="30" fill="${N}"/>
    <rect x="356" y="120" width="48" height="30" fill="${C}"/><rect x="60" y="226" width="30" height="48" fill="${N}"/>`,
  bath: `<rect x="40" y="200" width="320" height="110" rx="20" fill="${W}" stroke="${N}" stroke-width="12"/>
    <path d="M70 310 l-10 40 M330 310 l10 40" stroke="${N}" stroke-width="12" stroke-linecap="round"/>
    <path d="M80 200 V90 Q80 60 110 60 Q140 60 140 90" fill="none" stroke="${N}" stroke-width="12"/>
    <path d="M125 100 h30" stroke="${C}" stroke-width="12" stroke-linecap="round"/>
    <path d="M40 360 H360" stroke="${C}" stroke-width="10" stroke-dasharray="18 12"/>
    <path d="M200 240 h120" stroke="${L}" stroke-width="10" stroke-linecap="round"/>`,
  toilet: `<rect x="120" y="40" width="160" height="110" rx="10" fill="${W}" stroke="${N}" stroke-width="12"/>
    <rect x="175" y="60" width="50" height="14" rx="7" fill="${C}"/>
    <path d="M100 170 H300 Q300 280 200 290 Q100 280 100 170z" fill="${W}" stroke="${N}" stroke-width="12"/>
    <path d="M160 290 L150 360 H250 L240 290" fill="${W}" stroke="${N}" stroke-width="12"/>
    <path d="M200 110 q14 22 0 34 q-14 -12 0 -34z" fill="${C}"/>
    <path d="M200 190 q18 28 0 42 q-18 -14 0 -42z" fill="${C2}"/>`,
  manhole: `<ellipse cx="200" cy="230" rx="170" ry="80" fill="${N}"/>
    <ellipse cx="200" cy="220" rx="150" ry="66" fill="${N2}" stroke="${L}" stroke-width="6"/>
    <path d="M90 220 H310 M110 195 H290 M110 245 H290" stroke="${L}" stroke-width="6"/>
    <path d="M60 300 q30 -20 60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="${C}" stroke-width="10"/>
    <path d="M150 110 q10 -30 0 -60 M200 110 q10 -30 0 -60 M250 110 q10 -30 0 -60" fill="none" stroke="${C2}" stroke-width="8" stroke-linecap="round"/>`,
  heater: `<rect x="120" y="40" width="160" height="300" rx="70" fill="${W}" stroke="${N}" stroke-width="12"/>
    <circle cx="200" cy="140" r="34" fill="${L}" stroke="${N}" stroke-width="8"/>
    <path d="M200 140 L218 122" stroke="${C}" stroke-width="8" stroke-linecap="round"/>
    <path d="M200 300 q-34 -40 0 -90 q34 50 0 90z" fill="${C}"/>
    <path d="M160 340 v40 M240 340 v40" stroke="${N}" stroke-width="16"/>
    <path d="M232 380 h60" stroke="${C}" stroke-width="16"/><path d="M108 380 h60" stroke="${L}" stroke-width="16"/>`,
  pump: `<rect x="60" y="150" width="190" height="130" rx="18" fill="${N}"/>
    <path d="M80 175 v80 M110 175 v80 M140 175 v80 M170 175 v80" stroke="${N2}" stroke-width="10"/>
    <circle cx="290" cy="215" r="60" fill="${W}" stroke="${N}" stroke-width="12"/>
    <circle cx="290" cy="215" r="16" fill="${C}"/>
    <path d="M290 155 V70 H380" fill="none" stroke="${C}" stroke-width="26"/>
    <path d="M350 215 H400" stroke="${L}" stroke-width="26"/>
    <rect x="50" y="280" width="310" height="22" fill="${N2}"/>`,
  tap: `<path d="M60 120 H230 Q280 120 280 170 V200" fill="none" stroke="${N}" stroke-width="44" stroke-linecap="round"/>
    <rect x="120" y="60" width="70" height="30" rx="8" fill="${C}"/><rect x="145" y="88" width="20" height="30" fill="${N}"/>
    <path d="M280 250 q22 34 0 52 q-22 -18 0 -52z" fill="${C}"/>
    <path d="M280 320 q16 26 0 38 q-16 -12 0 -38z" fill="${C2}"/>
    <path d="M180 380 H380" stroke="${L}" stroke-width="12" stroke-linecap="round"/>`,
  sun: `<circle cx="300" cy="100" r="54" fill="${C}"/>
    <g stroke="${C2}" stroke-width="10" stroke-linecap="round">
      <path d="M300 20 v-14 M300 194 v14 M220 100 h-14 M380 100 h14 M244 44 l-10 -10 M356 156 l10 10 M356 44 l10 -10 M244 156 l-10 10"/></g>
    <rect x="60" y="170" width="180" height="120" rx="14" fill="${W}" stroke="${N}" stroke-width="12"/>
    <path d="M60 210 H240" stroke="${L}" stroke-width="8"/>
    <path d="M150 290 V340 H380" fill="none" stroke="${N2}" stroke-width="24"/>
    <path d="M40 300 H260" stroke="${N}" stroke-width="14"/>`,
};
