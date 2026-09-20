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
  let data = [
    { dayName: "Sam", maxTemp: 24, minTemp: 14 },
    { dayName: "Dim", maxTemp: 21, minTemp: 12 },
    { dayName: "Lun", maxTemp: 24, minTemp: 15 },
  ];
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
