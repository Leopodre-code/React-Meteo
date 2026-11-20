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
  const [errorMessage, setErrorMessage] = useState();
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
        <b> {element.location} </b>
        {element.info}
        <i> {element.country}</i>
        <TrashIcon
          onClick={(e) => {
            e.stopPropagation();
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
      console.log(error);
    }
    return list?.results;
  }
  useEffect(() => {
    // suggestions
    if (text.slice().length < 2) return;
    getJSON(3).then((response) => {
      if (!response) return;

      setSuggestions([]);
      setSuggestions(
        response
          .map((e) => {
            let info;
            if (e.admin3 && !e.admin3.includes(e.name)) info = e.admin3;
            else if (e.admin2 && !e.admin2.includes(e.name)) info = e.admin2;
            else info = e.country;
            return {
              location: e.name,
              id: e.id,
              info: info,
              latitude: e.latitude,
              longitude: e.longitude,
              country: e.country,
            };
          })
          .filter(
            (e) =>
              !props.locationsList
                .map((loc) => {
                  return loc.id;
                })
                .includes(e.id),
          ),
      );
    });
  }, [text]);

  // ajouter un lieu
  function addLocation(location) {
    if (!location) return;

    function addLocationToState(data) {
      if (
        props.locationsList
          .map((loc) => {
            return loc.id;
          })
          .includes(data.id)
      ) {
        setErrorMessage("Location already exist");
        return;
      }
      setErrorMessage();

      let info;
      if (data.admin4 && !data.admin4.includes(data.name)) info = data.admin4;
      else if (data.admin3 && !data.admin3.includes(data.name))
        info = data.admin3;
      else if (data.admin2 && !data.admin2.includes(data.name))
        info = data.admin2;
      else if (data.admin1 && !data.admin1.includes(data.name))
        info = data.admin1;
      props.setLocationsList([
        ...props.locationsList,
        {
          location: `${text}`,
          latitude: data.latitude,
          longitude: data.longitude,
          country: data.country,

          info: info ?? data.info,
          id: data.id,
        },
      ]);
    }
    if (ShearchData) {
      addLocationToState(ShearchData);
      setShearchData();
    } else
      getJSON(1).then((data) => {
        // ville introuvable (ou pas de connexion) : on prévient au lieu de planter
        if (!data?.[0]) {
          setErrorMessage("Location not found");
          return;
        }
        addLocationToState(data[0]);
      });
    // Ne pas mettre de code ici svp
  }
  // sauvegarde
  useEffect(() => {
    localStorage.setItem("locationsList", JSON.stringify(props.locationsList));
  }, [props.locationsList]);
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
                onClick={() => {
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
      <div className="error-message">
        {errorMessage && (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                d="M12 3 L22 20 H2 Z"
                fill="#d32f2f"
                stroke="#8b0000"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              {/* Point d'exclamation : la barre, puis le point */}
              <line
                x1="12"
                y1="9"
                x2="12"
                y2="14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="17" r="1.1" fill="white" />
            </svg>
            {errorMessage}
          </>
        )}
      </div>
    </header>
  );
}
export default Header;
