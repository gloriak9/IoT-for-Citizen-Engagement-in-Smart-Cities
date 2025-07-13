import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

/**
 * @typedef {Object} Observation
 * @property {string} phenomenonTime - The timestamp of the observation
 * @property {number} result - The pressure value
 */

/**
 * @typedef {Object} PressureData
 * @property {number} twilight - Average pressure for twilight period
 * @property {number} night - Average pressure for night period
 * @property {number} earlyMorning - Average pressure for early morning period
 * @property {number} overall - Overall average pressure for the day
 */

const PressureRadialBarChart = ({ selectedDate }) => {
  /** @type {PressureData} */
  const [pressureData, setPressureData] = useState({
    twilight: 0,
    night: 0,
    earlyMorning: 0,
    overall: 0
  });
  const [loading, setLoading] = useState(false);

  // Pressure endpoint
  const PRESSURE_ENDPOINT = 1506;

  // Time period definitions
  const timePeriods = {
    twilight: { start: 16, end: 19, label: "🌇 Evening Twilight (16:00-19:00)", color: "#FF6B6B" },
    night: { start: 19, end: 4, label: "🌙 Night (19:00-04:00)", color: "#4ECDC4" },
    earlyMorning: { start: 4, end: 8, label: "🌅 Early Morning (04:00-08:00)", color: "#45B7D1" }
  };

  const fetchPressureData = async (date) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://gi3.gis.lrg.tum.de/frost/v1.1/Datastreams(${PRESSURE_ENDPOINT})/Observations?$top=1000&$orderby=phenomenonTime desc`
      );
      const json = await response.json();
      
      // Filter data for the selected date
      /** @type {Observation[]} */
      const selectedDateData = json.value.filter(obs => {
        const obsDate = new Date(obs.phenomenonTime).toISOString().split('T')[0];
        return obsDate === date;
      });

      if (selectedDateData.length === 0) {
        setPressureData({ twilight: 0, night: 0, earlyMorning: 0, overall: 0 });
        setLoading(false);
        return;
      }

      // Calculate averages for each time period
      /** @type {PressureData} */
      const periodData = {};
      Object.keys(timePeriods).forEach(period => {
        const { start, end } = timePeriods[period];
        const periodObservations = selectedDateData.filter(obs => {
          const hour = new Date(obs.phenomenonTime).getHours();
          if (start <= end) {
            // Normal case (e.g., 16-19, 4-8)
            return hour >= start && hour < end;
          } else {
            // Overnight case (e.g., 19-4)
            return hour >= start || hour < end;
          }
        });
        
        if (periodObservations.length > 0) {
          const avg = periodObservations.reduce((sum, obs) => sum + obs.result, 0) / periodObservations.length;
          periodData[period] = Number(avg.toFixed(2));
        } else {
          periodData[period] = 0;
        }
      });

      // Calculate overall average for the entire day
      const overallAvg = selectedDateData.reduce((sum, obs) => sum + obs.result, 0) / selectedDateData.length;
      periodData.overall = Number(overallAvg.toFixed(2));

      setPressureData(periodData);
    } catch (error) {
      console.error('Error fetching pressure data:', error);
      setPressureData({ twilight: 0, night: 0, earlyMorning: 0, overall: 0 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPressureData(selectedDate);
  }, [selectedDate]);

  // Prepare chart data - always show all three periods with proper validation
  const series = [
    pressureData.twilight || 0,
    pressureData.night || 0,
    pressureData.earlyMorning || 0
  ].map(val => {
    // Ensure no undefined or NaN values
    const numVal = Number(val);
    return isNaN(numVal) ? 0 : numVal;
  });
  
  const labels = [
    timePeriods.twilight.label,
    timePeriods.night.label,
    timePeriods.earlyMorning.label
  ];

  const options = {
    chart: {
      height: 300,
      type: "radialBar",
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 15,
          size: '70%',
        },
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5,
        },
        dataLabels: {
          name: {
            fontSize: "12px",
            color: '#263238',
            fontWeight: 600,
            show: false // Hide individual labels
          },
          value: {
            fontSize: "16px",
            color: '#263238',
            fontWeight: 700,
            formatter: function(val) {
              return val + ' kPa';
            },
            show: false // Hide individual values
          },
          total: {
            show: true,
            label: "Daily Average",
            fontSize: "18px",
            fontWeight: 700,
            color: '#263238',
            formatter: function () {
              return pressureData.overall + ' kPa';
            }
          },
        },
        stroke: {
          lineCap: 'round'
        }
      },
    },
    colors: [timePeriods.twilight.color, timePeriods.night.color, timePeriods.earlyMorning.color],
    labels,
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '12px',
      markers: {
        size: 10
      },
      itemMargin: {
        horizontal: 8,
        vertical: 3
      }
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '14px'
      },
      y: {
        formatter: function(val) {
          return val + ' kPa';
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 250
        },
        legend: {
          fontSize: '10px',
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <div className="chart-container">
      {loading ? (
        <div className="loading">Loading pressure data...</div>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="radialBar"
          height={300}
        />
      )}
    </div>
  );
};

export default PressureRadialBarChart; 