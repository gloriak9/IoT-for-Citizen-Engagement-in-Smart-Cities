import { useToolContext } from "../ToolContext";
import { useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

function CommentTool() {
  const { activeTool, addPin, setActiveTool } = useToolContext();
  const [tempPos, setTempPos] = useState(null);

  useMapEvents({
    mousemove(e) {
      if (activeTool === "comment") {
        setTempPos(e.latlng);
      }
    },
    click(e) {
      if (activeTool === "comment" && tempPos) {
        const comment = prompt("Enter your comment:");
        if (comment) {
          addPin({ position: tempPos, comment });
        }
        setTempPos(null);
        setActiveTool(null);
      }
    },
  });

  if (activeTool !== "comment") return null;

  return tempPos ? (
    <Marker
      position={tempPos}
      icon={L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })}
    />
  ) : null;
}

export default CommentTool;
