import "./DayCard.css";
import { useRef, useEffect } from "react";

function DayCard(props) {
  let rain = props.bar;
  const cardRef = useRef(null);
  useEffect(() => {
    cardRef.current.style.background =
      "conic-gradient(var(--accent),var(--accent-2),var(--accent-3),var(--accent) )";
  }, []);
  // FAIRE EN SORTE QUE LES CARTES ONT DES COULEUR DES BACKGROUND SUIVANT LA TEMP2RATURE ET LE TEMPS ET UN PEU D4ALEATOIRE
  return (
    <div className="day-card" ref={cardRef}>
      <h5 className="dayName">{props.dayName}</h5>
      <h5 className="dayNumber">{props.dayNumber}</h5>
      <img src={props.icon} className="icon" />
      <h1 className="temp">
        {props.maxTemp}
        <span> {props.tempMode}</span>
      </h1>
      <span className="bar-container">
        <span className="bar-background">
          <span className="bar" style={{ height: `${rain}px` }}></span>
        </span>
      </span>
      <h6 className="info">{props.info}</h6>
    </div>
  );
}
export default DayCard;
