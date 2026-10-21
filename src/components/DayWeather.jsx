import "./DayWeather.css";

// FAIRE LA METHODE 2 DEGRADE PUIS FAIRE UNE NOUVELLE BRANCHE GITHUB

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
  }));
  let temp1 = Math.floor(Math.min(...props.dayWeather.temperature_2m) / 10 + 1); // plus petite temp
  console.log(temp1);
  // DEFINI LES COULEURS
  function setRainColor() {
    let dayRain = Math.round(
      props.dayWeather.rain.reduce((acc, e) => acc + e, 0) / 1.5,
    );
    if (dayRain < 6) return "rain-light";
    if (dayRain < 16) return "rain-moderate";
    else return "rain-heavy";
  }
  function setTempColor(temps, mode = "temp") {
    const TEMPCOLORS = [
      "temp-cold-",
      "temp-cool-",
      "temp-mild-",
      "temp-hot-",
      "temp-extreme-",
    ];
    let num;
    if (mode === "temp") {
      num = Math.floor(
        (temps.reduce((acc, e) => acc + e, 0) / temps.length + 10) / 10,
      );
    } else if (mode === "zone") num = temps;
    if (num < 0) num = 0;
    if (num > 4) num = 4;
    return TEMPCOLORS[num];
  }
  function setGradientColors() {
    let actualZone = Math.floor(props.dayWeather.temperature_2m[0] / 10 + 1);
    let tempsColors = [{ pos: 0, toColor: actualZone }];
    props.dayWeather.temperature_2m.map((e, i) => {
      if (Math.floor(e / 10 + 1) !== actualZone) {
        actualZone = Math.floor(e / 10 + 1);
        tempsColors.push({ pos: i, toColor: actualZone });
      }
    });

    let gradientColors = tempsColors.map((e, i, array) => {
      if (!array[i + 1])
        return (
          <stop
            offset="1"
            key={i}
            stopColor={`var(--${setTempColor([e.toColor], "zone")}a)`}
          />
        ); // Si c'est le dernier le mettre a la fin avec la dernière couleur qui change
      let offset = Math.round(((e.pos + array[i + 1].pos) / 48) * 100) / 100; // offset au centième près
      let color = setTempColor([e.toColor], "zone");
      return <stop offset={offset} key={i} stopColor={`var(--${color}a)`} />;
    });
    return gradientColors;
  }
  let gradientColors = setGradientColors();

  const [graphic, setGraphic] = useState({
    wind: false,
    rain: false,
  });
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
        <defs>
          <linearGradient id="temp-gradient" x1="0" x2="1" y1="1" y2="1">
            {[gradientColors]}
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis yAxisId="temp" />
        <YAxis yAxisId="cond" hide domain={[0, 60]} orientation="right" />
        <YAxis yAxisId="rain" hide domain={[0, 10]} orientation="right" />

        <Tooltip />
        <Area
          type="monotone"
          dataKey="temp"
          stroke="url(#temp-gradient)"
          fill="url(#temp-gradient)"
          fillOpacity={0.6}
          yAxisId="temp"
          strokeWidth={2}
          className="temp-gradient"
        />
        {graphic.wind && (
          <Line
            dataKey="wind"
            stroke="var(--wind)"
            strokeOpacity={0.5}
            dot={false}
            yAxisId="cond"
            strokeWidth={3}
          />
        )}
        {props.dayWeather.snowfall.reduce((acc, e) => acc + e, 0) && (
          <Line dataKey="snow" stroke="var(--accent)" yAxisId="rain" />
        )}
        {props.dayWeather.rain.reduce((acc, e) => acc + e, 0) && (
          <Area
            dataKey="rain"
            strokeWidth={1.3}
            stroke={`var(--${setRainColor()})`}
            type="monotone"
            fill={`var(--${setRainColor()})`}
            fillOpacity={0.3}
            yAxisId="rain"
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
