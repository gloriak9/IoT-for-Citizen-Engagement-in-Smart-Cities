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
import { format, parseISO, isWithinInterval, setHours, setMinutes, startOfDay, endOfDay } from "date-fns";

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

const timeRanges = {
  morning: { start: 6, end: 12, label: "🌅 Morning (6:00-12:00)" },
  afternoon: { start: 12, end: 18, label: "☀️ Afternoon (12:00-18:00)" },
  evening: { start: 18, end: 22, label: "🌆 Evening (18:00-22:00)" },
  night: { start: 22, end: 6, label: "🌙 Night (22:00-6:00)" }
};

const CombinedSensorChart = () => {
  const [dataSeries, setDataSeries] = useState({});
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");

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

  const resetFilters = () => {
    setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    setSelectedTimeRange("all");
  };

  const filterData = (data) => {
    if (!data) return [];
    
    return data.filter(obs => {
      const date = parseISO(obs.phenomenonTime);
      
      // Date filter
      if (selectedDate) {
        const selectedDay = parseISO(selectedDate);
        const dayStart = startOfDay(selectedDay);
        const dayEnd = endOfDay(selectedDay);
        if (!isWithinInterval(date, { start: dayStart, end: dayEnd })) {
          return false;
        }
      }

      // Time range filter
      if (selectedTimeRange !== "all") {
        const { start, end } = timeRanges[selectedTimeRange];
        const hour = date.getHours();
        
        if (start > end) {
          // Handle overnight ranges (e.g., night: 22:00-6:00)
          if (hour < start && hour >= end) {
            return false;
          }
        } else {
          // Handle normal ranges (e.g., morning: 6:00-12:00)
          if (hour < start || hour >= end) {
            return false;
          }
        }
      }

      return true;
    });
  };

  // Get filtered data for all series
  const filteredData = Object.fromEntries(
    Object.entries(dataSeries).map(([key, data]) => [key, filterData(data)])
  );

  // Get labels from filtered data
  const labels = filteredData.temperature?.map(obs => obs.phenomenonTime) || [];

  const chartData = {
    labels,
    datasets: Object.entries(endpoints).map(([key, { label, color, yAxisID }]) => ({
      label,
      data: filteredData[key]?.map(obs => obs.result),
      borderColor: color,
      backgroundColor: color + "33",
      fill: false,
      tension: 0.3,
      pointRadius: 0,
      yAxisID
    }))
  };

  const hasData = labels.length > 0;

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Let's play with data!</h2>
      <p style={{ textAlign: "center", marginBottom: "30px", fontSize: "1.1rem" }}>
      Filter sensor data by date and time to see how environmental conditions influence street lighting
      </p>
      
      {/* Filters */}
      <div style={{ 
        display: "flex", 
        gap: "20px", 
        marginBottom: "20px", 
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <div>
          <label style={{ marginRight: "10px" }}>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: "5px" }}
          />
        </div>
        
        <div>
          <label style={{ marginRight: "10px" }}>Time of Day:</label>
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            style={{ padding: "5px" }}
          >
            <option value="all">All Day</option>
            {Object.entries(timeRanges).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={resetFilters}
          style={{
            padding: "5px 15px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Reset Filters
        </button>
      </div>

      {hasData ? (
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
                  displayFormats: {
                    hour: "HH:mm"
                  }
                },
                title: {
                  display: true,
                  text: "Time"
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 10
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
                  text: "Environmental Values (°C, %, kPa)"
                },
                ticks: {
                  color: "#000",
                }
              }
            }
          }}
        />
      ) : (
        <div style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          marginTop: "20px"
        }}>
          <p style={{ fontSize: "1.2rem", color: "#666" }}>
            No data available for the selected date and time range.
          </p>
        </div>
      )}
    </div>
  );
};

export default CombinedSensorChart;
