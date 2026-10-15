import { useId } from "react";

// Icône « soleil couchant » (carré avec ciel du soir, étoiles et mer).
// Usage : <SoleilCouchant size={48} />
export default function SoleilCouchant({ size = 48, ...props }) {
  // Identifiants uniques : évitent les conflits si plusieurs icônes SVG
  // (lever + coucher, par exemple) sont affichées sur la même page.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ciel = `ciel-${uid}`;
  const mer = `mer-${uid}`;
  const soleil = `soleil-${uid}`;
  const halo = `halo-${uid}`;
  const carre = `carre-${uid}`;
  const auDessus = `au-dessus-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      role="img"
      aria-label="Icône coucher de soleil : soleil qui descend dans la mer"
      {...props}
    >
      <defs>
        {/* Ciel du soir : nuit violette en haut, rouge-orangé à l'horizon */}
        <linearGradient id={ciel} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1440" />
          <stop offset="0.45" stopColor="#5b2a6e" />
          <stop offset="0.8" stopColor="#d9434e" />
          <stop offset="1" stopColor="#ff8c42" />
        </linearGradient>
        <linearGradient id={mer} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a1d4d" />
          <stop offset="1" stopColor="#0d0a20" />
        </linearGradient>
        <linearGradient id={soleil} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="1" stopColor="#e8433a" />
        </linearGradient>
        <radialGradient
          id={halo}
          cx="128"
          cy="176"
          r="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ff7a59" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ff7a59" stopOpacity="0" />
        </radialGradient>
        <clipPath id={carre}>
          <rect width="256" height="256" rx="56" />
        </clipPath>
        <clipPath id={auDessus}>
          <rect x="0" y="0" width="256" height="160" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${carre})`}>
        {/* Ciel et mer */}
        <rect width="256" height="160" fill={`url(#${ciel})`} />
        <rect y="160" width="256" height="96" fill={`url(#${mer})`} />

        {/* Étoiles du soir */}
        <g fill="#fff3e0">
          <circle cx="52" cy="44" r="3" opacity="0.9" />
          <circle cx="200" cy="34" r="2.5" opacity="0.85" />
          <circle cx="182" cy="78" r="2" opacity="0.7" />
          <circle cx="78" cy="88" r="1.5" opacity="0.6" />
        </g>

        {/* Halo et soleil à moitié englouti (pas de rayons : il s'éteint) */}
        <g clipPath={`url(#${auDessus})`}>
          <circle cx="128" cy="176" r="100" fill={`url(#${halo})`} />
          <circle cx="128" cy="176" r="52" fill={`url(#${soleil})`} />
        </g>

        {/* Reflets sur l'eau */}
        <g fill="#ff8c42" opacity="0.6">
          <rect x="94" y="172" width="68" height="6" rx="3" />
          <rect x="106" y="190" width="44" height="6" rx="3" />
          <rect x="116" y="208" width="24" height="5" rx="2.5" />
        </g>

        {/* Ligne d'horizon */}
        <line
          x1="0"
          y1="160"
          x2="256"
          y2="160"
          stroke="#ff8c42"
          strokeWidth="3"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}
