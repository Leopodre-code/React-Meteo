import "./header.css";
import { useState } from "react";

function Header(props) {
  // fonction pour mettre les carte en premier
  function putCardFirst(location) {
    let other = props.locationsList.filter(
      (element) => element.location !== location,
    );
    let element = props.locationsList.filter(
      (element) => element.location === location,
    );
    props.setLocationsList([...element, ...other]);
    console.log(props.locationsList);
  }

  // acquérir l'input
  const [text, setText] = useState("");

  // affichage des cartes
  let locationsCards = props.locationsList.map((element) => {
    if (!element || !element.location) return;
    return (
      <div
        key={element.location}
        className="location-card"
        onClick={() => putCardFirst(element.location)}
      >
        {element.location}
      </div>
    );
  });
  // ajouter un lieu
  function addLocation(location) {
    if (!location) return;
    console.log(location);
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`,
      {
        headers: { "User-Agent": "MonAppli/1.0" },
      },
    )
      .then((reponse) => reponse.json())
      .then((data) => {
        console.log();
        props.setLocationsList([
          ...props.locationsList,
          {
            location: `${text}`,
            latitude: data[0].lat,
            longitude: data[0].lon,
          },
        ]);
      });
  }

  // définir le mode utilisé
  // c = Celcius , f = Farhenheit
  return (
    <header>
      {locationsCards}
      <div className="add-card">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Paris"
          className="input-add-Card"
        ></input>
        <button className="button-add-Card" onClick={() => addLocation(text)}>
          +
        </button>
      </div>
      <select onChange={(e) => props.setMode(e.target.value)}>
        <option value="c">Celsiuc °C</option>
        <option value="f">Farhenheit °F</option>
      </select>
    </header>
  );
}
export default Header;
