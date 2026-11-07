// Icône « plus d'options » (trois petits points, sans fond).
// La taille se règle en CSS avec une classe : <MoreIcon className="more-icon" />
// La couleur suit la propriété CSS `color` (grâce à currentColor).
export default function MoreIcon(props) {
  // Positions horizontales des trois points
  const positions = [5, 12, 19];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Plus d'options"
      fill="currentColor"
      {...props}
    >
      {positions.map((x) => (
        <circle key={x} cx={x} cy="12" r="2" />
      ))}
    </svg>
  );
}
