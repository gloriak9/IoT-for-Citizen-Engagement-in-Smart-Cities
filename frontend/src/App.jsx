import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import './App.css';
import "@fontsource/montserrat-alternates"; // Defaults to weight 400


function App() {
  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo-text"> SafeWalkMunich</h1>
        <div className="nav-links">
          <button>Map</button>
          <button>Dashboard</button>
          <button>Settings</button>
        </div>
      </nav>

      {/* Map Container */}
      <div className="map-wrapper">
        <MapContainer center={[48.1351, 11.5820]} zoom={12} className="map">
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>

        {/* Floating Buttons */}
        <div className="floating-buttons">
          <button>🔍 Search</button>
          <button>💡 Lighting</button>
          <button>📝 Comment</button>
          <button className="close">✖</button>
        </div>
      </div>
    </div>
  );
}

export default App;
