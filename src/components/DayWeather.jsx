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
  let tempHourly = props.tempHourly;
  return (
    <div className="main">
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dayName" />
        <YAxis />
        <Tooltip />
        <Line dataKey="maxTemp" stroke="var(--accent)" />
      </LineChart>
    </div>
  );
}

export default DayWeather;
