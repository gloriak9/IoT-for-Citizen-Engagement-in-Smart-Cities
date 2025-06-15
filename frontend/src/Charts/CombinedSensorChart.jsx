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

const endpoints = {
  temperature: {
    id: 1504,
    label: "🌡 Temperature (°C)",
    color: "#ef5350",
    yAxisID: "yEnvironmental"
  },
  humidity: {
    id: 1505,
    label: "💧 Humidity (%)",
    color: "#42a5f5",
    yAxisID: "yEnvironmental"
  },
  pressure: {
    id: 1506,
    label: "🌬 Pressure (kPa)",
    color: "#66bb6a",
    yAxisID: "yEnvironmental"
  },
  illuminance: {
    id: 1502,
    label: "💡 Illuminance (lux)",
    color: "#ffa726",
    yAxisID: "yLighting"
  }
};

const CombinedSensorChart = () => {
  const [dataSeries, setDataSeries] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        Object.entries(endpoints).map(async ([key, { id }]) => {
          const res = await fetch(`https://gi3.gis.lrg.tum.de/frost/v1.1/Datastreams(${id})/Observations?$top=100&$orderby=phenomenonTime desc`);
          const json = await res.json();
          return [key, json.value.reverse()];
        })
      );
      setDataSeries(Object.fromEntries(results));
    };

    fetchAll();
  }, []);

  const labels = dataSeries.temperature?.map(obs => obs.phenomenonTime) || [];

  const chartData = {
    labels,
    datasets: Object.entries(endpoints).map(([key, { label, color, yAxisID }]) => ({
      label,
      data: dataSeries[key]?.map(obs => obs.result),
      borderColor: color,
      backgroundColor: color + "33",
      fill: false,
      tension: 0.3,
      pointRadius: 0,
      yAxisID
    }))
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Sensor Dashboard — Group 04</h2>
      <p style={{ textAlign: "center", marginBottom: "30px", fontSize: "1.1rem" }}>
        Analyze how lighting changes depending on environmental data!
      </p>
      <Line
        data={chartData}
        options={{
          responsive: true,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
                pointStyle: "line",
              },
            },
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "hour",
              },
              title: {
                display: true,
                text: "Time"
              }
            },
            yLighting: {
              type: "linear",
              position: "left",
              title: {
                display: true,
                text: "Lighting Value (lux)"
              },
              ticks: {
                color: "#ffa726",
              },
              grid: {
                drawOnChartArea: false,
              }
            },
            yEnvironmental: {
              type: "linear",
              position: "right",
              title: {
                display: true,
                text: "Environmental Value"
              },
              ticks: {
                color: "#42a5f5",
              }
            }
          }
        }}
      />
    </div>
  );
};

export default CombinedSensorChart;
