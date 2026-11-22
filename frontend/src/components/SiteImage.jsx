import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

/**
 * Image slot. Loads /images/<name>.webp (drop your AI-generated or real photos
 * into frontend/public/images — see IMAGE_PROMPTS.md for names, sizes and prompts).
 * Until that file exists, a designed illustration is shown instead of a broken image.
 *
 *   <SiteImage name="hero" alt="…" icon={Users} tone="#0b4bb3" ratio="16/10" />
 */
export default function SiteImage({ name, alt = "", icon = ImageIcon, tone = "#0b4bb3", ratio = "4/3", className = "", eager = false }) {
  const [failed, setFailed] = useState(false);
  const style = { aspectRatio: ratio };
  if (failed) return <Fallback icon={icon} tone={tone} alt={alt} className={className} style={style} />;
  return (
    <img
      className={`site-img ${className}`}
      src={`/images/${name}.webp`}
      alt={alt}
      style={style}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function Fallback({ icon: Icon, tone, alt, className, style }) {
  return (
    <div className={`site-img site-img-fallback ${className}`} style={{ ...style, "--tone": tone }} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      <svg className="fb-shapes" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="330" cy="40" r="120" fill="currentColor" opacity=".10" />
        <circle cx="40" cy="280" r="110" fill="currentColor" opacity=".08" />
        <circle cx="300" cy="250" r="46" fill="#f5b400" opacity=".22" />
        <g fill="currentColor" opacity=".16">
          {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={30 + (i % 6) * 16} cy={30 + Math.floor(i / 6) * 16} r="2.2" />)}
        </g>
      </svg>
      <span className="fb-icon"><Icon aria-hidden="true" /></span>
    </div>
  );
}

// Hero fallback: an original flat illustration — Chennai skyline with a temple
// gopuram, the sun, and a group of people including a wheelchair user and a
// person with a white cane.
export function HeroArt({ className = "" }) {
  return (
    <svg className={`hero-art ${className}`} viewBox="0 0 720 520" role="img" aria-label="Illustration of people with different disabilities together in Tamil Nadu">
      <defs>
        <linearGradient id="ha-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dbe8ff" /><stop offset="1" stopColor="#f4f8ff" /></linearGradient>
        <linearGradient id="ha-ground" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0b4bb3" /><stop offset="1" stopColor="#123d8f" /></linearGradient>
      </defs>
      <rect width="720" height="520" fill="url(#ha-sky)" />
      <circle cx="560" cy="120" r="70" fill="#f5b400" opacity=".85" />
      {/* gopuram */}
      <g fill="#b9cdf3">
        <path d="M120 380 L135 150 L205 150 L220 380 Z" />
        <path d="M128 260 h84 M131 220 h78 M134 185 h72" stroke="#a5bdea" strokeWidth="6" />
        <rect x="150" y="125" width="40" height="28" rx="4" />
        <circle cx="160" cy="118" r="5" /><circle cx="170" cy="114" r="5" /><circle cx="180" cy="118" r="5" />
      </g>
      {/* buildings */}
      <g fill="#c9d9f6"><rect x="250" y="260" width="70" height="120" rx="4" /><rect x="330" y="230" width="56" height="150" rx="4" /><rect x="610" y="250" width="80" height="130" rx="4" /><rect x="20" y="290" width="80" height="90" rx="4" /></g>
      {/* trees */}
      <g fill="#7fb8a1"><circle cx="460" cy="300" r="34" /><circle cx="500" cy="285" r="40" /><circle cx="60" cy="300" r="26" /></g>
      <rect x="0" y="380" width="720" height="140" fill="url(#ha-ground)" />
      <path d="M0 470 Q 360 400 720 455 L720 520 L0 520Z" fill="#f5b400" />
      <path d="M0 492 Q 360 430 720 480 L720 520 L0 520Z" fill="#0a2a66" />
      {/* person 1: standing, sari */}
      <g transform="translate(250 230)">
        <circle cx="40" cy="22" r="20" fill="#8d5a3b" /><path d="M22 16 q18 -26 38 0 v-8 q-18 -18 -38 0z" fill="#1d1d2b" />
        <path d="M14 60 q26 -20 52 0 l10 120 h-72z" fill="#e8517a" /><path d="M20 70 l40 100" stroke="#f5b400" strokeWidth="8" />
      </g>
      {/* person 2: wheelchair user */}
      <g transform="translate(360 268)">
        <circle cx="46" cy="18" r="18" fill="#a06a45" /><path d="M28 12 q18 -24 36 0 v-6 q-18 -16 -36 0z" fill="#22222f" />
        <rect x="26" y="40" width="40" height="52" rx="14" fill="#2f6fd8" />
        <path d="M30 88 h52 v14 h-52z" fill="#2f6fd8" /><path d="M82 100 v40" stroke="#f0f4ff" strokeWidth="8" strokeLinecap="round" />
        <circle cx="40" cy="128" r="30" fill="none" stroke="#1b2540" strokeWidth="7" /><circle cx="40" cy="128" r="5" fill="#1b2540" />
        <circle cx="92" cy="150" r="8" fill="#1b2540" />
      </g>
      {/* person 3: white cane */}
      <g transform="translate(480 220)">
        <circle cx="38" cy="22" r="20" fill="#7a4a30" /><rect x="22" y="2" width="34" height="10" rx="5" fill="#1b2540" />
        <rect x="16" y="44" width="44" height="80" rx="16" fill="#f5b400" /><rect x="20" y="120" width="16" height="66" rx="7" fill="#1b2540" /><rect x="40" y="120" width="16" height="66" rx="7" fill="#1b2540" />
        <path d="M62 100 L104 186" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" /><path d="M98 174 L104 186" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* person 4: child with hearing aid */}
      <g transform="translate(160 290)">
        <circle cx="30" cy="16" r="16" fill="#9b6040" /><path d="M14 12 q16 -22 32 0 v-6 q-16 -14 -32 0z" fill="#1d1d2b" /><circle cx="46" cy="18" r="4" fill="#f5b400" />
        <rect x="12" y="34" width="36" height="58" rx="14" fill="#14a38b" /><rect x="15" y="88" width="12" height="40" rx="6" fill="#1b2540" /><rect x="33" y="88" width="12" height="40" rx="6" fill="#1b2540" />
      </g>
    </svg>
  );
}