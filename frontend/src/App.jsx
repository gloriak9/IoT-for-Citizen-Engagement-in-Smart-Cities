import "leaflet/dist/leaflet.css";
import './App.css';
import "@fontsource/montserrat-alternates";
import { Routes, Route, Link } from "react-router-dom";
import { ToolProvider } from "./ToolContext";
import Home from "./Home";
import { MapPinIcon, ChartColumnIcon, InfoIcon } from "lucide-react";
import Dashboard from "./Dashboard";
import SensorChart from "./Charts/CombinedSensorChart";

function App() {
  return (
    <ToolProvider>
      <div className="app-container">
        <nav className="navbar">
          <h1 className="nav-links">SafeWalkMunich</h1>
          <div className="nav-links">
            <Link to="/"><button><MapPinIcon /> </button></Link>
            <Link to="/dashboard"><button><ChartColumnIcon /> </button></Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sensor" element={<SensorChart />} />
        </Routes>
      </div>
    </ToolProvider>
  );
}

export default App;
