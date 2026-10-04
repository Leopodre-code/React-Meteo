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

  return (
    <div className="main">
      <ComposedChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="temp"
          stroke={`var(--${setTempColor()})`}
          fill="var(--accent-3)" // FAIRE  UN DEGARDE SUIVANT LA TEMPERATURE
          fillOpacity={0.3}
        />
        <Line
          dataKey="wind"
          stroke="var(--accent)"
          strokeOpacity={0.3}
          dot={false}
        />
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
    </div>
  );
}

export default DayWeather;
