import "./DayWeather.css";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useState } from "react";
import SoleilLevant from "/src/assets/icons/svg/SoleilLevant";
import SoleilCouchant from "/src/assets/icons/svg/SoleilCouchant";

function DayWeather(props) {
  let data = props.dayWeather.time.map((heure, i) => ({
    hour: heure.slice(11, 13),
    temp: props.dayWeather.temperature_2m[i],
    wind: props.dayWeather.wind_speed_10m[i],
    snow: props.dayWeather.snowfall[i],
    rain: props.dayWeather.rain[i],
  })); // FAIRE UN TABLEAU POUR CHAQUE HEURE

  // DEFINI LES COULEURS

  function setRainColor() {
    let dayRain = Math.round(
      props.dayWeather.rain.reduce((acc, e) => acc + e, 0) / 1.5,
    );
    if (dayRain < 6) return "rain-light";
    if (dayRain < 16) return "rain-moderate";
    else return "rain-heavy";
  }
  function setTempColor() {
    const TEMPCOLORS = [
      "temp-cold-a",
      "temp-cool-a",
      "temp-mild-a",
      "temp-hot-a",
      "temp-extreme-a",
    ];
    let num = Math.round(
      props.dayWeather.temperature_2m.reduce((acc, e) => acc + e, 20) / 240,
    );
    if (num < 0) num = 0;
    if (num > 4) num = 4;
    return TEMPCOLORS[num];
  }
  const [graphic, setGraphic] = useState({
    wind: false,
    rain: false,
  });
  //  TROUVER LES INFOS POUR LA GRID INFO
  let date = new Date(props.daySelected.slice(0, 10));
  let jour = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="main">
      <ComposedChart width={"60%"} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="temp"
          stroke={`var(--${setTempColor()})`}
          fill="var(--accent-3)"
          fillOpacity={0.3}
        />
        {graphic.wind && (
          <Line
            dataKey="wind"
            stroke="var(--wind)"
            strokeOpacity={0.5}
            dot={false}
          />
        )}
        {props.dayWeather.snowfall.reduce((acc, e) => acc + e, 0) && (
          <Line dataKey="snow" stroke="var(--accent)" />
        )}
        {props.dayWeather.rain.reduce((acc, e) => acc + e, 0) && (
          <Area
            dataKey="rain"
            stroke={`var(--${setRainColor()})`}
            type="monotone"
            fill={`var(--${setRainColor()})`}
            fillOpacity={0.3}
          />
        )}
      </ComposedChart>
      <div className="info-container">
        <p className="date">{jour} Après J-C</p>
        <em className="credit">@Leopodre-2026</em>
        <div className="sun-icon">
          <SoleilLevant />
          <SoleilCouchant />
        </div>
        <div className="sun-hour">
          {props.dayWeather.sunrise && (
            <div>{props.dayWeather.sunrise.slice(11, 16)}</div>
          )}
          {props.dayWeather.sunset && (
            <div>{props.dayWeather.sunset.slice(11, 16)}</div>
          )}
        </div>
        <div className="settings">
          <label>
            Vent
            <input
              type="checkbox"
              checked={graphic.wind}
              onChange={(e) =>
                setGraphic((content) => ({
                  ...content,
                  wind: e.target.checked,
                }))
              }
            />
          </label>
          <label></label>
        </div>
        <div className="info"></div>
      </div>
    </div>
  );
}

export default DayWeather;
