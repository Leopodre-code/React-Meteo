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
  let temp1Chunk = Math.floor(
    Math.min(...props.dayWeather.temperature_2m) / 10,
  ); // Section de température couleur 1
  let temp1S = true; // état de mettre (ou pas) temp1
  let temp2S = false; // état de mettre (ou pas) temp2
  let NextDesactivate = false;

  let data = props.dayWeather.time.map((heure, i) => {
    if (NextDesactivate === true) {
      NextDesactivate = false;
      temp1S = false;
    } // fonction pour désactiver en retard le temp1

    if (Math.floor(props.dayWeather.temperature_2m[i] / 10) === temp1Chunk)
      temp1S = true; // Si c'est dans le chunk 1 alors le mettre dans le tableau
    else if (temp1S === true) {
      temp1S = true;
      temp2S = true;
      NextDesactivate = true; // Sinon le mettre mais au prochain non
    } else {
      temp1S = false;
      temp2S = true;
    }
    console.log(
      props.dayWeather.temperature_2m[i] +
        " : " +
        temp1Chunk +
        " Est dans le tableau 1 : " +
        temp1S +
        " Est dans le tableau 2 : " +
        temp2S,
    );
    return {
      hour: heure.slice(11, 13),
      ...(temp1S && { temp1: props.dayWeather.temperature_2m[i] }),
      ...(temp2S && { temp2: props.dayWeather.temperature_2m[i] }),
      wind: props.dayWeather.wind_speed_10m[i],
      snow: props.dayWeather.snowfall[i],
      rain: props.dayWeather.rain[i],
    };
  }); // FAIRE UN TABLEAU POUR CHAQUE HEURE

  console.log(data);
  // DEFINI LES COULEURS

  function setRainColor() {
    let dayRain = Math.round(
      props.dayWeather.rain.reduce((acc, e) => acc + e, 0) / 1.5,
    );
    if (dayRain < 6) return "rain-light";
    if (dayRain < 16) return "rain-moderate";
    else return "rain-heavy";
  }
  function setTempColor(temps) {
    const TEMPCOLORS = [
      "temp-cold-",
      "temp-cool-",
      "temp-mild-",
      "temp-hot-",
      "temp-extreme-",
    ];
    let num = Math.floor(
      (temps.reduce((acc, e) => acc + e, 0) / temps.length + 10) / 10,
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
  console.log(data);
  return (
    <div className="main">
      <ComposedChart width={"60%"} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis yAxisId="temp" />
        <YAxis yAxisId="cond" hide domain={[0, 60]} orientation="right" />
        <YAxis yAxisId="rain" hide domain={[0, 10]} orientation="right" />

        <Tooltip />
        <Area
          type="monotone"
          dataKey="temp1"
          stroke={`var(--${setTempColor([Math.min(...props.dayWeather.temperature_2m)])}b)`}
          fill={`var(--${setTempColor([Math.min(...props.dayWeather.temperature_2m)])}a)`}
          fillOpacity={0.3}
          yAxisId="temp"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="temp2"
          stroke={`var(--${setTempColor([Math.min(...props.dayWeather.temperature_2m) + 10])}b)`}
          fill={`var(--${setTempColor([Math.min(...props.dayWeather.temperature_2m) + 10])}a)`}
          fillOpacity={0.3}
          yAxisId="temp"
          strokeWidth={2}
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
