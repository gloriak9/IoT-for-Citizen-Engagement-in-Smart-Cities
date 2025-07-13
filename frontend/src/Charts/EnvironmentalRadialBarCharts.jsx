import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const endpoints = {
  Temperature: 1504,
  Humidity: 1505,
  Pressure: 1506,
};

const periods = [
  { label: "Morning", start: 6, end: 12 },
  { label: "Afternoon", start: 12, end: 18 },
  { label: "Evening", start: 18, end: 22 },
];

const valueUnits = {
  Temperature: "°C",
  Humidity: "%",
  Pressure: "kPa",
};

function getPeriod(hour) {
  for (const period of periods) {
    if (hour >= period.start && hour < period.end) return period.label;
  }
  return null;
}

const EnvironmentalRadialBarCharts = () => {
  const [data, setData] = useState({
    Temperature: [0, 0, 0],
    Humidity: [0, 0, 0],
    Pressure: [0, 0, 0],
  });
  const [totals, setTotals] = useState({
    Temperature: 0,
    Humidity: 0,
    Pressure: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let result = {};
      let totalResult = {};
      for (const [key, id] of Object.entries(endpoints)) {
        const res = await fetch(
          `https://gi3.gis.lrg.tum.de/frost/v1.1/Datastreams(${id})/Observations?$top=500&$orderby=phenomenonTime desc`
        );
        const json = await res.json();
        // Group by period
        const periodValues = { Morning: [], Afternoon: [], Evening: [] };
        let allValues = [];
        json.value.forEach((obs) => {
          const date = new Date(obs.phenomenonTime);
          const hour = date.getHours();
          const period = getPeriod(hour);
          if (period) {
            periodValues[period].push(obs.result);
          }
          // Only count values in the 6:00-22:00 range for total
          if (hour >= 6 && hour < 22) {
            allValues.push(obs.result);
          }
        });
        // Calculate averages for each period
        const averages = periods.map((p) => {
          const vals = periodValues[p.label];
          return vals.length > 0
            ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
            : 0;
        });
        // Calculate total average for the day (6:00-22:00)
        const totalAvg = allValues.length > 0
          ? Number((allValues.reduce((a, b) => a + b, 0) / allValues.length).toFixed(2))
          : 0;
        result[key] = averages;
        totalResult[key] = totalAvg;
      }
      setData(result);
      setTotals(totalResult);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading environmental data...</div>;

  return (
    <div style={{ display: "flex", gap: 40, justifyContent: "center" }}>
      {Object.keys(endpoints).map((key) => (
        <div key={key}>
          <h3 style={{ textAlign: "center" }}>
            {key === "Temperature" && "🌡 Temperature"}
            {key === "Humidity" && "💧 Humidity"}
            {key === "Pressure" && "🌬 Pressure"}
            <span style={{ fontWeight: "normal", fontSize: "0.8em" }}> ({valueUnits[key]})</span>
          </h3>
          <ReactApexChart
            options={{
              chart: { height: 300, type: "radialBar" },
              plotOptions: {
                radialBar: {
                  dataLabels: {
                    name: { fontSize: "18px" },
                    value: { fontSize: "14px" },
                    total: {
                      show: true,
                      label: "Total Avg",
                      formatter: function () {
                        return totals[key];
                      },
                    },
                  },
                },
              },
              labels: periods.map((p) => p.label),
            }}
            series={data[key]}
            type="radialBar"
            height={300}
          />
        </div>
      ))}
    </div>
  );
};

export default EnvironmentalRadialBarCharts; 