import React, { useState } from "react";
import TemperatureRadialBarChart from "./TemperatureRadialBarChart";
import HumidityRadialBarChart from "./HumidityRadialBarChart";
import PressureRadialBarChart from "./PressureRadialBarChart";
import IlluminanceRadialBarChart from "./IlluminanceRadialBarChart";
import './EnvironmentalRadialBarCharts.css';

const EnvironmentalRadialBarCharts = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="environmental-radial-charts">
      <h2 className="charts-header">Explore the Night: Environmental Parameters Year-Round</h2>
      <div className="controls" style={{ marginBottom: 24 }}>
        <div className="date-picker-container">
          <label htmlFor="date-picker">Select Date: </label>
          <input
            id="date-picker"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      <div className="radial-charts-row">
        <div className="radial-chart-card">
          <div className="chart-header"><h3>Temperature</h3></div>
          <div className="chart-container"><TemperatureRadialBarChart selectedDate={selectedDate} /></div>
        </div>
        <div className="radial-chart-card">
          <div className="chart-header"><h3>Humidity</h3></div>
          <div className="chart-container"><HumidityRadialBarChart selectedDate={selectedDate} /></div>
        </div>
        <div className="radial-chart-card">
          <div className="chart-header"><h3>Pressure</h3></div>
          <div className="chart-container"><PressureRadialBarChart selectedDate={selectedDate} /></div>
        </div>
        <div className="radial-chart-card">
          <div className="chart-header"><h3>Illuminance</h3></div>
          <div className="chart-container"><IlluminanceRadialBarChart selectedDate={selectedDate} /></div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalRadialBarCharts; 