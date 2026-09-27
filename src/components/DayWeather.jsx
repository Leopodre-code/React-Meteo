import "./DayWeather.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function DayWeather(props) {
  console.log(props.dayWeather);
  let data = dayWeather.time.map((heure, i) => ({
    hour: heure,
    temp: dayWeather.temperature_2m[i],
  })); // FAIRE UN TABLEAU POUR CHAQUE HEURE
  return (
    <div className="main">
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Line dataKey="maxTemp" stroke="var(--accent)" />
        <Line dataKey="maxTemp" stroke="var(--accent)" />
      </LineChart>
    </div>
  );
}

export default DayWeather;
