import CombinedSensorChart from "./Charts/CombinedSensorChart";
import EnvironmentalRadialBarCharts from "./Charts/EnvironmentalRadialBarCharts";
import TemperatureRadialBarChart from "./Charts/TemperatureRadialBarChart";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Munich Light & Environment Monitor</h1>
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-content">
            <CombinedSensorChart />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-card-content">
            <EnvironmentalRadialBarCharts />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-card-content">
            <TemperatureRadialBarChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
