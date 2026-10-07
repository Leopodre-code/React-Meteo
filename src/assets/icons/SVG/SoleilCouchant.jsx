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

  // Angles des rayons autour du centre du soleil
  const angles = [0, -30, 30, -60, 60];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      role="img"
      aria-label="Icône soleil couchant sur fond de ciel"
      {...props}
    >
      <defs>
        <linearGradient id={ciel} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1f4f" />
          <stop offset="0.4" stopColor="#8a3f7a" />
          <stop offset="0.75" stopColor="#ff6a4d" />
          <stop offset="1" stopColor="#ffb35a" />
        </linearGradient>
        <linearGradient id={mer} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2a5e" />
          <stop offset="1" stopColor="#150f2a" />
        </linearGradient>
        <linearGradient id={soleil} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="1" stopColor="#ff5a3c" />
        </linearGradient>
        <radialGradient
          id={halo}
          cx="128"
          cy="168"
          r="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffb08a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffb08a" stopOpacity="0" />
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

        {/* Quelques étoiles du soir */}
        <g fill="#fff3e0">
          <circle cx="60" cy="48" r="2.5" opacity="0.9" />
          <circle cx="196" cy="36" r="2" opacity="0.8" />
          <circle cx="168" cy="70" r="1.5" opacity="0.6" />
        </g>

        {/* Halo, rayons, soleil (coupés à l'horizon) */}
        <g clipPath={`url(#${auDessus})`}>
          <circle cx="128" cy="168" r="100" fill={`url(#${halo})`} />
          <g stroke="#ff9a5a" strokeWidth="8" strokeLinecap="round">
            {angles.map((angle) => (
              <line
                key={angle}
                x1="128"
                y1="106"
                x2="128"
                y2="84"
                transform={`rotate(${angle} 128 168)`}
              />
            ))}
          </g>
          <circle cx="128" cy="168" r="48" fill={`url(#${soleil})`} />
        </g>

        {/* Reflets sur l'eau */}
        <g fill="#ff9a5a" opacity="0.6">
          <rect x="98" y="174" width="60" height="6" rx="3" />
          <rect x="108" y="192" width="40" height="6" rx="3" />
          <rect x="116" y="210" width="24" height="5" rx="2.5" />
        </g>

        {/* Ligne d'horizon */}
        <line
          x1="0"
          y1="160"
          x2="256"
          y2="160"
          stroke="#ffb35a"
          strokeWidth="3"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}
