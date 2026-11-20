import Header from "/src/components/header.jsx";
import DayCard from "./components/DayCard.jsx";
import DayWeather from "./components/DayWeather.jsx";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import cloudy from "./assets/icons/cloud.png";
// import moon from "./assets/icons/moon.png";
import rainy from "./assets/icons/rain.png";
import snowy from "./assets/icons/snow.png";
//import stormy from "./assets/icons/storm.png";
//import sunCloud from "./assets/icons/sun-cloud.png";
import sunny from "./assets/icons/sun.png";
import windy from "./assets/icons/wind.svg";

function App() {
  const [dayCards, setDayCard] = useState([]);
  const [dayCardsNumber, setDayCardNumber] = useState(() => {
    if (localStorage.getItem("dayCardsNumber"))
      return Number(localStorage.getItem("dayCardsNumber"));
    else return 7;
  });
  // locationsList
  const [locationsList, setLocationsList] = useState(() => {
    if (
      localStorage.getItem("locationsList") &&
      JSON.parse(localStorage.getItem("locationsList"))?.length > 0
    )
      return JSON.parse(localStorage.getItem("locationsList"));
    else
      return [
        {
          location: "Paris",
          latitude: 48.85341,
          longitude: 2.3488,
          country: "France",
          info: "Île-de-France",
          id: 2988507,
        },
      ];
  });

  const [mode, setMode] = useState("°C");
  const [scrollDist, setScrollDist] = useState(0);
  const [scrollDistTotal, setScrollDistTotal] = useState(10000);
  const [data, setData] = useState();
  const [daySelected, setDaySelected] = useState("");
  let latitude = locationsList[0].latitude;
  let longitude = locationsList[0].longitude;
  async function getJSON() {
    let list;

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,uv_index_max,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_sum,snowfall_sum&hourly=temperature_2m,snowfall,rain,wind_speed_10m,precipitation,uv_index&models=best_match&current=temperature_2m,rain,precipitation&timezone=Europe%2FBerlin&forecast_days=${dayCardsNumber}&past_hours=24`,
      );
      list = await response.json();
    } catch (error) {
      console.log("une erreur s'est produite avec le JSON : " + error);
    }
    return list;
  }

  useEffect(() => {
    getJSON().then((data) => {
      if (!data?.daily) {
        setDayCard(
          <p>
            Erreur de communication avec OpenMeteo... Vérifie ta connection
          </p>,
        );
        return;
      } // si erreur
      localStorage.setItem("dayCardsNumber", dayCardsNumber);
      setData(data);
      let days = data.daily.time;
      let dayCardsLoop = [];
      // jour sélectionné : celui sauvegardé s'il existe encore dans les prévisions, sinon le premier
      const sauvegarde = localStorage.getItem("daySelected");
      const jourChoisi = days.map((day) => `${day}T00:00`).includes(sauvegarde)
        ? sauvegarde
        : `${days[0]}T00:00`;
      setDaySelected(jourChoisi);

      for (let i = 0; i < days.length; i++) {
        let dateTool = new Date(days[i]);
        let dateHourly = `${days[i]}T00:00`;
        const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        // Toute les données de la dayCard
        let dayName = jours[dateTool.getDay()];
        let dayNumber = dateTool.getDate();

        let maxTemp = Math.round(data.daily.temperature_2m_max[i]);
        let minTemp = Math.round(data.daily.temperature_2m_min[i]);
        let tempMode = data.current_units.temperature_2m;

        let UV = data.daily.uv_index_max[i];
        let rain = data.daily.precipitation_sum[i];
        let snowFall = data.daily.snowfall_sum[i];
        let info = "";
        let wind = data.daily.wind_speed_10m_max[i];

        let icon = cloudy;
        if (snowFall > 0.5) {
          info += `Snowy day`;
          icon = snowy;
        } else if (rain > 15) {
          info += `rainy day`;
          icon = rainy;
        } else if (UV >= 4) {
          icon = sunny;
        } else if (wind > 35) {
          icon = windy;
        }
        if (UV >= 6) info += `hight UV index (${UV})`;
        let rainBar = Math.max(14, Math.min(140, Math.round(rain * 4)));
        let snowBar = Math.max(8, Math.min(129, Math.round(snowFall * 4.3)));
        if (rain < 1.5) rainBar = 0;
        if (snowFall < 0.5) snowBar = 0;
        let selected;

        if (dateHourly === jourChoisi) selected = "selected";
        dayCardsLoop.push(
          <DayCard
            key={dayNumber}
            dayName={dayName}
            dayNumber={dayNumber}
            maxTemp={maxTemp}
            minTemp={minTemp}
            tempMode={tempMode}
            info={info}
            icon={icon}
            rainBar={rainBar}
            snowBar={snowBar}
            dateHourly={dateHourly}
            setDaySelected={setDaySelected}
            daySelected={daySelected}
            selected={selected}
          ></DayCard>,
        );
      }
      setDayCard(dayCardsLoop);
    });
  }, [locationsList, dayCardsNumber]); // Création des DayCards
  useEffect(() => {
    function setSize() {
      setScrollDistTotal(
        dayCardsSliderRef.current.scrollWidth -
          dayCardsSliderRef.current.clientWidth,
      );
    }
    setSize();
    window.addEventListener("resize", setSize);
    return () => {
      window.removeEventListener("resize", setSize);
    };
  }, [dayCards]);
  useEffect(() => {
    if (!daySelected) return;
    localStorage.setItem("daySelected", daySelected);

    document.querySelectorAll(".day-card.selected").forEach((card) => {
      card.classList.remove("selected");
    });
    document
      .querySelector(`[data-date="${daySelected}"]`)
      ?.classList.add("selected");
  }, [daySelected]); // daySelected

  // card slider
  const dayCardsSliderRef = useRef(null);
  function scroll(direction) {
    setScrollDistTotal(
      dayCardsSliderRef.current.scrollWidth -
        dayCardsSliderRef.current.clientWidth,
    );
    let distance =
      scrollDistTotal /
        Math.round(
          (dayCardsSliderRef.current.scrollWidth /
            dayCardsSliderRef.current.clientWidth) *
            1.2,
        ) +
      10;

    if (direction === "L") distance = -distance;
    dayCardsSliderRef.current.scrollBy({ left: distance, behavior: "smooth" });
  }
  /* Partie graphique */

  let dayWeatherStartIndex;
  let dayWeather = {
    temperature_2m: [],
    wind_speed_10m: [],
    rain: [],
    snowfall: [],
    time: [],
    uv_index: [],
  };
  if (data) {
    dayWeatherStartIndex = data.hourly.time.indexOf(daySelected);
    Object.keys(dayWeather).forEach((e) => {
      dayWeather[e] = data.hourly[e].slice(
        dayWeatherStartIndex,
        dayWeatherStartIndex + 24,
      );
    });
    dayWeather.sunrise = data.daily.sunrise.find((e) =>
      e.startsWith(daySelected.slice(0, 10)),
    );
    dayWeather.sunset = data.daily.sunset.find((e) =>
      e.startsWith(daySelected.slice(0, 10)),
    );
  }
  return (
    <>
      <Header
        locationsList={locationsList}
        setLocationsList={setLocationsList}
        mode={mode}
        setMode={(valeur) => setMode(valeur)}
      ></Header>
      <div className="day-cards-container-container">
        {scrollDist > 10 && (
          <button
            className="scroll-button scroll-button-left"
            onClick={() => scroll("L")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="button-icon"
            >
              <path
                transform="scale(-1, 1) translate(-100, 0)"
                d="M 20,34 L 20,66 Q 20,80 32.70,74.13 L 72.30,55.87 Q 85,50 72.30,44.13 L 32.70,25.87 Q 20,20 20,34 Z"
              />
            </svg>
          </button>
        )}
        {scrollDist < scrollDistTotal - 1 && (
          <button
            className="scroll-button scroll-button-right"
            onClick={() => scroll("R")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="button-icon"
            >
              <path d="M 20,34 L 20,66 Q 20,80 32.70,74.13 L 72.30,55.87 Q 85,50 72.30,44.13 L 32.70,25.87 Q 20,20 20,34 Z" />
            </svg>
          </button>
        )}
        {dayCardsNumber < 8 && (
          <button
            className="add-day-cards-button"
            onClick={() => setDayCardNumber(16)}
          >
            +
          </button>
        )}
        <div
          ref={dayCardsSliderRef}
          onScroll={() => setScrollDist(dayCardsSliderRef.current.scrollLeft)}
          className="day-cards-container"
        >
          {dayCards}
        </div>
      </div>
      <DayWeather
        daySelected={daySelected}
        dayWeather={dayWeather}
        data={data}
      ></DayWeather>
    </>
  );
}
export default App;
