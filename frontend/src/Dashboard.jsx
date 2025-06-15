import TemperatureChart from "./Charts/TemperatureChart";
// import HumidityChart from "./HumidityChart";
// import PressureChart from "./PressureChart"; и т.д.

const Dashboard = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Sensor Dashboard — Group 04</h1>

      <section style={{ marginBottom: "60px" }}>
        <h2>🌡 Temperature</h2>
        <TemperatureChart />
      </section>

      {/* just add more charts here */}
      {/*
      <section style={{ marginBottom: "60px" }}>
        <h2>💧 Humidity</h2>
        <HumidityChart />
      </section>

      <section style={{ marginBottom: "60px" }}>
        <h2>🌬 Pressure</h2>
        <PressureChart />
      </section>
      */}
    </div>
  );
};

export default Dashboard;
