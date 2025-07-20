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
      if (activeTool === "comment") {
        const comment = prompt("Enter your comment:");
        if (comment) {
          const pinData = {
            text: comment,
            location: {
              lat: tempPos.lat,
              lng: tempPos.lng
           }
          };
          console.log('pinData before sending:', pinData);
          console.log('Sending pinData:', pinData);
          addPin(pinData);
          fetch("http://localhost:5000/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pinData),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Comment saved to DB:", data);
            })
            .catch((err) => {
              console.error("Failed to save comment:", err);
            });
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
