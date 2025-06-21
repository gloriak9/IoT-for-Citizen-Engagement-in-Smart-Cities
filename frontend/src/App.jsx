import "leaflet/dist/leaflet.css";
import './App.css';
import "@fontsource/montserrat-alternates";
import { Routes, Route, Link } from "react-router-dom";
import { ToolProvider } from "./ToolContext";
import Home from "./Home";
import Dashboard from "./Dashboard";
import { MapPinIcon, ChartColumnIcon, SettingsIcon } from "lucide-react";

function App() {
  return (
    <ToolProvider>
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
        </Routes>
      </div>
    </ToolProvider>
  );
}

export default App;
