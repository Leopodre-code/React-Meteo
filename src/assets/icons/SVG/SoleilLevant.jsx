import { useId } from "react";

// Icône « soleil levant » (carré avec ciel du matin et mer).
// Usage : <SoleilLevant size={48} />
export default function SoleilLevant({ size = 48, ...props }) {
  // Identifiants uniques : évitent les conflits si plusieurs icônes SVG
  // (lever + coucher, par exemple) sont affichées sur la même page.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ciel = `ciel-${uid}`;
  const mer = `mer-${uid}`;
  const soleil = `soleil-${uid}`;
  const halo = `halo-${uid}`;
  const carre = `carre-${uid}`;
  const auDessus = `au-dessus-${uid}`;

  // Angles des rayons autour du centre du soleil
  const angles = [0, -30, 30, -60, 60];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      role="img"
      aria-label="Icône lever de soleil : soleil qui monte au-dessus de la mer"
      {...props}
    >
      <defs>
        {/* Ciel du matin : bleu clair qui s'éclaircit en jaune pâle à l'horizon */}
        <linearGradient id={ciel} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a7bd5" />
          <stop offset="0.55" stopColor="#8ec5fc" />
          <stop offset="0.85" stopColor="#ffe29a" />
          <stop offset="1" stopColor="#fff1c1" />
        </linearGradient>
        <linearGradient id={mer} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4fa3c7" />
          <stop offset="1" stopColor="#1f5f8b" />
        </linearGradient>
        <linearGradient id={soleil} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset="1" stopColor="#ffd23f" />
        </linearGradient>
        <radialGradient
          id={halo}
          cx="128"
          cy="150"
          r="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
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

        {/* Halo, rayons, soleil (bien sorti de l'eau, coupé à l'horizon) */}
        <g clipPath={`url(#${auDessus})`}>
          <circle cx="128" cy="150" r="100" fill={`url(#${halo})`} />
          <g stroke="#ffd23f" strokeWidth="8" strokeLinecap="round">
            {angles.map((angle) => (
              <line
                key={angle}
                x1="128"
                y1="88"
                x2="128"
                y2="66"
                transform={`rotate(${angle} 128 150)`}
              />
            ))}
          </g>
          <circle cx="128" cy="150" r="48" fill={`url(#${soleil})`} />
        </g>

        {/* Reflets sur l'eau */}
        <g fill="#fff1c1" opacity="0.7">
          <rect x="98" y="172" width="60" height="6" rx="3" />
          <rect x="108" y="190" width="40" height="6" rx="3" />
          <rect x="116" y="208" width="24" height="5" rx="2.5" />
        </g>

        {/* Ligne d'horizon */}
        <line
          x1="0"
          y1="160"
          x2="256"
          y2="160"
          stroke="#fff1c1"
          strokeWidth="3"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
