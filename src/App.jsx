// import { useState } from "react";
import Header from "/src/components/header.jsx";
import DayCard from "./components/DayCard.jsx";
import DayWeather from "./components/DayWeather.jsx";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import cloudy from "./assets/icons/cloud.png";
// import moon from "./assets/icons/moon.png";
import rainy from "./assets/icons/rain.png";
import snowy from "./assets/icons/snow.png";
import stormy from "./assets/icons/storm.png";
import sunCloud from "./assets/icons/sun-cloud.png";
import sunny from "./assets/icons/sun.png";

function App() {
  const [dayCards, setDayCard] = useState([]);
  const [locationsList, setLocationsList] = useState([
    { location: "Schoenau", latitude: "48.2236", longitude: "7.6467" },
    { location: "Kerbach", latitude: "49.1672", longitude: "6.9658" },
  ]);
  const [mode, setMode] = useState("°C");
  const [scrollDist, setScrollDist] = useState(0);
  const [data, setData] = useState();
  const [daySelected, setDaySelected] = useState("");
  let latitude = locationsList[0].latitude;
  let longitude = locationsList[0].longitude;
  async function getJSON() {
    let list;
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,uv_index_max,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_sum&hourly=temperature_2m,snowfall,rain,wind_speed_10m,precipitation&models=best_match&current=temperature_2m,rain,precipitation&timezone=Europe%2FBerlin&forecast_days=7&past_hours=24`,
      );
      list = await response.json();
    } catch (error) {
      console.log("une erreur s'est produite avec le JSON : " + error);
    }
    return list;
  }
  useEffect(() => {
    getJSON().then((data) => {
      console.log(data);
      // tout le code pour crée une dayCard :
      setData(data);
      let days = data.daily.time;
      let dayCardsLoop = [];
      setDaySelected(days[0]);

      for (let i = 0; i < days.length; i++) {
        let date = new Date(days[i]);
        const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        let dayName = jours[date.getDay()];
        let dayNumber = date.getDate();

        let maxTemp = Math.round(data.daily.temperature_2m_max[i]);
        let minTemp = Math.round(data.daily.temperature_2m_min[i]);
        let tempMode = data.current_units.temperature_2m;

        let UV = data.daily.uv_index_max[i];
        let rain = data.daily.precipitation_sum[i];
        let info = "";
        let icon = cloudy;
        if (rain > 15) {
          info += `rainy day`;
          icon = rainy;
        } else if (UV >= 4) {
          icon = sunny;
          if (UV >= 6) info += `hight UV index (${UV})`;
        }
        let bar = Math.max(14, Math.min(140, Math.round(rain * 4)));
        if (rain < 1.5) bar = 0;
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
            bar={bar}
            day={date}
            setDaySelected={setDaySelected}
          ></DayCard>,
        );
      }
      setDayCard(dayCardsLoop);
    });
  }, [locationsList]);
  // card slider
  const dayCardsSliderRef = useRef(null);
  function scroll(distance) {
    dayCardsSliderRef.current.scrollBy({ left: distance, behavior: "smooth" });
    setScrollDist((prev) => prev + Number(distance));
  }
  useEffect(() => {
    console.log(daySelected);
    // CREE LE TABLEAU EN FONCTION DU DAY SELECTIONNE
  }, [daySelected]);
  let dayWeatherData = data;
  console.log(data);
  return (
    <>
      <Header
        locationsList={locationsList}
        setLocationsList={setLocationsList}
        mode={mode}
        setMode={(valeur) => setMode(valeur)}
      ></Header>
      <div ref={dayCardsSliderRef} className="day-cards-container">
        {scrollDist < dayCards.length * 105 - 50 && (
          <button className="scroll-button-right" onClick={() => scroll("350")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="button-icon"
            >
              <path d="M 20,34 L 20,66 Q 20,80 32.70,74.13 L 72.30,55.87 Q 85,50 72.30,44.13 L 32.70,25.87 Q 20,20 20,34 Z" />
            </svg>
          </button>
        )}
        {scrollDist > 10 && (
          <button className="scroll-button-left" onClick={() => scroll("-350")}>
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
        {dayCards}
      </div>
      <DayWeather data={dayWeatherData}></DayWeather>
    </>
  );
}
export default App;
