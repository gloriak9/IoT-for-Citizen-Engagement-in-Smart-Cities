import CombinedSensorChart from "./Charts/CombinedSensorChart";


const Dashboard = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center" }}>Munich Light & Environment Monitor</h1>
      <CombinedSensorChart />
    </div>
  );
};

export default Dashboard;
