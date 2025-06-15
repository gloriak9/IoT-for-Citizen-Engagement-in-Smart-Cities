import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

const TemperatureChart = () => {
  const [observations, setObservations] = useState([]);

  useEffect(() => {
    fetch(
      "https://gi3.gis.lrg.tum.de/frost/v1.1/Datastreams(1504)/Observations?$top=100&$orderby=phenomenonTime desc"
    )
      .then((res) => res.json())
      .then((data) => {
        // Обратный порядок (от старых к новым)
        setObservations(data.value.reverse());
      });
  }, []);

  const chartData = {
    labels: observations.map((obs) => obs.phenomenonTime),
    datasets: [
      {
        label: "Temperature (°C)",
        data: observations.map((obs) => obs.result),
        borderColor: "#ef5350",
        backgroundColor: "rgba(239, 83, 80, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Temperature — Group 4</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              type: "time",
              time: { unit: "minute" },
              title: { display: true, text: "Time" },
            },
            y: {
              title: { display: true, text: "Temperature (°C)" },
            },
          },
        }}
      />
    </div>
  );
};

export default TemperatureChart;
