// Icône « pas d'UV » (soleil barré).
export default function SansUV(props) {
  // Angles des 8 rayons autour du soleil
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Pas d'UV"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      {/* Soleil */}
      <circle cx="12" cy="12" r="4" />
      {angles.map((angle) => (
        <line
          key={angle}
          x1="12"
          y1="2.5"
          x2="12"
          y2="4.5"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
      {/* Barre en diagonale */}
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );
}
