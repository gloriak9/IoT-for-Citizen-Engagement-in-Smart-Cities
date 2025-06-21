import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useToolContext } from "./ToolContext";
import { toolRegistry } from "./toolRegistry";
import FloatingButtons from "./FloatingButtons";
import L from "leaflet";

function Home() {
  const { pins } = useToolContext();

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[48.1351, 11.5820]}
        zoom={12}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render tools */}
        {toolRegistry.map((tool) => {
          const ToolComponent = tool.component;
          return <ToolComponent key={tool.id} />;
        })}

        {/* Render saved pins */}
        {pins.map((pin, index) => (
          <Marker
            key={index}
            position={pin.position}
            icon={L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>{pin.comment}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <FloatingButtons />
    </div>
  );
}

export default Home;
