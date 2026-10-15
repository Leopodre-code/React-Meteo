// Icône « flocon de neige » (sans fond).
// La taille se règle en CSS avec une classe : <Flocon className="flocon" />
// La couleur suit la propriété CSS `color` (grâce à currentColor).
export default function Flocon(props) {
  // Angles des 6 branches autour du centre
  const angles = [0, 60, 120, 180, 240, 300];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role="img"
      aria-label="Icône flocon de neige"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {angles.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 32 32)`}>
          {/* Tige de la branche */}
          <line x1="32" y1="32" x2="32" y2="5" />
          {/* Petites ramifications en V */}
          <path d="M25 9 L32 15 L39 9" />
          <path d="M27 18 L32 22 L37 18" />
        </g>
      ))}
      {/* Cœur hexagonal */}
      <path d="M32 26 L37.2 29 L37.2 35 L32 38 L26.8 35 L26.8 29 Z" />
    </svg>
  );
}
