import "./DayCard.css";
import { useRef, useEffect } from "react";

function DayCard(props) {
  let rain = props.bar;
  const cardRef = useRef(null);
  useEffect(() => {
    // C1 et C2 , journée , C3, nuit
    let dayColorA = [
      "--temp-cold-a",
      "--temp-cool-a",
      "--temp-mild-a",
      "--temp-hot-a",
      "--temp-extreme-a",
    ];
    let dayColorB = [
      "--temp-cold-b",
      "--temp-cool-b",
      "--temp-mild-b",
      "--temp-hot-b",
      "--temp-extreme-b",
    ];
    let nightColor = [
      "--night-very-cold",
      "--night-cold",
      "--night-cool",
      "--night-mild",
      "--night-warm",
    ];
    let MTemp1 = Math.floor((props.maxTemp + 10) / 10);
    let MTemp2 = Math.round(props.maxTemp / 10);
    let mTemp = Math.floor((props.minTemp + 20) / 10);
    let C1 = dayColorA[MTemp1];
    let C2 = dayColorB[MTemp2];
    let C3 = nightColor[mTemp];

    cardRef.current.style.background = `conic-gradient(var(${C2}),var(${C3}),var(${C1}),var(${C2}) )`;
    cardRef.current.style.border = `solid 2px var(${C3})`;
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
