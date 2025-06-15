import { Routes, Route, Link } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import './App.css';
import "@fontsource/montserrat-alternates";
import { MapPinIcon, ChartColumnIcon, SettingsIcon } from "lucide-react";
import Dashboard from "./Dashboard";
import SensorChart from "./Charts/CombinedSensorChart";

function Home() {
  return (
    <div className="map-wrapper">
      <MapContainer center={[48.1351, 11.5820]} zoom={12} className="map">
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      <div className="floating-buttons">
        <button>🔍 Search</button>
        <button>💡 Lighting</button>
        <button>📝 Comment</button>
        <button className="close">✖</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 className="logo-text">SafeWalkMunich</h1>
        <div className="nav-links">
          <Link to="/"><button><MapPinIcon /> Map</button></Link>
          <Link to="/dashboard"><button><ChartColumnIcon /> Dashboard</button></Link>
          <button><SettingsIcon /> Settings</button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sensor" element={<SensorChart />} />
      </Routes>
    </div>
  );
}

export default App;
