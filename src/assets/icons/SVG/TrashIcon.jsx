// Icône « poubelle » (supprimer, sans fond).
// La taille se règle en CSS avec une classe : <TrashIcon className="trash-icon" />
// La couleur suit la propriété CSS `color` (grâce à currentColor).
export default function TrashIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Supprimer"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Couvercle et poignée */}
      <path d="M3 6h18" />
      <path d="M9 6V4h6v2" />
      {/* Corps de la poubelle */}
      <path d="M5 6l1 14h12l1-14" />
      {/* Rainures */}
      <path d="M10 10v6" />
      <path d="M14 10v6" />
    </svg>
  );
}
