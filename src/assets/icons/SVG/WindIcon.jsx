// Icône « vent » (trois rafales, sans fond).
// La taille se règle en CSS avec une classe : <WindIcon className="wind-icon" />
// La couleur suit la propriété CSS `color` (grâce à currentColor).
export default function WindIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Icône vent"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Rafale du haut, qui s'enroule vers le haut */}
      <path d="M2 9h10a3 3 0 1 0-3-3" />
      {/* Rafale du milieu, qui s'enroule vers le bas */}
      <path d="M2 13h15a3 3 0 1 1-3 3" />
      {/* Petite rafale du bas */}
      <path d="M4 17h5" />
    </svg>
  );
}
