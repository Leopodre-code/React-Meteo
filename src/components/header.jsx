import "./header.css";
import TrashIcon from "/src/assets/icons/SVG/TrashIcon";
import { useEffect, useState } from "react";

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
  }
  function deleteLocation(location) {
    props.setLocationsList(
      props.locationsList.filter((e) => e.location !== location),
    );
  }

  // variable pour les suggestions et ajout de cartes
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [ShearchData, setShearchData] = useState(); // affichage des cartes
  let locationsCards = props.locationsList.map((element) => {
    if (!element || !element.location) return;
    return (
      <div
        key={element.location}
        className="location-card"
        onClick={(e) => {
          e.stopPropagation();
          putCardFirst(element.location);
        }}
      >
        {element.location}
        <TrashIcon
          onClick={(e) => {
            e.stopPropagation();
            console.log(element.location);
            console.log(props.locationsList);
            deleteLocation(element.location);
          }}
          className="trash-icon"
        />
      </div>
    );
  });
  // suggérer des lieux
  async function getJSON(num) {
    let list;
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${text}&count=${num}&language=fr`,
      );
      list = await response.json();
    } catch (error) {
      console.log("une erreur s'est produite avec le JSON : " + error);
    }
    return list.results;
  }

  useEffect(() => {
    // suggestions
    if (text.slice().length < 2) return;
    getJSON(3).then((response) => {
      console.log(suggestions);
      if (!response) return;
      console.log(
        props.locationsList.map((e) => {
          return e;
        }),
      );
      console.log(response);
      setSuggestions([]);
      setSuggestions(
        response.map((e) => {
          if (
            props.locationsList
              .map((loc) => {
                return loc.location;
              })
              .includes(String(e.latitude))
          )
            // TERMINER LA VERIFICATION
            return;
          let info;
          if (e.admin3 && !e.admin3.includes(e.name)) info = e.admin3;
          else if (e.admin2 && !e.admin2.includes(e.name)) info = e.admin2;
          else info = e.country;
          return {
            location: e.name,
            id: e.id,
            info: info,
          };
        }),
      );
    });
  }, [text]);
  console.log(suggestions);

  // ajouter un lieu
  function addLocation(location) {
    if (!location) return;

    function addLocationToState(data) {
      if (data.admin4 && !data.admin4.includes(data.name)) return data.admin4;
      else if (data.admin3 && !data.admin3.includes(data.name))
        return data.admin3;
      else if (data.admin2 && !data.admin2.includes(data.name))
        return data.admin2;
      else if (data.admin1 && !data.admin1.includes(data.name))
        return data.admin1;

      props.setLocationsList([
        ...props.locationsList,
        {
          location: `${text}`,
          latitude: data[0].lat,
          longitude: data[0].lon,
          country: data[0].country,
          info: info,
          id: data[0].id,
        },
      ]);
    }
    //REFAIRE LA FONCTION ET CHANGER D'API POUR REPRENDRE LES DONNEE DES SUGGESTIONS D'OPEN METEO DEPUIS LA VARIABLE
    if (ShearchData) {
      addLocation(ShearchData);
      console.log("ajouté depuis les suggestions");
    } else
      getJSON(1).then((data) => {
        addLocationToState(data[0]);
      });
  }
  // sauvegarde
  useEffect(() => {
    localStorage.setItem("locationsList", JSON.stringify(props.locationsList));
  }, [props.locationsList]);
  // définir le mode utilisé
  // c = Celcius , f = Farhenheit
  return (
    <header>
      {locationsCards}
      <div className="add-card">
        <input
          value={text}
          onChange={(e) => {
            setShearchData(false);
            setText(e.target.value);
          }}
          type="text"
          placeholder="Paris"
          className="input-add-Card"
        ></input>
        {text.slice().length > 1 && suggestions.length > 0 && (
          <ul id="liste-locations">
            {suggestions.map((location) => (
              <li
                key={location.id}
                value={location.location}
                onClick={(location) => {
                  setShearchData(location);
                  setText(location.location);
                }}
              >
                <b>{location.location}</b>
                <i>{location.info}</i>
              </li>
            ))}
          </ul>
        )}
        <button className="button-add-Card" onClick={() => addLocation(text)}>
          +
        </button>
      </div>
    </header>
  );
}
export default Header;
