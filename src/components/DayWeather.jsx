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
    UV: props.dayWeather.uv_index[i],
  })); // plus petite temp  // DEFINI LES COULEURS
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

  function setUVColor(UV, mode = "UV") {
    const UVCOLORS = [
      "uv-low",
      "uv-moderate",
      "uv-high",
      "uv-very-hight",
      "uv-extreme",
    ];
    let zone;
    if (mode === "UV") {
      if (UV < 2) zone = 0;
      else if (UV < 5) zone = 1;
      else if (UV < 7) zone = 2;
      else if (UV < 10) zone = 3;
      else if (UV > 11) zone = 4;
    } else if (mode === "zone") zone = UV;
    return UVCOLORS[zone];
  }

  function setTempGradientColors() {
    let actualZone = props.dayWeather.temperature_2m[0];
    let tempsColors = [{ pos: 0, temp: actualZone }];
    props.dayWeather.temperature_2m.map((e, i) => {
      if (!(i % 4)) {
        actualZone = e;
        tempsColors.push({ pos: i, temp: actualZone });
      }
    });

    let gradientColors = tempsColors.map((e, i) => {
      let offset = Math.round(e.pos / 0.24) / 100;
      console.log(e.temp);
      return (
        <stop
          offset={offset}
          key={i}
          stopColor={`var(--${setTempColor([e.temp])}a)`}
        />
      );
    });
    return gradientColors;
  }
  let tempGradientColors = setTempGradientColors();

  function setUVGradientColors() {
    let actualZone = props.dayWeather.uv_index[0];
    let UVColors = [{ pos: 0, UV: actualZone }];
    props.dayWeather.uv_index.map((e, i) => {
      if (!(i % 2)) {
        actualZone = e;
        UVColors.push({ pos: i, UV: actualZone });
      }
    });
    let gradientColors = UVColors.map((e, i) => {
      let offset = Math.round(e.pos / 0.24) / 100;
      return (
        <stop
          offset={offset}
          key={i}
          stopColor={`var(--${setUVColor([e.UV])})`}
        />
      );
    });
    return gradientColors;
    // FAIRE LA MEME FONCTION QUE POUR LES TEMP POUR FAZIRE UN DEGRADE DU GRADIENT DES UVS
  }
  let UVGradientColors = setUVGradientColors();

  const [graphic, setGraphic] = useState({
    wind: false,
    rain: false,
    UV: true,
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
            {[tempGradientColors]}
          </linearGradient>
          <linearGradient id="UV-gradient" x1="0" x2="1" y1="1" y2="1">
            {[UVGradientColors]}
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis yAxisId="temp" />
        <YAxis yAxisId="cond" hide domain={[0, 60]} orientation="right" />
        <YAxis yAxisId="rain&UV" hide domain={[0, 10]} orientation="right" />

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
        {graphic.UV && (
          <Line
            dataKey="UV"
            stroke="url(#UV-gradient)"
            strokeOpacity={1}
            dot={false}
            yAxisId="rain&UV"
            strokeWidth={3}
          />
        )}
        {props.dayWeather.snowfall.reduce((acc, e) => acc + e, 0) && (
          <Line dataKey="snow" stroke="var(--accent)" yAxisId="rain" />
        )}
        {props.dayWeather.rain.reduce((acc, e) => acc + e, 0) && (
          <Area
            dataKey="rain&UV"
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
          <label>
            UV
            <input
              type="checkbox"
              checked={graphic.UV}
              onChange={(e) =>
                setGraphic((content) => ({
                  ...content,
                  UV: e.target.checked,
                }))
              }
            />
          </label>
        </div>
        <div className="info"></div>
      </div>
    </div>
  );
}

export default DayWeather;
